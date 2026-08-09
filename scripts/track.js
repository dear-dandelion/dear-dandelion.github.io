/* ============================================================
 * track.js — 轨道引擎(来源:DESIGN.md §4.2)
 *  1. 滚轮 deltaY → 水平滚动(rAF 节流合并)
 *  2. 当前站同步:IntersectionObserver → 导航/进度条/hash
 *  3. hash 恢复定位
 * ============================================================ */
(() => {
  const track = document.getElementById('track');
  if (!track) return;

  const stations = Array.from(track.querySelectorAll('.station'));
  const progressBar = document.getElementById('progress-bar');
  const navLinks = Array.from(document.querySelectorAll('.station-nav-link'));
  const navCurrent = document.getElementById('nav-current');

  const isMobile = () => window.matchMedia('(max-width: 767px)').matches;

  /* ---- 1. 滚轮:纵向滚轮 → 逐站翻页;横向触控板 → 原生滑动 ----
   * 说明:scroll-snap mandatory 会把 JS 驱动的 scrollLeft 赋值当帧吸回,
   * 不能用手动平移模拟滚动;改为阈值累加翻页,快慢滚动均确定可达 */
  const STEP_THRESHOLD = 100; // 约一格滚轮
  const reduceMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let pending = 0;
  let locked = false;

  function currentStationIndex() {
    return Math.round(track.scrollLeft / track.clientWidth);
  }

  function stepStation(dir) {
    if (locked) return;
    const target = Math.max(0, Math.min(stations.length - 1, currentStationIndex() + dir));
    if (target === currentStationIndex()) return;
    locked = true;
    track.scrollTo({
      left: target * track.clientWidth,
      behavior: reduceMotion() ? 'auto' : 'smooth',
    });
    const unlock = () => { locked = false; };
    track.addEventListener('scrollend', unlock, { once: true });
    setTimeout(unlock, 800); // scrollend 兜底(旧浏览器)
  }

  track.addEventListener(
    'wheel',
    (e) => {
      if (isMobile()) return; // 移动端为竖向文档流
      const dx = Math.abs(e.deltaX);
      const dy =
        e.deltaMode === 1 ? Math.abs(e.deltaY) * 16
        : e.deltaMode === 2 ? Math.abs(e.deltaY) * track.clientHeight
        : Math.abs(e.deltaY);
      if (dx > dy) return; // 横向触控板:原生滚动 + snap 对齐
      e.preventDefault();
      if (locked) return;
      pending += e.deltaY >= 0 ? dy : -dy;
      if (Math.abs(pending) >= STEP_THRESHOLD) {
        const dir = pending > 0 ? 1 : -1;
        pending = 0;
        stepStation(dir);
      }
    },
    { passive: false }
  );

  /* ---- 2. 进度条 + 当前站同步 ---- */
  function updateProgress() {
    const max = track.scrollWidth - track.clientWidth;
    if (max <= 0) return;
    progressBar.style.width = (track.scrollLeft / max) * 100 + '%';
  }
  track.addEventListener('scroll', updateProgress, { passive: true });

  let currentIndex = 0;
  function setStation(i, { updateHash = true } = {}) {
    currentIndex = i;
    navLinks.forEach((link, j) => {
      const active = j === i;
      link.toggleAttribute('aria-current', active);
      link.style.fontWeight = active ? '700' : '';
    });
    const num = String(i + 1).padStart(2, '0');
    if (navCurrent) {
      navCurrent.innerHTML = `<span class="nav-num">${num}</span>${stations[i].dataset.name}`;
    }
    if (updateHash) history.replaceState(null, '', `#station-${i}`);
    // 暴露给 navigation.js 等模块
    window.__trackCurrent = currentIndex;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setStation(stations.indexOf(entry.target));
      }
    },
    { threshold: 0.5 }
  );
  stations.forEach((s) => io.observe(s));

  /* ---- 3. hash 恢复定位(刷新/分享直达) ---- */
  const m = location.hash.match(/^#station-(\d+)$/);
  if (m) {
    const idx = Math.min(stations.length - 1, parseInt(m[1], 10));
    track.scrollLeft = idx * track.clientWidth;
    setStation(idx, { updateHash: false });
  } else {
    setStation(0, { updateHash: false });
  }
  updateProgress();
})();
