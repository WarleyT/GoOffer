# GoOffer MVP UI 设计规范

版本：v0.2  
日期：2026-05-29  
设计基准：Stitch `Bubbly Professional` 初步设计稿  
关联文档：[GoOffer MVP 产品需求文档 PRD](./GoOffer-PRD.md)

## 1. 设计基准

本规范以 `stitch_ui_style_transfer` 文件夹下的 Stitch HTML 初稿为准，覆盖 GoOffer 的 Dashboard、岗位列表、岗位详情、面试记录、AI 总结和 Offer 对比等 MVP 页面。

参考文件：

- `stitch_ui_style_transfer/stitch_ui_style_transfer/bubbly_professional/DESIGN.md`
- `stitch_ui_style_transfer/stitch_ui_style_transfer/gooffer_bubbly_style_1/code.html`
- `stitch_ui_style_transfer/stitch_ui_style_transfer/gooffer_bubbly_style_2/code.html`
- `stitch_ui_style_transfer/stitch_ui_style_transfer/gooffer_bubbly_style_3/code.html`
- `stitch_ui_style_transfer/stitch_ui_style_transfer/gooffer_offer_bubbly_style/code.html`

本版本废弃旧规范中的青绿 / 蓝色后台风格，改用 Stitch 初稿中的奶油纸感背景、乐观黄色主强调、深炭黑重点面板、柔红提示色、极大圆角、胶囊控件和柔和环境阴影。

## 2. 设计目标

GoOffer 是个人求职流程管理网站。MVP 界面既要像效率工具一样清晰可操作，也要降低求职过程的压力感，让记录岗位、跟进面试和比较 Offer 的过程更温暖、更轻松。

设计目标：

1. 让用户进入产品后立刻看到求职进展和下一步行动。
2. 用柔和、圆润、可触摸的视觉语言缓解求职压力。
3. 保持岗位、面试、Offer 等信息的可扫描性，不因视觉风格牺牲效率。
4. 让新增岗位、更新状态、记录面试、生成 AI 总结等高频动作足够明显。
5. 让 AI 总结和 Offer 对比成为有帮助的决策模块，而不是装饰内容。

## 3. 视觉定位

### 3.1 风格关键词

- Friendly
- Optimistic
- Tactile
- Bubbly
- Professional
- Calm

### 3.2 风格定义

GoOffer 采用 `Bubbly Professional`：现代极简布局 + 圆润拟物感。它不是传统企业后台，也不是营销型招聘网站，而是一个“柔和但专业的个人求职工作台”。

视觉表达：

- 使用奶油色页面背景，减少纯白页面的紧张感。
- 使用大圆角卡片和胶囊按钮，形成轻松、亲近的触感。
- 使用柔和阴影和层级色块表达空间关系。
- 使用黄色表达机会、进展、鼓励和主要行动。
- 使用深炭黑承载高优先级信息，例如 AI 分析、关键 CTA 和 Offer 决策。
- 使用柔红表达需要关注的状态，例如面试中、提醒、风险和紧急任务。

### 3.3 落地边界

Stitch 初稿中出现的自由漂浮光斑、鼠标跟随圆形光效、纯氛围图片不进入 MVP 主规范。正式产品的 Bubbly 感主要通过圆角、间距、层级色、阴影和微交互体现，避免影响可读性和任务效率。

## 4. 设计原则

### 4.1 工作台优先

登录后第一屏是可操作的求职工作台，而不是宣传页。用户应能直接看到概览指标、近期面试、待跟进事项和新增岗位入口。

### 4.2 圆润但不幼稚

圆角和胶囊形状是核心风格，但信息组织仍需清晰。求职是严肃决策场景，视觉可以友好，但不能显得儿童化。

### 4.3 卡片化承载主要对象

岗位、面试轮次、Offer、AI 建议都以卡片为主。卡片需要边界清楚、层级明确、可快速扫描。

### 4.4 行动入口要像“可触摸物”

主要按钮、状态筛选、搜索框、导航项应具有明确的触感：足够高、圆润、hover 有轻微浮起，active 有轻微按下。

### 4.5 信息对比不被装饰干扰

Offer 对比、岗位状态和面试记录是核心决策信息。颜色、图片和动效只能辅助理解，不应抢走内容注意力。

### 4.6 AI 内容结构化

AI 总结必须拆成可行动的小模块，例如复盘、亮点、不足、优化建议、下一轮准备。不要把 AI 输出展示成大段纯文本。

## 5. 信息架构

MVP 主导航以 Stitch 初稿为基准：

1. Dashboard / 概览
2. Jobs / 岗位
3. Job Detail / 岗位详情
4. Offer Comparison / Offer 对比

页面结构：

```text
GoOffer
├── 登录 / 注册
└── 应用主框架
    ├── Dashboard 概览
    ├── Jobs 岗位列表
    ├── Job Detail 岗位详情
    ├── Interview 面试记录
    ├── AI Summary AI 总结
    └── Offer Comparison Offer 对比
```

