<template>
  <div class="about-container">
    <div class="about-header">
      <h1 style="margin-top: 0;">关于我们</h1>
      <p>智能算法刷题平台 - 让刷题变得更智能、更高效</p>
    </div>

    <div class="about-content">
      <a-card class="about-card">
        <h2>项目简介</h2>
        <p>
          智能算法刷题平台是一个专为算法爱好者和开发者打造的在线编程练习平台。
          该平台提供了在线的算法题目、智能刷题助手功能以及实时的代码评测系统，
          帮助用户提升编程能力和算法思维。
        </p>
        <p>
          项目开源地址：
          <a href="https://github.com/SmartOnlineJudge" target="_blank" class="github-link">https://github.com/SmartOnlineJudge</a>
        </p>
      </a-card>

      <a-card class="about-card">
        <h2>主要功能</h2>
        <div class="features">
          <div class="feature-item">
            <div class="feature-icon">🤖</div>
            <div class="feature-content">
              <h3>智能解题助手</h3>
              <p>集成 AI 解题助手，实时解答编程问题，提供解题思路和优化建议</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">💻</div>
            <div class="feature-content">
              <h3>在线编码</h3>
              <p>内置代码编辑器，支持多种编程语言在线编写和调试</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔍</div>
            <div class="feature-content">
              <h3>动态布局</h3>
              <p>可拖拽调整的编辑器与终端布局，自定义编程环境</p>
            </div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">📊</div>
            <div class="feature-content">
              <h3>题目推荐</h3>
              <p>通过用户画像与知识图谱将合适的题目推荐给用户</p>
            </div>
          </div>
        </div>
      </a-card>

      <a-card class="about-card">
        <h2>开发小队</h2>
        <div class="team-members">
          <div class="team-member">
            <a-avatar :src="MINIO_URL + '/user-avatars/sOFQK2CZGNfIQVa6hgFKngTM8jp5u53h.jpg'" size="large" />
            <div class="member-info">
              <h3>先杀我队友</h3>
              <p class="role">项目发起人和主要开发</p>
              <a href="https://github.com/thcpdd" target="_blank" class="github-link">GitHub: https://github.com/thcpdd</a>
            </div>
          </div>
          <div class="team-member">
            <a-avatar :src="MINIO_URL + '/user-avatars/2025030669956.jpg'" size="large" />
            <div class="member-info">
              <h3>小张同志</h3>
              <p class="role">主要负责项目的前端开发</p>
              <a href="https://github.com/zlf7856" target="_blank" class="github-link">GitHub: https://github.com/zlf7856</a>
            </div>
          </div>
          <div class="team-member">
            <a-avatar :src="MINIO_URL + '/user-avatars/2025030629551.png'" size="large" />
            <div class="member-info">
              <h3>佩斯利公园</h3>
              <p class="role">主要负责项目的后端开发</p>
              <a href="https://github.com/Ramffly" target="_blank" class="github-link">GitHub: https://github.com/Ramffly</a>
            </div>
          </div>
        </div>
      </a-card>

      <a-card class="about-card">
        <h2>技术栈</h2>
        <div class="tech-stack">
          <div class="tech-category">
            <h3>前端技术</h3>
            <div class="tech-items">
              <div class="tech-item">
                <span class="tech-name">Vue 3 + Vite</span>
                <span class="tech-desc">客户端、后台管理系统框架</span>
              </div>
              <div class="tech-item">
                <span class="tech-name">Ant Design Vue</span>
                <span class="tech-desc">UI 组件库</span>
              </div>
              <div class="tech-item">
                <span class="tech-name">Ant Design X</span>
                <span class="tech-desc">前端 AI 组件库</span>
              </div>
              <div class="tech-item">
                <span class="tech-name">Vue-ECharts</span>
                <span class="tech-desc">数据可视化图标插件</span>
              </div>
            </div>
          </div>
          
          <div class="tech-category">
            <h3>后端技术</h3>
            <div class="tech-items">
              <div class="tech-item">
                <span class="tech-name">FastAPI</span>
                <span class="tech-desc">后端框架</span>
              </div>
              <div class="tech-item">
                <span class="tech-name">FastMCP</span>
                <span class="tech-desc">快速构建 MCP 工具</span>
              </div>
              <div class="tech-item">
                <span class="tech-name">LangChain、LangGraph</span>
                <span class="tech-desc">搭建多智能体协同的工作流系统</span>
              </div>
              <div class="tech-item">
                <span class="tech-name">Gin</span>
                <span class="tech-desc">代码沙箱后端框架</span>
              </div>
            </div>
          </div>
          
          <div class="tech-category">
            <h3>数据与存储</h3>
            <div class="tech-items">
              <div class="tech-item">
                <span class="tech-name">MySQL</span>
                <span class="tech-desc">后端数据库</span>
              </div>
              <div class="tech-item">
                <span class="tech-name">Redis</span>
                <span class="tech-desc">后端缓存、中间件依赖</span>
              </div>
              <div class="tech-item">
                <span class="tech-name">ElasticSearch</span>
                <span class="tech-desc">全文检索引擎</span>
              </div>
              <div class="tech-item">
                <span class="tech-name">MinIO</span>
                <span class="tech-desc">文件对象存储系统</span>
              </div>
            </div>
          </div>
          
          <div class="tech-category">
            <h3>基础设施</h3>
            <div class="tech-items">
              <div class="tech-item">
                <span class="tech-name">RabbitMQ</span>
                <span class="tech-desc">消息队列服务，实现异步任务</span>
              </div>
              <div class="tech-item">
                <span class="tech-name">Docker</span>
                <span class="tech-desc">容器技术，题目判题沙箱实现</span>
              </div>
              <div class="tech-item">
                <span class="tech-name">Nginx</span>
                <span class="tech-desc">网关，正向代理，反向代理</span>
              </div>
              <div class="tech-item">
                <span class="tech-name">Git/GitHub</span>
                <span class="tech-desc">团队协作工具，代码托管平台</span>
              </div>
            </div>
          </div>
        </div>
      </a-card>

      <a-card class="about-card">
        <h2>团队愿景</h2>
        <p>
          我们致力于打造一个高效、智能的算法学习平台，帮助更多开发者提升编程技能，
          在算法和数据结构的学习道路上更加轻松和高效。我们希望通过技术的力量，
          让学习变得更加简单和有趣。
        </p>
      </a-card>
    </div>
  </div>
