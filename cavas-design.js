(() => {
  const palette = {
    dark: "#0a0e17",
    panel: "#111827",
    blue: "#4285f4",
    blueLight: "#6ea8fe",
    green: "#34a853",
    cyan: "#22d3ee",
    white: "#f8fafc",
    border: "rgba(66, 133, 244, 0.35)",
  };

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawAntigravityLogo(ctx, size) {
    const s = size / 112;
    ctx.save();
    ctx.scale(s, s);
    ctx.clearRect(0, 0, 112, 112);

    roundRect(ctx, 8, 8, 96, 96, 22);
    const bg = ctx.createLinearGradient(0, 0, 112, 112);
    bg.addColorStop(0, "#0f172a");
    bg.addColorStop(1, palette.dark);
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.strokeStyle = palette.border;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const cx = 56;
    const cy = 58;

    ctx.strokeStyle = "rgba(66, 133, 244, 0.45)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 4, 30, 14, 0, 0, Math.PI * 2);
    ctx.stroke();

    const orbitGrad = ctx.createLinearGradient(cx - 20, cy - 20, cx + 20, cy + 20);
    orbitGrad.addColorStop(0, palette.cyan);
    orbitGrad.addColorStop(1, palette.blue);
    ctx.strokeStyle = orbitGrad;
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.arc(cx, cy + 4, 22, -Math.PI * 0.15, Math.PI * 0.85);
    ctx.stroke();

    const arrowGrad = ctx.createLinearGradient(cx, cy - 30, cx, cy + 10);
    arrowGrad.addColorStop(0, palette.white);
    arrowGrad.addColorStop(0.5, palette.blueLight);
    arrowGrad.addColorStop(1, palette.green);
    ctx.fillStyle = arrowGrad;
    ctx.beginPath();
    ctx.moveTo(cx, 24);
    ctx.lineTo(cx + 14, 48);
    ctx.lineTo(cx + 5, 48);
    ctx.lineTo(cx + 5, 72);
    ctx.lineTo(cx - 5, 72);
    ctx.lineTo(cx - 5, 48);
    ctx.lineTo(cx - 14, 48);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx + 24, cy - 8, 3, 0, Math.PI * 2);
    ctx.fillStyle = palette.cyan;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx - 26, cy + 12, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = palette.green;
    ctx.fill();

    ctx.restore();
  }

  function scaleCanvas(canvas, logicalW, logicalH) {
    const ratio = window.devicePixelRatio || 1;
    const w = Math.round(logicalW * ratio);
    const h = Math.round(logicalH * ratio);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    return ctx;
  }

  function drawBrand() {
    const canvas = document.getElementById("brand-canvas");
    if (!canvas) return;
    const ctx = scaleCanvas(canvas, 32, 32);
    ctx.clearRect(0, 0, 32, 32);
    drawAntigravityLogo(ctx, 32);
  }

  function drawHeroBg() {
    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = Math.max(rect.width, 400);
    const h = Math.max(rect.height, 400);
    const ctx = scaleCanvas(canvas, w, h);
    ctx.clearRect(0, 0, w, h);

    const spots = [
      { x: w * 0.28, y: h * 0.38, r: w * 0.28, c: "rgba(66, 133, 244, 0.07)" },
      { x: w * 0.72, y: h * 0.5, r: w * 0.22, c: "rgba(52, 168, 83, 0.05)" },
    ];
    spots.forEach(({ x, y, r, c }) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, c);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    });

    for (let i = 0; i < 5; i++) {
      const x = w * (0.12 + i * 0.17);
      const y = h * (0.22 + (i % 3) * 0.22);
      ctx.save();
      ctx.translate(x, y);
      ctx.globalAlpha = 0.1 + (i % 2) * 0.05;
      drawAntigravityLogo(ctx, 40 + (i % 2) * 16);
      ctx.restore();
    }
  }

  function installFavicon() {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    drawAntigravityLogo(ctx, 64);

    let link = document.getElementById("dynamic-favicon");
    if (!link) {
      link = document.querySelector("link[rel='icon']") || document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.id = "dynamic-favicon";
    link.type = "image/png";
    link.href = canvas.toDataURL("image/png");

    const apple = document.querySelector("link[rel='apple-touch-icon']");
    if (apple) apple.href = link.href;
  }

  function init() {
    drawBrand();
    drawHeroBg();
    installFavicon();
  }

  function safeInit() {
    if (document.getElementById("brand-canvas")) {
      init();
    } else {
      requestAnimationFrame(safeInit);
    }
  }

  window.addEventListener("resize", () => {
    drawHeroBg();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", safeInit);
  } else {
    safeInit();
  }
})();
