import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Rouleau de brosse de portique, vu de côté, qui descend au scroll.
// Chaque poil est un brin placé autour de l'axe : on le projette à l'écran selon son angle,
// ce qui donne une vraie rotation. Les poils de derrière sont plus sombres que ceux de devant.

type Shades = [string, string, string, string]; // du plus sombre (arrière) au plus clair (avant)

// Couleurs du logo
const PALETTE: Shades[] = [
  ['#5a1c00', '#a83600', '#e44800', '#ff7a33'], // 0 orange (dominant)
  ['#4a0c00', '#8f1a00', '#d82400', '#ff4a26'], // 1 rouge
  ['#0b0b0b', '#161616', '#262626', '#454545'], // 2 anthracite
  ['#5e5e5e', '#a3a3a3', '#e4e4e4', '#ffffff'], // 3 blanc
];

// Motif des bandes de couleur le long du rouleau (couleur, largeur en px), répété
const BANDS: [number, number][] = [
  [0, 110], [1, 30], [0, 56], [3, 26], [0, 120], [2, 28], [0, 70], [1, 22], [3, 18], [0, 90], [2, 20], [1, 26],
];
const BANDS_W = BANDS.reduce((n, b) => n + b[1], 0);

const bandColorAt = (x: number) => {
  let m = ((x % BANDS_W) + BANDS_W) % BANDS_W;
  for (const [c, w] of BANDS) {
    if (m < w) return c;
    m -= w;
  }
  return 0;
};

interface Bubble {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  life: number;
  age: number;
  wobble: number;
}

