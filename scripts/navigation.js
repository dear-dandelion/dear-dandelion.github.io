/* ============================================================
 * navigation.js — 站牌点击跳转 + 键盘导航(来源:DESIGN.md §5.7 / §8.5)
 * ============================================================ */
(() => {
  const track = document.getElementById('track');
  if (!track) return;
  const links = Array.from(document.querySelectorAll('.station-nav-link'));
  const stationCount = track.querySelectorAll('.station').length;

  const reduceMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function go(i) {
    const idx = Math.max(0, Math.min(stationCount - 1, i));
    track.scrollTo({
      left: idx * track.clientWidth,
      behavior: reduceMotion() ? 'auto' : 'smooth',
    });
  }

  links.forEach((link, i) =>
    link.addEventListener('click', (e) => {
      e.preventDefault();
      go(i);
    })
  );

  /* 键盘:←/→、PgUp/PgDn、Home/End(仅桌面轨道态) */
  document.addEventListener('keydown', (e) => {
    if (window.matchMedia('(max-width: 767px)').matches) return;
    if (e.target.closest('input, textarea, select, [contenteditable]')) return;

    const cur = window.__trackCurrent || 0;
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
        e.preventDefault(); go(cur + 1); break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault(); go(cur - 1); break;
      case 'Home':
        e.preventDefault(); go(0); break;
      case 'End':
        e.preventDefault(); go(stationCount - 1); break;
    }
  });
})();
