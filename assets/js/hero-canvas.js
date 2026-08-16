(function () {
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  let W;
  let H;
  const particles = [];
  const mouse = { x: 0, y: 0 };

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);
  document.getElementById('hero').addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  /* ---------- esporas ambientales ---------- */
  const PARTICLE_COUNT = window.innerWidth < 768 ? 85 : 130;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const px = Math.random();
    const py = Math.random();
    particles.push({
      x: px,
      y: py,
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003 - 0.0001,
      size: Math.random() * 2.2 + 0.5,
      opacity: Math.random() * 0.5 + 0.08,
      hue: Math.random() > 0.75 ? 'amber' : 'green',
      life: Math.random(),
      lifeSpeed: (Math.random() * 0.0015 + 0.0008) * (Math.random() > 0.5 ? 1 : -1),
    });
  }

  /* ---------- hifas fúngicas: crecimiento en tiempo real ---------- */
  let segments = [];
  let nodes = [];
  let tips = [];
  let pendingTips = [];

  let params = {};

  function deviceParams() {
    const mobile = W < 768;
    return {
      mobile,
      segLenBase: mobile ? 22 : 50,
      segLenGenFactor: mobile ? 1.4 : 2.2,
      maxSegments: mobile ? 190 : 480,
      originCount: mobile ? 16 : 24,
      maxDelay: mobile ? 55 : 110,
      lineWidthBase: mobile ? 2.1 : 1.7,
      lineWidthGenFactor: mobile ? 0.16 : 0.13,
      maxGen: mobile ? 9 : 11,
    };
  }

  function seedTip(x, y, angle, gen, delay) {
    pendingTips.push({
      x,
      y,
      angle,
      gen,
      len: (params.segLenBase - gen * params.segLenGenFactor) * (0.7 + Math.random() * 0.6),
      progress: 0,
      speed: 0.012 + Math.random() * 0.01,
      wob: Math.random() * Math.PI * 2,
      delay: delay || 0,
    });
  }

  function angleToCenter(x, y) {
    return Math.atan2(H / 2 - y, W / 2 - x) + (Math.random() - 0.5) * 0.7;
  }

  function perimeterPoint(frac) {
    const per = 2 * (W + H);
    let d = ((frac % 1) + 1) % 1;
    d *= per;
    let x;
    let y;
    if (d < W) {
      x = d;
      y = -0.025 * H;
    } else if (d < W + H) {
      x = W * 1.025;
      y = d - W;
    } else if (d < 2 * W + H) {
      x = W - (d - (W + H));
      y = H * 1.025;
    } else {
      x = -0.025 * W;
      y = H - (d - (2 * W + H));
    }
    return { x, y };
  }

  function startCycle() {
    segments = [];
    nodes = [];
    tips = [];
    pendingTips = [];
    params = deviceParams();
    const count = params.originCount;
    for (let i = 0; i < count; i++) {
      const frac = (i + Math.random() * 0.5) / count;
      const { x, y } = perimeterPoint(frac);
      const delay = Math.floor(Math.random() * params.maxDelay) + Math.floor((i / count) * 40);
      seedTip(x, y, angleToCenter(x, y), 0, delay);
    }
  }

  function drawSeg(x1, y1, cx, cy, x2, y2, gen, isDark) {
    ctx.save();
    ctx.globalAlpha = (isDark ? 0.5 : 0.32) * Math.max(0.15, 1 - gen * 0.06);
    ctx.strokeStyle = isDark ? '#3fae72' : '#0c5c32';
    ctx.lineWidth = Math.max(0.5, params.lineWidthBase - gen * params.lineWidthGenFactor);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(cx, cy, x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  function growTip(t, isDark) {
    if (t.delay > 0) {
      t.delay--;
      return false;
    }

    t.progress += t.speed;
    const p = Math.min(t.progress, 1);
    const wobble = Math.sin(t.wob + p * 5) * (3 - t.gen * 0.2);
    const qx = t.x + Math.cos(t.angle) * t.len * p * 0.5 + Math.cos(t.angle + Math.PI / 2) * wobble * p * 0.5;
    const qy = t.y + Math.sin(t.angle) * t.len * p * 0.5 + Math.sin(t.angle + Math.PI / 2) * wobble * p * 0.5;
    const ex = t.x + Math.cos(t.angle) * t.len * p + Math.cos(t.angle + Math.PI / 2) * wobble * p;
    const ey = t.y + Math.sin(t.angle) * t.len * p + Math.sin(t.angle + Math.PI / 2) * wobble * p;

    drawSeg(t.x, t.y, qx, qy, ex, ey, t.gen, isDark);

    const cx = W / 2;
    const cy = H / 2;
    const safeRX = Math.min(W * 0.3, 460);
    const safeRY = Math.min(H * 0.26, 260);
    const ndx = ex - cx;
    const ndy = (ey - cy) * (safeRX / safeRY);
    const touchedText = Math.sqrt(ndx * ndx + ndy * ndy) < safeRX;

    if (touchedText) {
      segments.push({ x1: t.x, y1: t.y, cx: qx, cy: qy, x2: ex, y2: ey, gen: t.gen });
      nodes.push({ x: ex, y: ey, phase: Math.random() * Math.PI * 2, gen: t.gen });
      return true;
    }

    if (p >= 1) {
      segments.push({ x1: t.x, y1: t.y, cx: qx, cy: qy, x2: ex, y2: ey, gen: t.gen });
      const canBranch = segments.length < params.maxSegments && t.gen < params.maxGen;
      const branchChance = Math.max(0.15, 0.82 - t.gen * 0.09);
      if (canBranch && Math.random() < branchChance) {
        const spread = 0.5 + Math.random() * 0.4;
        const homeAngle = angleToCenter(ex, ey);
        const baseAngle = t.angle * 0.35 + homeAngle * 0.65;
        seedTip(ex, ey, baseAngle - spread / 2 + Math.random() * 0.2, t.gen + 1);
        if (Math.random() > 0.25) {
          seedTip(ex, ey, baseAngle + spread / 2 - Math.random() * 0.2, t.gen + 1);
        }
      } else {
        nodes.push({ x: ex, y: ey, phase: Math.random() * Math.PI * 2, gen: t.gen });
      }
      return true;
    }
    return false;
  }

  function stepHyphae(isDark, t) {
    segments.forEach((s) => drawSeg(s.x1, s.y1, s.cx, s.cy, s.x2, s.y2, s.gen, isDark));

    nodes.forEach((n) => {
      const pulse = 0.5 + Math.sin(t * 2 + n.phase) * 0.4;
      ctx.save();
      ctx.globalAlpha = (isDark ? 0.55 : 0.35) * pulse * Math.max(0.2, 1 - n.gen * 0.07);
      ctx.fillStyle = isDark ? '#e0b25a' : '#7a4a08';
      ctx.beginPath();
      ctx.arc(n.x, n.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    const survivors = [];
    tips.forEach((tip) => {
      const finished = growTip(tip, isDark);
      if (!finished) survivors.push(tip);
    });
    tips = survivors.concat(pendingTips);
    pendingTips = [];
  }

  startCycle();

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const isDark = document.body.getAttribute('data-theme') !== 'light';
    if (isDark) {
      const bg = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.8);
      bg.addColorStop(0, '#0d1f0f');
      bg.addColorStop(0.5, '#111008');
      bg.addColorStop(1, '#0a0804');
      ctx.fillStyle = bg;
    } else {
      const bg = ctx.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.8);
      bg.addColorStop(0, '#e8f5ea');
      bg.addColorStop(0.5, '#f0ead8');
      bg.addColorStop(1, '#e8e0cc');
      ctx.fillStyle = bg;
    }
    ctx.fillRect(0, 0, W, H);

    const px = mouse.x || W / 2;
    const py = mouse.y || H / 2;
    const glow = ctx.createRadialGradient(px, py, 0, px, py, 250);
    glow.addColorStop(0, isDark ? 'rgba(74,140,80,0.12)' : 'rgba(45,92,50,0.08)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    const cx = W / 2;
    const cy = H / 2;
    const sg = ctx.createRadialGradient(cx, cy, 0, cx, cy, 300);
    sg.addColorStop(0, isDark ? 'rgba(122,184,128,0.08)' : 'rgba(45,92,50,0.06)');
    sg.addColorStop(1, 'transparent');
    ctx.fillStyle = sg;
    ctx.fillRect(0, 0, W, H);

    const t = Date.now() / 1000;

    stepHyphae(isDark, t);

    particles.forEach((p) => {
      p.x += p.vx + Math.sin(t * 0.3 + p.y * 10) * 0.00005;
      p.y += p.vy;
      p.life += p.lifeSpeed;
      p.x += (px / W - p.x) * 0.0006;
      p.y += (py / H - p.y) * 0.0006;
      if (p.x < -0.05) p.x = 1.05;
      if (p.x > 1.05) p.x = -0.05;
      if (p.y < -0.05) p.y = 1.05;
      if (p.y > 1.05) p.y = -0.05;
      if (p.life <= 0 || p.life >= 1) p.lifeSpeed *= -1;
      const a = p.opacity * Math.sin(p.life * Math.PI) * 0.8;
      ctx.fillStyle = isDark
        ? p.hue === 'amber'
          ? `rgba(196,133,26,${a})`
          : `rgba(122,184,128,${a})`
        : p.hue === 'amber'
          ? `rgba(100,64,0,${a})`
          : `rgba(30,80,35,${a})`;
      ctx.beginPath();
      ctx.arc(p.x * W, p.y * H, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  draw();
})();
