<script setup>
defineProps({ step: { type: Number, required: true } })
const milestones = [
  { title: 'First PR', date: 'Jan 9', detail: 'Remove disabled Renovate config', pr: 12631 },
  { title: 'Frontend tests', date: 'Jan 15', detail: 'Test the Kubernetes client', pr: 12635 },
  { title: 'CRA to Vite', date: 'Feb 9', detail: 'Replace the build and test tools', pr: 12754 },
  { title: 'Frontend approver', date: 'Feb 23', detail: '45 days after my first PR', pr: 12869 },
  { title: 'CI work', date: 'Jul 19', detail: 'Stabilize and speed up test lanes', pr: 13739 },
  { title: 'Project maintainer', date: 'Jul 28', detail: 'Responsibility across Pipelines', pr: 13908 },
  { title: 'Security advisories', date: 'Oct 28–29', detail: 'Triaged and published with 2.18', url: 'https://github.com/kubeflow/pipelines/security/advisories', linkLabel: 'Published advisories' },
  { title: 'Today: new UI', date: 'Preview', detail: 'Separate from the stack migration', pr: 14584 },
]
</script>

<template>
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
    </li>
  </ol>
  <p v-if="step === 7" class="milestone-key">2026 · Public disclosures: October 28–29 · <a href="https://github.com/kubeflow/pipelines/releases/tag/2.18.0" target="_blank" rel="noopener noreferrer">2.18 release notes</a></p>
  <p v-else-if="step < 8" class="milestone-key">2026 · Milestones in sequence, not to time scale · <span>Current milestone</span></p>
  <p v-else class="milestone-key">2026 · Not to time scale · UI PR is open as of November 9. These screenshots are a preview.</p>
</template>

<style scoped>
.milestone-timeline { position: relative; display: grid; grid-template-columns: repeat(8, 1fr); padding: 0; margin: 0; list-style: none; height: 330px; }
.milestone-timeline::before { content: ''; position: absolute; left: 6.25%; right: 6.25%; top: calc(50% - 2px); height: 4px; background: linear-gradient(to right, #153e7d var(--progress), #d4d9df var(--progress)); }
.milestone-timeline li { position: relative; margin: 0; padding: 0; color: #112c50; }
.milestone-marker { position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 22px; height: 22px; border: 3px solid #cbd0d6; border-radius: 50%; background: white; z-index: 1; }
.reached .milestone-marker { border-color: #153e7d; background: #153e7d; }
.current .milestone-marker { border-color: #d51a87; background: #d51a87; box-shadow: 0 0 0 6px #fceaf4; }
.reached::before { content: ''; position: absolute; left: calc(50% - 1px); top: calc(50% + 14px); width: 2px; height: 18px; background: #a5b7cc; }
.reached:nth-child(odd)::before { top: auto; bottom: calc(50% + 14px); }
.milestone-label { position: absolute; width: 158px; left: 50%; transform: translateX(-50%); top: calc(50% + 38px); text-align: center; }
li:nth-child(odd) .milestone-label { top: auto; bottom: calc(50% + 38px); }
.milestone-label time { font-size: 12px; font-weight: 600; color: #596c83; }
.milestone-timeline h2 { font-size: 17px; font-weight: 650; line-height: 1.2; margin: 5px 0; color: inherit; letter-spacing: 0; }
.current h2, .current time { color: #ac136b; }
.milestone-timeline p { font-size: 12px; line-height: 1.35; margin: 0 0 4px; }
.milestone-timeline a { color: inherit; font-size: 11px; text-decoration: underline; }
.milestone-key { font-size: 11px; color: #596c83; margin: 14px 0 0; }
.milestone-key span { color: #ac136b; }
</style>
