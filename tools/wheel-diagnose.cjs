/* 诊断:滚轮事件是否触发、scrollLeft 是否短暂变化、snap 是否回吸 */
const puppeteer = require('puppeteer-core');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle0' });
  await page.mouse.move(720, 450);
  await sleep(500);

  // 1) 探测 wheel 事件是否到达页面
  await page.evaluate(() => {
    window.__probe = { wheel: 0, target: null };
    document.addEventListener('wheel', (e) => {
      window.__probe.wheel++;
      window.__probe.target = e.target.id || e.target.className || e.target.tagName;
    }, { capture: true });
    window.__track = document.getElementById('track');
    window.__snapType = getComputedStyle(window.__track).scrollSnapType;
  });
  await page.mouse.wheel({ deltaY: 300 });
  await sleep(100);
  console.log('wheel 事件计数:', await page.evaluate(() => window.__probe.wheel),
              '| 目标元素:', await page.evaluate(() => window.__probe.target),
              '| scrollSnapType:', await page.evaluate(() => window.__snapType));

  // 2) 同步读取:wheel 事件后立刻(rAF 内)读 scrollLeft —— 看是否短暂前进后被 snap 拉回
  await page.evaluate(() => {
    window.__track.scrollLeft = 0;
    window.__track.addEventListener('wheel', () => {
      requestAnimationFrame(() => { window.__immediateLeft = window.__track.scrollLeft; });
    });
  });
  await page.mouse.wheel({ deltaY: 300 });
  await sleep(50);
  console.log('事件后立即(rAF)scrollLeft:', await page.evaluate(() => window.__immediateLeft));
  await sleep(600);
  console.log('600ms 后 scrollLeft:', await page.evaluate(() => Math.round(window.__track.scrollLeft)));

  // 3) 关闭 snap 再滚 —— 区分「handler 失效」与「snap 回吸」
  await page.evaluate(() => { window.__track.style.scrollSnapType = 'none'; });
  await page.mouse.wheel({ deltaY: 300 });
  await sleep(100);
  console.log('关闭 snap 后 scrollLeft:', await page.evaluate(() => Math.round(window.__track.scrollLeft)));

  await browser.close();
})().catch((e) => { console.error('诊断失败:', e.message); process.exit(1); });
