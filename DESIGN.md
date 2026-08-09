# 个人网站生产级设计方案(Xu JF)

> 版本:v1.0 · 日期:2026-08-09 · 状态:待评审
> 技术形态:纯静态 HTML/CSS/JS,零构建依赖,可部署至任意静态托管
> 本文件是项目唯一事实来源,所有实现以本文档为验收标准。

---

## 1. 产品定位

- **一句话定位**:一个在 AI 时代不断横跨边界的学生产品人。
- **叙事主线**:横向跨界 = 横向滚动。全站一条横向轨道,六站,滚动即旅程。
- **内容清单**:985 CS 本科 → BME 第二学位(即将攻读)、1087 条笔记的 RAG 知识库、2 件孵化中作品(健康风险评估系统 / 微恐乙女文字游戏)、3 张旅行摄影。
- **目标访客**:产品/技术同行、小红书/校园关注者、潜在合作者。停留时间 > 60s 即视为成功。

## 2. 信息架构(六站轨道)

| 站 | 站牌 | 标题/核心文案(定稿) | 素材 |
|---|---|---|---|
| 0 始发站 | — | 「我相信生活是灵感孵化的摇篮」(无句号)学生/产品人/生活体验者(头像替代名字)「985本科 CS BME」「向右看,走近我」 | 头像.jpg |
| 1 跨界 | 01 | 「我不满足于纯软件」CS:代码是我的老朋友，本科四年我用它搭建了很多小世界。BME:AI 的潮水漫上来，纯软件在退潮。我转身申请了生物医学工程，\<br>我想给代码装上会行动的手脚。 | 本科毕业照(低饱和处理) |
| 2 知识库 | 02 | 「信息不建库,就不算知识」我把小红书上的碎片建成了库，目前一共 1087 条笔记全部接入 RAG。\<br>现在它能回答我的问题，它成为了我的第二大脑。(整句换行)数据点:1087 篇笔记 / RAG 问答 / Obsidian 平台 | 小红书知识库演示.mp4 |
| 3 孵化场 | 03 | 「两件作品,都在孵化」推上线的那天,我会写在这里。A.健康风险评估系统 `●开发中` —— 居家康养,50 个医疗计算器,自然语言对话健康风险评估。B.微恐乙女向文字游戏 `●企划初期` —— 微恐 × 乙女 × 文字游戏。世界观正在纸上生长。 | 系统截图、角色草图、企划书截图 |
| 4 审美 | 04 | 「审美,是 AI 时代的护城河」编程的门槛逐渐被 AI 抹平，创意、审美、体验将变得更加重要。 | 故宫·北京 / 西园寺·杭州 / 共和县·青海 |
| 5 当前站 | 05 | 「现在我将攻读第二个学位,继续探索更多方向。」很高兴认识你!邮箱 / GitHub。下一站,还没定。 | 头像(复用) |

## 3. 设计系统

### 3.1 设计令牌(tokens.css)

```css
:root {
  /* 颜色 — 极简黑白,无装饰色 */
  --color-bg:        #FFFFFF;
  --color-ink:       #111111;   /* 主文本,对比度 16.7:1 */
  --color-ink-2:     #757575;   /* 次级文本,对比度 4.6:1(≥AA) */
  --color-ink-3:     #BBBBBB;   /* 仅限装饰线/虚线,禁止用于正文 */
  --color-focus:     #111111;
  --color-selection-bg: #111111;
  --color-selection-fg: #FFFFFF;

  /* 字体 — 中文用系统栈,禁用 web 中文字体(单字重 4-8MB,预算不可接受) */
  --font-sans: "PingFang SC", "HarmonyOS Sans SC", "Microsoft YaHei", "Noto Sans SC", system-ui, sans-serif;
  --font-latin: "Inter", var(--font-sans);   /* 仅数字/英文展示,可走 20KB 子集 */

  /* 字号 — clamp 流体缩放 */
  --text-display: clamp(1.5rem, 4.5vw, 2.75rem); /* 站标题,全站统一(与站0对齐) */
  --text-h2:      clamp(1.75rem, 4vw, 2.5rem);
  --text-h3:      1.25rem;
  --text-body:    clamp(1rem, 1.4vw, 1.125rem); /* 行高 1.75 */
  --text-small:   0.875rem;

  /* 间距 — 8px 基准 */
  --space-1: 8px;  --space-2: 16px;  --space-3: 24px;
  --space-4: 40px; --space-5: 64px;  --space-6: 96px;

  /* 布局 */
  --station-pad-x: clamp(24px, 6vw, 96px);   /* 站内边距,致敬 Mike 式宽留白 */
  --track-station-w: 100vw;

  /* 动效 */
  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --dur-base: 0.6s;
  --dur-slow: 0.8s;

  /* 层级 */
  --z-nav: 100; --z-progress: 90; --z-overlay: 200;
}
```

