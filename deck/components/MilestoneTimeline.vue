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
  <ol class="milestone-timeline" :data-step="step" aria-label="My path through Kubeflow Pipelines in 2026">
    <li v-for="(milestone, index) in milestones" :key="milestone.title"
      :class="{ reached: index < step, current: index === step - 1 }"
      :aria-current="index === step - 1 ? 'step' : undefined">
      <div class="milestone-marker"><span>{{ index + 1 }}</span><time>{{ milestone.date }}</time></div>
      <h2>{{ milestone.title }}</h2>
      <p>{{ milestone.detail }}</p>
      <a :href="milestone.url || `https://github.com/kubeflow/pipelines/pull/${milestone.pr}`" target="_blank" rel="noopener noreferrer">{{ milestone.linkLabel || `#${milestone.pr}` }}</a>
    </li>
  </ol>
  <p v-if="step === 7" class="milestone-key">2026 · Public disclosures: October 28–29 · <a href="https://github.com/kubeflow/pipelines/releases/tag/2.18.0" target="_blank" rel="noopener noreferrer">2.18 release notes</a></p>
  <p v-else-if="step < 8" class="milestone-key">2026 · Milestones in sequence, not to time scale · <span>Current milestone</span></p>
  <p v-else class="milestone-key">2026 · Not to time scale · UI PR is open as of November 9. These screenshots are a preview.</p>
</template>

<style scoped>
.milestone-timeline { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px 14px; padding: 0; margin: 0; list-style: none; }
.milestone-timeline li { margin: 0; padding: 12px 14px; border-top: 4px solid #cbd0d6; background: #f1f2f4; color: #68717b; min-height: 141px; }
.milestone-timeline li.reached { background: #e9f0f8; border-color: #153e7d; color: #112c50; }
.milestone-timeline li.current { border-color: #d51a87; background: #fceaf4; }
.milestone-marker { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; }
.milestone-marker span { display: inline-flex; width: 24px; height: 24px; border-radius: 50%; align-items: center; justify-content: center; background: #dce0e5; }
.reached .milestone-marker span { background: #153e7d; color: white; }
.current .milestone-marker span { background: #d51a87; }
.milestone-timeline h2 { font-size: 17px; line-height: 1.2; margin: 10px 0 6px; color: inherit; letter-spacing: 0; }
.milestone-timeline p { font-size: 13px; line-height: 1.35; margin: 0 0 7px; min-height: 35px; }
.milestone-timeline a { color: inherit; font-size: 12px; text-decoration: underline; }
.milestone-key { font-size: 11px; color: #596c83; margin: 14px 0 0; }
.milestone-key span { color: #ac136b; }
</style>
