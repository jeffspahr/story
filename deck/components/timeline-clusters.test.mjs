import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { buildClusters, boundaries, circleSize, milestonePrs } from './timeline-clusters.mjs'

test('interval boundaries include each non-milestone PR exactly once', () => {
  const result = buildClusters([
    { number: 12631, mergedAt: boundaries[0] },
    { number: 1, mergedAt: boundaries[1] },
    { number: 2, mergedAt: boundaries[2] },
    { number: 3, mergedAt: boundaries.at(-1) },
  ])
  assert.deepEqual(result.clusters.map(c => [c.gap, c.prs[0].number]), [[0, 1], [1, 2]])
  assert.equal(result.approverCount, 3)
  assert.throws(() => buildClusters([{ number: 1 }, { number: 1 }]), /Duplicate/)
})

test('published cluster counts reconcile with verified authored merges', () => {
  const data = JSON.parse(readFileSync(new URL('./timeline-clusters.json', import.meta.url)))
  const prs = data.clusters.flatMap(c => c.prs)
  assert.equal(data.approverCount, 16)
  assert.equal(prs.length + data.milestoneCount, data.total)
  assert.equal(new Set(prs.map(p => p.number)).size, prs.length)
  assert.ok(prs.every(p => !milestonePrs.includes(p.number)))
  assert.ok(milestonePrs.includes(12636))
  assert.ok(prs.some(p => p.number === 12635))
  for (let gap = 0; gap < 7; gap++) assert.ok(data.clusters.filter(c => c.gap === gap).length <= 3)
  assert.ok(prs.every(p => p.url === `https://github.com/kubeflow/pipelines/pull/${p.number}`))
  assert.deepEqual([1, 2, 9, 10, 100].map(circleSize), [6, 10, 10, 14, 14])
})