桌面端使用固定左侧导航；移动端使用底部导航，并保留一个突出的新增按钮。

## 6. 颜色规范

### 6.1 核心色板

| Token | 色值 | 用途 |
|---|---|---|
| color.background | `#FBF9F5` | 页面背景，奶油纸感主画布 |
| color.surface | `#FBF9F5` | 默认页面表面 |
| color.surface.lowest | `#FFFFFF` | 主要卡片、导航、输入框 |
| color.surface.low | `#F5F3EF` | 次级容器、搜索区、卡片内分区 |
| color.surface.container | `#F0EEEA` | 默认容器底色 |
| color.surface.high | `#EAE8E4` | hover、分割区域 |
| color.surface.highest | `#E4E2DE` | 更强层级、禁用背景 |
| color.on.surface | `#1B1C1A` | 主文本 |
| color.on.surface.variant | `#4D4632` | 次级文本 |
| color.outline | `#7F7660` | 图标、弱文本、边界强调 |
| color.outline.variant | `#D1C6AB` | 虚线、分割线、弱边框 |

### 6.2 品牌与强调色

| Token | 色值 | 用途 |
|---|---|---|
| color.primary | `#735C00` | 主品牌深黄棕，用于重点文字和进度条 |
| color.primary.container | `#FACC15` | 主强调黄，用于主按钮、激活导航、重点标签 |
| color.on.primary.container | `#6C5700` | 黄色容器上的文字 |
| color.primary.fixed | `#FFE083` | 轻量强调、待办、提示 |
| color.primary.fixed.dim | `#EEC200` | 星标、评分、进度辅助 |
| color.inverse.surface | `#30312E` | 深色重点面板、AI 卡片、高优先级按钮 |
| color.inverse.on.surface | `#F2F0EC` | 深色面板文字 |
| color.secondary | `#A83639` | 高风险、强提醒 |
| color.secondary.container | `#FE7676` | 面试中、提醒卡、重要状态 |
| color.on.secondary.container | `#720B17` | 柔红容器上的文字 |
| color.tertiary | `#555F6F` | 冷静辅助强调 |
| color.tertiary.container | `#C7D1E4` | Offer、进行中、冷色状态 |
| color.on.tertiary.container | `#505A69` | 蓝灰容器上的文字 |
| color.error | `#BA1A1A` | 错误和破坏性操作 |
| color.error.container | `#FFDAD6` | 错误提示背景 |
| color.on.error.container | `#93000A` | 错误提示文字 |

### 6.3 使用比例

推荐页面色彩比例：

```text
奶油背景 / 白色卡片：70%
黄色主强调：10%
深炭黑重点面板：8%
柔红 / 蓝灰状态色：8%
错误和特殊提示：4%
```

黄色不能铺满大面积页面，主要用于按钮、激活态、Badge、进度条和少量重点卡片。深炭黑用于制造对比和决策重点，例如 AI 面试助手、Offer 决策分析、关键按钮。

### 6.4 投递状态颜色

| 状态 | 背景 | 文本 | 用途说明 |
|---|---|---|---|
| 待投递 | `#E4E2DE` | `#4D4632` | 未开始、弱状态 |
| 已投递 | `#FACC15` | `#6C5700` | 已开始流程 |
| 沟通中 | `#C7D1E4` | `#505A69` | HR / 业务沟通 |
| 笔试 | `#FFE083` | `#574500` | 笔试、作业、待完成 |
| 一面 / 二面 / 三面 / 四面 / 终面 | `#FE7676` | `#720B17` | 面试阶段，需要关注 |
| 等待结果 | `#FFE083` | `#574500` | 等待反馈 |
| 已拒绝 | `#FFDAD6` | `#93000A` | 负向结果 |
| 已放弃 | `#E4E2DE` | `#4D4632` | 用户主动放弃 |
| 已拿Offer | `#C7D1E4` | `#505A69` | 正向结果，进入对比 |

状态标签必须有文字，不依赖颜色表达含义。

## 7. 字体规范

### 7.1 字体栈

Stitch 初稿使用 Plus Jakarta Sans。中文环境需要补充中文字体 fallback：

```css
font-family: "Plus Jakarta Sans", "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", Arial, sans-serif;
```

### 7.2 字号层级

| Token | 大小 | 行高 | 字重 | 用途 |
|---|---:|---:|---:|---|
| text.display | 48px | 52px | 800 | 品牌名、关键大数字 |
| text.headline.lg | 32px | 40px | 700 | 页面标题、Dashboard 大标题 |
| text.headline.lg.mobile | 24px | 32px | 700 | 移动端页面标题 |
| text.headline.md | 24px | 32px | 700 | 卡片标题、岗位名称、Offer 公司名 |
| text.body.lg | 18px | 28px | 500 | 页面说明、重要正文 |
| text.body.md | 16px | 24px | 500 | 默认正文、卡片内容 |
| text.label.md | 14px | 20px | 600 | 按钮、导航、表单 Label |
| text.label.sm | 12px | 16px | 700 | Badge、辅助标签、表格标签 |

