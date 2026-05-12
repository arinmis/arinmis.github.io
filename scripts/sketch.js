(function () {
  const FPS = 14;
  const FRAME_INTERVAL = 1000 / FPS;
  const CELL = 9;
  const INITIAL_FILL = 0.10;

  const reducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ALIVE = window.GOL_ALIVE || "#e8e1e0";
  const DEAD = window.GOL_DEAD || "#191312";
  const s = window.GOL_STROKE || [232, 225, 224, 28];
  const STROKE = `rgba(${s[0]},${s[1]},${s[2]},${s[3] / 255})`;

  const game = document.getElementById("game");
  const canvas = document.createElement("canvas");
  canvas.style.display = "block";
  game.appendChild(canvas);
  const ctx = canvas.getContext("2d", { alpha: false });

  let cols = 0, rows = 0;
  let cells = null, scratch = null;
  let running = true;
  let lastTick = 0;
  let rafId = 0;

  function init() {
    const w = Math.floor(window.innerWidth / CELL) * CELL;
    const h = Math.floor(window.innerHeight / CELL) * CELL;
    canvas.width = w;
    canvas.height = h;
    cols = w / CELL;
    rows = h / CELL;
    cells = new Uint8Array(cols * rows);
    scratch = new Uint8Array(cols * rows);
    for (let i = 0; i < cells.length; i++) {
      if (Math.random() < INITIAL_FILL) cells[i] = 1;
    }
    render();
  }

  function step() {
    const c = cells;
    const n = scratch;
    for (let y = 0; y < rows; y++) {
      const ym = ((y - 1 + rows) % rows) * cols;
      const yc = y * cols;
      const yp = ((y + 1) % rows) * cols;
      for (let x = 0; x < cols; x++) {
        const xm = (x - 1 + cols) % cols;
        const xp = (x + 1) % cols;
        const count =
          c[ym + xm] + c[ym + x] + c[ym + xp] +
          c[yc + xm] + c[yc + xp] +
          c[yp + xm] + c[yp + x] + c[yp + xp];
        const alive = c[yc + x];
        n[yc + x] = alive ? (count === 2 || count === 3 ? 1 : 0) : (count === 3 ? 1 : 0);
      }
    }
    cells = n;
    scratch = c;
  }

  function render() {
    ctx.fillStyle = DEAD;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = ALIVE;
    for (let y = 0; y < rows; y++) {
      const yc = y * cols;
      const py = y * CELL;
      for (let x = 0; x < cols; x++) {
        if (cells[yc + x]) ctx.fillRect(x * CELL, py, CELL, CELL);
      }
    }
    ctx.strokeStyle = STROKE;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= cols; x++) {
      const px = x * CELL + 0.5;
      ctx.moveTo(px, 0);
      ctx.lineTo(px, canvas.height);
    }
    for (let y = 0; y <= rows; y++) {
      const py = y * CELL + 0.5;
      ctx.moveTo(0, py);
      ctx.lineTo(canvas.width, py);
    }
    ctx.stroke();
  }

  function frame(t) {
    if (!running) return;
    if (t - lastTick >= FRAME_INTERVAL) {
      step();
      render();
      lastTick = t;
    }
    rafId = requestAnimationFrame(frame);
  }

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const w = Math.floor(window.innerWidth / CELL) * CELL;
      const h = Math.floor(window.innerHeight / CELL) * CELL;
      if (w !== canvas.width || h !== canvas.height) init();
    }, 250);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    } else if (!reducedMotion) {
      running = true;
      lastTick = 0;
      rafId = requestAnimationFrame(frame);
    }
  });

  init();
  if (!reducedMotion) {
    rafId = requestAnimationFrame(frame);
  } else {
    running = false;
  }
})();
