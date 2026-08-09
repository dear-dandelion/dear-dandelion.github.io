/* 滚轮实测:真实 Edge 无头驱动,区分「连续滚动」与「慢速离散滚动」两种真实场景 */
const puppeteer = require('puppeteer-core');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function scrollState(page) {
  return page.evaluate(() => ({
    left: Math.round(document.getElementById('track').scrollLeft),
    cur: window.__trackCurrent,
    hash: location.hash,
  }));
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  page.on('pageerror', (e) => console.log('[页面JS错误]', e.message));
  page.on('console', (m) => { if (m.type() === 'error') console.log('[console.error]', m.text()); });

  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle0' });
  await page.mouse.move(720, 450);
  await sleep(600);
  console.log('初始:', JSON.stringify(await scrollState(page)));

  /* 场景A:连续快速滚动(模拟正常滚轮)—— 30 次 × 100px,16ms 间隔 */
  console.log('--- 场景A:连续滚动(30×100px @16ms)---');
  for (let i = 0; i < 30; i++) {
    await page.mouse.wheel({ deltaY: 100 });
    await sleep(16);
  }
  await sleep(800); // 等 snap 稳定
  console.log('连续滚动后:', JSON.stringify(await scrollState(page)));

  /* 场景B:慢速离散滚动(模拟缓慢一格一格滚)—— 8 次 × 300px,600ms 间隔 */
  console.log('--- 场景B:慢速离散滚动(8×300px @600ms)---');
  for (let i = 0; i < 8; i++) {
    await page.mouse.wheel({ deltaY: 300 });
    await sleep(600);
    console.log(`  慢滚${i + 1}:`, JSON.stringify(await scrollState(page)));
  }

  await browser.close();
  console.log('== 测试结束 ==');
})().catch((e) => { console.error('测试失败:', e.message); process.exit(1); });
