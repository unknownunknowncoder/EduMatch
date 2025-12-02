<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
      <!-- 顶部标题 -->
      <header class="mb-8">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 00-2 2v1a2 2 0 01-2 2m4-5a2 2 0 012 2v1a2 2 0 002 2m-6 4h6m-6 4h3" />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">帮助文档 · 如何高效使用 EduMatch</h1>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">面向首次使用和回访用户的完整使用说明</p>
          </div>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          EduMatch 是一个集「AI 智能推荐」「学习资源管理」「学习计划」「学习社区」于一体的学习平台。下面的说明会带你从零开始，了解每个核心功能应该怎么用、在什么场景用，帮助你尽快把它变成自己的学习中枢。
        </p>
      </header>

      <!-- 目录提示 -->
      <section class="mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
          <h2 class="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">建议阅读顺序</h2>
          <ol class="text-sm text-gray-600 dark:text-gray-300 space-y-1 list-decimal list-inside">
            <li>先看「快速开始」，用 1 分钟完成第一次体验。</li>
            <li>再看「页面导航」+「首页与 AI 学习助手」，搞清楚入口在哪里。</li>
            <li>根据自己的需求重点看：搜索资源 / 学习计划 / 学习社区 / 个人中心与资源管理。</li>
          </ol>
        </div>
      </section>

      <!-- 1. 快速开始 -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">一、快速开始（1 分钟上手）</h2>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 space-y-3 text-sm leading-relaxed">
          <p class="text-gray-700 dark:text-gray-200">推荐你按下面 4 步来完成第一次体验：</p>
          <ol class="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-200">
            <li>
              打开首页：左侧侧边栏点击「首页」，或在移动端底部导航点击「首页」。
            </li>
            <li>
              登录 / 注册：
              <span class="font-medium">右上角</span>
              点击「登录」或「注册」，创建自己的账号，方便保存学习计划、发帖、收藏等数据。
            </li>
            <li>
              试试 AI 学习助手：在首页右下角找到会呼吸的紫色圆形悬浮球，点击打开对话框，输入你的学习目标，例如「我想零基础学前端」，等待 AI 返回推荐资源和学习建议。
            </li>
            <li>
              创建一个学习计划：登录后，在侧边栏点击「学习计划」，用推荐的资源创建一个属于你的学习计划，并完成第一次打卡。
            </li>
          </ol>
        </div>
      </section>

      <!-- 2. 页面与导航 -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">二、整体结构与导航说明</h2>
        <div class="grid gap-4 md:grid-cols-2 text-sm leading-relaxed">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">1. 桌面端（电脑）</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-2">左侧固定的导航栏包含主要入口：</p>
            <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-200">
              <li><span class="font-medium">首页</span>：AI 助手、功能总览。</li>
              <li><span class="font-medium">创建资源</span>：手动录入你发现的好课程 / 视频 / 工具。</li>
              <li><span class="font-medium">学习社区</span>：浏览和发布学习经验帖，互动点赞收藏。</li>
              <li><span class="font-medium">点赞收藏</span>：统一查看你在社区中点赞、收藏过的帖子。</li>
              <li><span class="font-medium">学习计划</span>：查看、创建和打卡学习计划。</li>
              <li><span class="font-medium">个人中心</span>：我的资料、我的资源、我的帖子等聚合入口。</li>
            </ul>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
            <h3 class="font-semibold text-gray-900 dark:text-white mb-2">2. 移动端（手机）</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-2">页面底部的导航栏提供常用入口：</p>
            <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-200">
              <li><span class="font-medium">首页</span>：AI 助手 + 功能介绍。</li>
              <li><span class="font-medium">搜索</span>：按关键字搜索学习资源。</li>
              <li><span class="font-medium">创建</span>：新增自己的学习资源。</li>
              <li><span class="font-medium">社区</span>：浏览与发布帖子。</li>
              <li><span class="font-medium">我的</span>：个人中心相关内容。</li>
            </ul>
            <p class="mt-3 text-gray-600 dark:text-gray-300">
              本页「帮助文档」可以在首页右上角点击进入，随时回来看使用说明。
            </p>
          </div>
        </div>
      </section>

      <!-- 3. 首页与 AI 学习助手 -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">三、首页与 AI 学习助手</h2>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 space-y-3 text-sm leading-relaxed">
          <p class="text-gray-700 dark:text-gray-200">
            首页分为两部分：上方是平台的整体介绍和 6 大功能卡片，下方是 AI 学习助手带来的个性化推荐结果。
          </p>
          <h3 class="font-semibold text-gray-900 dark:text-white mt-2">1. 打开 AI 学习助手</h3>
          <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-200">
            <li>右下角的紫色圆形悬浮球就是「AI 学习助手」。</li>
            <li>点击悬浮球会弹出对话窗口；长按 / 拖动可以改变它在屏幕上的位置。</li>
          </ul>
          <h3 class="font-semibold text-gray-900 dark:text-white mt-3">2. 如何提问更容易得到好推荐</h3>
          <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-200">
            <li>直接用自然语言描述需求，例如：「我想考英语六级」「零基础学 Python 数据分析」。</li>
            <li>可以说明自己的基础和时间，例如：「每天 1 小时，想三个月入门前端」。</li>
            <li>也可以从快捷问题标签里直接点击（如「考研数学复习计划」）。</li>
          </ul>
          <h3 class="font-semibold text-gray-900 dark:text-white mt-3">3. 如何理解推荐结果</h3>
          <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-200">
            <li>
              对话区中：AI 会先给出一段「学习建议」，告诉你学习路径、阶段重点等。
            </li>
            <li>
              下方「最推荐」卡片：展示 1 个优先推荐资源，包含平台（B 站 / 中国大学 MOOC）、难度、时长、UP 主 / 机构等信息，点击「立即学习」会在新窗口打开对应链接。
            </li>
            <li>
              「其他推荐」区域：罗列更多可选资源，每条都有平台、难度、时长等标签，你可以自行对比选择。
            </li>
            <li>
              部分资源会附带「访问指引」，告诉你该如何在平台中找到对应课程或视频。
            </li>
          </ul>
        </div>
      </section>

      <!-- 4. 搜索学习资源 -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">四、搜索学习资源（搜索页）</h2>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 space-y-3 text-sm leading-relaxed">
          <p class="text-gray-700 dark:text-gray-200">
            当你已经大致知道要学什么时，可以进入「搜索」页面做更精确的资源检索。
          </p>
          <h3 class="font-semibold text-gray-900 dark:text-white mt-2">1. 进入方式</h3>
          <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-200">
            <li>移动端：点击底部导航栏中的「搜索」。</li>
            <li>桌面端：在地址栏输入对应链接，或通过站内其它入口跳转。</li>
          </ul>
          <h3 class="font-semibold text-gray-900 dark:text-white mt-3">2. 使用步骤</h3>
          <ol class="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-200">
            <li>在顶部输入框输入关键词（如「Vue.js 入门」），按 Enter 或点击「搜索」。</li>
            <li>可以通过「难度」和「分类」下拉框进行筛选，例如只看「前端开发」「初学者」。</li>
            <li>等待 AI 返回结果后，会看到：一个智能推荐的资源卡片 + 多个其他推荐资源列表。</li>
            <li>点击资源卡片即可打开对应的 B 站视频或 MOOC 课程；如有 BV 号也会显示出来。</li>
          </ol>
          <p class="text-gray-600 dark:text-gray-300">
            搜索页适合：你已有明确目标，例如「我要找一门适合自己的 Vue 课程」，想对比不同资源的情况。
          </p>
        </div>
      </section>

      <!-- 5. 学习计划与打卡 -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">五、学习计划与打卡</h2>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 space-y-3 text-sm leading-relaxed">
          <h3 class="font-semibold text-gray-900 dark:text-white">1. 创建学习计划</h3>
          <ol class="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-200">
            <li>在侧边栏点击「学习计划」，进入学习计划列表页面。</li>
            <li>点击「创建新的学习计划」，填写：标题、描述（可选）、开始日期、每日学习时间。</li>
            <li>
              如果你已经有对应的学习资源，可以：
              <ul class="list-disc list-inside ml-5 mt-1 space-y-1">
                <li>在「关联学习资源」中输入资源名称和链接；或</li>
                <li>点击「从我的资源中选择」，直接从你自己创建的资源列表中选一条，系统会自动带入名称和时长。</li>
              </ul>
            </li>
            <li>填写「学习总时长」后，系统会自动计算需要学习多少天，以及预计完成日期。</li>
          </ol>
          <h3 class="font-semibold text-gray-900 dark:text-white mt-3">2. 查看与管理计划</h3>
          <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-200">
            <li>页面上方会展示「进行中」「已完成」计划的数量统计。</li>
            <li>每个计划卡片上会显示：开始时间、目标时间、每日学习时长、打卡天数、剩余天数以及进度条。</li>
            <li>点击「查看详情」可进入该计划的详情页，查看更完整的进度和目标信息。</li>
            <li>如果不再需要某个计划，可以点击卡片右上角的删除按钮，系统会同时清理相关打卡记录。</li>
          </ul>
          <h3 class="font-semibold text-gray-900 dark:text-white mt-3">3. 打卡与完成计划</h3>
          <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-200">
            <li>在「学习计划」列表页，进行中的计划会展示「今日打卡」按钮：</li>
            <li>每天完成学习后点击一次，系统会记录当天的学习情况，并更新进度条与已打卡天数。</li>
            <li>当天已打卡的计划会显示「今日已打卡」，避免重复操作。</li>
            <li>当进度达到 100% 时，计划会自动或通过按钮标记为「已完成」。</li>
          </ul>
        </div>
      </section>

      <!-- 6. 学习社区与发帖 -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">六、学习社区与发帖互动</h2>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 space-y-3 text-sm leading-relaxed">
          <h3 class="font-semibold text-gray-900 dark:text-white">1. 浏览与搜索帖子</h3>
          <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-200">
            <li>在侧边栏点击「学习社区」，进入社区首页。</li>
            <li>顶部有搜索框，可以按标题、内容、作者、分类或标签进行关键词搜索。</li>
            <li>右侧有「热门话题」模块，点击某个标签可快速筛选相关帖子。</li>
            <li>帖子卡片上会显示作者、发布时间、分类、标签以及评论数等信息。</li>
          </ul>
          <h3 class="font-semibold text-gray-900 dark:text-white mt-3">2. 发布自己的学习经验</h3>
          <ol class="list-decimal list-inside space-y-1 text-gray-700 dark:text-gray-200">
            <li>在社区右侧点击「发表我的经验」按钮，打开发帖弹窗。</li>
            <li>填写帖子标题、分类（如前端开发 / 语言学习 / 考证等）。</li>
            <li>在内容区域详细描述你的学习方法、踩坑经验或资源推荐。</li>
            <li>可以通过标签（如「考研英语」「Vue3」）对帖子做简单归类，方便别人搜索。</li>
            <li>如果你在「我的资源」中已经创建了相关学习资源，可以在「关联我的资源」处选择一条，这样帖子会展示该资源卡片，方便读者直接前往学习。</li>
          </ol>
          <h3 class="font-semibold text-gray-900 dark:text-white mt-3">3. 点赞、收藏与个人「点赞收藏」页</h3>
          <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-200">
            <li>在帖子右上角可以对帖子进行点赞和收藏，数据会实时更新到数据库。</li>
            <li>在侧边栏点击「点赞收藏」，可以分别查看：你点赞过的帖子、你收藏过的帖子，并一键跳转到帖子详情。</li>
            <li>这些操作需要登录后进行，以便正确关联到你的账号。</li>
          </ul>
          <p class="text-gray-600 dark:text-gray-300">
            社区适合用来：记录阶段性总结、分享备考经验、提问与交流，也可以把 AI 推荐的资源使用体验写出来帮助后来的同学。
          </p>
        </div>
      </section>

      <!-- 7. 个人中心与我的资源 / 帖子 -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">七、个人中心、我的资源与我的帖子</h2>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 space-y-3 text-sm leading-relaxed">
          <h3 class="font-semibold text-gray-900 dark:text-white">1. 个人中心概览</h3>
          <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-200">
            <li>在侧边栏点击「个人中心」，可以看到你的头像首字、昵称 / 用户名和个人签名。</li>
            <li>在这里可以编辑昵称和个人签名，完善你的学习形象。</li>
          </ul>
          <h3 class="font-semibold text-gray-900 dark:text-white mt-3">2. 我的资源</h3>
          <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-200">
            <li>「我的资源」模块会展示你创建的学习资源预览（最近几条）。</li>
            <li>点击「查看全部资源」可以进入「我的全部资源」页面，集中管理所有资源（查看详情、删除资源、处理与社区帖子的关联等）。</li>
            <li>创建资源的场景：你在 B 站 / MOOC 或其他平台发现了好课，希望在 EduMatch 中统一管理和复用。</li>
          </ul>
          <h3 class="font-semibold text-gray-900 dark:text-white mt-3">3. 我的帖子</h3>
          <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-200">
            <li>「我的帖子」模块展示你在社区发布的帖子预览。</li>
            <li>点击「查看全部帖子」进入「我的全部帖子」页面，可以查看全部帖子、跳转到详情，或删除不再需要的帖子。</li>
          </ul>
        </div>
      </section>

      <!-- 8. 设置与隐私 -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">八、设置与隐私（设置中心）</h2>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 space-y-3 text-sm leading-relaxed">
          <p class="text-gray-700 dark:text-gray-200">
            设置中心用于调整账户信息和个人偏好，目前主要包含：
          </p>
          <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-200">
            <li><span class="font-medium">账户信息</span>：查看用户名、邮箱、注册时间等基本信息。</li>
            <li><span class="font-medium">通知设置</span>：开关学习提醒、系统通知、营销邮件等。</li>
            <li><span class="font-medium">隐私设置</span>：是否公开个人资料、是否参与匿名数据分析等。</li>
          </ul>
          <p class="text-gray-600 dark:text-gray-300">
            后续版本中，这里的设置会逐步与实际通知/隐私策略打通，目前可以理解为偏好记录功能。
          </p>
        </div>
      </section>

      <!-- 9. 常见问题与小贴士 -->
      <section class="mb-4">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-3">九、常见问题与小贴士</h2>
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 space-y-3 text-sm leading-relaxed">
          <h3 class="font-semibold text-gray-900 dark:text-white">1. 看不到推荐结果 / 搜索失败怎么办？</h3>
          <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-200 mb-2">
            <li>先检查网络是否正常，刷新页面后重试。</li>
            <li>如果一直失败，可以简化问题描述，或稍后再次尝试。</li>
          </ul>
          <h3 class="font-semibold text-gray-900 dark:text-white">2. 登录后数据保存在哪里？</h3>
          <p class="text-gray-700 dark:text-gray-200 mb-2">
            你的登录信息、学习计划、资源和帖子等数据会统一保存在后端数据库中，同一账号在不同设备登录都可以看到同样的数据。
          </p>
          <h3 class="font-semibold text-gray-900 dark:text-white">3. 推荐资源是不是唯一正确的？</h3>
          <p class="text-gray-700 dark:text-gray-200 mb-2">
            AI 推荐的资源是基于你的需求和公开数据做出的「优先级排序」，不代表唯一正确选择。建议你：
          </p>
          <ul class="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-200 mb-2">
            <li>优先尝试「最推荐」资源；</li>
            <li>不满意时，继续向下浏览「其他推荐」；</li>
            <li>结合社区里的实际学习反馈做综合判断。</li>
          </ul>
          <h3 class="font-semibold text-gray-900 dark:text-white">4. 不知道下一步该做什么时</h3>
          <p class="text-gray-700 dark:text-gray-200">
            你可以随时回到首页，打开 AI 学习助手，直接把自己的困惑打出来，例如「我已经学完 JS 基础，下一步该学什么？」让系统给出下一阶段的路径建议。
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
// 本页面主要为静态说明文档，如后续需要根据登录状态展示不同内容，可在此处补充逻辑。
</script>
