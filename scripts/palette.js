(function () {
  function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const k = (n) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => {
      const c = l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
      return Math.round(255 * c).toString(16).padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }
  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const hexToRgb = (hex) => [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];

  const hue = Math.floor(rand(0, 360));
  const isDark = Math.random() < 0.55;

  let bg, cell, textOnCard;
  if (isDark) {
    bg = hslToHex(hue, rand(15, 32), rand(7, 14));
    cell = hslToHex(
      (hue + rand(-15, 15) + 360) % 360,
      rand(8, 20),
      rand(88, 96)
    );
    textOnCard = hslToHex(hue, rand(15, 32), rand(7, 14));
  } else {
    bg = hslToHex(hue, rand(15, 35), rand(90, 96));
    cell = hslToHex(
      (hue + rand(-15, 15) + 360) % 360,
      rand(25, 55),
      rand(12, 22)
    );
    textOnCard = hslToHex(hue, rand(15, 35), rand(90, 96));
  }

  const accentHue = (hue + pick([150, 180, 210, -30, 30]) + 360) % 360;
  const accent = hslToHex(accentHue, rand(55, 80), rand(50, 65));

  const [tr, tg, tb] = hexToRgb(textOnCard);
  const [cr, cg, cb] = hexToRgb(cell);

  const root = document.documentElement;
  root.style.setProperty("--bg", bg);
  root.style.setProperty("--cell", cell);
  root.style.setProperty("--accent", accent);
  root.style.setProperty("--text-on-card", textOnCard);
  root.style.setProperty(
    "--text-on-card-muted",
    `rgba(${tr}, ${tg}, ${tb}, 0.65)`
  );

  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) themeMeta.setAttribute("content", bg);

  window.GOL_ALIVE = cell;
  window.GOL_DEAD = bg;
  window.GOL_STROKE = [cr, cg, cb, 28];
})();