</template>

<script setup>
const MINIO_URL = import.meta.env.VITE_MINIO_URL;
</script>

<style scoped>
.about-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.about-header {
  text-align: center;
  margin-bottom: 40px;
}

.about-header h1 {
  font-size: 2.5rem;
  margin-bottom: 12px;
  color: #1890ff;
}

.about-header p {
  font-size: 1.2rem;
  color: #666;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.about-card {
  margin-bottom: 24px;
}

.about-card h2 {
  margin-bottom: 16px;
  color: #1890ff;
}

.about-card p {
  line-height: 1.8;
  color: #333;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
}

.feature-icon {
  font-size: 24px;
  margin-right: 16px;
}

.feature-content h3 {
  margin: 0 0 8px 0;
  font-size: 1.2rem;
  color: #333;
}

.feature-content p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.team-members {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-top: 20px;
}

.team-member {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  width: 100%;
  max-width: 350px;
  flex: 1;
  min-width: 300px;
}

.team-member .ant-avatar {
  flex-shrink: 0;
}

.member-info h3 {
  margin: 0 0 8px 0;
  font-size: 1.3rem;
  color: #333;
}

.member-info .role {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 1rem;
}

.github-link {
  color: #1890ff;
  text-decoration: none;
}

.github-link:hover {
  text-decoration: underline;
}

.tech-stack {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.tech-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.tech-name {
  font-weight: bold;
  color: #333;
}

.tech-value {
  color: #666;
}

@media (max-width: 768px) {
  .about-container {
    padding: 16px;
  }

  .about-header h1 {
    font-size: 2rem;
  }

  .features {
    grid-template-columns: 1fr;
  }
  
  .team-members {
    flex-direction: column;
  }
  
  .team-member {
    min-width: unset;
    max-width: 100%;
  }
}
</style>