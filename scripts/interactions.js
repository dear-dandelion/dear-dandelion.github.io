/* ============================================================
 * interactions.js — 站内交互(来源:DESIGN.md §5.3/§5.6,修订)
 *  视频:自动静音循环播放;加载失败兜底
 *  邮箱:点击复制到剪切板(渐进增强:无 JS 回退 mailto)
 * ============================================================ */

/* ---- 邮箱复制 ---- */
(() => {
  const link = document.querySelector('.copy-email');
  if (!link) return;

  link.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = link.getAttribute('href').replace(/^mailto:/, '');
    const originalText = link.textContent;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        /* 降级:非安全上下文(file:// 等)用 execCommand */
        const ta = document.createElement('textarea');
        ta.value = email;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      link.textContent = '已复制';
    } catch {
      link.textContent = '复制失败';
    }
    setTimeout(() => { link.textContent = originalText; }, 2000);
  });
})();
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
