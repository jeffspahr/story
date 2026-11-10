<script setup>
import { computed } from 'vue'
import data from './chart-data.json'
const props = defineProps({ mode: { type: String, default: 'annual' } })
const months = ['01','02','03','04','05','06','07','08','09','10','11']
const monthLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov']
const series = [
  { key: 'opened', label: 'PRs authored', color: '#168477' },
  { key: 'reviewed', label: 'PRs reviewed', color: '#d51a87' },
]
const chartRows = computed(() => props.mode === 'monthly' ? data.monthlyActivity : data.annual.map(row => ({ ...row, label: `${row.year}${row.year === 2026 ? '*' : ''}` })))
function upper(key) { const max = Math.max(1, ...chartRows.value.map(row => row[key])); const step = max >= 1000 ? 500 : max >= 100 ? 50 : 10; return Math.ceil(max / step) * step }
function x(index) { return 175 + (index + 0.5) * 675 / chartRows.value.length }
const areas = [ ['Frontend','frontend'], ['CI','ci'], ['Backend / API','backend_api'], ['SDK','sdk'], ['Deployment','deployment_release'] ]
function count(area, month) { return data.categories.find(x => x.category === area && x.month === `2026-${month}`)?.count || 0 }
function color(n) { return n === 0 ? '#e9edf4' : n < 3 ? '#a8c6e9' : n < 10 ? '#548cc6' : n < 30 ? '#2361a3' : '#123d7a' }
</script>
<template>
<div v-if="props.mode === 'annual' || props.mode === 'monthly'">
  <svg class="aligned-charts" viewBox="0 0 850 230" role="img" :aria-label="props.mode === 'monthly' ? 'Monthly PRs authored and PRs reviewed in 2026 through November 9' : 'Yearly PRs authored and PRs reviewed through November 9, 2026'">
    <g v-for="(s, panel) in series" :key="s.key" :transform="'translate(0,' + panel * 110 + ')'">
      <text x="0" y="35" class="panel-name" :fill="s.color">{{ s.label }}</text>
      <text x="0" y="54" class="panel-scale">Scale: 0–{{ upper(s.key).toLocaleString() }}</text>
      <line x1="175" x2="850" y1="74" y2="74" stroke="#c4d2df" />
      <g v-for="(row, i) in chartRows" :key="row.label">
        <title>{{ row.label }}: {{ s.label }} {{ row[s.key] }}</title>
        <rect :x="x(i)-14" :y="74-row[s.key]/upper(s.key)*50" width="28" :height="row[s.key]/upper(s.key)*50" :fill="s.color" />
        <text :x="x(i)" :y="68-row[s.key]/upper(s.key)*50" text-anchor="middle" class="panel-value">{{ row[s.key].toLocaleString() }}</text>
      </g>
    </g>
    <text v-for="(row,i) in chartRows" :key="row.label" :x="x(i)" y="215" text-anchor="middle" class="panel-period">{{ row.label }}</text>
  </svg>
</div>
<div v-else class="heatmap" :style="{ '--month-count': months.length }">
  <div class="heat-head"><span></span><span v-for="(m, i) in months" :key="m">{{ monthLabels[i] }}</span></div>
  <div v-for="area in areas" :key="area[1]" class="heat-row"><b>{{ area[0] }}</b><span v-for="m in months" :key="m" :style="{background: color(count(area[1],m)), color: count(area[1],m) >= 10 ? 'white' : '#153762'}">{{ count(area[1],m) || '·' }}</span></div>
</div>
</template>