规则：

- 中文界面不使用负字距，所有 `letter-spacing` 统一为 `0`。
- Dashboard 和卡片可以使用较大的数字，但不要让标题挤压操作区。
- 长岗位名、公司名在列表卡片中最多展示 2 行，详情页展示完整内容。
- 页面说明最多 2 行，避免工具页面像营销页。

## 8. 间距、布局与圆角

### 8.1 间距 Token

| Token | 值 | 用途 |
|---|---:|---|
| space.stack.sm | 8px | 小组件内部间距 |
| space.stack.md | 16px | 控件组、卡片内小分组 |
| space.gutter | 24px | 网格间距、卡片间距 |
| space.card.padding | 32px | 标准卡片内边距 |
| space.margin.page | 40px | 桌面端页面左右边距 |
| space.margin.mobile | 16px | 移动端页面左右边距 |

### 8.2 布局规格

| 区域 | 规格 |
|---|---|
| 桌面侧边导航 | 288px，固定左侧 |
| 桌面主内容左边距 | 288px |
| 桌面内容左右边距 | 40px |
| 桌面网格 | 12 列，gap 24px |
| 卡片内边距 | 32px |
| 顶部栏高度 | 64px - 80px |
| 移动端底部导航高度 | 72px - 88px |

### 8.3 圆角 Token

| Token | 值 | 用途 |
|---|---:|---|
| radius.sm | 8px | 小图标容器、小标签 |
| radius.default | 16px | 输入框、普通容器 |
| radius.md | 24px | 中型卡片、用户信息块 |
| radius.lg | 32px | 标准卡片、侧边导航圆角 |
| radius.xl | 48px | Offer 大卡、重点 Hero 卡 |
| radius.full | 9999px | 胶囊按钮、导航项、Badge、头像 |

卡片圆角以 32px 为主；Offer 对比大卡可使用 48px。表单输入框不必全部 32px，建议 16px - 24px，避免大表单显得松散。

## 9. 阴影与层级

### 9.1 阴影 Token

```css
--shadow-soft: 0 20px 40px rgba(0, 0, 0, 0.04);
--shadow-medium: 0 20px 40px rgba(0, 0, 0, 0.08);
--shadow-popover: 0 24px 48px rgba(0, 0, 0, 0.12);
```

### 9.2 层级规则

1. 页面背景使用 `color.background`。
2. 主卡片使用白色 `color.surface.lowest` + `shadow-soft`。
3. 卡片内分区使用 `color.surface.low`。
4. 重点深色模块使用 `color.inverse.surface`。
5. 弹窗、抽屉、菜单使用 `shadow-popover`。

普通页面不使用硬边阴影。边框主要用于卡片内的小分区、输入框和对比项。

## 10. 图标规范

Stitch 初稿使用 `Material Symbols Outlined`。如果前端最终使用 lucide，也必须保持同样的线性、圆润、轻量风格，不混用多套图标语言。

常用映射：

| 场景 | Material Symbols | 说明 |
|---|---|---|
| 概览 | `dashboard` | 导航 |
| 岗位 | `work` | 导航、岗位对象 |
| 岗位详情 | `description` | 导航、详情 |
| Offer 对比 | `balance` | 导航、对比 |
| 新增 | `add` / `add_circle` | 主操作 |
| 搜索 | `search` | 搜索框 |
| 筛选 | `filter_list` | 筛选按钮 |
| 返回 | `arrow_back` | 顶部栏 |
| 通知 | `notifications` | 顶部栏 |
| 面试时间 | `calendar_month` | 面试记录 |
| 薪资 | `payments` | 岗位概览 |
| 城市 | `location_on` | 岗位概览 |
| AI | `auto_awesome` | AI 总结 |
| Offer | `card_membership` | Offer 入口 |
| 评分 | `star` | 优先级、Offer 评分 |

规则：

- 图标按钮必须有 `aria-label`。
- 重要或低频操作使用图标 + 文案，例如“新增岗位”“生成 AI 总结”。
- 删除、拒绝、放弃等风险操作不能只用图标，必须有文字和二次确认。

## 11. 组件规范

### 11.1 Button

按钮形态以胶囊为主。

| 类型 | 背景 | 文字 | 使用场景 |
|---|---|---|---|
| Primary Yellow | `#FACC15` | `#6C5700` | 新增岗位、添加 Offer、保存成功型操作 |
| Primary Dark | `#30312E` | `#FFFFFF` | 编辑岗位、AI 重点行动、高优先级 CTA |
| Secondary Surface | `#FFFFFF` | `#1B1C1A` | 分享、取消、次级操作 |
| Subtle | `#F0EEEA` | `#4D4632` | 筛选、继续编辑、轻量操作 |
| Danger | `#FFDAD6` | `#93000A` | 删除、拒绝、放弃 |

