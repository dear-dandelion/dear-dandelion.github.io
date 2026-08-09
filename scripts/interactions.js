/* ============================================================
 * interactions.js — 站内交互(来源:DESIGN.md §5.3,修订)
 *  视频:自动静音循环播放;加载失败兜底
 * ============================================================ */
(() => {
  const card = document.querySelector('.video-card');
  if (!card) return;

  const video = card.querySelector('video');

  /* 自动播放被浏览器拦截(如数据节省模式)时,controls 兜底可手动播放 */
  video.addEventListener('canplay', () => {
    video.play().catch(() => {});
  });

  /* 素材加载失败兜底 */
  video.addEventListener(
    'error',
    () => card.classList.add('has-error'),
    true
  );
})();
