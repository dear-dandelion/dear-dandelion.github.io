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

  /* ---- 1. 滚轮 → 水平滚动 ---- */
  let pending = 0;
  let rafId = null;

  function applyScroll() {
    rafId = null;
    if (pending !== 0) {
      track.scrollLeft += pending;
      pending = 0;
    }
  }
  function scheduleScroll() {
    if (rafId === null) rafId = requestAnimationFrame(applyScroll);
  }

  track.addEventListener(
    'wheel',
    (e) => {
      if (isMobile()) return; // 移动端为竖向文档流
      e.preventDefault();
      // deltaMode 归一化:像素=1、行=×16、页=×视口高
      const delta =
        e.deltaMode === 1 ? e.deltaY * 16
        : e.deltaMode === 2 ? e.deltaY * track.clientHeight
        : e.deltaY;
      pending += Math.abs(e.deltaX) > Math.abs(delta) ? e.deltaX : delta;
      scheduleScroll();
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