### 3.2 排版规范

- 站标题:字重 100(Thin),大字号,中文 Thin 由系统字体提供(Windows 微软雅黑 Light 回退)
- 正文:字重 400,行高 1.75,段间距 1em
- 数字一律 `font-variant-numeric: tabular-nums`(1087 等统计数字)
- 破折号「——」为文案指定标点,渲染时保持原样
- 标点压缩:`text-spacing` 默认即可,不启用额外压缩

### 3.3 图标与状态

- 状态角标:`●` 圆点 + 文字(开发中/企划初期)。圆点 `@keyframes` 2s 呼吸(透明度 0.4→1),`prefers-reduced-motion` 下静止
- 状态不得只靠颜色表达(角标必有文字),满足 WCAG 1.4.1

## 4. 页面结构与轨道引擎

### 4.1 页面骨架(index.html)

```
<header role="banner">   顶部导航:站牌列表(01-05)+ 进度条
<main id="content">      横向滚动轨道容器
  <section id="station-0" class="station" aria-labelledby="...">× 6
<footer>                 移动端降级时承接终点站内容
```

### 4.2 轨道引擎(scripts/track.js)— 生产级要求

- **实现方式**:原生滚动容器 `overflow-x: scroll` + `scroll-snap-type: x mandatory`,**不用 transform 平移模拟**(保证滚动位置可被浏览器恢复、键盘可导航、屏幕阅读器可理解)
- **滚轮映射**:桌面端将 `deltaY`(垂直滚轮)映射为 `scrollLeft`(水平滚动);`deltaMode` 归一化(像素=1、行=×16、页=×viewport);`rAF` 节流合并
- **防溢出**:滚动到首尾站时吞掉向外的滚动,防止页面垂直跳动(`overscroll-behavior: none` + 边界 clamp)
- **站状态同步**:`IntersectionObserver`(threshold 0.5)判定当前站 → 更新导航高亮、站号、URL hash(`history.replaceState`,刷新/分享可恢复定位)、`aria-current`
- **平滑性**:`scroll-snap` 自带惯性;不叠加 JS lerp,避免双引擎冲突
- **触摸设备**:原生横向滑动即可工作,无需 JS 干预

### 4.3 响应式降级(styles/responsive.css)

| 断点 | 行为 |
|---|---|
| ≥1024px 桌面 | 全横向轨道,每站 100vw × 100vh |
| 768–1023px 平板 | 轨道保持横向,站内密度降低,边距收窄 |
| <768px 移动 | **整页降级为竖向文档流**:站变 section,高度自适应(auto,不用 100vh),移除 scroll-snap;导航仅保留顶部进度条;内容顺序 0→5 不变 |

降级原则:移动端永不出现横向滚动手势(触控层无此习惯),竖向堆叠是规格内行为,不是缺陷。

## 5. 组件规格

### 5.1 站 0 始发站(修订 v1.1)
- 布局:宣言区 flex 居中(column);**头像内联进身份行,替代名字展示**(28px 圆形,`vertical-align: middle`),不再有角落头像
- 标题:**缩小字号 `clamp(1.5rem, 4.5vw, 2.75rem)` 且桌面单行不换行**(移动端允许换行),Thin 字重
- 身份行:「学生 / 产品人 / 生活体验者」与「985本科 CS BME」**同级同式**(`--color-ink-2`,不强调)
- 宣言段:`向右看,走近我 ⟶` 箭头往复动画
- 「向右看,走近我」:正文字号 + 右侧 `⟶` 箭头,箭头 `@keyframes` 水平位移 8px 往复 1.6s(仅动效,reduced-motion 静止);整行 `cursor` 为滚动提示
- 入场:三段内容 stagger fade-in(120ms 间隔,0.6s `--ease-out`),仅首次加载执行
- 头像 `fetchpriority="high"`、`loading="eager"`(全站唯一非懒加载图片)

