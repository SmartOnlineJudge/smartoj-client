<script setup>
import {ClearOutlined, DownOutlined, SearchOutlined} from "@ant-design/icons-vue";
import {computed, onBeforeMount, reactive, ref, watch} from "vue";
import {getQuestionList, getTagsList} from "@/http.js";

onBeforeMount(() => {
  getTagsList(true).then(response => {
    const tags = response.data.data
    tags.forEach(tag => {
      tagsData[tag.name] = tag.question_count
    })
  })
  pageChangeHandler(pagination.current, pagination.pageSize)
})

//顶部标签
const tagsData = reactive({})
const showTags = ref(true)
const tagsDataShow = computed(() => {
  if (showTags.value) {
    return tagsData;
  } else {
    const entries = Object.entries(tagsData).slice(0, 5);
    return Object.fromEntries(entries);
  }
});

//清除筛选
const openClearFilters = ref(false)
const clearFilters = () => {
  selectedTags.value = []
  selectingTags.value = []
  openClearFilters.value = false
  difficultySelect.value = null
  searchValue.value = null
  pageChangeHandler(1, pagination.pageSize)
}

//难度菜单
const difficultySelect = ref(null)

//选择标签
const openTag = ref(false)
const selectedTags = ref([])  //绑定的已选择标签
const selectingTags = ref([])
const tagSelected = (tag, checked) => {
  selectingTags.value = checked ? [...selectingTags.value, tag] : selectingTags.value.filter(t => t !== tag);
}

//搜索框
const searchValue = ref(null)

//筛选
watch([searchValue, difficultySelect, selectedTags], () => {
  openClearFilters.value = true
  getQuestionList(1, pagination.pageSize, selectingTags.value, difficultySelect.value, searchValue.value).then(response => {
    questionsData.value = response.data.data.results
    pagination.total = response.data.data.total
  })
})

//题目列表
const questionsData = ref([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  pageSizeOptions: ['10', '20', '50']
})
const questionsLoading = ref(false)
const pageChangeHandler = (pageCurrent, pageSize) => {
  questionsLoading.value = true
  getQuestionList(pageCurrent, pageSize, selectedTags.value, difficultySelect.value, searchValue.value).then(response => {
    questionsData.value = response.data.data.results
    pagination.total = response.data.data.total
    pagination.current = pageCurrent
    pagination.pageSize = pageSize
    questionsLoading.value = false
  })
};
const questionColumns = [
  {
    title: '题目',
    dataIndex: 'title',
    align: 'center',
    width: '30%',
  },
  {
    title: '提交数量',
    dataIndex: 'submission_quantity',
    align: 'center',
    width: '30%'
  },
  {
    title: '通过率',
    dataIndex: 'pass_quantity',
    align: 'center',
    width: '20%',
    customRender: ({record}) => {
      if (!record.submission_quantity || !record.pass_quantity) {
        return '0.0%';
      }
      const rate = record.pass_quantity / record.submission_quantity * 100;
      return `${rate.toFixed(1)}%`;
    }
  },
  {
    title: '难度',
    dataIndex: 'difficulty',
    align: 'center',
  }
]
const rowClick = (record) => {
  return {
    onClick: () => {
      window.open(`/coding/${record.id}`)
    },
    onMouseenter: () => {
      document.body.style.cursor = 'pointer';
    },
    onMouseleave: () => {
      document.body.style.cursor = '';
    }
  }
}
</script>

<template>
  <div class="tags-list">
    <a-space :size="[10,18]" wrap>
      <a-tag v-for="(count,tag) in tagsDataShow"
             :key="tag"
             style="font-size: 15px; padding: 3px 4px;background-color: white"
             :bordered='false'
      >
        {{ tag }}
        <span style="background-color: #ededed;
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 13px">
            {{ count }}
          </span>
      </a-tag>
      <a-button type="link" style="font-size: 15px" @click="()=>{showTags=!showTags}">
        {{ showTags ? '<< 收起' : '展开>>' }}
      </a-button>
    </a-space>
  </div>
  <div class="operate">
    <a-space>
      <a-dropdown>
        <template #overlay>
          <a-menu @click="(item) => {difficultySelect = item.key}">
            <a-menu-item key="easy">
              简单
            </a-menu-item>
            <a-menu-item key="medium">
              中等
            </a-menu-item>
            <a-menu-item key="hard">
              困难
            </a-menu-item>
          </a-menu>
        </template>
        <a-button
            :style="difficultySelect ? {backgroundColor:'#bae7ff',color: '#1890ff'}:{backgroundColor: 'unset'}">
          难度
          <DownOutlined/>
        </a-button>
      </a-dropdown>
      <div>
        <a-button 
          @click="() => { openTag = true }"
          :style="selectedTags.length > 0 ? {backgroundColor: '#bae7ff', color: '#1890ff'}: {backgroundColor: 'unset'}"
        >
          标签
        </a-button>
        <a-modal 
          v-model:open="openTag"
          width="40%"
          :closable="false"
          cancelText="取消"
          okText="确认"
          @ok="() => {openTag = false;selectedTags = selectingTags}"
          :maskClosable="false"
          @cancel="()=>{selectingTags=selectedTags}"
        >
          <template #title>
            <span style="font-size: 20px; font-weight: bold;">选择标签</span>
          </template>
          <div style="max-height: 400px ;overflow-y: auto;">
            <a-space :size="[3, 8]" wrap>
              <a-checkable-tag v-for="(count,tag) in tagsData"
                               :key="tag"
                               style="font-size: 15px; padding: 5px 8px;margin: 7px "
                               :checked="selectingTags.indexOf(tag) > -1"
                               @change="checked => tagSelected(tag, checked)"
              >
                {{ tag }}
              </a-checkable-tag>
            </a-space>
          </div>
        </a-modal>
      </div>
      <a-input 
        v-model:value="searchValue" 
        placeholder="搜索题目、编号或内容"
        type="primary"
      >
        <template #prefix>
          <SearchOutlined/>
        </template>
      </a-input>
      <a-button type="text" v-show=openClearFilters @click="clearFilters">清除筛选
        <ClearOutlined/>
      </a-button>
    </a-space>
  </div>
  <div class="questions-list">
    <a-table 
      :dataSource="questionsData" 
      :columns="questionColumns" 
      :pagination="pagination"
      style="font-size: 15px;"
      :loading=questionsLoading
      :customRow="rowClick"
      @change="page => { pageChangeHandler(page.current, page.pageSize) }"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'title'">
          <span>{{ record.id }}.{{ record.title }}</span>
        </template>
        <template v-else-if="column.dataIndex === 'difficulty'">
          <span v-if="record.difficulty==='easy'" style="color: #52c41a;font-size: 15px">
            简单
          </span>
          <span v-else-if="record.difficulty==='medium'" style="color: #faad14;font-size: 15px">
            中等
          </span>
          <span v-else style="color: #ff4d4f;font-size: 15px">困难</span>
        </template>
      </template>
    </a-table>
  </div>
</template>

<style scoped>
.tags-list {
  margin: 10px 0 20px 0;
}
.operate {
  margin: 25px 0 20px 0;
}
</style>