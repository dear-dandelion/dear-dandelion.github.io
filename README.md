# Xu JF 个人网站

极简叙事型个人网站

**在线地址:** https://dear-dandelion.github.io/

> 我相信生活是灵感孵化的摇篮。

## 特性

- **六站横向轨道**:始发站 / 跨界 / 知识库 / 孵化场 / 审美 / 当前站,滚轮逐站翻页
- **纯静态**:原生 HTML/CSS/JS,零构建、零第三方依赖、零外部字体
- **极简黑白设计系统**:排版驱动、动效克制、数据驱动可信度
- **生产级规范**:WCAG AA 无障碍、`prefers-reduced-motion`、键盘全遍历、素材预算(图片 890KB / 视频 2.3MB)
- **素材管线**:源素材一键压缩为 webp,视频压至 720p ≤10MB

## 技术栈

原生 HTML5 / CSS3(CSS 变量 + clamp 流体排版)/ 原生 JS(IntersectionObserver + scroll-snap)

## 目录结构

```
个人网站/
├── index.html            站点主体(六站全量标记)
├── DESIGN.md             生产级设计规格(唯一事实来源)
├── STYLE-GUIDE.md        可复用设计风格手册
├── styles/               tokens · base · layout · components · responsive
├── scripts/              track(滚轮引擎)· navigation · reveal · interactions · main
├── assets/               压缩后的线上资源
│   ├── img/              webp 图片(预算内)
│   └── video/            知识库演示视频 + poster
├── 素材/                 原始素材(图片/视频,不入部署)
├── tools/                素材压缩脚本 + 滚轮回归测试
└── 404.html · robots.txt · sitemap.xml · favicon.svg
```

## 本地预览

```bash
python -m http.server 8080
# 浏览器打开 http://localhost:8080
```

## 素材管线

**源素材**统一放在 `素材/` 目录,新增素材后执行:

```bash
# 1. 图片压缩(webp,按 DESIGN.md §6.1 预算)
node tools/compress.cjs

# 2. 视频压缩(720p H.264,目标 ≤10MB)
ffmpeg -i 素材/xxx.mp4 -vf "scale=-2:720" -c:v libx264 -preset slow -crf 28 \
  -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 96k assets/video/xxx.mp4
```

**滚轮回归测试**(改动轨道引擎后必跑):

```bash
node tools/wheel-test.cjs   # 真实 Edge 无头驱动
```

## 部署

```bash
git push                    # GitHub Pages 自动构建,1-2 分钟上线
```

Pages 配置:仓库 Settings → Pages → Deploy from a branch → `master` / `(root)`。

> **本机网络注意**(Watt Toolkit TLS 中间人环境):git 需 schannel 后端、推送需强制 HTTP/1.1,详见项目记忆。
> ```bash
> git config http.sslBackend schannel
> git -c http.version=HTTP/1.1 push
> ```

## 设计文档

| 文档 | 用途 |
|---|---|
| `DESIGN.md` | 本项目的生产级规格:令牌、组件、轨道引擎、性能预算、验收标准 |
| `STYLE-GUIDE.md` | 从本项目提炼的可复用风格手册,新项目直接套用 |

## 致谢

设计灵感来自 Mike Matas(mikematas.com)与 Jenny Wen(jennywen.ca)的个人网站:极简排版、叙事同构、数据驱动交互。
