// dsh 界面皮肤库 · 基于 --dsw-alias-* 语义 Token 覆盖
// 每皮肤 = 完整 Token 值集, 注入到 body(及 body[data-ds-dark-theme]) 覆盖 dsh 默认主题
// 与品鉴系统 成游-UI换肤设计 模块对齐: 语义Token驱动换肤
// mode: light|dark — 主题选择器分组用(与皮肤色板 CSS 一一对应)

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
  window.__dshSkins = { SKINS, SKIN_IDS };
}
if (typeof module !== "undefined") {
  module.exports = { SKINS, SKIN_IDS };
}
