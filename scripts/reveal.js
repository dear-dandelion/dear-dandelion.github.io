/* ============================================================
 * reveal.js — 滚动入场(来源:DESIGN.md §5.2,进入视口 20% 触发)
 * ============================================================ */
(() => {
  const els = Array.from(document.querySelectorAll('.reveal'));
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
  );
  els.forEach((el) => io.observe(el));
})();