export function initBrush() {
  const root = document.querySelector<HTMLElement>('[data-foam]');
  if (!root || !document.documentElement.classList.contains('js-motion')) return;

  const sticky = root.querySelector<HTMLElement>('.foam__sticky')!;
  const canvas = root.querySelector<HTMLCanvasElement>('[data-foam-canvas]')!;
  const clean = root.querySelector<HTMLElement>('[data-foam-clean]')!;
  const sheen = root.querySelector<HTMLElement>('[data-foam-sheen]')!;
  const ctx = canvas.getContext('2d')!;

  let W = 0;
  let H = 0;
  let dpr = 1;
  let R = 120; // longueur des poils
  let core = 14; // rayon du noyau
  let foamH = 160;

  // Brins pré-calculés (tableaux typés pour la perf)
  let n = 0;
  let sx = new Float32Array(0);
  let sPhase = new Float32Array(0);
  let sLen = new Float32Array(0);
  let sSway = new Float32Array(0);
  let sColor = new Uint8Array(0);

  let foamTex: HTMLCanvasElement | null = null;
  const bubbleSprite = makeBubbleSprite();
  const bubbles: Bubble[] = [];

  const state = { p: 0 };
  let rot = 0;
  let lastY = -9999;
  let visible = false;
  let spawnAcc = 0;

  function setup() {
    dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.5 : 2);
    W = sticky.clientWidth;
    H = sticky.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);

    R = Math.max(70, Math.min(150, H * 0.15));
    core = R * 0.07;
    foamH = R * 1.5;

    // Brins : une colonne tous les ~2,4 px, plusieurs brins par colonne répartis autour de l'axe
    const spacing = W < 700 ? 3 : 2.4;
    const perCol = W < 700 ? 12 : 15;
    const cols = Math.ceil((W + 40) / spacing);
    n = cols * perCol;
    sx = new Float32Array(n);
    sPhase = new Float32Array(n);
    sLen = new Float32Array(n);
    sSway = new Float32Array(n);
    sColor = new Uint8Array(n);
    let k = 0;
    for (let c = 0; c < cols; c++) {
      for (let j = 0; j < perCol; j++) {
        const x = -20 + c * spacing + (Math.random() - 0.5) * spacing * 1.6;
        sx[k] = x;
        sPhase[k] = (j / perCol) * Math.PI * 2 + Math.random() * 0.6;
        sLen[k] = R * (0.7 + Math.random() * 0.38);
        // Écartement des pointes : les poils s'ouvrent en éventail
        sSway[k] = (Math.random() - 0.5) * R * 0.5;
        // Bords des bandes mélangés, comme sur une vraie brosse
        sColor[k] = bandColorAt(x + (Math.random() - 0.5) * 14);
        k++;
      }
    }

    foamTex = makeFoamTexture(W, foamH, dpr);
  }

  // Mousse dense : des milliers de petites bulles serrées, avec des creux plus sombres entre elles
  function makeFoamTexture(w: number, h: number, scale: number) {
    const c = document.createElement('canvas');
    c.width = Math.round(w * scale);
    c.height = Math.round(h * scale);
    const g = c.getContext('2d')!;
    g.scale(scale, scale);

    // Silhouette irrégulière : bord haut ondulé, bord bas avec coulures
    const step = 6;
    const topEdge: number[] = [];
    const botEdge: number[] = [];
    let t = Math.random() * 100;
    for (let x = 0; x <= w + step; x += step) {
      t += 0.09;
      const wave = Math.sin(t) * 0.5 + Math.sin(t * 2.7 + 1.3) * 0.3 + Math.sin(t * 0.37) * 0.2;
      topEdge.push(h * (0.08 + 0.06 * wave));
      const drip = Math.random() < 0.035 ? h * (0.15 + Math.random() * 0.2) : 0;
      botEdge.push(h * (0.62 + 0.12 * wave) + drip);
    }
    // Lissage du bord bas pour des coulures arrondies
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 1; i < botEdge.length - 1; i++) {
        botEdge[i] = (botEdge[i - 1] + botEdge[i] * 2 + botEdge[i + 1]) / 4;
      }
    }

    const inside = (x: number, y: number) => {
      const i = Math.max(0, Math.min(topEdge.length - 1, Math.round(x / step)));
      return y > topEdge[i] && y < botEdge[i];
    };

    const list: [number, number, number][] = [];
    const count = Math.round((w * h) / 8);
    for (let i = 0; i < count; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      if (!inside(x, y)) continue;
      // Beaucoup de petites bulles, quelques grosses
      const r = 1.3 + Math.pow(Math.random(), 2.6) * 9;
      list.push([x, y, r]);
    }

    // Passe 1 : creux et ombres entre les bulles
    g.fillStyle = 'rgba(160, 35, 105, 0.5)';
    for (const [x, y, r] of list) {
      g.beginPath();
      g.arc(x, y + r * 0.25, r * 1.08, 0, Math.PI * 2);
      g.fill();
    }

    // Passe 2 : les bulles, teinte rose de la mousse colorée, plus blanches vers le haut
    for (const [x, y, r] of list) {
      const lift = 1 - y / h;
      const grad = g.createRadialGradient(x - r * 0.35, y - r * 0.4, r * 0.1, x, y, r);
      grad.addColorStop(0, `rgba(255, ${246 + lift * 8}, ${250 + lift * 5}, 0.97)`);
      grad.addColorStop(0.6, `rgba(255, ${178 + lift * 50}, ${215 + lift * 25}, 0.92)`);
      grad.addColorStop(1, 'rgba(222, 92, 160, 0.95)');
      g.fillStyle = grad;
      g.beginPath();
      g.arc(x, y, r, 0, Math.PI * 2);
      g.fill();

      if (r > 2.2) {
        g.fillStyle = 'rgba(255, 255, 255, 0.9)';
        g.beginPath();
        g.arc(x - r * 0.38, y - r * 0.42, Math.max(0.6, r * 0.18), 0, Math.PI * 2);
        g.fill();
      }
    }
    return c;
  }

  function spawnBubble(yc: number) {
    if (bubbles.length > (W < 700 ? 28 : 60)) return;
    const big = Math.random() < 0.25;
    bubbles.push({
      x: Math.random() * W,
      y: yc - R * (0.6 + Math.random() * 0.5),
      r: big ? 14 + Math.random() * 24 : 4 + Math.random() * 10,
      vx: (Math.random() - 0.5) * 30,
      vy: -(25 + Math.random() * 55),
      life: 2.5 + Math.random() * 3,
      age: 0,
      wobble: Math.random() * Math.PI * 2,
    });
  }

  // Départ : brosse ET mousse entièrement au-dessus de l'écran. Arrivée : poils du haut sortis par le bas.
  const brushY = () => {
    const start = -(R * 0.5 + foamH + 40);
    const end = H + R * 1.3;
    return start + state.p * (end - start);
  };

  function draw(_time: number, deltaMs: number) {
    const dt = Math.min(deltaMs, 50) / 1000;
    const yc = brushY();

    // La brosse tourne en continu, plus vite quand on fait défiler
    const scrollSpeed = Math.abs(yc - lastY) / Math.max(dt, 0.001);
    lastY = yc;
    rot += dt * (6 + Math.min(scrollSpeed / 60, 10));

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // Voiture révélée au-dessus de l'axe du rouleau
    const revealed = Math.max(0, Math.min(H, yc));
    clean.style.clipPath = `inset(0 0 ${H - revealed}px 0)`;

    const onScreen = yc > -R * 1.5 && yc < H + R + foamH;
    if (onScreen) {
      // Mousse poussée devant le rouleau
      if (foamTex) ctx.drawImage(foamTex, 0, yc + R * 0.5, W, foamH);

      // Ombre portée du rouleau sur la carrosserie
      const sh = ctx.createLinearGradient(0, yc - R * 1.3, 0, yc + R * 1.3);
      sh.addColorStop(0, 'rgba(0,0,0,0)');
      sh.addColorStop(0.5, 'rgba(0,0,0,0.35)');
      sh.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = sh;
      ctx.fillRect(0, yc - R * 1.3, W, R * 2.6);

      drawBristles(yc, false);
      drawCore(yc);
      drawBristles(yc, true);

      // Environ 10 bulles par seconde, davantage quand la brosse avance vite
      spawnAcc += dt * (10 + Math.min(scrollSpeed / 30, 30));
      while (spawnAcc >= 1) {
        spawnBubble(yc);
        spawnAcc -= 1;
      }
    }

    // Bulles de savon qui s'envolent
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      b.age += dt;
      if (b.age > b.life || b.y < -60) {
        bubbles.splice(i, 1);
        continue;
      }
      b.wobble += dt * 2.2;
      b.x += (b.vx + Math.sin(b.wobble) * 12) * dt;
      b.y += b.vy * dt;
      b.vy *= 0.995;
      const fadeIn = Math.min(1, b.age / 0.3);
      const fadeOut = Math.min(1, (b.life - b.age) / 0.6);
      ctx.globalAlpha = fadeIn * fadeOut;
      // Légère déformation : une bulle n'est jamais parfaitement ronde
      const squash = 1 + Math.sin(b.wobble * 1.7) * 0.04;
      ctx.drawImage(bubbleSprite, b.x - b.r * squash, b.y - b.r / squash, b.r * 2 * squash, (b.r * 2) / squash);
    }
    ctx.globalAlpha = 1;
  }

  function drawCore(yc: number) {
    const g = ctx.createLinearGradient(0, yc - core, 0, yc + core);
    g.addColorStop(0, '#111');
    g.addColorStop(0.45, '#3a3a3a');
    g.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = g;
    ctx.fillRect(0, yc - core, W, core * 2);
  }

  // Dessine les brins de l'arrière (front=false) ou de l'avant (front=true),
  // regroupés par couleur et par teinte pour limiter les appels de dessin
  function drawBristles(yc: number, front: boolean) {
    const paths: Path2D[] = [];
    for (let i = 0; i < 16; i++) paths.push(new Path2D());
    const lag = 0.32; // les pointes traînent derrière la rotation

    for (let k = 0; k < n; k++) {
      const a = sPhase[k] + rot;
      const cz = Math.cos(a);
      if (front ? cz < 0 : cz >= 0) continue;

      const shade = cz > 0.55 ? 3 : cz > 0 ? 2 : cz > -0.55 ? 1 : 0;
      const L = sLen[k];
      const x = sx[k];
      const s = Math.abs(Math.sin(a));
      const sway = sSway[k] * (0.35 + 0.65 * s) + Math.sin(a * 3 + k) * 2;

      const y0 = yc + core * Math.sin(a);
      const yMid = yc + L * 0.55 * Math.sin(a - lag * 0.4);
      const yTip = yc + L * Math.sin(a - lag);
      const path = paths[sColor[k] * 4 + shade];
      path.moveTo(x, y0);
      path.quadraticCurveTo(x + sway * 0.2, yMid, x + sway, yTip);
    }

    ctx.lineCap = 'round';
    ctx.lineWidth = W < 700 ? 1.3 : 1.4;
    for (let shade = 0; shade < 4; shade++) {
      for (let c = 0; c < 4; c++) {
        ctx.strokeStyle = PALETTE[c][shade];
        ctx.stroke(paths[c * 4 + shade]);
      }
    }
  }

  setup();
  if (import.meta.env.DEV) Object.assign(window, { __brush: { bubbles, state } });

  gsap.to(state, {
    p: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: '85% bottom',
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });

  gsap.to(sheen, {
    xPercent: 100,
    ease: 'power2.inOut',
    scrollTrigger: { trigger: root, start: '82% bottom', end: 'bottom bottom', scrub: 0.6 },
  });

  // On n'anime le canvas que lorsque la section est visible
  const tick = (time: number, delta: number) => draw(time, delta);
  ScrollTrigger.create({
    trigger: root,
    start: 'top bottom',
    end: 'bottom top',
    onToggle: (self) => {
      if (self.isActive && !visible) gsap.ticker.add(tick);
      if (!self.isActive && visible) gsap.ticker.remove(tick);
      visible = self.isActive;
    },
  });

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (sticky.clientWidth !== W || Math.abs(sticky.clientHeight - H) > 120) setup();
    }, 200);
  });

  // Premier rendu pour que l'état initial soit correct
  draw(0, 16);
}

