(function () {
  "use strict";
  if (window.__dshUiInjected) return;
  window.__dshUiInjected = true;
  window.__dshLang__ = null;
  window.__dshSkinId__ = null;
  window.__dshWordmarkSvg__ = null;
  window.__dshWhaleSvg__ = null;

  const BRAND_LOGO = `<svg width="16" height="16" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink:0;display:block"><path d="M48.8354 10.0479C48.3232 9.79199 48.1025 10.2798 47.8032 10.5278C47.7007 10.6079 47.6143 10.7119 47.5273 10.8076C46.7793 11.624 45.9048 12.1597 44.7622 12.0957C43.0923 12 41.666 12.5356 40.4058 13.8398C40.1377 12.2319 39.2476 11.272 37.8926 10.6558C37.1836 10.3359 36.4668 10.0156 35.9702 9.31982C35.6235 8.82373 35.5293 8.27197 35.356 7.72754C35.2456 7.3999 35.1353 7.06396 34.7651 7.00781C34.3633 6.94385 34.2056 7.2876 34.0479 7.57568C33.418 8.75195 33.1733 10.0479 33.1973 11.3599C33.2524 14.312 34.4736 16.6641 36.8999 18.3359C37.1758 18.5278 37.2466 18.7197 37.1597 19C36.9946 19.5757 36.7974 20.1357 36.624 20.7119C36.5137 21.0801 36.3486 21.1597 35.9624 21C34.6309 20.4321 33.481 19.5918 32.4644 18.5757C30.7393 16.8721 29.1792 14.9917 27.2334 13.52C26.7764 13.1758 26.3193 12.856 25.8467 12.5518C23.8618 10.584 26.1069 8.96777 26.627 8.77588C27.1704 8.57568 26.8159 7.8877 25.0591 7.896C23.3022 7.90381 21.6953 8.50391 19.647 9.30371C19.3477 9.42383 19.0322 9.51172 18.7095 9.58398C16.8501 9.22363 14.9199 9.14355 12.9033 9.37598C9.10596 9.80762 6.07275 11.6396 3.84326 14.7681C1.16455 18.5278 0.53418 22.7998 1.30664 27.2559C2.11768 31.9521 4.46582 35.8398 8.07373 38.8799C11.8159 42.0322 16.1255 43.5762 21.041 43.2803C24.0269 43.104 27.3516 42.6963 31.1016 39.4561C32.0469 39.936 33.0396 40.1279 34.686 40.272C35.9546 40.3921 37.1758 40.208 38.1211 40.0078C39.6021 39.688 39.4995 38.2881 38.9639 38.0322C34.623 35.9678 35.5762 36.8081 34.71 36.1279C36.9155 33.4639 40.2402 30.6958 41.54 21.728C41.6426 21.0161 41.5557 20.5679 41.54 19.9917C41.5322 19.6396 41.6108 19.5039 42.0049 19.4639C43.0923 19.3359 44.1479 19.0317 45.1167 18.4878C47.9292 16.9199 49.064 14.3438 49.3315 11.2559C49.3711 10.7837 49.3237 10.2959 48.8354 10.0479ZM24.3262 37.8398C20.1196 34.4639 18.0791 33.3521 17.2358 33.3999C16.4482 33.4482 16.5898 34.3682 16.7632 34.9678C16.9443 35.5601 17.1812 35.9683 17.5117 36.4878C17.7402 36.832 17.8979 37.3442 17.2832 37.728C15.9282 38.584 13.5728 37.4399 13.4624 37.3838C10.7207 35.7358 8.42822 33.5601 6.81348 30.584C5.25342 27.7197 4.34766 24.6479 4.19775 21.3677C4.1582 20.5757 4.38672 20.2959 5.15869 20.1519C6.17529 19.96 7.22314 19.9199 8.23926 20.0718C12.5327 20.7119 16.1885 22.6719 19.2529 25.7759C21.002 27.5439 22.3252 29.6558 23.6885 31.7202C25.1377 33.9121 26.6978 36 28.6831 37.7119C29.3843 38.312 29.9434 38.7681 30.479 39.104C28.8643 39.2881 26.1699 39.3281 24.3262 37.8398ZM26.3433 24.6001C26.3433 24.248 26.6191 23.9678 26.9658 23.9678C27.0444 23.9678 27.1152 23.9839 27.1782 24.0078C27.2651 24.04 27.3438 24.0879 27.4067 24.1602C27.5171 24.272 27.5801 24.4321 27.5801 24.6001C27.5801 24.9521 27.3042 25.2319 26.9575 25.2319C26.6108 25.2319 26.3433 24.9521 26.3433 24.6001ZM32.6064 27.8799C32.2046 28.0479 31.8027 28.1919 31.4165 28.208C30.8179 28.2397 30.1641 27.9922 29.8096 27.688C29.2583 27.2158 28.8643 26.9521 28.6987 26.1279C28.6279 25.7759 28.6675 25.2319 28.7305 24.9199C28.8721 24.248 28.7144 23.8159 28.2495 23.4238C27.8716 23.104 27.3911 23.0161 26.8633 23.0161C26.666 23.0161 26.4849 22.9277 26.3511 22.856C26.1304 22.7441 25.9492 22.4639 26.1226 22.1201C26.1777 22.0078 26.4458 21.7358 26.5088 21.688C27.2256 21.272 28.0527 21.4077 28.8169 21.7197C29.5259 22.0161 30.0615 22.5601 30.834 23.3281C31.6216 24.2559 31.7632 24.5117 32.2124 25.208C32.5669 25.752 32.8901 26.312 33.1104 26.9521C33.2446 27.3521 33.0713 27.6802 32.6064 27.8799Z" fill="currentColor"/></svg>`;

  function injectSkin() {
    const id = window.__dshSkinId__;
    const skins = (window.__dshSkins && window.__dshSkins.SKINS) || {};
    const skin = id ? skins[id] : null;
    if (!skin || !skin.tokens) return;
    // 关键: DSH web 把 --dsw-alias-* 定义在 body / body[data-ds-dark-theme] 上,
    // 只注入 :root 对页面元素无效(离元素更近的 body 定义胜出), 必须同体覆盖。
    const vars = Object.entries(skin.tokens).map(([k, v]) => `${k}: ${v};`).join("\n");
    const css = `:root, body, body[data-ds-dark-theme] {\n${vars}\n}`;
    const style = document.createElement("style");
    style.id = "dshx-skin";
    style.textContent = css;
    document.head.appendChild(style);
  }

  function injectStyle() {
    const css = `
      .dshx-titlebar {
        position: fixed; top: 0; left: 0; right: 0; height: 40px; z-index: 2147483000;
        display: flex; align-items: center; padding: 0 0 0 14px;
        background: var(--dsw-alias-bg-layer-1, #fafbfc);
        border-bottom: 1px solid var(--dsw-alias-border-l1, #dfe4ea);
        -webkit-app-region: drag; user-select: none;
      }
      .dshx-titlebar .dshx-brand { display: flex; align-items: center; gap: 7px; color: var(--dsw-alias-brand-primary, #3b5bdb); min-width: 0; }
      .dshx-titlebar .dshx-brand svg { display: block; height: 18px; width: auto; flex-shrink: 0; }
      .dshx-titlebar .dshx-brand-text {
        font-size: 12.5px; font-weight: 600; color: var(--dsw-alias-label-primary, #20262e);
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px; flex-shrink: 1;
      }
      .dshx-titlebar .dshx-tokenbar {
        display: flex; align-items: center; gap: 8px; margin-left: auto; margin-right: 8px;
        font-size: 10.5px; color: var(--dsw-alias-label-secondary, #5a6472);
        font-family: "JetBrains Mono", Consolas, monospace; pointer-events: none; white-space: nowrap;
      }
      .dshx-titlebar .dshx-tk { display: inline-flex; align-items: center; gap: 3px; transition: color .2s; flex-shrink: 0; }
      .dshx-titlebar .dshx-tk b {
        color: var(--dsw-alias-brand-primary, #3b5bdb); font-weight: 600; min-width: 24px; text-align: right;
        font-variant-numeric: tabular-nums;
        transition: transform .15s, color .2s;
      }
      .dshx-titlebar .dshx-tk.pop b { transform: scale(1.15); color: var(--dsw-alias-state-success-primary, #2f9e44); }
      .dshx-titlebar .dshx-ring {
        position: relative; flex: 0 0 20px; width: 20px; height: 20px; border-radius: 50%;
        background: conic-gradient(var(--dshx-ring-color, var(--dsw-alias-brand-primary, #3b5bdb)) 0deg, var(--dshx-ring-color, var(--dsw-alias-brand-primary, #3b5bdb)) var(--dshx-ring-angle, 0deg), color-mix(in srgb, var(--dsw-alias-border-l2, #c9d2dc) 45%, transparent) var(--dshx-ring-angle, 0deg) 360deg);
        filter: drop-shadow(0 1px 1px rgba(15, 23, 42, .15));
        transition: background .4s;
      }
      .dshx-titlebar .dshx-ring::after {
        content: ""; position: absolute; inset: 3px; border-radius: 50%;
        background: var(--dsw-alias-bg-layer-1, #fafbfc);
      }
      .dshx-titlebar .dshx-ring .dshx-ring-pct {
        position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
        font-size: 6.5px; font-weight: 700; color: var(--dsw-alias-label-primary, #20262e); z-index: 1;
      }
      .dshx-titlebar .dshx-winbtns { margin-left: auto; height: 100%; display: flex; -webkit-app-region: no-drag; }
      .dshx-titlebar .dshx-winbtns button {
        width: 44px; height: 100%; border: none; background: transparent; color: var(--dsw-alias-label-secondary, #5a6472);
        font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center;
        transition: background .15s;
      }
      .dshx-titlebar .dshx-winbtns button:hover { background: var(--dsw-alias-bg-layer-2, #f2f4f7); color: var(--dsw-alias-label-primary, #20262e); }
      .dshx-titlebar .dshx-winbtns button.dshx-close:hover { background: #e03131; color: #fff; }
      .dshx-titlebar .dshx-activity {
        width: 10px; height: 10px; border-radius: 50%; margin-left: 4px; flex-shrink: 0;
        background: var(--dsw-alias-state-success-primary, #2f9e44);
        opacity: 0; transition: opacity .3s;
      }
      .dshx-titlebar .dshx-activity.on { opacity: 1; animation: dshx-breathe 1.6s ease-in-out infinite; }
      @keyframes dshx-breathe { 0%,100% { opacity:.35; transform: scale(.85);} 50% { opacity:1; transform: scale(1.1);} }
      .dshx-titlebar .dshx-tk b.pulse { animation: dshx-pulse .5s ease; }
      @keyframes dshx-pulse { 0% { transform: scale(1);} 40% { transform: scale(1.2);} 100% { transform: scale(1);} }
      body.dshx-padded { padding-top: 40px; }
      .dshx-titlebar .dshx-ring { transition: background .4s; }
      .dshx-no-ellipsis [class*='summary' i] {
        white-space: normal !important; overflow: visible !important; text-overflow: clip !important;
        display: -webkit-box !important; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
      }
      .dshx-titlebar .dshx-skinwrap { position: relative; margin-left: 6px; -webkit-app-region: no-drag; flex-shrink: 0; }
      .dshx-titlebar .dshx-skinbtn {
        width: 30px; height: 26px; border: 1px solid var(--dsw-alias-border-l1, #dfe4ea);
        background: var(--dsw-alias-bg-layer-1, #fafbfc); color: var(--dsw-alias-label-primary, #20262e);
        border-radius: 6px; font-size: 13px; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: transform .12s ease, background .15s ease, border-color .15s ease;
      }
      .dshx-titlebar .dshx-skinbtn:hover { border-color: var(--dsw-alias-brand-primary, #3b5bdb); }
      .dshx-titlebar .dshx-skinbtn:active { transform: scale(.94); }
      .dshx-titlebar .dshx-skinmenu {
        position: absolute; top: 32px; right: 0; min-width: 220px; z-index: 2147483001;
        background: var(--dsw-alias-bg-overlay, #fff); border: 1px solid var(--dsw-alias-border-l1, #dfe4ea);
        border-radius: 8px; padding: 5px; box-shadow: 0 8px 24px rgba(15, 23, 42, .16);
        transform-origin: top right; animation: dshx-menu-in .14s ease;
      }
      @keyframes dshx-menu-in { from { opacity: 0; transform: scale(.96) translateY(-3px); } to { opacity: 1; transform: none; } }
      .dshx-titlebar .dshx-skingroup {
        padding: 5px 9px 3px; font-size: 10.5px; font-weight: 600; letter-spacing: .4px;
        color: var(--dsw-alias-label-secondary, #5a6472); text-transform: uppercase;
      }
      .dshx-titlebar .dshx-skinitem {
        display: flex; align-items: center; gap: 9px; padding: 6px 9px; border-radius: 5px;
        font-size: 12px; color: var(--dsw-alias-label-primary, #20262e); cursor: pointer;
        transition: background .12s ease, transform .12s ease;
      }
      .dshx-titlebar .dshx-skinitem:hover { background: var(--dsw-alias-bg-layer-2, #f2f4f7); }
      .dshx-titlebar .dshx-skinitem:active { transform: scale(.98); }
      .dshx-titlebar .dshx-skinitem .dshx-swatch {
        display: flex; flex-shrink: 0; overflow: hidden; border-radius: 4px;
        border: 1px solid var(--dsw-alias-border-l2, #c9d2dc); width: 34px; height: 18px;
      }
      .dshx-titlebar .dshx-skinitem .dshx-swatch i { flex: 1 1 0; min-width: 0; }
      .dshx-titlebar .dshx-skinitem .dshx-skinname { flex: 1 1 auto; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .dshx-titlebar .dshx-skinitem.active { color: var(--dsw-alias-brand-primary, #3b5bdb); font-weight: 600; }
      .dshx-titlebar .dshx-skinitem.active::after { content: "✓"; margin-left: auto; }
    `;
    const s = document.createElement("style");
    s.textContent = css;
    document.head.appendChild(s);
    document.body.classList.add("dshx-padded");
  }

  function formatTokens(n) {
    if (n == null || isNaN(n)) return "-";
    if (n >= 1000000) return (n / 1000000).toFixed(2) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "k";
    return String(n);
  }

  let winApi = null;
  function getWinApi() {
    if (winApi) return winApi;
    try {
      winApi = window.dshUi && window.dshUi.win;
    } catch (e) { winApi = null; }
    return winApi;
  }

  function greeting(userName) {
    const h = new Date().getHours();
    let g = "你好";
    if (h >= 5 && h < 9) g = "早上好";
    else if (h >= 9 && h < 12) g = "上午好";
    else if (h >= 12 && h < 14) g = "中午好";
    else if (h >= 14 && h < 18) g = "下午好";
    else if (h >= 18 && h < 23) g = "晚上好";
    else g = "夜深了";
    return `DeepSeek Harness ${g}，${userName || "海龙龙"}`;
  }

  function injectTitleBar(userName) {
    const bar = document.createElement("div");
    bar.className = "dshx-titlebar";
    bar.id = "dshx-titlebar";
    const whale = window.__dshWhaleSvg__ || BRAND_LOGO;
    bar.innerHTML = `
      <span class="dshx-brand">${whale}</span>
      <span class="dshx-brand-text" id="dshx-brand-text">${greeting(userName)}</span>
      <span class="dshx-skinwrap">
        <button id="dshx-skin-btn" class="dshx-skinbtn" title="切换皮肤">◐</button>
        <div class="dshx-skinmenu" id="dshx-skinmenu" hidden></div>
      </span>
      <span class="dshx-winbtns">
        <button id="dshx-min" title="最小化">─</button>
        <button id="dshx-max" title="最大化">□</button>
        <button id="dshx-close" class="dshx-close" title="关闭">✕</button>
      </span>`;
    document.body.appendChild(bar);

    initSkinSwitcher();

    const api = getWinApi();
    if (api) {
      document.getElementById("dshx-min").addEventListener("click", () => api.minimize());
      document.getElementById("dshx-max").addEventListener("click", () => api.maximize());
      document.getElementById("dshx-close").addEventListener("click", () => api.close());
      api.onMaximized((max) => {
        const b = document.getElementById("dshx-max");
        if (b) b.textContent = max ? "❐" : "□";
      });
    } else {
      document.querySelectorAll(".dshx-winbtns button").forEach((b) => b.style.display = "none");
    }
  }

  function initSkinSwitcher() {
    const btn = document.getElementById("dshx-skin-btn");
    const menu = document.getElementById("dshx-skinmenu");
    if (!btn || !menu) return;
    const skins = (window.__dshSkins && window.__dshSkins.SKINS) || {};
    const ids = (window.__dshSkins && window.__dshSkins.SKIN_IDS) || Object.keys(skins);
    const current = () => window.__dshSkinId__ || "default-light";

    function swatchHtml(tok) {
      const bg = tok["--dsw-alias-bg-base"] || "#eceff3";
      const brand = tok["--dsw-alias-brand-primary"] || "#3b5bdb";
      const label = tok["--dsw-alias-label-primary"] || "#20262e";
      return `<span class="dshx-swatch"><i style="background:${bg}"></i><i style="background:${brand}"></i><i style="background:${label}"></i></span>`;
    }

    function rebuildMenu(activeId) {
      menu.innerHTML = "";
      const order = ["light", "dark"];
      const groupLabel = { light: "浅色主题", dark: "深色主题" };
      for (const mode of order) {
        const group = ids.filter(id => (skins[id] && (skins[id].mode || "light")) === mode);
        if (group.length === 0) continue;
        const head = document.createElement("div");
        head.className = "dshx-skingroup";
        head.textContent = groupLabel[mode];
        menu.appendChild(head);
        for (const id of group) {
          const skin = skins[id];
          if (!skin) continue;
          const item = document.createElement("div");
          item.className = "dshx-skinitem" + (id === activeId ? " active" : "");
          item.innerHTML = `${swatchHtml(skin.tokens || {})}<span class="dshx-skinname">${skin.name || id}</span>`;
          item.addEventListener("click", () => applySkin(id));
          menu.appendChild(item);
        }
      }
    }

    function applySkin(id) {
      if (!skins[id]) return;
      window.__dshSkinId__ = id;
      const old = document.getElementById("dshx-skin");
      if (old) old.remove();
      injectSkin();
      rebuildMenu(id);
      menu.hidden = true;
      try {
        if (window.dshUi && window.dshUi.setSkin) window.dshUi.setSkin(id);
      } catch (e) {}
    }

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (menu.hidden) rebuildMenu(current());
      menu.hidden = !menu.hidden;
    });
    window.addEventListener("pointerdown", (e) => {
      if (menu.hidden) return;
      if (!menu.contains(e.target) && e.target !== btn) menu.hidden = true;
    });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") menu.hidden = true; });
    try {
      if (window.dshUi && window.dshUi.onSkinChange) {
        window.dshUi.onSkinChange((id) => {
          if (id && skins[id]) {
            window.__dshSkinId__ = id;
            const old = document.getElementById("dshx-skin");
            if (old) old.remove();
            injectSkin();
            rebuildMenu(id);
          }
        });
      }
    } catch (e) {}
    rebuildMenu(current());
  }

  let usageMax = 1;
  const tkCache = new Map();
  let tkBusy = false;
  let tkPrev = { in: null, out: null, reason: null, count: 0 };

  async function tkCount(text) {
    try {
      if (!window.dshUi || !window.dshUi.countTokens) return null;
      if (tkCache.has(text)) return tkCache.get(text);
      const n = await window.dshUi.countTokens(text.slice(0, 4000));
      tkCache.set(text, n);
      if (tkCache.size > 300) {
        const first = tkCache.keys().next().value;
        tkCache.delete(first);
      }
      return n;
    } catch (e) { return null; }
  }

  function setTkValue(id, v, key) {
    const el = document.getElementById(id);
    if (!el) return;
    const txt = formatTokens(v);
    if (el.textContent !== txt) {
      el.textContent = txt;
      el.classList.remove("pop");
      void el.offsetWidth;
      el.classList.add("pop");
      if (tkPrev[key] != null && v != null && v > tkPrev[key]) {
        el.classList.remove("pulse");
        void el.offsetWidth;
        el.classList.add("pulse");
      }
      tkPrev[key] = v;
    }
  }

  function collectMessages() {
    const out = { user: [], assistant: [] };
    const seen = new Set();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const n of nodes) {
      const t = (n.textContent || "").trim();
      if (!t || t.length < 2 || t.length > 6000) continue;
      const parent = n.parentElement;
      if (!parent) continue;
      const cls = (parent.className || "") + " " + (parent.parentElement ? parent.parentElement.className || "" : "");
      const key = t.slice(0, 80);
      if (seen.has(key)) continue;
      seen.add(key);
      if (/user/i.test(cls) && !/assistant|assistant/i.test(cls)) out.user.push(t);
      else if (/assistant|message-content|assistant/i.test(cls)) out.assistant.push(t);
      else if (/message/i.test(cls)) out.user.push(t);
    }
    return out;
  }

  async function pollTokens() {
    try {
      const msgs = collectMessages();
      const countEl = document.getElementById("dshx-tk-count");
      if (countEl && countEl.textContent !== String(msgs.user.length)) {
        countEl.textContent = String(msgs.user.length);
        countEl.classList.remove("pop"); void countEl.offsetWidth; countEl.classList.add("pop");
      }
      if (tkBusy) return;
      tkBusy = true;
      try {
        const userText = msgs.user.join("\n");
        const asstText = msgs.assistant.join("\n");
        const [input, output] = await Promise.all([
          tkCount(userText),
          tkCount(asstText)
        ]);
        const total = (input || 0) + (output || 0);
        setTkValue("dshx-tk-in", input, "in");
        setTkValue("dshx-tk-out", output, "out");
        setTkValue("dshx-tk-total", total > 0 ? total : null, "total");
        setTkValue("dshx-tk-reason", null, "reason");

        if (total > usageMax) usageMax = total;
        const pct = Math.min(100, (total / usageMax) * 100);
        const ring = document.getElementById("dshx-ring");
        if (ring) {
          const angle = Math.round((pct / 100) * 360);
          let color = "#3b5bdb";
          if (pct >= 90) color = "#dc2626";
          else if (pct >= 75) color = "#ea580c";
          else if (pct >= 60) color = "#0ea5e9";
          ring.style.setProperty("--dshx-ring-angle", angle + "deg");
          ring.style.setProperty("--dshx-ring-color", color);
          const pctEl = document.getElementById("dshx-ring-pct");
          if (pctEl) pctEl.textContent = Math.round(pct) + "%";
        }

        const act = document.getElementById("dshx-activity");
        if (act) {
          const busy = document.body.innerText.includes("正在思考") || !!document.querySelector("[class*='streaming' i]") || !!document.querySelector("[class*='running' i]");
          act.classList.toggle("on", busy);
        }
      } finally {
        tkBusy = false;
      }
    } catch (e) {}
  }

  function translateStrings() {
    const lang = window.__dshLang__ || "zh";
    const packs = (window.__dshLangs && window.__dshLangs.LANG_PACKS) || {};
    const map = packs[lang] || packs.zh || {};
    if (!Object.keys(map).length) return;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const n of nodes) {
      const t = n.textContent;
      for (const [en, localized] of Object.entries(map)) {
        if (t.includes(en)) { n.textContent = t.split(en).join(localized); }
      }
    }
  }

  function boot(userName) {
    injectStyle();
    injectSkin();
    document.body.classList.add("dshx-no-ellipsis");
    injectTitleBar(userName);
  }

  function getConfigUserName() {
    try {
      if (window.dshUi && window.dshUi.getConfig) return window.dshUi.getConfig().then ? null : null;
    } catch (e) {}
    return null;
  }

  const nameHint = (window.__dshUserName__) || "海龙龙";

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      boot(nameHint);
      pollTokens();
      setInterval(() => pollTokens(), 4000);
      setTimeout(translateStrings, 2500);
      setInterval(translateStrings, 5000);
      setInterval(() => {
        const el = document.getElementById("dshx-brand-text");
        if (el) el.textContent = greeting(nameHint);
      }, 60 * 60 * 1000);
    });
  } else {
    boot(nameHint);
    pollTokens();
    setInterval(() => pollTokens(), 4000);
    setTimeout(translateStrings, 2500);
    setInterval(translateStrings, 5000);
    setInterval(() => {
      const el = document.getElementById("dshx-brand-text");
      if (el) el.textContent = greeting(nameHint);
    }, 60 * 60 * 1000);
  }
})();