### 5.2 站 1 跨界
- 双节点卡:垂直堆叠,卡间一条贯穿的装饰虚线(颜色 `--color-ink-3`,仅装饰)
- 每卡:序号(01/02)+ 关键词(CS/BME)字重 700 + 正文
- 滚动进入时逐卡 fade-up(`IntersectionObserver` 触发,offset 0.3)
- 本科毕业照:置于 CS 卡右侧,宽 ≤380px,`filter: saturate(0.6) contrast(1.05)` 低饱和处理,配 1px `--color-ink-3` 边框,alt="本科毕业留影"

### 5.3 站 2 知识库(修订 v1.3)
- 布局:`.knowledge-layout` flex —— **视频 + 下方文案在左列**(`.knowledge-main` `max-width: 560px`,文案与视频同宽对齐),**数据点列移右侧栏**(`.knowledge-data.data-points`,纵向三行,`margin-left: auto` + `margin-right: 50px` 微调)
- 视频卡:16:9,`max-width: 560px`,圆角 8px,无阴影
- **自动播放**:`autoplay muted loop playsinline controls`(静音循环,controls 供手动取消静音);被浏览器拦截时 controls 兜底
- 简介与数据点自动展开(reveal 触发),不做点击展开
- 数据点:1087 / RAG / Obsidian 平台,数字 32px Thin + tabular-nums,标签 small `--color-ink-2`;平板及以下(≤1023px)回到下方三列横排
- 语义:视频 `aria-label="小红书知识库 RAG 问答演示"`;加载失败时错误文案兜底(`.has-error`)

### 5.4 站 3 孵化场(修订 v1.2)
- **双栏并排布局**:`.project-list` grid `1fr 1fr`(桌面),两件作品左右分栏,信息完整一屏展示;副行「推上线的那天,我会写在这里。」为 `.project-note` 次级灰(`--color-ink-2`,降级) 
- 每项目内:文字块在上,媒体在下;无分隔线(用间距代替装饰)
- **项目卡 A(健康风险评估系统)**:封面图套浏览器窗口 mockup(纯 CSS:3 圆点 + 地址栏条),占满列宽;角标 `● 开发中`;标题 h3 + 正文
- **项目卡 B(游戏)**:媒体列 `.project-media` **`max-width: 400px` 居中**;**两张纸片左右并排交叠**(`.game-stack` 宽 400px,flex 布局,每张宽 58%,首张 `margin-right: -16%` 与次张交叠约 64px;草图 -2°、企划书 +1.5° 旋转错位,次张下移 10px;纸张微阴影 `0 1px 4px` 为全站唯一例外),**hover 时该纸片置顶归正**(rotate 0 + translateY -3px + z-index 5);角标 `● 企划初期`;文案块含「它还没有名字。」
- 平板(≤1023px)降为单列堆叠,媒体放宽至 320px
- 角标圆点呼吸动画见 §3.3

### 5.5 站 4 审美(修订 v1.2)
- 布局:**列比 4:3:3**(北京故宫占 4,宽于其余两图),**高度保持一致**(52dvh)
- hover(桌面):地点浮层淡入,置于图底,`--color-ink` 底 72% 透明黑字,仅文字无图标
- 交互数据 = 地点文案:**摄于 北京-故宫 / 摄于 杭州-西园寺 / 摄于 青海-共和县**
- 焦点可见:`:focus-visible` 下浮层常显(键盘用户)
- 移动端:无 hover,「摄于XX」作为图下说明文字常显

### 5.6 站 5 当前站
- display 字号收尾句,居中
- 联系方式:两个链接(**邮箱 `dandelion1110@yeah.net` — 点击复制到剪切板**(`.copy-email`,`navigator.clipboard` + `execCommand` 降级,保留 `mailto:` href 作无 JS 兜底;点击后文案临时变「已复制」2 秒) / **GitHub `https://github.com/dear-dandelion`**),hover 下划线从左侧生长(`background-size` 技术),链接 `rel` 按外链标准
- 底部小字「下一站,还没定。」italic + `--color-ink-2`

