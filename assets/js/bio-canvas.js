(function () {
  const canvas = document.getElementById('bio-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W = 360;
  const H = 432;
  const pts = [];

  for (let i = 0; i < 55; i++) {
    pts.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25 - 0.1,
      a: Math.random() * 0.5 + 0.1,
      life: Math.random() * Math.PI * 2,
    });
  }

  function drawBio() {
    ctx.clearRect(0, 0, W, H);
    const isDark = document.body.getAttribute('data-theme') !== 'light';
    ctx.fillStyle = isDark ? '#0e130e' : '#e3ece3';
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalAlpha = isDark ? 0.04 : 0.05;
    ctx.strokeStyle = '#1d8a58';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= W; x += 28) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y <= H; y += 28) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    ctx.restore();

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 75) {
          ctx.save();
          ctx.globalAlpha = (isDark ? 0.1 : 0.07) * (1 - d / 75);
          ctx.strokeStyle = isDark ? '#1d8a58' : '#0c5c32';
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }

    pts.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life += 0.018;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      const pulse = 0.4 + Math.sin(p.life) * 0.3;
      ctx.save();
      ctx.globalAlpha = p.a * pulse;
      ctx.fillStyle = isDark ? '#29b876' : '#0c5c32';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    const t = Date.now() / 1500;
    const gx = W / 2 + Math.sin(t * 0.4) * 25;
    const gy = H / 2 + Math.cos(t * 0.3) * 18;
    const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, W * 0.42);
    g.addColorStop(0, isDark ? 'rgba(29,138,88,0.06)' : 'rgba(13,92,54,0.05)');
    g.addColorStop(1, 'transparent');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    requestAnimationFrame(drawBio);
  }

  drawBio();
})();
