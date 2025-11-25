<template>
  <div class="contribution-graph">
    <div class="weeks-container">
      <!-- 周数标签 -->
      <div class="month-labels">
        <div 
          v-for="month in monthLabels"
          :key="month.index"
          class="month-label"
        >
          {{ month.name }}
        </div>
      </div>
      
      <div class="weeks">
        <!-- 星期标签 - 只显示周一、周四、周日 -->
        <div class="day-labels">
          <div 
            v-for="(label, index) in dayLabels" 
            :key="index"
            class="day-label"
          >
            {{ label }}
          </div>
        </div>
        
        <!-- 贡献格子 -->
        <div class="days-grid">
          <div 
            v-for="(week, weekIndex) in graphData" 
            :key="weekIndex"
            class="week-column"
          >
            <div
              v-for="(day, dayIndex) in week"
              :key="dayIndex"
              class="day-cell"
              :style="{ backgroundColor: day.color }"
              :data-tooltip="`${day.displayDate}: ${day.count} 次提交`"
            ></div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 图例 -->
    <div class="legend">
      <span class="legend-text">更少</span>
      <div class="legend-items">
        <div
          v-for="(color, index) in currentColors"
          :key="index"
          class="legend-item"
          :style="{ backgroundColor: color }"
        ></div>
      </div>
      <span class="more-text">更多</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: {
    type: Object,
    required: true,
    default: () => ({})
  },
  theme: {
    type: String,
    default: 'github'
  },
  year: {
    type: Number,
    default: () => new Date().getFullYear()
  }
})
const year = props.year
const data = props.data

const themes = {
  github: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  halloween: ['#ebedf0', '#FFEE4A', '#FFC501', '#FE9600', '#03001C'],
  blue: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'],
  pink: ['#ebedf0', '#ffb3c6', '#ff8fab', '#fb6f92', '#e36493'],
  purple: ['#ebedf0', '#d9c6f4', '#b699f0', '#9365e8', '#7038d9'],
  smartoj: ['#ebedf0', '#b8d4fd', '#85bffc', '#3185fc', '#1a6bd6']
}
const dayLabels = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
const monthLabels = [
  { name: '1月', index: 0 },
  { name: '2月', index: 4 },
  { name: '3月', index: 8 },
  { name: '4月', index: 13 },
  { name: '5月', index: 17 },
  { name: '6月', index: 21 },
  { name: '7月', index: 26 },
  { name: '8月', index: 30 },
  { name: '9月', index: 35 },
  { name: '10月', index: 39 },
  { name: '11月', index: 43 },
  { name: '12月', index: 48 }
]

const currentColors = computed(() => {
  return themes[props.theme] || themes.github
})

const generateYearData = () => {
  const yearData = {}
  const startDate = new Date(year, 0, 1)
  const endDate = new Date(year, 11, 31)
  
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    const dateStr = date.toISOString().split('T')[0]
    yearData[dateStr] = data[dateStr] || 0
  }
  return yearData
}

const getContributionLevel = count => {
  if (count === 0) return 0
  if (count <= 3) return 1
  if (count <= 6) return 2
  if (count <= 9) return 3
  return 4
}

const graphData = computed(() => {
  const yearData = generateYearData()
  const weeks = []
  
  // 计算第一周的起始日期
  const firstDay = new Date(year, 0, 1)
  const firstWeekDay = firstDay.getDay() // 0是周日
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstWeekDay)
  
  // 生成52周的数据
  for (let week = 0; week < 52; week++) {
    const weekData = []
    for (let day = 0; day < 7; day++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + (week * 7 + day))
      
      const dateStr = currentDate.toISOString().split('T')[0]
      const count = yearData[dateStr] || 0
      const level = getContributionLevel(count)
      
      // 格式化日期显示
      const displayDate = currentDate.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      
      weekData.push({
        date: dateStr,
        count,
        level,
        displayDate,
        color: currentColors.value[level]
      })
    }
    weeks.push(weekData)
  }
  return weeks
})
</script>

<style scoped>
.contribution-graph {
  display: inline-block;
  border-radius: 8px;
}
.weeks-container {
  display: flex;
  flex-direction: column;
}
.month-labels {
  display: flex;
  margin-left: 40px;
  margin-bottom: 5px;
  height: 15px;
}
.month-label {
  font-size: 10px;
  color: #656d76;
  text-align: center;
  flex: 1;
}
.weeks {
  display: flex;
}
.day-labels {
  display: flex;
  flex-direction: column;
  margin-right: 8px;
  font-size: 10px;
  color: #656d76;
  width: 30px;
}
.day-label {
  height: 12px;
  margin-bottom: 3px;
  text-align: right;
  padding-right: 5px;
  line-height: 14px;
}
.days-grid {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  height: 112px;
  gap: 3px;
}
.week-column {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.day-cell {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  position: relative;
  transition: transform 0.1s ease;
}
.day-cell:hover {
  transform: scale(1.1);
  z-index: 10;
  box-shadow: 0 0 0 2px rgba(9, 105, 218, 0.3);
}
.day-cell:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 100;
  margin-bottom: 8px;
  pointer-events: none;
}
.legend {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #656d76;
  gap: 8px;
}
.legend-items {
  display: flex;
  gap: 3px;
}
.legend-item {
  width: 12px;
  height: 12px;
  border-radius: 3px;
}
.more-text {
  margin-left: 0;
}
</style>
