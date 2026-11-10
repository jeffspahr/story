import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const cutoff = '2026-11-09'
const labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov']
const years = Array.from({ length: 7 }, (_, i) => 2020 + i)
const periods = [
  ...years.map(year => ({ key: `y${year}`, from: `${year}-01-01`, to: year === 2026 ? cutoff : `${year}-12-31` })),
  ...labels.map((_, i) => {
    const month = String(i + 1).padStart(2, '0')
    const last = new Date(Date.UTC(2026, i + 1, 0)).getUTCDate()
    return { key: `m${i}`, from: `2026-${month}-01`, to: i === 10 ? cutoff : `2026-${month}-${last}` }
  }),
]
const fields = 'totalCommitContributions totalPullRequestContributions totalPullRequestReviewContributions'
const query = `{viewer{login ${periods.map(p => `${p.key}:contributionsCollection(from:"${p.from}T00:00:00Z",to:"${p.to}T23:59:59Z"){${fields}}`).join(' ')}}}`
const response = JSON.parse(execFileSync('gh', ['api', 'graphql', '-f', `query=${query}`], { encoding: 'utf8' }))
assert.ok(!response.errors, JSON.stringify(response.errors))
assert.equal(response.data.viewer.login, 'jeffspahr')
function counts(key) {
  const row = response.data.viewer[key]
  const result = { commits: row.totalCommitContributions, opened: row.totalPullRequestContributions, reviewed: row.totalPullRequestReviewContributions }
  for (const value of Object.values(result)) assert.ok(Number.isInteger(value) && value >= 0)
  return result
}
const annual = years.map(year => ({ year, ...counts(`y${year}`) }))
const monthlyActivity = labels.map((label, i) => ({ label, ...counts(`m${i}`) }))
assert.equal(annual.at(-1).opened, monthlyActivity.reduce((sum, row) => sum + row.opened, 0))
assert.equal(annual.at(-1).commits, monthlyActivity.reduce((sum, row) => sum + row.commits, 0))
const output = new URL('../components/chart-data.json', import.meta.url)
const data = JSON.parse(readFileSync(output, 'utf8'))
data.annual = annual
data.monthlyActivity = monthlyActivity
data.activityMetadata = { cutoff, scope: 'Authenticated GitHub contribution totals across all repositories; private activity retained only as aggregates. Reviews are distinct PRs per queried period; monthly review counts need not sum to yearly counts.' }
writeFileSync(output, JSON.stringify(data, null, 2) + '\n')
console.log(JSON.stringify({ annual, monthlyActivity }, null, 2))
