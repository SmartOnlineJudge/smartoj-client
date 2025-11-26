<template>
  <div class="submit-record">
    <div 
      v-for="quetion in pageData" 
      :key="quetion.question_id" 
      class="record-container" 
      @click="() => { goToCoding(quetion.question_id) }"
    >
      <div class="title">
        <span class="question-name">{{ quetion.question_id }}.{{ quetion.name }}</span>
        <div class="difficulty">
          <a-tag v-if="quetion.difficulty === 'hard'" color="error">困难</a-tag>
          <a-tag v-else-if="quetion.difficulty === 'easy'" color="success">简单</a-tag>
          <a-tag v-else-if="quetion.difficulty === 'medium'" color="warning">中等</a-tag>
        </div>
      </div>
      <div class="footer">
        <span style="margin-right: 10px;">{{ quetion.created_at }}</span>
        <CheckCircleOutlined v-if="quetion.pass_test_quantity === quetion.total_test_quantity" style="color: #52c41a;"/>
        <CloseCircleOutlined v-else style="color: red;"/>
        <div class="tags">
          <a-tag v-for="tag in quetion.tags" :key="tag.id" color="processing">{{ tag.tag.name }}</a-tag>
        </div>
      </div>
      <a-divider style="margin-top: 15px;margin-bottom: 15px;"/>
    </div>
    <div class="pagination">
      <a-pagination 
        v-model:current="currentPage"
        v-model:pageSize="pageSize"
        :total="data.length" 
        :defautPageSize="pageSize"
        @change="pageChangeHandler"
        size="small"
        style="margin-left: auto;"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons-vue";

const pageSize = 5;
const currentPage = ref(1);