尺寸：

| 尺寸 | 高度 | 用途 |
|---|---:|---|
| sm | 40px | 卡片内次级操作 |
| md | 48px | 默认按钮 |
| lg | 56px | 页面主操作、右侧栏操作 |
| icon | 48px | 圆形图标按钮 |
| fab | 64px | 移动端 / Dashboard 快速新增 |

交互：

- hover：`translateY(-2px)` 或 `scale(1.02)`，阴影略加深。
- active：`scale(0.95)`。
- loading：显示加载文案或 spinner，禁用重复点击。
- disabled：降低透明度，并移除 hover / active。

### 11.2 Navigation Drawer

桌面端侧边导航是 GoOffer 的主要框架组件。

规格：

- 宽度：288px。
- 位置：固定左侧，主内容 `margin-left: 288px`。
- 背景：`color.surface.lowest`。
- 圆角：右侧 32px。
- 内边距：顶部 / 底部 40px，左右 32px。
- 阴影：`shadow-soft`。

导航项：

- 高度：52px - 56px。
- 圆角：`radius.full`。
- 图标 + 文案，间距 16px。
- 默认文字：`color.on.surface.variant`。
- hover 背景：`color.surface.high`。
- active 背景：`color.primary.container`。
- active 文字：`color.on.primary.container`。

底部用户信息块：

- 背景：`color.surface.container` 或 `color.surface.low`。
- 圆角：32px。
- 包含头像、用户名、计划 / 状态信息。

### 11.3 Top App Bar

顶部栏用于页面标题、返回、通知和主操作。

规格：

- 高度：64px - 80px。
- 背景：默认透明；滚动时可使用 `background / 80% + backdrop-filter: blur(8px)`。
- 页面标题使用 `text.headline.lg`。
- 图标按钮使用 48px 圆形按钮。
- 右侧操作最多放 2 个主按钮，其他操作进入菜单。

### 11.4 Card

卡片是 GoOffer 的主要承载单元。

基础规格：

- 背景：`color.surface.lowest`。
- 圆角：32px。
- 内边距：32px。
- 阴影：`shadow-soft`。
- 边框：默认无；卡片内小分区可使用 `color.surface.highest` 边框。

类型：

- Metric Card：概览指标。
- Job Card：岗位对象。
- Interview Card：面试轮次。
- AI Card：AI 总结 / AI 助手。
- Offer Card：Offer 对比对象。
- Add Card：新增入口。

规则：

- 不做卡片套卡片。卡片内部的补充块使用浅色分区，不再使用完整卡片样式。
- hover 可轻微浮起，但列表中大量卡片不宜过度动画。
- 卡片中每个信息区域都要有明确标题或标签。

### 11.5 Job Card

Stitch 岗位列表以卡片网格为主，而不是传统表格。

结构：

1. 顶部：公司 Logo / 图标容器 + 状态 Badge。
2. 中部：岗位名称、公司名称、城市。
3. 底部：薪资范围 + 优先级胶囊。

规格：

- 卡片圆角：32px。
- Logo 容器：64px × 64px，圆角 32px 或 24px。
- 标题：`text.headline.md`，最多 2 行。
- 公司 / 城市：`text.body.md`，使用中点分隔。
- 底部分割线：`color.surface.high`。
- 薪资数字使用 `color.primary`。

交互：

- 点击卡片进入岗位详情。
- 状态 Badge 可作为筛选提示，不建议在卡片中直接承载复杂下拉。
- 新增岗位入口使用虚线 Add Card：4px dashed `color.outline.variant`，居中 Plus 图标。

### 11.6 Search / Filter Toolbar

岗位列表顶部工具区使用大圆角、低压感控件。

搜索框：

- 高度：56px。
- 背景：`color.surface.lowest`。
- 圆角：`radius.full`。
- 左侧搜索图标。
- 可使用轻微内阴影表达“凹陷”：

```css
box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
```

筛选按钮：

- 高度：56px。
- 胶囊形状。
- 图标 + 文案。
- 默认白底，hover 增加阴影。

### 11.7 Badge / Chip

用途：

- 投递状态
- 优先级
- 面试结果
- Offer 决策
- AI 标签

规格：

- 高度：28px - 32px。
- 圆角：`radius.full`。
- 字体：`text.label.sm`。
- 内边距：左右 12px - 16px。
- 文案尽量短，例如“面试中”“已投递”“Top Choice”。

### 11.8 Interview Card

面试记录以时间线式卡片呈现。

结构：

1. 轮次图标：圆形 40px，使用 `looks_one` / `looks_two` 等图标。
2. 轮次标题：例如“第一轮：技术初试”。
3. 时间与时长。
4. 结果 Badge。
5. 问题与回答列表。

