<template>
  <div class="min-h-screen bg-[#f2f0e9] font-sans text-[#1a3c34] selection:bg-[#1a3c34] selection:text-[#e8e4d9]">
    <div class="max-w-4xl mx-auto px-6 py-8 lg:py-12">
      <!-- 顶部标题 -->
      <header class="mb-12">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-12 h-12 bg-[#1a3c34] rounded-sm flex items-center justify-center border-2 border-[#d4c5a3]">
            <svg class="w-7 h-7 text-[#d4c5a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl md:text-4xl font-serif font-bold text-[#1a3c34]">EduMatch 使用指南</h1>
            <p class="mt-2 text-sm text-[#1a3c34]/60 font-mono uppercase tracking-widest">知识构建平台</p>
          </div>
        </div>
        <div class="bg-white p-6 border-l-4 border-[#d4c5a3] shadow-sm">
          <p class="text-[#1a3c34]/80 leading-relaxed font-serif">
            欢迎来到 EduMatch！这是一个集<strong class="text-[#1a3c34] font-bold">AI 智能推荐</strong>、<strong class="text-[#1a3c34] font-bold">学习资源管理</strong>、<strong class="text-[#1a3c34] font-bold">学习计划</strong>、<strong class="text-[#1a3c34] font-bold">学习社区</strong>于一体的沉浸式学习平台。本指南将帮助你快速掌握每个核心功能的使用方法。
          </p>
        </div>
      </header>

      <!-- 快速导航 -->
      <section class="mb-12">
        <h2 class="text-2xl font-serif font-bold text-[#1a3c34] mb-6 flex items-center gap-3">
          <div class="w-8 h-8 bg-[#d4c5a3] rounded-sm flex items-center justify-center">
            <span class="text-[#1a3c34] font-bold text-sm">1</span>
          </div>
          快速开始指南
        </h2>
        <div class="bg-white p-8 shadow-sm border border-[#1a3c34]/10">
          <div class="grid md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h3 class="font-serif font-bold text-[#1a3c34] text-lg">🚀 新手 5 分钟上手</h3>
              <ol class="space-y-3 text-[#1a3c34]/70">
                <li class="flex gap-3">
                  <span class="font-mono text-[#d4c5a3] font-bold">01</span>
                  <div>
                    <strong class="text-[#1a3c34]">注册登录</strong> - 点击右上角「注册」创建账号
                  </div>
                </li>
                <li class="flex gap-3">
                  <span class="font-mono text-[#d4c5a3] font-bold">02</span>
                  <div>
                    <strong class="text-[#1a3c34]">AI 助手提问</strong> - 在首页右下角找到紫色悬浮球，输入学习目标
                  </div>
                </li>
                <li class="flex gap-3">
                  <span class="font-mono text-[#d4c5a3] font-bold">03</span>
                  <div>
                    <strong class="text-[#1a3c34]">创建学习计划</strong> - 根据推荐资源创建个人学习计划
                  </div>
                </li>
                <li class="flex gap-3">
                  <span class="font-mono text-[#d4c5a3] font-bold">04</span>
                  <div>
                    <strong class="text-[#1a3c34]">开始学习打卡</strong> - 每天记录学习进度
                  </div>
                </li>
              </ol>
            </div>
            <div class="bg-[#f9f9f7] p-6 border border-[#1a3c34]/10">
              <h4 class="font-serif font-bold text-[#1a3c34] mb-3">💡 使用场景建议</h4>
              <ul class="space-y-2 text-sm text-[#1a3c34]/70">
                <li>• <strong>考证备考</strong>：输入「英语六级备考」获取资源推荐</li>
                <li>• <strong>技能提升</strong>：输入「前端开发入门」制定学习路径</li>
                <li>• <strong>学术研究</strong>：输入「机器学习基础」查找相关课程</li>
                <li>• <strong>职业发展</strong>：输入「Python 数据分析」获取职场技能</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. 界面导航 -->
      <section class="mb-12">
        <h2 class="text-2xl font-serif font-bold text-[#1a3c34] mb-6 flex items-center gap-3">
          <div class="w-8 h-8 bg-[#d4c5a3] rounded-sm flex items-center justify-center">
            <span class="text-[#1a3c34] font-bold text-sm">2</span>
          </div>
          界面导航指南
        </h2>
        <div class="grid md:grid-cols-2 gap-6">
          <!-- 桌面端导航 -->
          <div class="bg-white p-6 shadow-sm border border-[#1a3c34]/10">
            <h3 class="font-serif font-bold text-[#1a3c34] mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-[#d4c5a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              桌面端顶部导航
            </h3>
            <ul class="space-y-3 text-sm text-[#1a3c34]/70">
              <li class="flex justify-between items-center pb-2 border-b border-[#1a3c34]/10">
                <span class="font-medium text-[#1a3c34]">🏠 首页</span>
                <span class="text-[#d4c5a3] font-mono">首页 + AI 助手</span>
              </li>
              <li class="flex justify-between items-center pb-2 border-b border-[#1a3c34]/10">
                <span class="font-medium text-[#1a3c34]">📝 新建条目</span>
                <span class="text-[#d4c5a3] font-mono">创建学习资源</span>
              </li>
              <li class="flex justify-between items-center pb-2 border-b border-[#1a3c34]/10">
                <span class="font-medium text-[#1a3c34]">👥 社区</span>
                <span class="text-[#d4c5a3] font-mono">学习社区</span>
              </li>
              <li class="flex justify-between items-center pb-2 border-b border-[#1a3c34]/10">
                <span class="font-medium text-[#1a3c34]">📅 计划</span>
                <span class="text-[#d4c5a3] font-mono">学习计划管理</span>
              </li>
              <li class="flex justify-between items-center">
                <span class="font-medium text-[#1a3c34]">📁 个人中心</span>
                <span class="text-[#d4c5a3] font-mono">个人中心</span>
              </li>
            </ul>
          </div>

          <!-- 移动端导航 -->
          <div class="bg-white p-6 shadow-sm border border-[#1a3c34]/10">
            <h3 class="font-serif font-bold text-[#1a3c34] mb-4 flex items-center gap-2">
              <svg class="w-5 h-5 text-[#d4c5a3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              移动端底部导航
            </h3>
            <ul class="space-y-3 text-sm text-[#1a3c34]/70">
              <li class="flex justify-between items-center pb-2 border-b border-[#1a3c34]/10">
                <span class="font-medium text-[#1a3c34]">🏠 首页</span>
                <span class="text-[#d4c5a3] font-mono">首页</span>
              </li>
              <li class="flex justify-between items-center pb-2 border-b border-[#1a3c34]/10">
                <span class="font-medium text-[#1a3c34]">🔍 搜索</span>
                <span class="text-[#d4c5a3] font-mono">搜索资源</span>
              </li>
              <li class="flex justify-between items-center pb-2 border-b border-[#1a3c34]/10">
                <span class="font-medium text-[#1a3c34]">📝 创建</span>
                <span class="text-[#d4c5a3] font-mono">创建资源</span>
              </li>
              <li class="flex justify-between items-center pb-2 border-b border-[#1a3c34]/10">
                <span class="font-medium text-[#1a3c34]">👥 社区</span>
                <span class="text-[#d4c5a3] font-mono">社区</span>
              </li>
              <li class="flex justify-between items-center">
                <span class="font-medium text-[#1a3c34]">👤 我的</span>
                <span class="text-[#d4c5a3] font-mono">个人中心</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 3. AI 智能助手 -->
      <section class="mb-12">
        <h2 class="text-2xl font-serif font-bold text-[#1a3c34] mb-6 flex items-center gap-3">
          <div class="w-8 h-8 bg-[#d4c5a3] rounded-sm flex items-center justify-center">
            <span class="text-[#1a3c34] font-bold text-sm">3</span>
          </div>
          AI 智能助手使用
        </h2>
        <div class="bg-white p-8 shadow-sm border border-[#1a3c34]/10">
          <div class="mb-6">
            <h3 class="font-serif font-bold text-[#1a3c34] mb-3 flex items-center gap-2">
              <div class="w-6 h-6 bg-[#d4c5a3] rounded-full flex items-center justify-center">
                <span class="text-[#1a3c34] text-xs font-bold">✦</span>
              </div>
              如何找到并使用 AI 助手
            </h3>
            <div class="bg-[#f9f9f7] p-4 border-l-4 border-[#d4c5a3]">
              <ol class="space-y-2 text-sm text-[#1a3c34]/80">
                <li>1. 在首页右下角找到<strong class="text-[#1a3c34] font-bold">紫色圆形悬浮球</strong></li>
                <li>2. 点击悬浮球打开对话窗口</li>
                <li>3. 输入你的学习目标或问题</li>
                <li>4. 等待 AI 分析并返回推荐结果</li>
              </ol>
            </div>
          </div>

          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-serif font-bold text-[#1a3c34] mb-3">💬 有效提问示例</h4>
              <div class="space-y-2">
                <div class="p-3 bg-[#f9f9f7] rounded border border-[#1a3c34]/10">
                  <code class="text-xs text-[#d4c5a3]">简单目标：</code>
                  <p class="text-sm text-[#1a3c34]/80 mt-1">「英语六级备考计划」</p>
                </div>
                <div class="p-3 bg-[#f9f9f7] rounded border border-[#1a3c34]/10">
                  <code class="text-xs text-[#d4c5a3]">详细描述：</code>
                  <p class="text-sm text-[#1a3c34]/80 mt-1">「每天1小时，3个月学完Python数据分析」</p>
                </div>
                <div class="p-3 bg-[#f9f9f7] rounded border border-[#1a3c34]/10">
                  <code class="text-xs text-[#d4c5a3]">快速选择：</code>
                  <p class="text-sm text-[#1a3c34]/80 mt-1">点击快捷标签（React基础、考研数学等）</p>
                </div>
              </div>
            </div>

            <div>
              <h4 class="font-serif font-bold text-[#1a3c34] mb-3">📊 推荐结果解读</h4>
              <div class="space-y-2 text-sm text-[#1a3c34]/70">
                <p><strong class="text-[#1a3c34]">• 学习建议</strong> - AI 给出的学习建议和路径规划</p>
                <p><strong class="text-[#1a3c34]">• 首选资源</strong> - 最推荐的资源，包含详细信息</p>
                <p><strong class="text-[#1a3c34]">• 其他推荐</strong> - 备选资源列表</p>
                <p><strong class="text-[#1a3c34]">• 访问指引</strong> - 如何在对应平台找到课程</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. 学习计划功能 -->
      <section class="mb-12">
        <h2 class="text-2xl font-serif font-bold text-[#1a3c34] mb-6 flex items-center gap-3">
          <div class="w-8 h-8 bg-[#d4c5a3] rounded-sm flex items-center justify-center">
            <span class="text-[#1a3c34] font-bold text-sm">4</span>
          </div>
          学习计划管理
        </h2>
        <div class="bg-white p-8 shadow-sm border border-[#1a3c34]/10">
          <div class="grid md:grid-cols-2 gap-8">
            <!-- 创建计划 -->
            <div>
              <h3 class="font-serif font-bold text-[#1a3c34] mb-4 flex items-center gap-2">
                <span class="text-[#d4c5a3]">📅</span> 创建学习计划
              </h3>
              <ol class="space-y-3 text-sm text-[#1a3c34]/70">
                <li><strong class="text-[#1a3c34]">1. 进入计划页面</strong> - 点击导航栏「计划」</li>
                <li><strong class="text-[#1a3c34]">2. 填写基本信息</strong> - 标题、目标描述</li>
                <li><strong class="text-[#1a3c34]">3. 设置时间安排</strong> - 开始日期、每日学习时长</li>
                <li><strong class="text-[#1a3c34]">4. 关联学习资源</strong> - 选择或添加相关学习材料</li>
                <li><strong class="text-[#1a3c34]">5. 设定总目标</strong> - 总学习时长，系统自动计算完成时间</li>
              </ol>
            </div>

            <!-- 管理和打卡 -->
            <div>
              <h3 class="font-serif font-bold text-[#1a3c34] mb-4 flex items-center gap-2">
                <span class="text-[#d4c5a3]">✅</span> 打卡与进度追踪
              </h3>
              <div class="space-y-3 text-sm text-[#1a3c34]/70">
                <p><strong class="text-[#1a3c34]">每日打卡</strong> - 计划列表页点击「今日打卡」，记录学习时长和心得</p>
                <p><strong class="text-[#1a3c34]">进度可视化</strong> - 实时查看学习进度条和完成百分比</p>
                <p><strong class="text-[#1a3c34]">统计分析</strong> - 查看已完成天数、剩余时间、累计学习时长</p>
                <p><strong class="text-[#1a3c34]">编辑计划</strong> - 随时修改计划详情，系统自动重新计算进度</p>
                <p><strong class="text-[#1a3c34]">完成标记</strong> - 达到100%自动标记为已完成</p>
              </div>
            </div>
          </div>

          <div class="mt-6 bg-[#f9f9f7] p-4 border-l-4 border-[#d4c5a3]">
            <h4 class="font-serif font-bold text-[#1a3c34] mb-2">💡 计划管理技巧</h4>
            <ul class="text-sm text-[#1a3c34]/70 space-y-1">
              <li>• 建议将大目标拆分为多个小计划，更容易坚持</li>
              <li>• 每日学习时长建议设置在1-3小时，避免过度疲劳</li>
              <li>• 定期查看进度统计，保持学习动力</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 5. 学习社区 -->
      <section class="mb-12">
        <h2 class="text-2xl font-serif font-bold text-[#1a3c34] mb-6 flex items-center gap-3">
          <div class="w-8 h-8 bg-[#d4c5a3] rounded-sm flex items-center justify-center">
            <span class="text-[#1a3c34] font-bold text-sm">5</span>
          </div>
          学习社区交流
        </h2>
        <div class="bg-white p-8 shadow-sm border border-[#1a3c34]/10">
          <div class="grid md:grid-cols-2 gap-8">
            <!-- 浏览和搜索 -->
            <div>
              <h3 class="font-serif font-bold text-[#1a3c34] mb-4 flex items-center gap-2">
                <span class="text-[#d4c5a3]">🔍</span> 浏览与发现
              </h3>
              <ul class="space-y-3 text-sm text-[#1a3c34]/70">
                <li><strong class="text-[#1a3c34]">社区首页</strong> - 浏览最新发布的学习经验分享</li>
                <li><strong class="text-[#1a3c34]">关键词搜索</strong> - 按标题、内容、作者、标签查找</li>
                <li><strong class="text-[#1a3c34]">热门话题</strong> - 点击标签快速筛选相关内容</li>
                <li><strong class="text-[#1a3c34]">分类浏览</strong> - 按前端开发、语言学习、考证等分类查看</li>
              </ul>
            </div>

            <!-- 发布内容 -->
            <div>
              <h3 class="font-serif font-bold text-[#1a3c34] mb-4 flex items-center gap-2">
                <span class="text-[#d4c5a3]">✍️</span> 发布与互动
              </h3>
              <ul class="space-y-3 text-sm text-[#1a3c34]/70">
                <li><strong class="text-[#1a3c34]">发表经验</strong> - 点击「发表我的经验」按钮</li>
                <li><strong class="text-[#1a3c34]">添加标签</strong> - 使用标签方便他人搜索和分类</li>
                <li><strong class="text-[#1a3c34]">关联资源</strong> - 关联你创建的学习资源</li>
                <li><strong class="text-[#1a3c34]">互动交流</strong> - 点赞、收藏、评论其他用户的帖子</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 bg-[#f9f9f7] p-4 border-l-4 border-[#d4c5a3]">
            <h4 class="font-serif font-bold text-[#1a3c34] mb-2">🎯 社区使用建议</h4>
            <ul class="text-sm text-[#1a3c34]/70 space-y-1">
              <li>• 分享真实的学习体验和踩坑经历，帮助其他学习者</li>
              <li>• 发布具体的资源使用心得，而不仅仅是课程推荐</li>
              <li>• 积极参与讨论，在学习社区中建立个人影响力</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- 6. 个人中心管理 -->
      <section class="mb-12">
        <h2 class="text-2xl font-serif font-bold text-[#1a3c34] mb-6 flex items-center gap-3">
          <div class="w-8 h-8 bg-[#d4c5a3] rounded-sm flex items-center justify-center">
            <span class="text-[#1a3c34] font-bold text-sm">6</span>
          </div>
          个人中心管理
        </h2>
        <div class="bg-white p-8 shadow-sm border border-[#1a3c34]/10">
          <div class="grid md:grid-cols-3 gap-6">
            <!-- 个人资料 -->
            <div class="bg-[#f9f9f7] p-6 border border-[#1a3c34]/10">
              <h3 class="font-serif font-bold text-[#1a3c34] mb-4 flex items-center gap-2">
                <span class="text-[#d4c5a3]">👤</span> 个人资料
              </h3>
              <ul class="space-y-2 text-sm text-[#1a3c34]/70">
                <li>• 编辑昵称和个人签名</li>
                <li>• 查看头像和用户信息</li>
                <li>• 管理个人学习形象</li>
              </ul>
            </div>

            <!-- 我的资源 -->
            <div class="bg-[#f9f9f7] p-6 border border-[#1a3c34]/10">
              <h3 class="font-serif font-bold text-[#1a3c34] mb-4 flex items-center gap-2">
                <span class="text-[#d4c5a3]">📚</span> 我的资源
              </h3>
              <ul class="space-y-2 text-sm text-[#1a3c34]/70">
                <li>• 查看已创建的学习资源</li>
                <li>• 编辑或删除资源信息</li>
                <li>• 管理资源与社区的关联</li>
              </ul>
            </div>

            <!-- 我的帖子 -->
            <div class="bg-[#f9f9f7] p-6 border border-[#1a3c34]/10">
              <h3 class="font-serif font-bold text-[#1a3c34] mb-4 flex items-center gap-2">
                <span class="text-[#d4c5a3]">📝</span> 我的帖子
              </h3>
              <ul class="space-y-2 text-sm text-[#1a3c34]/70">
                <li>• 查看社区发布的帖子</li>
                <li>• 编辑或删除自己的内容</li>
                <li>• 查看点赞收藏数据</li>
              </ul>
            </div>
          </div>

          <div class="mt-6 grid md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-serif font-bold text-[#1a3c34] mb-3">🔗 其他功能</h4>
              <ul class="text-sm text-[#1a3c34]/70 space-y-1">
                <li>• <strong class="text-[#1a3c34]">点赞收藏页</strong> - 统一查看收藏的优质内容</li>
                <li>• <strong class="text-[#1a3c34]">设置中心</strong> - 管理账户和隐私设置</li>
                <li>• <strong class="text-[#1a3c34]">关注系统</strong> - 关注其他学习者，构建学习网络</li>
              </ul>
            </div>
            <div>
              <h4 class="font-serif font-bold text-[#1a3c34] mb-3">📱 数据同步</h4>
              <p class="text-sm text-[#1a3c34]/70">
                所有数据统一保存在云端数据库，同一账号在不同设备登录可看到同步的内容，支持多端无缝学习体验。
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 7. 常见问题解答 -->
      <section class="mb-12">
        <h2 class="text-2xl font-serif font-bold text-[#1a3c34] mb-6 flex items-center gap-3">
          <div class="w-8 h-8 bg-[#d4c5a3] rounded-sm flex items-center justify-center">
            <span class="text-[#1a3c34] font-bold text-sm">7</span>
          </div>
          常见问题解答
        </h2>
        <div class="bg-white p-8 shadow-sm border border-[#1a3c34]/10">
          <div class="space-y-6">
            <div class="border-b border-[#1a3c34]/10 pb-4">
              <h3 class="font-serif font-bold text-[#1a3c34] mb-2">❓ AI 助手没有响应怎么办？</h3>
              <ul class="text-sm text-[#1a3c34]/70 space-y-1">
                <li>• 检查网络连接是否正常</li>
                <li>• 刷新页面后重试</li>
                <li>• 尝试简化问题描述，如用「英语六级」代替详细描述</li>
                <li>• 如问题持续存在，可能是服务暂时繁忙，请稍后再试</li>
              </ul>
            </div>

            <div class="border-b border-[#1a3c34]/10 pb-4">
              <h3 class="font-serif font-bold text-[#1a3c34] mb-2">❓ 学习计划进度计算不准确？</h3>
              <ul class="text-sm text-[#1a3c34]/70 space-y-1">
                <li>• 系统基于实际打卡时长自动计算进度</li>
                <li>• 编辑计划的总时长会实时重新计算进度百分比</li>
                <li>• 如有异常，可检查打卡记录是否完整</li>
                <li>• 每日只允许打卡一次，避免重复计算</li>
              </ul>
            </div>

            <div class="border-b border-[#1a3c34]/10 pb-4">
              <h3 class="font-serif font-bold text-[#1a3c34] mb-2">❓ 如何删除不需要的内容？</h3>
              <ul class="text-sm text-[#1a3c34]/70 space-y-1">
                <li>• <strong>学习计划</strong>：在计划卡片右上角点击删除按钮</li>
                <li>• <strong>社区帖子</strong>：在「我的全部帖子」页面删除</li>
                <li>• <strong>学习资源</strong>：在「我的全部资源」页面删除</li>
                <li>• 删除操作不可恢复，请谨慎操作</li>
              </ul>
            </div>

            <div class="border-b border-[#1a3c34]/10 pb-4">
              <h3 class="font-serif font-bold text-[#1a3c34] mb-2">❓ 推荐的资源如何选择？</h3>
              <ul class="text-sm text-[#1a3c34]/70 space-y-1">
                <li>• <strong>首选资源</strong> 是 AI 最推荐的首选资源</li>
                <li>• <strong>其他推荐</strong> 提供更多备选方案</li>
                <li>• 结合个人基础、时间安排和学习习惯选择</li>
                <li>• 参考社区中其他用户的实际使用反馈</li>
              </ul>
            </div>

            <div>
              <h3 class="font-serif font-bold text-[#1a3c34] mb-2">❓ 学习遇到困难时怎么办？</h3>
              <ul class="text-sm text-[#1a3c34]/70 space-y-1">
                <li>• 在社区发布求助帖子，获得其他学习者帮助</li>
                <li>• 回到首页询问 AI 助手获取建议</li>
                <li>• 调整学习计划，适当降低难度或延长时间</li>
                <li>• 寻找相关资源进行补充学习</li>
              </ul>
            </div>
          </div>

          <div class="mt-8 bg-[#f9f9f7] p-6 border-l-4 border-[#d4c5a3]">
            <h4 class="font-serif font-bold text-[#1a3c34] mb-3">🎯 高效学习建议</h4>
            <div class="grid md:grid-cols-2 gap-4 text-sm text-[#1a3c34]/70">
              <div>
                <p class="mb-2"><strong class="text-[#1a3c34]">学习路径规划</strong></p>
                <ul class="space-y-1">
                  <li>• 先用 AI 助手确定学习方向</li>
                  <li>• 制定详细的学习计划</li>
                  <li>• 坚持每日打卡记录</li>
                </ul>
              </div>
              <div>
                <p class="mb-2"><strong class="text-[#1a3c34]">社区互动学习</strong></p>
                <ul class="space-y-1">
                  <li>• 分享学习经验和心得</li>
                  <li>• 向其他学习者请教问题</li>
                  <li>• 关注优质内容创作者</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 结束语 -->
      <section class="text-center py-12 border-t border-[#1a3c34]/10">
        <div class="max-w-2xl mx-auto">
          <h3 class="text-2xl font-serif font-bold text-[#1a3c34] mb-4">开启你的知识构建之旅</h3>
          <p class="text-[#1a3c34]/70 leading-relaxed mb-8">
            EduMatch 不仅是学习工具，更是你的知识构建伙伴。通过 AI 智能推荐、系统化计划管理和社区互动，
            让学习变得更高效、更有趣。现在就开始使用，将知识转化为真正的能力。
          </p>
          <button @click="router.push('/')" class="px-8 py-3 bg-[#d4c5a3] text-[#1a3c34] font-serif font-bold hover:bg-[#1a3c34] hover:text-[#d4c5a3] transition-all border border-[#1a3c34]/20">
            返回首页开始学习
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