### 5.7 顶部导航(header)
- 固定顶部,高 56px,`backdrop-filter: blur(8px)` + 白底 88% 透明(不遮挡内容)
- 左侧:站牌列表 01·始发 / 02·跨界…(桌面);移动端只显示当前站名
- 右侧(或同条):细进度条 2px(`--color-ink`),宽度 = `scrollLeft / (scrollWidth - clientWidth)`
- 当前站:`--color-ink` 且字重 700 + `aria-current="true"`;其余 `--color-ink-2`
- 站牌可点击跳转(`scrollTo` + `behavior: "smooth"`,reduced-motion 下 `"auto"`)

## 6. 素材管线(assets/)

### 6.1 压缩规格(工具:ffmpeg + cwebp,或手工导出等价产物)

| 源文件 | 目标 | 规格 | 预算 |
|---|---|---|---|
| 小红书知识库演示.mp4 (61MB) | assets/video/knowledge-demo.mp4 | H.264 yuv420p,高 ≤720,时长 ≤60s(需裁剪),AAC 96k | **≤10MB** |
| 同上 | assets/video/knowledge-poster.jpg | 第 25% 处抽帧,宽 1280 | ≤150KB |
| 北京-故宫.jpg | assets/img/photo-forbidden-city.webp | 长边 ≤1920,质量 80 | ≤300KB |
| 杭州-西园寺.jpg | assets/img/photo-xiyuan.webp | 长边 ≤1600 | ≤250KB |
| 青海-共和县.jpg | assets/img/photo-gonghe.webp | 长边 ≤1600 | ≤250KB |
| 本科毕业照.jpg (21MB) | assets/img/grad-2024.webp | 长边 ≤1920,`-vf hue=s=0.6` 降饱和 | ≤300KB |
| 头像.jpg | assets/img/avatar.webp | 640×640 方形 | ≤100KB |
| 健康风险评估系统.png | assets/img/project-health.webp | 长边 ≤1920 | ≤200KB |
| 游戏角色设计草稿.jpg | assets/img/game-sketch.webp | 长边 ≤1200 | ≤150KB |
| 游戏企划书截图.png | assets/img/game-plan.webp | **保持 ≤790px 内宽**,或用户重截高清版 | ≤150KB |
| — | favicon.svg | 手写「X」单字 SVG | ≤2KB |

**全站预算:图片总量 ≤1.5MB,视频 ≤10MB,合计 ≤11.5MB(首次),二次访问走 HTTP 缓存。**

### 6.2 图片加载策略
- 全部 `loading="lazy"` + `decoding="async"`,唯一例外:站 0 头像(eager + fetchpriority=high)
- 视频 `preload="metadata"`,点击才下载主体数据
- 缓存:`Cache-Control: public, max-age=31536000, immutable`(静态托管默认);HTML 不缓存或 10 分钟

## 7. 性能预算(验收门槛)

| 指标 | 目标(桌面 + 移动模拟) |
|---|---|
| FCP | < 1.2s |
| LCP | < 1.5s |
| CLS | 0 |
| TBT | < 100ms |
| Lighthouse Performance | ≥ 95 |
| 总传输量 | 首屏 < 500KB(不含视频,视频点击后加载) |

约束:零第三方脚本;零追踪(隐私默认,M1 不放分析);不引外部字体(中文);不引外部 CDN 库。

## 8. 可访问性(WCAG 2.1 AA 验收)

1. **对比度**:正文 `--color-ink`(16.7:1);次级 `--color-ink-2 #757575`(4.6:1 ≥ AA);`#BBBBBB` 只用于装饰线
2. **焦点**:全站 `:focus-visible` 2px `--color-ink` 外描边 + 2px offset;键盘可完整走完六站(站牌 Tab 可达)
3. **语义**:唯一 h1 在站 0;每站 section + aria-labelledby;站点导航 aria-current;跳过链接(跳到站 0 内容)
4. **动效**:`prefers-reduced-motion` 下关闭 lerp/箭头动画/呼吸圆点/入场 stagger,站切换 instant
5. **键盘横向导航**:←/→ 键站级跳转(仅桌面轨道态);监听 `keydown`,排除输入态
6. **放大 200%**:rem/clamp 单位,无固定宽度溢出(站内容 `max-width` 兜底)
7. **图片**:全部 alt 有意义描述;装饰虚线 `aria-hidden`
8. **视频**:播放按钮是按钮元素(`aria-label`),不自动播放,无音频突袭