规格：

- 卡片圆角：32px。
- 左侧强调边：8px，使用 `primary.container` 或 `tertiary.container`。
- 问答块背景：`color.surface.low`。
- 问题标题使用 `color.primary`。
- 未完成记录使用虚线空状态。

### 11.9 AI Summary Card

AI 模块是 GoOffer 的差异化能力，应比普通卡片更有识别度。

视觉：

- 背景：`color.inverse.surface`。
- 文字：`color.inverse.on.surface`。
- 图标：`auto_awesome`，使用 `color.primary.container`。
- 内部分区：`rgba(255,255,255,0.10)`。
- 按钮：黄色胶囊。

内容结构：

1. 本轮面试复盘。
2. 表现亮点。
3. 回答不足。
4. 优化建议。
5. 下一轮准备。

规则：

- AI 输出不使用纯大段文本。
- 重点建议用列表和短段落展示。
- 生成中按钮禁用，文案显示“正在生成”。
- 生成失败提供“重新生成”入口。

### 11.10 Offer Card / Offer Comparison

Stitch Offer 对比使用并列大卡片，而不是首屏大表格。MVP 以 Offer Card Grid 为主；当维度变多时，可在卡片下方增加横向对比矩阵。

Offer Card 结构：

1. 顶部：Top Choice Badge（可选）。
2. 公司 Logo。
3. 公司名称 / 岗位名称。
4. 基础信息块：城市、工作方式、入职时间。
5. 年总包薪资进度条。
6. 成长 / 稳定 / 工作强度等评分条。
7. 综合评分。
8. 风险点或决策状态。

规格：

- 圆角：48px。
- 内边距：32px。
- 进度条高度：8px - 12px。
- 综合评分使用大数字，`text.display` 或 40px。
- Top Choice 使用黄色 Badge，但不能替用户强制做决定。

AI 决策分析：

- 使用深色宽卡片。
- 标题：“AI 智能决策分析”。
- 正文必须说明依据和权衡，不输出绝对结论。
- 标签使用半透明白色胶囊。

### 11.11 Form Controls

新增 / 编辑岗位、面试记录、Offer 信息需要保留表单效率。

输入框：

- 高度：48px。
- 圆角：16px - 24px。
- 背景：白色。
- 边框：`color.outline.variant`。
- focus：2px 黄色或深黄棕 focus ring。

Textarea：

- 最小高度：120px。
- 圆角：24px。
- 用于岗位描述、任职要求、回答、复盘备注。

Select：

- 状态选择因枚举较多，使用 Select / Dropdown。
- 优先级、面试形式、Offer 决策可使用 Segmented Control。

表单布局：

- 桌面端 2 列分组。
- 长文本字段占满整行。
- 移动端全部单列。

### 11.12 Modal / Drawer / Toast

Modal：

- 用于删除确认、风险操作确认。
- 圆角：32px。
- 阴影：`shadow-popover`。
- 删除岗位时必须说明会影响相关面试和 Offer。

Drawer：

- 桌面端可用于快速新增岗位、编辑面试。
- 宽度：520px - 640px。
- 右侧滑出，圆角左侧 32px。
- 底部操作栏固定。

Toast：

- 背景：`color.inverse.surface`。
- 文字：白色。
- 圆角：24px。
- 展示 3 - 5 秒。
- 关键错误不能只用 Toast，需要页面内错误状态。

### 11.13 Empty State

空状态应保持鼓励感，但不要营销化。

结构：

1. 圆形 / 胶囊图标容器。
2. 标题。
3. 说明。
4. 主操作按钮。

示例：

| 场景 | 标题 | 说明 | 操作 |
|---|---|---|---|
| 无岗位 | 还没有岗位记录 | 添加第一个岗位，开始整理你的求职进度。 | 新增岗位 |
| 无面试 | 还没有面试记录 | 添加面试后，可以记录问题、回答并生成 AI 总结。 | 添加面试 |
| 无 AI 总结 | 还没有 AI 总结 | 记录面试问题和回答后，生成结构化复盘。 | 生成 AI 总结 |
| 无 Offer | 还没有 Offer | 拿到 Offer 后，在这里进行横向比较。 | 添加 Offer |

## 12. 页面级规范

### 12.1 登录 / 注册页

Stitch 暂未提供完整认证页，需沿用 Bubbly Professional 语言设计。

布局：

- 页面背景：`color.background`。
- 居中认证卡片，宽度 420px - 480px。
- 卡片圆角：48px。
- 卡片内边距：32px - 40px。
- 品牌名 `GoOffer` 使用 `text.display` 和 `color.primary`。

字段：

- 注册：用户名、密码、确认密码。
- 登录：用户名、密码。
- 主按钮使用黄色或深炭黑胶囊按钮，高度 56px。

状态：

