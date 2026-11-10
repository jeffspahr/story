import { readFileSync, writeFileSync } from 'node:fs'
import { buildClusters } from '../components/timeline-clusters.mjs'

// Input is the public gh pr list result for jeffspahr, merged Jan 9-Nov 9, 2026.
const prs = JSON.parse(readFileSync(process.argv[2], 'utf8'))
if (prs.length >= 1000) throw new Error('Check GitHub search pagination before publishing')
const classifications = JSON.parse(readFileSync(new URL('../../data/github/pipelines-pr-classification.json', import.meta.url)))
const byNumber = new Map(classifications.map(pr => [pr.number, pr]))
const labels = {
  frontend: 'Frontend', ci: 'CI', integration_testing: 'Tests',
  governance_maintenance: 'Project maintenance', documentation: 'Documentation',
  backend_api: 'Backend / API', deployment_release: 'Deployment / releases',
  build_tooling: 'Build tooling', samples_components: 'Samples / components', sdk: 'SDK', other: 'Other',
}
const data = buildClusters(prs.map(pr => ({
  ...pr,
  areas: Object.keys(byNumber.get(pr.number)?.category_file_counts || {}).map(key => labels[key] || key),
})))
writeFileSync(new URL('../components/timeline-clusters.json', import.meta.url), JSON.stringify(data, null, 2) + '\n')
console.log(`${data.total} authored merges; ${data.approverCount} by approver; ${data.clusters.length} clusters`)
