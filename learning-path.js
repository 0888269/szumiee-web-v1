// Independent year panels: native buttons support Enter and Space.
(() => {
  const buttons = [...document.querySelectorAll('.learning-path .path-toggle')];
  const stage = document.querySelector('.learning-path .nums-stage');
  const track = stage?.querySelector('.nums-track');
  if (!track) return;
  let selected = null, raf = 0, until = 0, previous = 0;
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('reduce-motion');
  // content.js retains ownership of --tx (the scroll timeline). The disclosure
  // temporarily overrides only the rendered translation, never page scrolling.
  const centerFrame = (now) => {
    raf = 0;
    const current = new DOMMatrixReadOnly(getComputedStyle(track).transform).m41;
    const s = stage.getBoundingClientRect();
    const b = selected?.getBoundingClientRect();
    const target = b ? current + s.left + s.width / 2 - b.left - b.width / 2
      : parseFloat(track.style.getPropertyValue('--tx')) || 0;
    const dt = Math.min(64, now - (previous || now - 16));
    previous = now;
    const next = reduced() ? target : current + (target - current) * (1 - Math.exp(-dt / 80));
    track.style.setProperty('--path-tx', `${Math.abs(target - next) < .05 ? target : next}px`);
    if (!reduced() && (now < until || Math.abs(target - next) > .05)) raf = requestAnimationFrame(centerFrame);
    else if (!selected) track.style.removeProperty('--path-tx');
  };
  const center = () => {
    if (!selected && !track.style.getPropertyValue('--path-tx')) return;
    until = performance.now() + 550;
    if (!raf) { previous = 0; raf = requestAnimationFrame(centerFrame); }
  };
  new ResizeObserver(center).observe(track);
  addEventListener('resize', center);
  addEventListener('scroll', center, { passive: true });
  buttons.forEach((button, index) => {
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    // Keep each disclosure in the original flex scroller, directly after its year.
    const offset = index % 2 ? '-9vh' : '9vh';
    button.style.setProperty('--year-offset', offset);
    panel.style.setProperty('--year-offset', offset);
    button.after(panel);
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      selected = open ? button : null;
      center();
      buttons.forEach((other) => {
        const target = document.getElementById(other.getAttribute('aria-controls'));
        const active = other === button && open;
        other.setAttribute('aria-expanded', String(active));
        target.setAttribute('aria-hidden', String(!active));
        target.inert = !active;
        target.classList.toggle('open', active);
      });
    });
    button.addEventListener('keydown', (event) => {
      let next;
      if (event.key === 'ArrowDown') next = (index + 1) % buttons.length;
      if (event.key === 'ArrowUp') next = (index + buttons.length - 1) % buttons.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;
      if (next !== undefined) { event.preventDefault(); buttons[next].focus(); }
    });
  });
  document.querySelector('.learning-path .path-panels')?.remove();
})();