- 必填缺失。
- 用户名重复。
- 密码错误。
- 提交中。

### 12.2 应用主框架

桌面端：

```text
┌──────────────────────┬────────────────────────────────────┐
│ 固定圆角侧边导航      │ 顶部栏                             │
│ 288px                │ 页面标题 + 操作                     │
│                      ├────────────────────────────────────┤
│ Dashboard            │ 主内容画布，40px 页面边距           │
│ Jobs                 │ 卡片 / 网格 / 详情布局              │
│ Job Detail           │                                    │
│ Offer Comparison     │                                    │
└──────────────────────┴────────────────────────────────────┘
```

移动端：

- 隐藏侧边导航。
- 使用底部导航。
- 中间可放突出的新增岗位圆形按钮。
- 内容底部需要预留底部导航安全距离。

### 12.3 Dashboard

设计目标：让用户一眼看到求职状态，并知道下一步该做什么。

内容模块：

1. 页面标题：Dashboard / 概览。
2. 说明：集中查看投递、面试和 Offer 状态。
3. 指标卡：投递总数、正在面试、收获 Offer、待跟进。
4. AI 面试复盘报告卡。
5. 近期面试。
6. 待跟进任务。
7. 浮动新增按钮。

布局：

- 桌面端使用 Bento Grid。
- 指标卡横向排布，可换行。
- AI 卡片占 8 列，近期面试占 4 列。
- 待跟进区域可占满整行。

视觉重点：

- “正在面试”可使用黄色卡片。
- “收获 Offer”可使用深炭黑卡片。
- AI 报告卡使用白色大卡 + 黄色 AI Badge + 明确 CTA。

### 12.4 岗位列表

设计目标：支持高频浏览、筛选、排序和新增岗位。

内容模块：

1. 页面标题：岗位。
2. 页面说明：筛选、排序并更新每个岗位的投递状态。
3. 搜索框。
4. 筛选按钮。
5. 新增岗位按钮。
6. 小指标卡。
7. 岗位卡片网格。
8. 新增岗位占位卡。

布局：

- 桌面端：3 列卡片网格。
- 中等屏幕：2 列卡片网格。
- 移动端：1 列卡片列表。

卡片字段：

- 公司 Logo / 占位图标。
- 投递状态。
- 岗位名称。
- 公司名称。
- 城市。
- 薪资范围。
- 优先级。

### 12.5 岗位详情

设计目标：成为单个岗位的信息沉淀中心。

桌面布局：

- 主内容 8 列：岗位头图卡、面试记录。
- 右侧 4 列：快捷操作、岗位概览、AI 面试助手。

顶部栏：

- 返回按钮。
- 页面标题：Job Detail / 岗位详情。
- 分享按钮。
- 编辑岗位按钮。

岗位 Hero 卡：

- 白色卡片，圆角 32px。
- 右上角状态 Badge。
- 公司 / 岗位标题。
- 标签胶囊。
- Logo / 公司图容器。

右侧快捷操作：

- Add Interview：黄色大按钮。
- Add Offer：深炭黑大按钮。

岗位概览：

- 城市、薪资范围、招聘渠道等信息以图标 + 标签 + 内容展示。
- 图标容器为 48px 圆形浅色底。

### 12.6 面试记录

设计目标：快速回顾每轮面试，并沉淀问题和回答。

内容：

- 面试轮次。
- 面试时间和时长。
- 面试结果。
- 面试问题。
- 我的回答。
- 继续编辑入口。

交互：

- “添加新轮次”放在面试记录标题右侧。
- 未完成轮次使用虚线空状态。
- 问题卡背景使用浅奶油色，避免和主卡片混淆。

### 12.7 AI 面试助手 / AI 总结

设计目标：让用户相信 AI 输出能帮助下一轮准备。

入口：

- 岗位详情右侧 AI 面试助手卡。
- 面试记录卡片内的生成入口。

展示：

- 深炭黑卡片。
- 黄色 AI 图标。
- 内部分区展示“准备建议”“近期趋势”“优化回答”等内容。
- 主按钮为黄色胶囊。

禁止：

- 不输出无法执行的大段泛泛建议。
- 不使用过度装饰的光斑作为信息承载。
- 不用 AI 替用户做绝对结论。

### 12.8 Offer 对比

设计目标：帮助用户用多维度方式比较 Offer，而不是只看薪资。

页面结构：

1. 顶部栏：Offer 对比 + 添加新 Offer。
2. Offer 卡片网格。
3. AI 智能决策分析。
4. 关键行动卡。

Offer 卡片布局：

- 桌面端 3 列。
- 平板 2 列。
- 移动端 1 列。

对比维度：

- 公司 / 岗位。
- 城市。
- 年总包薪资。
- 成长空间。
- 稳定性。
- 工作强度。
- 福利。
- 风险点。
- 综合评分。

评分表达：

