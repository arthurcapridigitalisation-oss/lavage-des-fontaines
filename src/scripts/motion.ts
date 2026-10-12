import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Accès console en développement uniquement (débogage des animations)
if (import.meta.env.DEV) Object.assign(window, { gsap, ScrollTrigger });

const motionOK = document.documentElement.classList.contains('js-motion');

if (motionOK) {
  // Apparition au scroll : éléments seuls et groupes en cascade
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 88%',
    once: true,
    onEnter: (els) =>
      gsap.to(els, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  });

  // Compteurs (4,8 ★, 530 avis…)
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count!);
    const decimals = Number(el.dataset.decimals ?? 0);
    const obj = { v: 0 };
    const fmt = (v: number) => v.toFixed(decimals).replace('.', ',');
    el.textContent = fmt(0);
    gsap.to(obj, {
      v: target,
      duration: 1.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => (el.textContent = fmt(obj.v)),
    });
  });

  // Bandeaux défilants : boucle continue, accélérée par la vitesse de scroll
  document.querySelectorAll<HTMLElement>('[data-marquee]').forEach((band) => {
    const track = band.querySelector<HTMLElement>('.stripe-band__track')!;
    const loop = gsap.to(track, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
    ScrollTrigger.create({
      trigger: band,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 5);
        gsap.killTweensOf(loop);
        gsap.timeline()
          .to(loop, { timeScale: boost, duration: 0.2 })
          .to(loop, { timeScale: 1, duration: 1.2 });
      },
    });
  });

  // Léger parallaxe sur les photos
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const amount = Number(el.dataset.parallax || 10);
    gsap.fromTo(
      el,
      { yPercent: -amount / 2 },
      {
        yPercent: amount / 2,
        ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });

  // Bandes diagonales qui glissent avec le scroll
  document.querySelectorAll<HTMLElement>('.stripes').forEach((el) => {
    gsap.fromTo(
      el,
      { backgroundPositionX: 0 },
      {
        backgroundPositionX: 260,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  });
}

// Statut d'ouverture en direct (uniquement si les horaires sont connus)
document.querySelectorAll<HTMLElement>('[data-open-status]').forEach((el) => {
  const open = el.dataset.open;
  const close = el.dataset.close;
  if (!open || !close) return;
  const toMin = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const now = new Date();
  const cur = now.getHours() * 60 + now.getMinutes();
  const isOpen = cur >= toMin(open) && cur < toMin(close);
  el.classList.add(isOpen ? 'is-open' : 'is-closed');
  const label = el.querySelector('[data-open-label]');
  const allDay = open === '00:00' && close === '24:00';
  if (label && !allDay) label.textContent = isOpen ? 'Ouvert maintenant' : 'Fermé actuellement';
});
