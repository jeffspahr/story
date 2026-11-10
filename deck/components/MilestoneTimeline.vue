<script setup>
import { ref, watch } from 'vue'
import clusterData from './timeline-clusters.json'
import { circleSize } from './timeline-clusters.mjs'
const props = defineProps({ step: { type: Number, required: true } })
const activeCluster = ref(null)
watch(() => props.step, () => { activeCluster.value = null })
const clustersByGap = Array.from({ length: 7 }, (_, gap) => clusterData.clusters.filter(c => c.gap === gap))
function areas(cluster) {
  const counts = new Map()
  for (const pr of cluster.prs) for (const area of pr.areas) counts.set(area, (counts.get(area) || 0) + 1)
  return [...counts].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([area]) => area).join(', ') || 'Work areas not classified'
}
function date(value) { return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }) }
function leaveCluster(event) {
  if (!event.currentTarget.contains(event.currentTarget.ownerDocument.activeElement)) activeCluster.value = null
}
function blurCluster(event) {
  if (!event.currentTarget.contains(event.relatedTarget)) activeCluster.value = null
}
const milestones = [
  { title: 'First PR', date: 'Jan 9', detail: 'Remove disabled Renovate config', pr: 12631 },
  { title: 'Frontend tests', date: 'Jan 15', detail: 'Stabilize frontend E2E tests', pr: 12636 },
  { title: 'CRA to Vite', date: 'Feb 9', detail: 'Replace the build and test tools', pr: 12754 },
  { title: 'Frontend approver', date: 'Feb 23', detail: '45 days after my first PR', pr: 12869 },
  { title: 'CI work', date: 'Jul 19', detail: 'Stabilize and speed up test lanes', pr: 13739 },
  { title: 'Project maintainer', date: 'Jul 28', detail: 'Responsibility across Pipelines', pr: 13908 },
  { title: 'Security advisories', date: 'Oct 28–29', detail: 'Triaged and published with 2.18', url: 'https://github.com/kubeflow/pipelines/security/advisories', linkLabel: 'Published advisories' },
  { title: 'Today: new UI', date: 'Preview', detail: 'Separate from the stack migration', pr: 14584 },
]
</script>

<template>
  <p class="milestone-summary" v-if="step === 4">{{ clusterData.approverCount }} of my PRs had merged by this point, including the milestones shown.</p>
  <p class="milestone-summary" v-else>Smaller circles show my other merged PRs between milestones.</p>
  <ol class="milestone-timeline" :data-step="step" :style="{ '--progress': `${(step - 1) / (milestones.length - 1) * 100}%` }" aria-label="My path through Kubeflow Pipelines in 2026">
    <li v-for="(milestone, index) in milestones" :key="milestone.title"
      :class="{ reached: index < step, current: index === step - 1 }"
      :aria-current="index === step - 1 ? 'step' : undefined"
      :aria-label="index >= step ? 'Upcoming milestone' : undefined">
      <span class="milestone-marker" aria-hidden="true"></span>
      <div v-if="index < step" class="milestone-label">
        <time>{{ milestone.date }}</time>
        <h2>{{ milestone.title }}</h2>
        <p>{{ milestone.detail }}</p>
        <a :href="milestone.url || `https://github.com/kubeflow/pipelines/pull/${milestone.pr}`" target="_blank" rel="noopener noreferrer">{{ milestone.linkLabel || `#${milestone.pr}` }}</a>
      </div>
      <div v-for="cluster in clustersByGap[index] || []" :key="cluster.id" class="pr-cluster"
        :class="{ 'cluster-active': activeCluster === cluster.id }"
        :style="{ left: `${50 + cluster.offset * 100}%`, '--dot-size': `${circleSize(cluster.prs.length)}px` }"
        @mouseenter="step > index + 1 && (activeCluster = cluster.id)"
        @mouseleave="leaveCluster" @focusin="activeCluster = cluster.id" @focusout="blurCluster"
        @keydown.esc.stop="activeCluster = null">
        <button v-if="step > index + 1" class="cluster-button" type="button"
          :aria-label="`${cluster.prs.length} other merged PRs: ${areas(cluster)}. Show PR links`"
          :aria-expanded="activeCluster === cluster.id" :aria-controls="`cluster-${step}-${cluster.id}`"
          @click="activeCluster = cluster.id"><span aria-hidden="true"></span></button>
        <span v-else class="cluster-pending" aria-hidden="true"></span>
        <div v-if="step > index + 1 && activeCluster === cluster.id" :id="`cluster-${step}-${cluster.id}`"
          class="cluster-details" :class="{ 'align-right': index >= 4 }" role="region" :aria-label="`${cluster.prs.length} merged PRs`">
          <b>{{ cluster.prs.length }} other merged {{ cluster.prs.length === 1 ? 'PR' : 'PRs' }}</b>
          <p>{{ date(cluster.prs[0].mergedAt) }}–{{ date(cluster.prs.at(-1).mergedAt) }} · UTC</p>
          <p>{{ areas(cluster) }}</p>
          <ul><li v-for="pr in cluster.prs" :key="pr.number"><a :href="pr.url" target="_blank" rel="noopener noreferrer">#{{ pr.number }} · {{ pr.title }}</a></li></ul>
        </div>
      </div>
    </li>
  </ol>
  <p class="cluster-legend">Small circles: 1 / 2–9 / 10+ PRs · Hover or focus for links · Merges through Nov 9</p>
  <p v-if="step === 7" class="milestone-key">2026 · Public disclosures: October 28–29 · <a href="https://github.com/kubeflow/pipelines/releases/tag/2.18.0" target="_blank" rel="noopener noreferrer">2.18 release notes</a></p>
  <p v-else-if="step < 8" class="milestone-key">2026 · Milestones in sequence, not to time scale · <span>Current milestone</span></p>
  <p v-else class="milestone-key">2026 · Not to time scale · UI PR is open as of November 9. These screenshots are a preview.</p>
