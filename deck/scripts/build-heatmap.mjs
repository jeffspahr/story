import { readFileSync, writeFileSync } from 'node:fs'

const [input, cutoff] = process.argv.slice(2)
if (!input || !/^2026-\d{2}-\d{2}$/.test(cutoff || '')) {
  throw new Error('Usage: node deck/scripts/build-heatmap.mjs PR_JSON YYYY-MM-DD')
}
const prs = JSON.parse(readFileSync(input, 'utf8'))
const rules = {
  frontend: /^frontend\//,
  ci: /^(\.github\/(workflows|actions)\/|\.pre-commit-config)/,
  backend_api: /^(backend\/|api\/|go\.(mod|sum)$)/,
  sdk: /^(sdk|kubernetes_platform)\//,
  deployment_release: /^(manifests|release|images)\//,
}
const seen = new Set()
const counts = new Map()
for (const pr of prs) {
  if (seen.has(pr.number)) throw new Error(`Duplicate PR ${pr.number}`)
  seen.add(pr.number)
  const date = pr.createdAt.slice(0, 10)
  if (date < '2026-01-01' || date > cutoff) throw new Error(`Out-of-range PR ${pr.number}`)
  const paths = new Set(pr.files.map(file => file.path))
  if (paths.size !== pr.changedFiles) throw new Error(`Incomplete file inventory for ${pr.number}`)
  for (const [category, rule] of Object.entries(rules)) {
    if (![...paths].some(path => rule.test(path))) continue
    const key = `${date.slice(0, 7)}/${category}`
    counts.set(key, (counts.get(key) || 0) + 1)
  }
}
const output = new URL('../components/chart-data.json', import.meta.url)
const data = JSON.parse(readFileSync(output, 'utf8'))
data.categories = [...counts].sort(([a], [b]) => a.localeCompare(b)).map(([key, count]) => {
  const [month, category] = key.split('/')
  return { month, role: 'authored_prs', category, count }
})
data.heatmapMetadata = { cutoff, authoredPrs: prs.length, scope: 'Public kubeflow/pipelines PRs authored by jeffspahr, all states, grouped by UTC opening month. Path categories overlap.' }
writeFileSync(output, JSON.stringify(data, null, 2) + '\n')
console.log(`Classified ${prs.length} unique PRs through ${cutoff}; complete file inventories verified.`)