- 使用进度条和分段条。
- 综合评分使用大数字。
- Top Choice 只作为推荐提示，不能隐藏其他 Offer 的优缺点。

## 13. 响应式规范

### 13.1 断点

| 断点 | 宽度 | 规则 |
|---|---:|---|
| mobile | `< 768px` | 单列、底部导航、隐藏侧栏 |
| tablet | `768px - 1023px` | 2 列卡片、侧栏可收起 |
| desktop | `>= 1024px` | 固定侧栏、12 列网格 |
| wide | `>= 1280px` | 岗位 / Offer 3 列网格 |

### 13.2 桌面端

- 使用 288px 固定侧边导航。
- 主内容 40px 页面边距。
- Dashboard 使用 Bento Grid。
- 岗位和 Offer 使用卡片网格。
- 岗位详情使用主栏 + 侧栏。

### 13.3 平板端

- 侧边导航可收起。
- 卡片网格从 3 列降为 2 列。
- 岗位详情右侧栏下移或变成独立分区。
- 顶部操作按钮保留主按钮，次级操作进入更多菜单。

### 13.4 移动端

- 使用底部导航。
- 页面边距 16px。
- 卡片单列。
- 表单单列。
- Offer 对比使用纵向卡片，不强行展示大表格。
- 所有触控目标不低于 44px，主按钮建议 56px。
- 长标题允许换行，不允许和按钮重叠。

## 14. 动效与交互

### 14.1 微交互

Stitch 风格强调 “squishy” 触感，但必须克制。

推荐：

```css
.interactive:hover {
  transform: translateY(-2px) scale(1.01);
}

.interactive:active {
  transform: scale(0.95);
}

.interactive {
  transition: transform 200ms ease, box-shadow 200ms ease, background-color 200ms ease;
}
```

规则：

- 大量重复卡片 hover 不超过 `translateY(-4px)`。
- 不让 hover 改变布局尺寸。
- 表单输入时不使用缩放，避免干扰输入。
- 支持 `prefers-reduced-motion`，减少或关闭非必要动画。

### 14.2 加载状态

需要覆盖：

- 页面初次加载。
- 岗位列表筛选。
- 表单保存。
- 状态更新。
- AI 总结生成。

样式：

- 卡片 skeleton 使用 `color.surface.container`。
- 按钮 loading 使用 spinner + 文案。
- AI 生成中展示深色卡内 loading，不允许重复点击。

### 14.3 错误状态

错误类型：

- 表单校验错误。
- 网络错误。
- 权限不足。
- 数据不存在。
- AI 生成失败。

样式：

- 字段错误显示在字段下方。
- 页面错误使用白色卡片 + 错误色图标 + 重试按钮。
- AI 失败在 AI 卡片内提供“重新生成”按钮。

## 15. 内容规范

### 15.1 术语

统一使用：

- 概览
- 岗位
- 岗位详情
- 投递状态
- 面试记录
- 面试问题
- 我的回答
- AI 总结
- Offer 对比

导航可以在英文原型中使用 Dashboard / Jobs / Job Detail / Offer Comparison；正式中文界面建议统一中文。

### 15.2 按钮文案

| 场景 | 文案 |
|---|---|
| 新增岗位 | 新增岗位 |
| 添加面试 | 添加面试 |
| 添加新轮次 | 添加新轮次 |
| 编辑岗位 | 编辑岗位 |
| 添加 Offer | 添加 Offer |
| 添加新 Offer | 添加新 Offer |
| 生成 AI 总结 | 生成 AI 总结 |
| 保存总结 | 保存总结 |
| 继续编辑 | 继续编辑 |
| 确认删除 | 确认删除 |
| 重新生成 | 重新生成 |

### 15.3 空状态文案

| 页面 | 标题 | 说明 | 操作 |
|---|---|---|---|
| 概览 | 开始你的求职整理 | 添加第一个岗位后，这里会展示投递、面试和 Offer 进展。 | 新增岗位 |
| 岗位列表 | 还没有岗位记录 | 记录你感兴趣的岗位，后续就能跟踪投递进度。 | 新增岗位 |
| 筛选无结果 | 没有匹配的岗位 | 调整筛选条件，或者清空筛选后再看看。 | 清空筛选 |
| 面试记录 | 还没有面试记录 | 添加面试后，可以记录问题、回答并生成 AI 总结。 | 添加面试 |
| Offer 对比 | 还没有 Offer | 拿到 Offer 后，在这里进行横向比较。 | 添加 Offer |

## 16. 可访问性规范

1. 所有输入框必须有关联 Label。
2. 图标按钮必须有 `aria-label`。
3. 状态不能只靠颜色表达，必须有文字。
4. focus 状态必须清晰可见，建议使用 2px focus ring。
5. Modal 打开后焦点进入弹窗，关闭后回到触发按钮。
6. 胶囊按钮文字必须完整显示，不允许被图标挤压。
7. 文本与背景需要满足基础对比度要求，浅黄底上使用深黄棕文字。
8. 动效需支持 reduced motion。

