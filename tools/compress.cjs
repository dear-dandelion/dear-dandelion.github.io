/* 素材压缩脚本 — DESIGN.md §6.1
 * 用法: node tools/compress.cjs
 * 输出: assets/img/*.webp(全部按预算表)
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, '素材'); // 源素材统一在 素材/ 目录
const OUT = path.join(ROOT, 'assets', 'img');
fs.mkdirSync(OUT, { recursive: true });

const JOBS = [
  // [源文件, 输出, 长边px, webp质量, 选项]
  ['北京-故宫.jpg',       'photo-forbidden-city.webp', 1920, 80, {}],
  ['杭州-西园寺.jpg',     'photo-xiyuan.webp',         1600, 80, {}],
  ['青海-共和县.jpg',     'photo-gonghe.webp',         1600, 80, {}],
  ['本科毕业照.jpg',      'grad-2024.webp',            1920, 80, { saturation: 0.6 }], // 降饱和烘焙进文件,§5.2
  ['头像.jpg',            'avatar.webp',               640,  78, { cover: true }],
  ['健康风险评估系统.png', 'project-health.webp',       1920, 80, {}],
  ['游戏角色设计草稿.jpg', 'game-sketch.webp',          1200, 85, {}],
  ['游戏企划书截图.png',  'game-plan.webp',             790,  85, {}],
];

(async () => {
  for (const [src, out, size, quality, opts] of JOBS) {
    const p = path.join(SRC, src);
    if (!fs.existsSync(p)) { console.log(`跳过(源缺失): ${src}`); continue; }
    let img = sharp(p).rotate(); // 尊重 EXIF 方向
    if (opts.cover) {
      img = img.resize(size, size, { fit: 'cover', position: 'centre' });
    } else {
      img = img.resize({ width: size, height: size, fit: 'inside', withoutEnlargement: true });
    }
    if (opts.saturation) img = img.modulate({ saturation: opts.saturation });
    const buf = await img.webp({ quality }).toBuffer();
    fs.writeFileSync(path.join(OUT, out), buf);
    console.log(`${out}: ${(buf.length / 1024).toFixed(0)}KB`);
  }
  console.log('图片处理完成');
})();