// Bulle de savon : transparente, liseré irisé, reflets blancs
function makeBubbleSprite() {
  const S = 128;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const g = c.getContext('2d')!;
  const m = S / 2;
  const r = S / 2 - 3;

  // Corps quasi transparent, plus dense vers le bord (effet de film)
  const body = g.createRadialGradient(m, m, 0, m, m, r);
  body.addColorStop(0, 'rgba(255,255,255,0.02)');
  body.addColorStop(0.72, 'rgba(255,255,255,0.08)');
  body.addColorStop(0.88, 'rgba(255,255,255,0.22)');
  body.addColorStop(0.97, 'rgba(255,255,255,0.6)');
  body.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = body;
  g.beginPath();
  g.arc(m, m, r, 0, Math.PI * 2);
  g.fill();

  // Liseré irisé (rose, cyan, jaune)
  const iri = g.createLinearGradient(0, 0, S, S);
  iri.addColorStop(0, 'rgba(255,120,200,0.8)');
  iri.addColorStop(0.3, 'rgba(120,220,255,0.7)');
  iri.addColorStop(0.55, 'rgba(255,230,120,0.65)');
  iri.addColorStop(0.8, 'rgba(255,110,170,0.75)');
  iri.addColorStop(1, 'rgba(130,200,255,0.7)');
  g.strokeStyle = iri;
  g.lineWidth = 3.5;
  g.beginPath();
  g.arc(m, m, r - 2, 0, Math.PI * 2);
  g.stroke();

  // Reflet principal (fenêtre) en haut à gauche
  g.save();
  g.translate(m - r * 0.38, m - r * 0.42);
  g.rotate(-0.7);
  const hl = g.createRadialGradient(0, 0, 0, 0, 0, r * 0.3);
  hl.addColorStop(0, 'rgba(255,255,255,0.95)');
  hl.addColorStop(0.5, 'rgba(255,255,255,0.5)');
  hl.addColorStop(1, 'rgba(255,255,255,0)');
  g.scale(1, 0.55);
  g.fillStyle = hl;
  g.beginPath();
  g.arc(0, 0, r * 0.3, 0, Math.PI * 2);
  g.fill();
  g.restore();

  // Reflet secondaire en bas à droite
  g.strokeStyle = 'rgba(255,255,255,0.35)';
  g.lineWidth = 2;
  g.beginPath();
  g.arc(m, m, r * 0.78, 0.15 * Math.PI, 0.4 * Math.PI);
  g.stroke();
  g.fillStyle = 'rgba(255,255,255,0.6)';
  g.beginPath();
  g.arc(m + r * 0.45, m + r * 0.5, r * 0.06, 0, Math.PI * 2);
  g.fill();

  return c;
}