const data = [
  {
    question_id: 1,
    name: "两数之和",
    tags: [
      {
        tag: {name: "数组"},
        id: 1
      },
      {
        tag: {name: "哈希表"},
        id: 2
      }
    ],
    total_test_quantity: 3,
    pass_test_quantity: 2,
    created_at: "2025-11-18 13:21:57",
    difficulty: "easy"
  },
  {
    question_id: 2,
    name: "三数之和",
    tags: [
      {
        tag: {name: "数组"},
        id: 1
      },
      {
        tag: {name: "双指针"},
        id: 2
      },
      {
        tag: {name: "排序"},
        id: 3
      }
    ],
    total_test_quantity: 3,
    pass_test_quantity: 3,
    created_at: "2025-11-18 13:21:57",
    difficulty: "medium"
  },
  {
    question_id: 3,
    name: "三数之和",
    tags: [
      {
        tag: {name: "数组"},
        id: 1
      },
      {
        tag: {name: "哈希表"},
        id: 2
      }
    ],
    total_test_quantity: 3,
    pass_test_quantity: 3,
    created_at: "2025-11-18 13:21:57",
    difficulty: "hard"
  },
  {
    question_id: 4,
    name: "两数之和",
    tags: [
      {
        tag: {name: "数组"},
        id: 1
      },
      {
        tag: {name: "哈希表"},
        id: 2
      }
    ],
    total_test_quantity: 3,
    pass_test_quantity: 2,
    created_at: "2025-11-18 13:21:57",
    difficulty: "easy"
  },
  {
    question_id: 5,
    name: "三数之和",
    tags: [
      {
        tag: {name: "数组"},
        id: 1
      },
      {
        tag: {name: "双指针"},
        id: 2
      },
      {
        tag: {name: "排序"},
        id: 3
      }
    ],
    total_test_quantity: 3,
    pass_test_quantity: 3,
    created_at: "2025-11-18 13:21:57",
    difficulty: "medium"
  },
  {
    question_id: 6,
    name: "三数之和",
    tags: [
      {
        tag: {name: "数组"},
        id: 1
      },
      {
        tag: {name: "哈希表"},
        id: 2
      }
    ],
    total_test_quantity: 3,
    pass_test_quantity: 3,
    created_at: "2025-11-18 13:21:57",
    difficulty: "hard"
  },
  {
    question_id: 7,
    name: "两数之和",
    tags: [
      {
        tag: {name: "数组"},
        id: 1
      },
      {
        tag: {name: "哈希表"},
        id: 2
      }
    ],
    total_test_quantity: 3,
    pass_test_quantity: 2,
    created_at: "2025-11-18 13:21:57",
    difficulty: "easy"
  },
  {
    question_id: 8,
    name: "三数之和",
    tags: [
      {
        tag: {name: "数组"},
        id: 1
      },
      {
        tag: {name: "双指针"},
        id: 2
      },
      {
        tag: {name: "排序"},
        id: 3
      }
    ],
    total_test_quantity: 3,
    pass_test_quantity: 3,
    created_at: "2025-11-18 13:21:57",
    difficulty: "medium"
  },
  {
    question_id: 9,
    name: "三数之和",
    tags: [
      {
        tag: {name: "数组"},
        id: 1
      },
      {
        tag: {name: "哈希表"},
        id: 2
      }
    ],
    total_test_quantity: 3,
    pass_test_quantity: 3,
    created_at: "2025-11-18 13:21:57",
    difficulty: "hard"
  },
  {
    question_id: 10,
    name: "两数之和",
    tags: [
      {
        tag: {name: "数组"},
        id: 1
      },
      {
        tag: {name: "哈希表"},
        id: 2
      }
    ],
    total_test_quantity: 3,
    pass_test_quantity: 2,
    created_at: "2025-11-18 13:21:57",
    difficulty: "easy"
  },
  {
    question_id: 11,
    name: "三数之和",
    tags: [
      {
        tag: {name: "数组"},
        id: 1
      },
      {
        tag: {name: "双指针"},
        id: 2
      },
      {
        tag: {name: "排序"},
        id: 3
      }
    ],
    total_test_quantity: 3,
    pass_test_quantity: 3,
    created_at: "2025-11-18 13:21:57",
    difficulty: "medium"
  },
  {
    question_id: 12,
    name: "三数之和",
    tags: [
      {
        tag: {name: "数组"},
        id: 1
      },
      {
        tag: {name: "哈希表"},
        id: 2
      }
    ],
    total_test_quantity: 3,
    pass_test_quantity: 3,
    created_at: "2025-11-18 13:21:57",
    difficulty: "hard"
  },
  {
    question_id: 13,
    name: "两数之和",
    tags: [
      {
        tag: {name: "数组"},
        id: 1
      },
      {
        tag: {name: "哈希表"},
        id: 2
      }
    ],
    total_test_quantity: 3,
    pass_test_quantity: 2,
    created_at: "2025-11-18 13:21:57",
    difficulty: "easy"
  },
  {
    question_id: 14,
    name: "三数之和",
    tags: [
      {
        tag: {name: "数组"},
        id: 1
      },
      {
        tag: {name: "双指针"},
        id: 2
      },
      {
        tag: {name: "排序"},
        id: 3
      }
    ],
    total_test_quantity: 3,
    pass_test_quantity: 3,
    created_at: "2025-11-18 13:21:57",
    difficulty: "medium"
  },
  {
    question_id: 15,
    name: "三数之和",
    tags: [
      {
        tag: {name: "数组"},
        id: 1
      },
      {
        tag: {name: "哈希表"},
        id: 2
      }
    ],
    total_test_quantity: 3,
    pass_test_quantity: 3,
    created_at: "2025-11-18 13:21:57",
    difficulty: "hard"
  },
]
const pageData = ref(data.slice(0, 5))

const pageChangeHandler = page => {
  pageData.value = data.slice((page - 1) * pageSize, page * pageSize)
}
const goToCoding = questionID => {
  console.log(questionID)
}
</script>

<style scoped>
.record-container {
  display: flex;
  flex-direction: column;
}
.record-container:hover {
  cursor: pointer;
}
.record-container:hover .question-name {
  color: #1677ff;
}
.title {
  display: flex;
}
.question-name {
  font-weight: bold;
  font-size: 15px;
  color: black;
}
.difficulty {
  margin-left: auto;
}
.footer {
  margin-top: 10px;
  color: gray;
  display: flex;
  align-items: center;
}
.tags {
  margin-left: auto;
}
.pagination {
  margin-bottom: 10px;
  display: flex;
}
</style>
