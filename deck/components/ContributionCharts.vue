<script setup>
import { computed } from 'vue'
import data from './chart-data.json'
const props = defineProps({ mode: { type: String, default: 'annual' } })
const months = ['01','02','03','04','05','06','07','08','09','10']
const series = [
  { key: 'authored', label: 'PRs authored', color: '#1a5190' },
  { key: 'reviewed', label: 'PRs reviewed', color: '#d51a87' },
]
const chartRows = computed(() => props.mode === 'monthly' ? data.monthlyActivity : data.annual.map(row => ({ ...row, label: `${row.year}${row.year === 2026 ? '*' : ''}` })))
const peak = computed(() => Math.max(1, ...chartRows.value.flatMap(row => series.map(s => row[s.key]))))
const areas = [ ['Frontend','frontend'], ['CI','ci'], ['Backend / API','backend_api'], ['SDK','sdk'], ['Deployment','deployment_release'] ]
function count(area, month) { return data.categories.find(x => x.category === area && x.month === `2026-${month}`)?.count || 0 }
function color(n) { return n === 0 ? '#e9edf4' : n < 3 ? '#a8c6e9' : n < 10 ? '#548cc6' : n < 30 ? '#2361a3' : '#123d7a' }
</script>
<template>
<div v-if="props.mode === 'annual' || props.mode === 'monthly'">
  <div class="annual-legend"><span v-for="s in series" :key="s.key"><i :style="{background:s.color}"></i>{{ s.label }}</span></div>
  <div class="annual-chart">
    <div v-for="row in chartRows" :key="row.label" class="annual-col">
      <div class="pr-group" :aria-label="row.label + ': ' + series.map(s => s.label + ' ' + row[s.key]).join(', ')" role="img">
        <div v-for="s in series" :key="s.key" class="pr-column" :title="row.label + ' ' + s.label + ': ' + row[s.key]"><span>{{ row[s.key] }}</span><div :style="{height: (row[s.key] / peak * 180) + 'px', background:s.color}"></div></div>
      </div>
      <div class="annual-year">{{ row.label }}</div>
    </div>
  </div>
</div>
<div v-else class="heatmap">
  <div class="heat-head"><span></span><span v-for="m in months" :key="m">{{ m }}</span></div>
  <div v-for="area in areas" :key="area[1]" class="heat-row"><b>{{ area[0] }}</b><span v-for="m in months" :key="m" :style="{background: color(count(area[1],m)), color: count(area[1],m) >= 10 ? 'white' : '#153762'}">{{ count(area[1],m) || '·' }}</span></div>
</div>
</template>
