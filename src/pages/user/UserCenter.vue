<script setup>
import UserBaseInfo from "@/components/user/user-center/UserBaseInfo.vue";
import SolutionHeatMap from "@/components/user/user-center/SolutionHeatMap.vue";
import ActivationRecord from "@/components/user/user-center/ActivationRecord.vue";
import UserProfile from "@/components/user/user-center/UserProfile.vue";
import SolutionSummary from "@/components/user/user-center/SolutionSummary.vue";

</script>

<template>
  <div class="user-center">
    <div class="user-center-left">
      <UserBaseInfo class="base-box-style"/>
      <UserProfile class="base-box-style"/>
    </div>
    <div class="user-center-right">
      <!-- 刷题总结、其他 -->
      <div style="display: flex;">
        <SolutionSummary class="base-box-style" style="width: 49%;"/>
        <div class="base-box-style" style="width: 49%;margin-left: auto;">
          暂时不知道放什么
        </div>
      </div>
      <!-- 刷题热力图 -->
      <SolutionHeatMap class="base-box-style"/>
      <!-- 活跃记录 -->
      <ActivationRecord class="base-box-style"/>
    </div>
  </div>
</template>

<style scoped>
.base-box-style {
  background-color: white;
  border-radius: 10px;
  min-height: 170px;
  margin-bottom: 15px;
}
.user-center {
  display: flex;
  margin: 20px auto 0 auto;
  width: 65vw;
}
.user-center-left {
  height: max-content;
  min-width: 20%;
  max-width: 22%;
}
.user-center-right {
  display: flex;
  flex-direction: column;
  margin-left: 15px;
  width: 100%;
}
</style>