## 17. Figma 文件组织建议

页面：

1. `00 Cover`
2. `01 Foundations - Bubbly Professional`
3. `02 Components`
4. `03 Dashboard`
5. `04 Jobs`
6. `05 Job Detail`
7. `06 Offer Comparison`
8. `07 Mobile`
9. `08 Handoff Notes`

Frame 命名：

```text
Dashboard / Default / Desktop
Jobs / List / Default / Desktop
Jobs / List / Empty / Desktop
Job Detail / Default / Desktop
Job Detail / AI Summary / Desktop
Offer Comparison / Default / Desktop
Offer Comparison / Empty / Desktop
Jobs / List / Default / Mobile
```

组件命名：

```text
Button / Primary Yellow
Button / Primary Dark
Button / Secondary Surface
NavItem / Default
NavItem / Active
Card / Metric
Card / Job
Card / Interview
Card / AI Summary
Card / Offer
Badge / Job Status
Input / Search Pill
Toolbar / Jobs Filter
EmptyState / Default
Modal / Confirm Delete
```

变量组：

- Color
- Typography
- Spacing
- Radius
- Shadow
- Status
- Motion

MVP 只做 Light 模式。Stitch 中的 dark class 可保留为未来扩展，不作为当前交付范围。

## 18. 前端交付说明

### 18.1 Tailwind Token 建议

前端若使用 Tailwind，可沿用 Stitch 初稿中的 token 命名：

```js
colors: {
  background: "#fbf9f5",
  "surface-container-lowest": "#ffffff",
  "surface-container-low": "#f5f3ef",
  "surface-container": "#f0eeea",
  "surface-container-high": "#eae8e4",
  "surface-container-highest": "#e4e2de",
  "on-surface": "#1b1c1a",
  "on-surface-variant": "#4d4632",
  "inverse-surface": "#30312e",
  "inverse-on-surface": "#f2f0ec",
  primary: "#735c00",
  "primary-container": "#facc15",
  "on-primary-container": "#6c5700",
  secondary: "#a83639",
  "secondary-container": "#fe7676",
  "on-secondary-container": "#720b17",
  tertiary: "#555f6f",
  "tertiary-container": "#c7d1e4",
  "on-tertiary-container": "#505a69",
  error: "#ba1a1a",
  "error-container": "#ffdad6",
  "on-error-container": "#93000a"
}
```

圆角：

```js
borderRadius: {
  sm: "0.5rem",
  DEFAULT: "1rem",
  md: "1.5rem",
  lg: "2rem",
  xl: "3rem",
  full: "9999px"
}
```

间距：

```js
spacing: {
  "margin-page": "40px",
  gutter: "24px",
  "card-padding": "32px",
  "stack-sm": "8px",
  "stack-md": "16px",
  "stack-lg": "32px"
}
```

### 18.2 组件清单

基础组件：

- AppShell
- SidebarNav
- TopAppBar
- Button
- IconButton
- SearchInput
- Select
- SegmentedControl
- Badge
- Card
- Modal
- Drawer
- Toast
- EmptyState
- Skeleton

业务组件：

- DashboardMetricCard
- AIReviewHeroCard
- RecentInterviewList
- FollowUpTaskCard
- JobCard
- JobFilterToolbar
- JobDetailHero
- InterviewRoundCard
- AISummaryCard
- OfferCard
- OfferComparisonGrid
- RatingBar

### 18.3 验证重点

实现后需要检查：

1. 1440px 桌面端侧边导航、顶部栏和卡片网格稳定。
2. 1024px 下岗位详情主栏和侧栏不重叠。
3. 390px / 375px 移动端卡片单列展示，底部导航不遮挡内容。
4. 长岗位名、长公司名、长薪资信息不会撑破卡片。
5. 胶囊按钮中文案完整，不被图标挤压。
6. AI 总结生成中不会重复提交。
7. Offer 卡片 3 个以上时仍能清晰比较。
8. 所有状态标签都有文字，颜色对比可读。

## 19. 不在 MVP 设计范围

当前规范不覆盖：

1. 深色模式。
2. 拖拽看板。
3. 日历视图。
4. 浏览器插件。
5. 邮箱解析流程。
6. 社区面经。
7. 复杂图表分析。
8. 付费订阅页面。
9. 自定义主题。
10. 自由漂浮装饰光斑和鼠标跟随视觉效果。

## 20. 后续开放问题

后续进入高保真和开发前建议确认：

1. 正式界面导航使用中文还是保留英文。
2. 公司 Logo 是否允许用户上传，还是统一使用首字母占位。
3. Offer 对比是否需要在卡片之外增加详细横向矩阵。
4. AI 总结是否允许用户编辑后保存。
5. 移动端新增岗位按钮放底部中间还是右下角 FAB。
