<template>
  <div class="content">
    <div class="title">
      <span style="color: gray;">
        过去一年共提交
        <span class="statistics">
          {{ sum(Object.values(contributionData)) }}
        </span>
        次
      </span>
      <span style="color: gray;margin-left: 15px;">
        累计提交天数
        <span class="statistics">
          {{ Object.keys(contributionData).length }}
        </span>
        天
      </span>
    </div>
    <Contributions :data="contributionData" theme="smartoj"/>
  </div>
</template>

<script setup>
import Contributions from '@/components/Contributions.vue';

const sum = (arr) => {
  let res = 0
  for (let i = 0; i < arr.length; i++) {
    res += arr[i]
  }
  return res
}
const contributionData = {
  "2025-01-01": 5, 
  "2025-01-02": 3,
  "2025-07-02": 10,
  "2025-10-02": 1,
}
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 5px 10px 5px;
}
.title {
  margin: 10px 0;
}
.statistics {
  font-weight: bold;
  color: black;
  font-size: 16px;
}
</style>
