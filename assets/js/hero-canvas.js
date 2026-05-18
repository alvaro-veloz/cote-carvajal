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

  for (let i = 0; i < 180; i++) {
    particles.push({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003,
      vy: (Math.random() - 0.5) * 0.0003 - 0.0001,
      size: Math.random() * 3 + 0.5,
      opacity: Math.random() * 0.6 + 0.1,
      hue: Math.random() > 0.7 ? 'amber' : 'green',
      life: Math.random(),
      lifeSpeed: (Math.random() * 0.002 + 0.001) * (Math.random() > 0.5 ? 1 : -1),
    });
  }

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

    ctx.save();
    ctx.globalAlpha = isDark ? 0.18 : 0.12;
    drawRoots(ctx, cx, cy + 50, 8, Math.PI / 2, 5);
    ctx.restore();

    const t = Date.now() / 1000;
    particles.forEach((p) => {
      p.x += p.vx + Math.sin(t * 0.3 + p.y * 10) * 0.00005;
      p.y += p.vy;
      p.life += p.lifeSpeed;
      p.x += (px / W - p.x) * 0.0008;
      p.y += (py / H - p.y) * 0.0008;
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

    ctx.save();
    ctx.globalAlpha = isDark ? 0.05 : 0.04;
    ctx.strokeStyle = isDark ? '#7ab880' : '#2d5c32';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + t * 0.05;
      const r = 160 + Math.sin(t * 0.2 + i) * 30;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.stroke();
    }
    ctx.restore();

    requestAnimationFrame(draw);
  }

  function drawRoots(ctx, x, y, depth, angle, spread) {
    if (depth <= 0) return;
    const len = (20 + depth * 18) * (1 + Math.sin(Date.now() * 0.001 + depth) * 0.05);
    const ex = x + Math.cos(angle) * len;
    const ey = y + Math.sin(angle) * len;
    ctx.strokeStyle = '#4a8c50';
    ctx.lineWidth = depth * 0.8;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(
      x + Math.cos(angle + 0.3) * len * 0.5,
      y + Math.sin(angle + 0.3) * len * 0.5,
      ex,
      ey
    );
    ctx.stroke();
    if (depth > 1) {
      drawRoots(ctx, ex, ey, depth - 1, angle - spread / 2 + Math.random() * spread * 0.3, spread * 0.85);
      drawRoots(ctx, ex, ey, depth - 1, angle + spread / 2 - Math.random() * spread * 0.3, spread * 0.85);
    }
  }

  draw();
})();
