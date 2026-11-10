<script setup>
import data from './chart-data.json'
const props = defineProps({ mode: { type: String, default: 'annual' } })
const months = ['01','02','03','04','05','06','07','08','09','10']
const series = [
  { key: 'contributed', label: 'Contributed by me', color: '#1a5190' },
  { key: 'reviewed', label: 'Reviewed by me', color: '#d51a87' },
]
const peak = Math.max(...data.annual.map(row => row.total))
const areas = [ ['Frontend','frontend'], ['CI','ci'], ['Backend / API','backend_api'], ['SDK','sdk'], ['Deployment','deployment_release'] ]
function count(area, month) { return data.categories.find(x => x.category === area && x.month === `2026-${month}`)?.count || 0 }
function color(n) { return n === 0 ? '#e9edf4' : n < 3 ? '#a8c6e9' : n < 10 ? '#548cc6' : n < 30 ? '#2361a3' : '#123d7a' }
</script>
<template>
<div v-if="props.mode === 'annual'">
  <div class="annual-legend"><span v-for="s in series" :key="s.key"><i :style="{background:s.color}"></i>{{ s.label }}</span></div>
  <div class="annual-chart">
    <div v-for="row in data.annual" :key="row.year" class="annual-col">
      <div class="annual-value">{{ row.total.toLocaleString() }}</div>
      <div class="annual-stack" :aria-label="row.year + ': ' + series.map(s => s.label + ' ' + row[s.key]).join(', ')" role="img">
        <div v-for="s in series" :key="s.key" :title="row.year + ' ' + s.label + ': ' + row[s.key]" :style="{height: (row[s.key] / peak * 180) + 'px', background:s.color}"></div>
      </div>
      <div class="annual-year">{{ row.year }}<span v-if="row.year === 2026">*</span></div>
    </div>
  </div>
</div>
<div v-else class="heatmap">
  <div class="heat-head"><span></span><span v-for="m in months" :key="m">{{ m }}</span></div>
  <div v-for="area in areas" :key="area[1]" class="heat-row"><b>{{ area[0] }}</b><span v-for="m in months" :key="m" :style="{background: color(count(area[1],m)), color: count(area[1],m) >= 10 ? 'white' : '#153762'}">{{ count(area[1],m) || '·' }}</span></div>
</div>
</template>