</template>

<style scoped>
.milestone-timeline { position: relative; display: grid; grid-template-columns: repeat(8, 1fr); padding: 0; margin: 0; list-style: none; height: 290px; }
.milestone-timeline::before { content: ''; position: absolute; left: 6.25%; right: 6.25%; top: calc(50% - 2px); height: 4px; background: linear-gradient(to right, #153e7d var(--progress), #d4d9df var(--progress)); }
.milestone-timeline > li { position: relative; margin: 0; padding: 0; color: #112c50; }
.milestone-marker { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 22px; height: 22px; border: 3px solid #cbd0d6; border-radius: 50%; background: white; z-index: 1; }
.reached .milestone-marker { border-color: #153e7d; background: #153e7d; }
.current .milestone-marker { border-color: #d51a87; background: #d51a87; box-shadow: 0 0 0 6px #fceaf4; }
.reached::before { content: ''; position: absolute; left: calc(50% - 1px); top: calc(50% + 14px); width: 2px; height: 18px; background: #a5b7cc; }
.reached:nth-child(odd)::before { top: auto; bottom: calc(50% + 14px); }
.milestone-label { position: absolute; width: 158px; left: 50%; transform: translateX(-50%); top: calc(50% + 38px); text-align: center; }
.milestone-timeline > li:nth-child(odd) .milestone-label { top: auto; bottom: calc(50% + 38px); }
.milestone-label time { font-size: 12px; font-weight: 600; color: #596c83; }
.milestone-timeline h2 { font-size: 17px; font-weight: 650; line-height: 1.2; margin: 5px 0; color: inherit; letter-spacing: 0; }
.current h2, .current time { color: #ac136b; }
.milestone-timeline p { font-size: 12px; line-height: 1.35; margin: 0 0 4px; }
.milestone-timeline a { color: inherit; font-size: 11px; text-decoration: underline; }
.milestone-key { font-size: 11px; color: #596c83; margin: 4px 0 0; }
.milestone-key span { color: #ac136b; }
.milestone-summary { font-size: 14px !important; margin: 0 0 8px; color: #112c50; opacity: 1 !important; }
.cluster-legend { font-size: 10px !important; margin: 8px 0 0; color: #596c83; }
.pr-cluster { position: absolute; top: 50%; transform: translate(-50%, -50%); width: 24px; height: 24px; display: grid; place-items: center; z-index: 2; }
.cluster-active { z-index: 10; }
.cluster-button { display: grid; place-items: center; width: 24px; height: 24px; padding: 0; border: 0; background: transparent; cursor: pointer; }
.cluster-button span { width: var(--dot-size); height: var(--dot-size); border-radius: 50%; background: #5484b4; border: 1px solid white; box-sizing: content-box; }
.cluster-button:focus-visible { outline: 2px solid #d51a87; outline-offset: 1px; border-radius: 50%; }
.cluster-pending { width: 5px; height: 5px; border-radius: 50%; background: #cbd0d6; }
.cluster-details { position: absolute; top: 24px; left: 0; width: 310px; max-height: 175px; overflow-y: auto; padding: 12px; background: white; border: 1px solid #a5b7cc; box-shadow: 0 4px 14px #112c5026; color: #112c50; }
.cluster-details.align-right { left: auto; right: 0; }
.cluster-details b { font-size: 14px; }
.milestone-timeline .cluster-details p { margin: 4px 0; font-size: 11px; }
.cluster-details ul { padding: 0; margin: 8px 0 0; list-style: none; }
.cluster-details li { font-size: 11px; line-height: 1.4; margin: 0 0 7px; }
</style>
