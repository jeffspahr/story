export const boundaries = [
  '2026-01-09T11:21:21Z', '2026-01-15T03:04:24Z',
  '2026-02-09T16:42:12Z', '2026-02-23T21:36:24Z',
  '2026-07-19T00:09:27Z', '2026-07-28T15:47:30Z',
  '2026-10-29T04:44:27Z', '2026-11-10T00:00:00Z',
]
export const milestonePrs = [12631, 12636, 12754, 12869, 13739, 13908]
export const circleSize = count => count === 1 ? 6 : count < 10 ? 10 : 14

export function buildClusters(prs) {
  if (new Set(prs.map(pr => pr.number)).size !== prs.length)
    throw new Error('Duplicate PRs in timeline input')
  const eligible = prs.filter(pr => pr.mergedAt >= boundaries[0] && pr.mergedAt < boundaries.at(-1))
    .sort((a, b) => a.mergedAt.localeCompare(b.mergedAt) || a.number - b.number)
  const clusters = []
  for (let gap = 0; gap < boundaries.length - 1; gap++) {
    const start = Date.parse(boundaries[gap])
    const end = Date.parse(boundaries[gap + 1])
    const bins = [[], [], []]
    for (const pr of eligible) {
      const time = Date.parse(pr.mergedAt)
      if (time <= start || time > end || milestonePrs.includes(pr.number)) continue
      const bin = Math.min(2, Math.floor((time - start) / (end - start) * 3))
      bins[bin].push(pr)
    }
    bins.forEach((items, bin) => {
      if (items.length) clusters.push({ id: `${gap}-${bin}`, gap, offset: (bin + 1) / 4, prs: items })
    })
  }
  return {
    through: '2026-11-09',
    approverCount: eligible.filter(pr => pr.mergedAt <= boundaries[3]).length,
    total: eligible.length,
    milestoneCount: eligible.filter(pr => milestonePrs.includes(pr.number)).length,
    clusters,
  }
}
