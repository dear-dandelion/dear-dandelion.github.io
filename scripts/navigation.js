/* ============================================================
 * navigation.js — 站牌/半屏点击/鼠标拖动跳转 + 键盘导航(来源:DESIGN.md §4.2 / §5.7 / §8.5)
 * ============================================================ */
(() => {
  const track = document.getElementById('track');
  if (!track) return;
  const links = Array.from(document.querySelectorAll('.station-nav-link'));
  const stationCount = track.querySelectorAll('.station').length;

  const reduceMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = () => window.matchMedia('(max-width: 767px)').matches;
  const isInteractive = (target) =>
    target.closest('a, button, input, textarea, select, video, [contenteditable]');

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

  /* 桌面半屏点击:左侧上一站,右侧下一站;保留站内交互元素的原始行为 */
  track.addEventListener('click', (e) => {
    if (suppressClick || isMobile()) {
      suppressClick = false;
      return;
    }
    if (isInteractive(e.target)) return;

    const current = Math.round(track.scrollLeft / track.clientWidth);
    go(current + (e.clientX < window.innerWidth / 2 ? -1 : 1));
  });

  /* 桌面鼠标拖动:连续移动轨道,松手后由 scroll-snap 吸附到最近站 */
  let activePointerId = null;
  let startX = 0;
  let startScrollLeft = 0;
  let hasDragged = false;
  let suppressClick = false;

  track.addEventListener('pointerdown', (e) => {
    if (isMobile() || e.pointerType !== 'mouse' || e.button !== 0 || isInteractive(e.target)) return;

    activePointerId = e.pointerId;
    startX = e.clientX;
    startScrollLeft = track.scrollLeft;
    hasDragged = false;
    track.setPointerCapture(e.pointerId);
  });

  track.addEventListener('pointermove', (e) => {
    if (e.pointerId !== activePointerId) return;

    const deltaX = e.clientX - startX;
    if (Math.abs(deltaX) > 6) hasDragged = true;
    if (!hasDragged) return;

    e.preventDefault();
    track.classList.add('is-dragging');
    track.scrollLeft = startScrollLeft - deltaX;
  });

  const finishDrag = (e) => {
    if (e.pointerId !== activePointerId) return;

    if (track.hasPointerCapture(e.pointerId)) track.releasePointerCapture(e.pointerId);
    activePointerId = null;
    track.classList.remove('is-dragging');
    if (!hasDragged) return;

    suppressClick = true;
    window.setTimeout(() => { suppressClick = false; }, 0);
  };

  track.addEventListener('pointerup', finishDrag);
  track.addEventListener('pointercancel', finishDrag);

  /* 键盘:←/→、PgUp/PgDn、Home/End(仅桌面轨道态) */
  document.addEventListener('keydown', (e) => {
    if (isMobile()) return;
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
