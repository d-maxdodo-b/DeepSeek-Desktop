// dsh 界面皮肤库 · 基于 --dsw-alias-* 语义 Token 覆盖
// 每皮肤只维护 13 个核心语义 Token(与皮肤色板 CSS 一一对应, SSoT),
// 注入时经 expandSkinTokens() 派生全量 ~78 个 alias Token, 保证 DSH web
// 所有组件(按钮/代码块/滚动条/tooltip/markdown/状态色等)全部被皮肤接管,
// 消除"只变一半"的拼接感。注入目标: body + body[data-ds-dark-theme](同体覆盖)。
// mode: light|dark — 主题选择器分组用。

// ── 颜色工具(纯 JS, 无依赖, 经 executeJavaScript 注入) ──────────────
function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  const n = parseInt(full, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}
function rgbStr({ r, g, b }) { return `rgb(${r}, ${g}, ${b})` }
function mix(hexA, hexB, t) {
  const a = hexToRgb(hexA), b = hexToRgb(hexB)
  return rgbStr({
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  })
}
function rgba(hex, alpha) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
/** 任意颜色(hex 或 rgb())加透明度 — 壁纸模式把表层变半透明用。 */
function fade(color, alpha) {
  if (typeof color !== 'string') return color
  const c = color.trim()
  const m = c.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (m) return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${alpha})`
  return rgba(c, alpha)
}

/**
 * 从 13 个核心 Token 派生 DSH web 全量 alias Token(浅/深皮肤各一套规则)。
 * 生成集应用到 body 与 body[data-ds-dark-theme] 两处 → 皮肤完全接管界面,
 * 应用的浅/深主题开关不再影响配色。
 */
function expandSkinTokens(skin) {
  const T = skin.tokens || {}
  const dark = (skin.mode || 'dark') === 'dark'
  const bg = T['--dsw-alias-bg-base'] || (dark ? '#12151a' : '#eceff3')
  const l1 = T['--dsw-alias-bg-layer-1'] || bg
  const l2 = T['--dsw-alias-bg-layer-2'] || bg
  const ov = T['--dsw-alias-bg-overlay'] || l2
  const br = T['--dsw-alias-brand-primary'] || (dark ? '#4d6bfe' : '#3b5bdb')
  const tx1 = T['--dsw-alias-label-primary'] || (dark ? '#e8ecf1' : '#20262e')
  const tx2 = T['--dsw-alias-label-secondary'] || (dark ? '#93a0b2' : '#5a6472')
  const err = T['--dsw-alias-state-error-primary'] || (dark ? '#f85149' : '#e03131')
  const ok = T['--dsw-alias-state-success-primary'] || (dark ? '#3fb950' : '#2f9e44')
  const warn = T['--dsw-alias-state-warn-primary'] || (dark ? '#d29922' : '#e8a00c')
  const side = T['--dsw-specific-sidebar-fill'] || bg
  const W = '#ffffff', K = '#000000'
  const base = dark ? W : K
  const l3 = dark ? mix(l2, W, 0.10) : mix(l2, K, 0.03)
  const codeBg = dark ? mix(bg, K, 0.32) : mix(bg, K, 0.03)
  const codeBg2 = dark ? mix(bg, K, 0.40) : mix(bg, K, 0.05)
  const brHover = dark ? mix(br, W, 0.12) : mix(br, K, 0.10)
  const floatFill = dark ? l2 : mix(l2, W, 0.45)
  return {
    '--dsw-alias-bg-base': bg,
    '--dsw-alias-bg-layer-1': l1,
    '--dsw-alias-bg-layer-2': l2,
    '--dsw-alias-bg-layer-3': l3,
    '--dsw-alias-bg-overlay': ov,
    '--dsw-alias-bg-module-platform': l1,
    '--dsw-alias-bg-multi-select': l2,
    '--dsw-alias-bg-skeleton': rgba(base, dark ? 0.08 : 0.04),
    '--dsw-alias-border-inverted2': rgba(base, dark ? 0.08 : 0),
    '--dsw-alias-border-inverted': rgba(base, dark ? 0.06 : 0),
    '--dsw-alias-border-l1': rgba(base, dark ? 0.06 : 0.04),
    '--dsw-alias-border-l2-darkmode-thin': rgba(base, dark ? 0.06 : 0.04),
    '--dsw-alias-border-l2': rgba(base, dark ? 0.12 : 0.10),
    '--dsw-alias-border-l3': rgba(base, dark ? 0.16 : 0.12),
    '--dsw-alias-border-l4': rgba(base, dark ? 0.20 : 0.16),
    '--dsw-alias-brand-primary': br,
    '--dsw-alias-brand-primary-invert': tx1,
    '--dsw-alias-brand-primary-new-colorprimary-new-color': br,
    '--dsw-alias-brand-text': tx1,
    '--dsw-alias-button-contrast-fill': dark ? mix(bg, W, 0.18) : mix(bg, K, 0.06),
    '--dsw-alias-button-elevated-fill': dark ? mix(bg, W, 0.10) : mix(bg, W, 0.55),
    '--dsw-alias-button-floating-fill': floatFill,
    '--dsw-alias-button-floating-hover': dark ? mix(floatFill, W, 0.10) : mix(floatFill, K, 0.03),
    '--dsw-alias-button-ghost-active-border': tx2,
    '--dsw-alias-button-ghost-active-fill': dark ? mix(l2, W, 0.08) : mix(l2, K, 0.04),
    '--dsw-alias-button-ghost-active-hover': dark ? mix(l2, W, 0.12) : mix(l2, K, 0.06),
    '--dsw-alias-button-info-fill': br,
    '--dsw-alias-button-info-hover': brHover,
    '--dsw-alias-button-primary-dimmed': rgba(br, 0.30),
    '--dsw-alias-button-primary-fill': br,
    '--dsw-alias-button-primary-hover': brHover,
    '--dsw-alias-interactive-bg-active': rgba(base, dark ? 0.14 : 0.10),
    '--dsw-alias-interactive-bg-hover-accent': rgba(br, 0.22),
    '--dsw-alias-interactive-bg-hover-danger': rgba(err, 0.15),
    '--dsw-alias-interactive-bg-hover-solid': l2,
    '--dsw-alias-interactive-bg-hover': rgba(base, dark ? 0.08 : 0.06),
    '--dsw-alias-label-caption': mix(tx2, bg, 0.20),
    '--dsw-alias-label-dimmed': mix(tx1, bg, 0.45),
    '--dsw-alias-label-primary-bluish': tx1,
    '--dsw-alias-label-primary-dimmed': mix(tx1, bg, 0.35),
    '--dsw-alias-label-primary-foreground': dark ? bg : '#ffffff',
    '--dsw-alias-label-primary-inverted': dark ? l2 : '#ffffff',
    '--dsw-alias-label-primary': tx1,
    '--dsw-alias-label-secondary': tx2,
    '--dsw-alias-label-tertiary': mix(tx2, bg, 0.35),
    '--dsw-alias-markdown-citation': codeBg,
    '--dsw-alias-markdown-code-block-banner': codeBg,
    '--dsw-alias-markdown-code-block': codeBg,
    '--dsw-alias-markdown-code-segment-selected': codeBg2,
    '--dsw-alias-markdown-code-segment-unselected': codeBg,
    '--dsw-alias-markdown-inline-code': codeBg,
    '--dsw-alias-markdown-placeholder': mix(tx2, bg, 0.40),
    '--dsw-alias-markdown-tag': dark ? mix(l2, K, 0.15) : mix(l2, K, 0.04),
    '--dsw-alias-scrollbar-bg-l1': dark ? mix(l2, K, 0.18) : mix(l2, K, 0.10),
    '--dsw-alias-scrollbar-bg-l2': dark ? mix(l2, K, 0.18) : mix(l2, K, 0.10),
    '--dsw-alias-scrollbar-hover-l1': dark ? mix(l2, K, 0.10) : mix(l2, K, 0.06),
    '--dsw-alias-scrollbar-hover-l2': dark ? mix(l2, K, 0.10) : mix(l2, K, 0.06),
    '--dsw-alias-state-business-primary': br,
    '--dsw-alias-state-business-tertiary': mix(br, bg, 0.88),
    '--dsw-alias-state-error-primary': err,
    '--dsw-alias-state-error-secondary': mix(err, W, 0.30),
    '--dsw-alias-state-success-primary': ok,
    '--dsw-alias-state-success-secondary': mix(ok, W, 0.30),
    '--dsw-alias-state-success-tertiary': mix(ok, bg, 0.88),
    '--dsw-alias-state-warn-label': mix(warn, K, 0.15),
    '--dsw-alias-state-warn-primary': warn,
    '--dsw-alias-state-warn-secondary': mix(warn, W, 0.30),
    '--dsw-alias-state-warn-tertiary': mix(warn, bg, 0.88),
    '--dsw-alias-toast-bg': dark ? mix(bg, W, 0.12) : mix(bg, K, 0.25),
    '--dsw-alias-tooltip-bg': dark ? mix(bg, W, 0.15) : mix(bg, K, 0.30),
    // ── --dsw-specific-* 第三命名空间: 输入框/选择器/菜单/提示/气泡/侧栏导航 ──
    '--dsw-specific-input-major': dark ? mix(bg, W, 0.06) : mix(l2, W, 0.55),
    '--dsw-specific-login-input': dark ? mix(bg, W, 0.04) : mix(l2, W, 0.5),
    '--dsw-specific-menu': dark ? l2 : mix(l2, W, 0.65),
    '--dsw-specific-selector': dark ? l2 : mix(l2, W, 0.65),
    '--dsw-specific-tip': dark ? mix(bg, W, 0.08) : mix(bg, K, 0.03),
    '--dsw-specific-bubble': dark ? mix(br, bg, 0.35) : mix(br, bg, 0.90),
    '--dsw-specific-bubble-highlight': dark ? mix(br, bg, 0.55) : mix(br, bg, 0.80),
    '--dsw-specific-sidebar-nav-item-active': dark ? mix(br, bg, 0.30) : mix(br, bg, 0.88),
    '--dsw-specific-sidebar-nav-item-active-accent': br,
    '--dsw-specific-sidebar-nav-item-hover': dark ? rgba(W, 0.06) : rgba(K, 0.05),
    '--dsw-specific-sidebar-fill': side,
  }
}

const SKINS = {
  "default-light": {
    name: "默认浅色",
    mode: "light",
    tokens: {
      "--dsw-alias-bg-base": "#eceff3",
      "--dsw-alias-bg-layer-1": "#fafbfc",
      "--dsw-alias-bg-layer-2": "#f2f4f7",
      "--dsw-alias-bg-overlay": "#ffffff",
      "--dsw-alias-border-l1": "#dfe4ea",
      "--dsw-alias-border-l2": "#c9d2dc",
      "--dsw-alias-brand-primary": "#3b5bdb",
      "--dsw-alias-label-primary": "#20262e",
      "--dsw-alias-label-secondary": "#5a6472",
      "--dsw-alias-state-error-primary": "#e03131",
      "--dsw-alias-state-success-primary": "#2f9e44",
      "--dsw-alias-state-warn-primary": "#e8a00c",
      "--dsw-specific-sidebar-fill": "#f2f4f7"
    }
  },
  "default-dark": {
    name: "默认深色",
    mode: "dark",
    tokens: {
      "--dsw-alias-bg-base": "#12151a",
      "--dsw-alias-bg-layer-1": "#1a1e26",
      "--dsw-alias-bg-layer-2": "#21262f",
      "--dsw-alias-bg-overlay": "#262c37",
      "--dsw-alias-border-l1": "#2c333f",
      "--dsw-alias-border-l2": "#3a4353",
      "--dsw-alias-brand-primary": "#4d6bfe",
      "--dsw-alias-label-primary": "#e8ecf1",
      "--dsw-alias-label-secondary": "#93a0b2",
      "--dsw-alias-state-error-primary": "#f85149",
      "--dsw-alias-state-success-primary": "#3fb950",
      "--dsw-alias-state-warn-primary": "#d29922",
      "--dsw-specific-sidebar-fill": "#161a20"
    }
  },
  "codex-dark": {
    name: "Codex 暗色",
    mode: "dark",
    tokens: {
      "--dsw-alias-bg-base": "#0d0e10",
      "--dsw-alias-bg-layer-1": "#141518",
      "--dsw-alias-bg-layer-2": "#1a1c20",
      "--dsw-alias-bg-overlay": "#202329",
      "--dsw-alias-border-l1": "#26282e",
      "--dsw-alias-border-l2": "#34373f",
      "--dsw-alias-brand-primary": "#e5c07b",
      "--dsw-alias-label-primary": "#d4d4d8",
      "--dsw-alias-label-secondary": "#8b8f98",
      "--dsw-alias-state-error-primary": "#f44747",
      "--dsw-alias-state-success-primary": "#4d9e6a",
      "--dsw-alias-state-warn-primary": "#d29922",
      "--dsw-specific-sidebar-fill": "#111214"
    }
  },
  "vscode-dark": {
    name: "VS Code Dark+",
    mode: "dark",
    tokens: {
      "--dsw-alias-bg-base": "#1e1e1e",
      "--dsw-alias-bg-layer-1": "#252526",
      "--dsw-alias-bg-layer-2": "#2d2d30",
      "--dsw-alias-bg-overlay": "#333333",
      "--dsw-alias-border-l1": "#3c3c3c",
      "--dsw-alias-border-l2": "#454545",
      "--dsw-alias-brand-primary": "#007acc",
      "--dsw-alias-label-primary": "#cccccc",
      "--dsw-alias-label-secondary": "#969696",
      "--dsw-alias-state-error-primary": "#f14c4c",
      "--dsw-alias-state-success-primary": "#89d185",
      "--dsw-alias-state-warn-primary": "#cca700",
      "--dsw-specific-sidebar-fill": "#252526"
    }
  },
  onedark: {
    name: "One Dark Pro",
    mode: "dark",
    tokens: {
      "--dsw-alias-bg-base": "#282c34",
      "--dsw-alias-bg-layer-1": "#2c313a",
      "--dsw-alias-bg-layer-2": "#353b45",
      "--dsw-alias-bg-overlay": "#3e4451",
      "--dsw-alias-border-l1": "#3e4451",
      "--dsw-alias-border-l2": "#4b5263",
      "--dsw-alias-brand-primary": "#61afef",
      "--dsw-alias-label-primary": "#abb2bf",
      "--dsw-alias-label-secondary": "#5c6370",
      "--dsw-alias-state-error-primary": "#e06c75",
      "--dsw-alias-state-success-primary": "#98c379",
      "--dsw-alias-state-warn-primary": "#e5c07b",
      "--dsw-specific-sidebar-fill": "#21252b"
    }
  },
  "tokyo-night": {
    name: "Tokyo Night",
    mode: "dark",
    tokens: {
      "--dsw-alias-bg-base": "#1a1b26",
      "--dsw-alias-bg-layer-1": "#1f2335",
      "--dsw-alias-bg-layer-2": "#24283b",
      "--dsw-alias-bg-overlay": "#292e42",
      "--dsw-alias-border-l1": "#292e42",
      "--dsw-alias-border-l2": "#3b4261",
      "--dsw-alias-brand-primary": "#7aa2f7",
      "--dsw-alias-label-primary": "#c0caf5",
      "--dsw-alias-label-secondary": "#565f89",
      "--dsw-alias-state-error-primary": "#f7768e",
      "--dsw-alias-state-success-primary": "#9ece6a",
      "--dsw-alias-state-warn-primary": "#e0af68",
      "--dsw-specific-sidebar-fill": "#16161e"
    }
  },
  nord: {
    name: "Nord",
    mode: "dark",
    tokens: {
      "--dsw-alias-bg-base": "#2e3440",
      "--dsw-alias-bg-layer-1": "#3b4252",
      "--dsw-alias-bg-layer-2": "#434c5e",
      "--dsw-alias-bg-overlay": "#4c566a",
      "--dsw-alias-border-l1": "#4c566a",
      "--dsw-alias-border-l2": "#5e687d",
      "--dsw-alias-brand-primary": "#88c0d0",
      "--dsw-alias-label-primary": "#eceff4",
      "--dsw-alias-label-secondary": "#d8dee9",
      "--dsw-alias-state-error-primary": "#bf616a",
      "--dsw-alias-state-success-primary": "#a3be8c",
      "--dsw-alias-state-warn-primary": "#ebcb8b",
      "--dsw-specific-sidebar-fill": "#2e3440"
    }
  },
  kanagawa: {
    name: "Kanagawa 和风",
    mode: "dark",
    tokens: {
      "--dsw-alias-bg-base": "#1f1c28",
      "--dsw-alias-bg-layer-1": "#2a2734",
      "--dsw-alias-bg-layer-2": "#332f3d",
      "--dsw-alias-bg-overlay": "#3a3550",
      "--dsw-alias-border-l1": "#363a52",
      "--dsw-alias-border-l2": "#45496a",
      "--dsw-alias-brand-primary": "#7aa2f7",
      "--dsw-alias-label-primary": "#dcd7ba",
      "--dsw-alias-label-secondary": "#938aa9",
      "--dsw-alias-state-error-primary": "#ff5d62",
      "--dsw-alias-state-success-primary": "#98bb6c",
      "--dsw-alias-state-warn-primary": "#e0af68",
      "--dsw-specific-sidebar-fill": "#252232"
    }
  },
  solarized: {
    name: "Solarized 复古",
    mode: "light",
    tokens: {
      "--dsw-alias-bg-base": "#fdf6e3",
      "--dsw-alias-bg-layer-1": "#eee8d5",
      "--dsw-alias-bg-layer-2": "#e6dfc8",
      "--dsw-alias-bg-overlay": "#f5efd9",
      "--dsw-alias-border-l1": "#d5cfb8",
      "--dsw-alias-border-l2": "#b7b194",
      "--dsw-alias-brand-primary": "#268bd2",
      "--dsw-alias-label-primary": "#073642",
      "--dsw-alias-label-secondary": "#657b83",
      "--dsw-alias-state-error-primary": "#dc322f",
      "--dsw-alias-state-success-primary": "#859900",
      "--dsw-alias-state-warn-primary": "#b58900",
      "--dsw-specific-sidebar-fill": "#eee8d5"
    }
  },
  gruvbox: {
    name: "Gruvbox 复古暖",
    mode: "dark",
    tokens: {
      "--dsw-alias-bg-base": "#282828",
      "--dsw-alias-bg-layer-1": "#32302f",
      "--dsw-alias-bg-layer-2": "#3c3836",
      "--dsw-alias-bg-overlay": "#45403d",
      "--dsw-alias-border-l1": "#4a4543",
      "--dsw-alias-border-l2": "#5a524f",
      "--dsw-alias-brand-primary": "#fabd2f",
      "--dsw-alias-label-primary": "#ebdbb2",
      "--dsw-alias-label-secondary": "#a89984",
      "--dsw-alias-state-error-primary": "#fb4934",
      "--dsw-alias-state-success-primary": "#b8bb26",
      "--dsw-alias-state-warn-primary": "#fe8019",
      "--dsw-specific-sidebar-fill": "#2e2b28"
    }
  },
  berserk: {
    name: "剑风传奇 Berserk",
    mode: "dark",
    wallpaperKey: "berserk",
    tokens: {
      "--dsw-alias-bg-base": "#0a0a0d",
      "--dsw-alias-bg-layer-1": "#131316",
      "--dsw-alias-bg-layer-2": "#1a1a1f",
      "--dsw-alias-bg-overlay": "#202026",
      "--dsw-alias-border-l1": "#26202a",
      "--dsw-alias-border-l2": "#3d2a2e",
      "--dsw-alias-brand-primary": "#c62828",
      "--dsw-alias-label-primary": "#d8d2c4",
      "--dsw-alias-label-secondary": "#8f8778",
      "--dsw-alias-state-error-primary": "#b71c1c",
      "--dsw-alias-state-success-primary": "#6b8f71",
      "--dsw-alias-state-warn-primary": "#b05c1e",
      "--dsw-specific-sidebar-fill": "#0f0f13"
    }
  }
};

const SKIN_IDS = Object.keys(SKINS);

if (typeof window !== "undefined") {
  window.__dshSkins = { SKINS, SKIN_IDS, expand: expandSkinTokens, fade };
}
if (typeof module !== "undefined") {
  module.exports = { SKINS, SKIN_IDS, expand: expandSkinTokens, fade };
}
