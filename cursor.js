/* ============================================================
   cursor.js — Custom Cursor with Trail
   Sreeram I | Developer Portfolio
   ============================================================ */

(function initCustomCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursor-trail');
  if (!cursor || !trail) return;

  let cx = 0, cy = 0; // cursor actual position
  let tx = 0, ty = 0; // trail lagging position

  // Update cursor dot instantly
  document.addEventListener('mousemove', e => {
    cx = e.clientX;
    cy = e.clientY;
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
  });

  // Animate trail with easing
  (function animateTrail() {
    tx += (cx - tx) * 0.15;
    ty += (cy - ty) * 0.15;
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';
    requestAnimationFrame(animateTrail);
  })();
})();