## 9. SEO 与分享

- `title`:Xu JF — 学生 · 产品人 · 生活体验者
- `meta description`:985 CS 本科、BME 第二学位、1087 条笔记 RAG 知识库、孵化中的产品与游戏
- Open Graph:`og:type=website`、`og:image`(故宫摄影压缩版)、`og:locale=zh_CN`
- JSON-LD `Person`:`name`、`jobTitle`、`alumniOf`、`knowsAbout:["CS","BME","AI","Product Design"]`
- `robots.txt` + `sitemap.xml`(单页,1 个 URL)
- `canonical` 指向裸域
- 单页应用注意:hash 定位(`#station-3`)在刷新与分享时可用(§4.2)

## 10. 工程与部署

### 10.1 文件结构(最终)

```
个人网站/
├── index.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── favicon.svg
├── styles/tokens.css · base.css · layout.css · components.css · responsive.css
├── scripts/track.js · navigation.js · interactions.js · reveal.js · main.js
├── assets/img/*.webp · assets/video/knowledge-demo.mp4 · knowledge-poster.jpg
└── DESIGN.md(本文档)
```

### 10.2 兼容目标

- 最新 Chrome / Edge / Safari / Firefox(前 2 个主版本)
- Safari 15+ 兜底:`100vh → 100svh` 用 `@supports` 渐进增强;`backdrop-filter` 不支持时纯白底
- Windows 10/11、macOS、iOS、Android 主浏览器

### 10.3 部署与发布

1. 代码托管 GitHub(私库可转公),`main` 分支
2. 托管:Vercel(推荐,静态零配置、自动 HTTPS + HSTS)或 Netlify / GitHub Pages 等价
3. 推送即自动部署;发布流程 = merge to main,无手动步骤
4. 自定义域名(可选,规格支持),DNS 按平台指引
5. 回滚:平台前一个部署一键回滚

### 10.4 质量门槛(Definition of Done)

- [ ] Lighthouse 桌面 & 移动四指标(性能/可访问/最佳实践/SEO)均 ≥ 95
- [ ] 全站素材在预算内(§6.1),CLS = 0
- [ ] 仅键盘完整走通六站;reduced-motion 模式无动画残留
- [ ] 375px / 768px / 1440px 三档手动 QA 通过(轨道降级行为符合 §4.3)
- [ ] 视频点击播放、poster 先显、加载失败兜底文案出现
- [ ] URL hash 刷新恢复站位置;←/→ 键导航可用
- [ ] W3C 校验通过,console 零报错
- [ ] 4G 网络模拟下首屏 < 2s

## 11. 里程碑(按序交付,每期有独立验收)

| 期 | 内容 | 验收 |
|---|---|---|
| M1 | 轨道骨架 + 导航/进度条 + 站 0/1/5 + tokens/base | 六站可滚动遍历,移动端降级竖排,hash 恢复 |
| M2 | 站 2(视频 + 数据点)+ 站 3(双卡孵化场)+ 素材压缩脚本 | 视频 ≤10MB 点击播放,预算达标 |
| M3 | 站 4(摄影 + 地点 hover)+ 动效打磨 + reduced-motion 全量 | 可访问性检查清单(§8)全过 |
| M4 | SEO/JSON-LD/OG/404/sitemap + 部署上线 + Lighthouse 门槛 | DoD(§10.4)全过,域名可访问 |

## 12. 明确不做(P2 后备,防范围蔓延)

- 暗色模式(品牌决策:极简白;若做,P2 后置)
- 分析统计(先零追踪;后置 umami/Plausible 自托管)
- 摄影灯箱与相册子轨道、游戏站更新日志、独立博客(如知识库文章要输出,另立子页)
- 视频字幕/字幕轨道(素材无;后置)
