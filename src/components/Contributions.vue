<!-- Google Gemini3 立大功！ -->
<template>
  <div class="contributions-board">
    <!-- 1. 年份主容器：Flex行布局，不换行，支持横向滚动 -->
    <div class="year-container">
      
      <!-- 循环渲染 12 个月 -->
      <div 
        v-for="(month, mIndex) in monthsData" 
        :key="mIndex" 
        class="month-block"
      >
        <!-- 月份标题 -->
        <div class="month-label">{{ month.label }}</div>

        <!-- 月份网格 -->
        <div class="month-grid">
          <!-- 循环渲染 周 -->
          <div 
            v-for="(week, wIndex) in month.weeks" 
            :key="wIndex" 
            class="week-column"
          >
            <!-- 循环渲染 天 -->
            <a-tooltip 
              placement="top"
              v-for="(day, dIndex) in week"
              :key="dIndex"
            >
              <template #title>
                {{ day.date ? `${day.date}： ${day.count} 次提交` : '' }}
              </template>
              <div 
                class="day-cell"
                :class="{ 'empty-day': !day.date }"
                :style="getDayStyle(day)"
              ></div>
            </a-tooltip>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. 底部图例 -->
    <div class="legend-container">
      <span class="legend-text">更少</span>
      <div class="legend-cells">
        <!-- 循环渲染图例的5个等级 -->
        <div 
          v-for="level in 5" 
          :key="level" 
          class="day-cell legend-item"
          :style="{ backgroundColor: currentThemeColors[level - 1] }"
        ></div>
      </div>
      <span class="legend-text">更多</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

// --- Props 定义 ---
const props = defineProps({
  year: {
    type: Number,
    default: new Date().getFullYear()
  },
  data: {
    type: Object, // 格式: { "2023-11-26": 5, ... }
    default: () => ({})
  },
  // 主题名称，默认 github
  theme: {
    type: String,
    default: 'github'
  }
});

// --- 主题配置 ---
const themes = {
  github: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  halloween: ['#ebedf0', '#FFEE4A', '#FFC501', '#FE9600', '#03001C'],
  blue: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'],
  pink: ['#ebedf0', '#ffb3c6', '#ff8fab', '#fb6f92', '#e36493'],
  purple: ['#ebedf0', '#d9c6f4', '#b699f0', '#9365e8', '#7038d9'],
  smartoj: ['#ebedf0', '#b8d4fd', '#85bffc', '#3185fc', '#1a6bd6']
};

const monthsData = ref([]);

// --- 计算当前使用的主题颜色数组 ---
const currentThemeColors = computed(() => {
  return themes[props.theme] || themes.github;
});

// --- 核心逻辑：生成日历数据 ---
const generateMonthCalendar = () => {
  const result = [];
  const year = props.year;

  // 遍历 12 个月
  for (let month = 0; month < 12; month++) {
    const monthWeeks = [];
    let currentWeek = [];

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // 1. 填充月初空白 (占位符)
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0-6
    for (let i = 0; i < startDayOfWeek; i++) {
      currentWeek.push({ date: null, count: 0 });
    }

    // 2. 填充真实日期
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const currentDate = new Date(year, month, day);
      const dateStr = formatDate(currentDate);
      const count = props.data[dateStr] || 0;

      currentWeek.push({ date: dateStr, count });

      if (currentWeek.length === 7) {
        monthWeeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // 3. 填充月末空白
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ date: null, count: 0 });
      }
      monthWeeks.push(currentWeek);
    }

    result.push({
      label: `${month + 1}月`,
      weeks: monthWeeks
    });
  }
  monthsData.value = result;
};

// --- 工具函数 ---

const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// 计算贡献等级 0-4
const getLevel = (count) => {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
};

// 获取单个格子的样式
const getDayStyle = (day) => {
  // 如果是占位符，背景透明
  if (!day.date) {
    return { backgroundColor: 'transparent' };
  }
  
  // 获取等级并从当前主题数组取色
  const level = getLevel(day.count);
  const color = currentThemeColors.value[level];
  
  return {
    backgroundColor: color
  };
};

onMounted(() => {
  generateMonthCalendar();
});

watch(() => [props.data, props.year], () => {
  generateMonthCalendar();
}, { deep: true });
</script>

<style scoped>
.contributions-board {
  display: flex;
  flex-direction: column;
  padding: 5px;
  max-width: 100%;
  overflow-x: auto; /* 允许横向滚动 */
}

/* 1. 月份容器：横向排列 */
.year-container {
  display: flex;
  flex-direction: row;
  gap: 10px; /* 月份之间的间距 */
}

/* 单个月份块 */
.month-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.month-label {
  font-size: 12px;
  color: #57606a;
  margin-bottom: 8px;
  height: 14px;
  font-weight: 400;
}

/* 月份内的网格：横向周 */
.month-grid {
  display: flex;
  flex-direction: row;
  gap: 2px; /* 周间距 */
}

/* 每一周：纵向天 */
.week-column {
  display: flex;
  flex-direction: column;
  gap: 2px; /* 天间距 */
}

/* 2. 格子通用样式 */
.day-cell {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  box-sizing: border-box;
  /* 增加过渡动画，让颜色变化和hover更丝滑 */
  transition: transform 0.1s, border 0.1s; 
}

/* 保持 Hover 效果 */
.day-cell:not(.empty-day):not(.legend-item):hover {
  /* 
    这里使用 outline 或 border 来做高亮 
    rgba(0,0,0,0.5) 是为了兼容所有浅色背景的格子
  */
  border: 1px solid rgba(27, 31, 35, 0.4); 
  transform: scale(1.15); /* 放大效果 */
  cursor: pointer;
  z-index: 2; /* 确保放大时盖住周围格子 */
}

/* 占位格子：不可交互 */
.empty-day {
  pointer-events: none;
}

/* 3. 图例 */
.legend-container {
  display: flex;
  align-items: center;
  justify-content: center; /* 靠右 */
  gap: 5px;
  margin-top: 15px;
  font-size: 12px;
  color: #57606a;
}

.legend-cells {
  display: flex;
  gap: 3px;
}

.legend-item {
  /* 图例不需要放大效果，这里只复用大小样式 */
  pointer-events: none;
}
</style>
