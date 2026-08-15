const MOUNTS = [
  { key: "skills", name: "技能库", icon: "技" },
  { key: "instructions", name: "指令库", icon: "指" },
  { key: "deploy", name: "部署词", icon: "部" },
  { key: "knowledge", name: "知识库", icon: "知" },
  { key: "thinking", name: "思维模型", icon: "思" },
  { key: "memory", name: "记忆中枢", icon: "忆" },
  { key: "cases", name: "案例库", icon: "案" },
  { key: "engines", name: "引擎库", icon: "引" },
  { key: "mcp", name: "MCP服务器", icon: "M" },
  { key: "aiModel", name: "AI MODEL", icon: "AI" },
  { key: "comfyui", name: "ComfyUI", icon: "C" },
  { key: "projects", name: "落地项目", icon: "项" },
  { key: "designAssets", name: "设计资产库", icon: "设" },
  { key: "pending", name: "待处理", icon: "待" },
  { key: "roleLibrary", name: "角色智库", icon: "角" },
  { key: "designGate", name: "设计门控", icon: "门" },
  { key: "researchReports", name: "研究报告", icon: "研" },
  { key: "tasteSystem", name: "品鉴系统", icon: "品" },
  { key: "memoryFlash", name: "闪存记忆", icon: "闪" },
  { key: "sessionMemory", name: "会话记忆", icon: "会" },
  { key: "kgCrystal", name: "KG结晶", icon: "晶" },
  { key: "engineMiao", name: "引擎-Miao", icon: "喵" },
  { key: "contentOut", name: "内容输出", icon: "出" },
  { key: "obsidian", name: "Obsidian", icon: "O" }
];

let config = null;
let backendState = "stopped";
let currentPanel = "overview";

function toast(title, sub, isErr) {
  const box = document.getElementById("toast");
  const el = document.createElement("div");
  el.className = "toast-item" + (isErr ? " err" : "");
  el.innerHTML = `<div class="t-title">${esc(title)}</div>${sub ? `<div class="t-sub">${esc(sub)}</div>` : ""}`;
  box.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 300); }, 3800);
}

async function init() {
  config = await dsh.config.get();
  applyTheme();
  renderVer();
  renderBackendState(backendState);
  renderPanel("overview");
  bindNav();
  bindState();
  runSplash();
  checkOllama();
  checkOm();
  startMonitor();
}

function applyTheme() {
  const t = config.theme || "light";
  const dark = t === "dark" || (t === "system" && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.body.dataset.theme = dark ? "dark" : "light";
}

function renderVer() {
  document.getElementById("verLabel").textContent = "v0.1.0";
  document.getElementById("engineInfo").textContent = config.enginePath;
}

function renderBackendState(s) {
  backendState = s;
  const dot = document.getElementById("stateDot");
  dot.className = "dot " + s;
  const map = {
    stopped: "后端已停止", starting: "后端启动中...", running: "后端运行中",
    stopping: "后端停止中...", crashed: "后端异常"
  };
  document.getElementById("backendState").textContent = map[s] || s;
  const btn = document.getElementById("openUiBtn");
  if (s === "running") { btn.disabled = false; btn.textContent = "打开 Harness 主窗口"; }
  else { btn.disabled = true; btn.textContent = s === "crashed" ? "后端异常" : "等待后端..."; }
}

function bindState() {
  dsh.backend.onState((s) => {
    renderBackendState(s);
    if (currentPanel === "overview") renderOverview();
    if (s === "running") {
      const el = document.getElementById("splash");
      if (el) { document.getElementById("sbarFill").style.width = "100%"; setTimeout(() => el.classList.add("hide"), 300); }
    }
  });
}

function runSplash() {
  const fill = document.getElementById("sbarFill");
  let w = 0;
  const timer = setInterval(() => {
    w = Math.min(95, w + 5 + Math.random() * 12);
    fill.style.width = w + "%";
    if (backendState === "running") { clearInterval(timer); fill.style.width = "100%"; }
  }, 400);
  setTimeout(() => {
    document.getElementById("splashText").textContent = backendState === "running" ? "就绪" : "若长时间无响应, 请检查引擎路径设置";
  }, 5000);
}

function bindNav() {
  document.querySelectorAll("#nav .nav-item").forEach((el) => {
    el.addEventListener("click", () => {
      document.querySelectorAll("#nav .nav-item").forEach((n) => n.classList.remove("active"));
      el.classList.add("active");
      renderPanel(el.dataset.panel);
    });
  });
  const tb = document.getElementById("titlebar");
  if (tb) {
    tb.addEventListener("dblclick", (e) => {
      if (e.target.closest(".winbtns")) return;
      dsh.win.maximize();
    });
  }
  dsh.win.onMaximized((max) => {
    const btn = document.getElementById("btnMax");
    if (btn) btn.textContent = max ? "❐" : "□";
  });
}

function renderPanel(panel) {
  currentPanel = panel;
  const c = document.getElementById("content");
  if (panel === "overview") renderOverview(c);
  else if (panel === "models") renderModels(c);
  else if (panel === "engines") renderEngines(c);
  else if (panel === "mounts") renderMounts(c);
  else if (panel === "memory") renderMemory(c);
  else if (panel === "system") renderSystem(c);
}

function openWebUi() {
  dsh.win.openShell();
  toast("已唤起 Harness 主窗口", `http://127.0.0.1:${config.port}`);
}

let ollamaState = { up: false, models: [] };
let omState = { up: false, lastCheck: null };
let monitorTimer = null;

async function checkOllama() {
  try {
    const res = await fetch(config.local.ollamaUrl + "/api/tags", { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      ollamaState = { up: true, models: (data.models || []).map((m) => m.name) };
    } else {
      ollamaState = { up: false, models: [] };
    }
  } catch {
    ollamaState = { up: false, models: [] };
  }
  if (currentPanel === "models") renderModels(document.getElementById("content"));
}

async function checkOm() {
  try {
    const headers = {};
    if (config.om && config.om.apiKey) headers["x-api-key"] = config.om.apiKey;
    const res = await fetch((config.om && config.om.url || "http://localhost:8080") + "/health", { headers, signal: AbortSignal.timeout(3000) });
    omState = { up: res.ok, lastCheck: new Date() };
  } catch {
    omState = { up: false, lastCheck: new Date() };
  }
  if (currentPanel === "memory") renderMemory(document.getElementById("content"));
  return omState.up;
}

function startMonitor() {
  if (monitorTimer) return;
  monitorTimer = setInterval(() => {
    checkOllama();
    checkOm();
    if (currentPanel === "overview") renderOverview();
  }, 20000);
}

function mountCardHtml(m) {
  const p = config.mounts[m.key] || "";
  return `<div class="mount-item" onclick="dsh.fs.exists('${esc(p)}').then(ok => showMountDetail('${m.key}','${m.name}','${esc(p)}',ok))">
    <div class="name"><span>${m.icon}</span> ${m.name}<span class="state" id="mstate-${m.key}">…</span></div>
    <div class="path">${esc(p)}</div>
  </div>`;
}

function esc(s) {
  return String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

async function showMountDetail(key, name, p, ok) {
  const detail = window.confirm(`${name}\n路径: ${p}\n状态: ${ok ? "存在" : "不存在"}\n\n点击 打开文件夹 浏览内容?`);
  if (detail && ok) dsh.win.openPath(p);
}

async function renderOverview() {
  const c = document.getElementById("content");
  const checks = [];
  for (const m of MOUNTS) checks.push(dsh.fs.exists(config.mounts[m.key] || ""));
  const results = await Promise.all(checks);
  let ok = 0;
  MOUNTS.forEach((m, i) => { if (results[i]) ok++; });
  const bstate = backendState;
  c.innerHTML = `
    <h2>概览</h2>
    <div class="hint">DeepSeek Harness 桌面中枢 · 管理后端引擎与 F 盘资源</div>
    <div class="card">
      <h3>后端状态 <span class="tag" id="ovState">${bstate}</span></h3>
      <div class="row">
        <label>引擎路径</label><input type="text" value="${esc(config.enginePath)}" disabled />
      </div>
      <div class="row">
        <label>端口</label><input type="number" value="${config.port}" disabled style="max-width:120px" />
        <label>模型</label><input type="text" value="${esc(config.api.model)}" disabled style="max-width:200px" />
      </div>
      <div class="row">
        <button class="btn" onclick="dsh.backend.start()">启动</button>
        <button class="btn ghost" onclick="dsh.backend.restart()">重启</button>
        <button class="btn danger" onclick="dsh.backend.stop()">停止</button>
        <button class="btn ghost" onclick="openWebUi()">打开 Harness 主窗口</button>
      </div>
    </div>
    <div class="card">
      <h3>资源挂接 <span class="tag">${ok}/${MOUNTS.length} 正常</span></h3>
      <div class="grid">${MOUNTS.map(mountCardHtml).join("")}</div>
    </div>`;
  MOUNTS.forEach((m, i) => {
    const el = document.getElementById("mstate-" + m.key);
    if (el) { el.className = "state " + (results[i] ? "ok" : "miss"); el.textContent = results[i] ? "存在" : "缺失"; }
  });
}

async function renderModels() {
  const c = document.getElementById("content");
  c.innerHTML = `
    <h2>模型中心</h2>
    <div class="hint">API 模型与本地模型 (Ollama) 统一管理</div>
    <div class="card">
      <h3>API 模型</h3>
      <div class="row"><label>模型名</label><input type="text" id="apiModel" value="${esc(config.api.model)}" /></div>
      <div class="row"><label>密钥环境变量</label><input type="text" id="apiKeyEnv" value="${esc(config.api.keyEnv)}" /></div>
      <div class="row"><label>密钥</label><input type="password" id="apiKey" placeholder="输入新密钥(保存到引擎 .env)" /></div>
      <div class="row"><button class="btn sm" onclick="saveApi()">保存 API 配置</button></div>
    </div>
    <div class="card">
      <h3>本地模型 (Ollama)</h3>
      <div class="row"><label>Ollama 地址</label><input type="text" id="ollamaUrl" value="${esc(config.local.ollamaUrl)}" /></div>
      <div class="row">
        <label>状态</label>
        <div><span class="dot ${ollamaState.up ? "running" : "stopped"}" style="margin-right:6px"></span>${ollamaState.up ? "运行中" : "未运行"}</div>
      </div>
      <div class="row">
        <label>已安装</label>
        <div>${ollamaState.models.length ? ollamaState.models.map((m) => `<span class="tag">${esc(m)}</span>`).join(" ") : '<span class="tag">无/未连接</span>'}</div>
      </div>
      <div class="row">
        <label>常用</label>
        <div>${(config.local.models || []).map((m) => `<span class="tag" style="background:rgba(63,185,80,.12);color:var(--ok)">${esc(m)}</span>`).join(" ")}</div>
      </div>
      <div class="row">
        ${ollamaState.up
          ? `<button class="btn sm ghost" onclick="refreshOllama()">刷新模型列表</button>`
          : `<button class="btn sm" onclick="startOllama()">协助启动 Ollama</button><button class="btn sm ghost" onclick="dsh.win.openExternal('https://ollama.com/download')">下载页</button>`}
      </div>
    </div>
    <div class="card">
      <h3>本地模型引擎 (F:\\AI MODEL)</h3>
      <div class="row">
        <label>目录</label><input type="text" value="${esc(config.mounts.aiModel)}" disabled />
        <button class="btn sm ghost" onclick="dsh.win.openPath('${esc(config.mounts.aiModel)}')">打开</button>
      </div>
      <div class="hint" style="margin-bottom:0">TTS / 视频 / 图像 / LLM 等 30+ 模型引擎目录, 经引擎管理面板注册为工具</div>
    </div>`;
}

async function saveApi() {
  const model = document.getElementById("apiModel").value.trim();
  const keyEnv = document.getElementById("apiKeyEnv").value.trim();
  const key = document.getElementById("apiKey").value.trim();
  config.api.model = model || config.api.model;
  config.api.keyEnv = keyEnv || config.api.keyEnv;
  config = await dsh.config.set({ api: config.api });
  if (key) {
    await dsh.config.saveEnvKey(key);
  }
  window.alert("API 配置已保存" + (key ? "\n密钥已写入引擎 .env (不在壳内存储)" : ""));
  renderModels();
}

async function refreshOm() {
  const up = await checkOm();
  toast(up ? "OpenMemory 运行中" : "OpenMemory 未运行", up ? "localhost:8080" : "", !up);
}

async function refreshOllama() {
  await checkOllama();
  renderModels();
}

async function startOllama() {
  const r = await dsh.ollama.start();
  if (r.ok) {
    toast("Ollama 启动请求已发送", "等待服务就绪...");
    setTimeout(async () => {
      await checkOllama();
      if (ollamaState.up) toast("Ollama 已就绪", ollamaState.models.length + " 个本地模型可用");
      else toast("Ollama 启动中", "请稍候或检查安装", true);
    }, 6000);
  } else {
    toast("Ollama 启动失败", r.error, true);
  }
}

async function startOm() {
  const r = await dsh.om.start();
  if (r.ok) {
    toast("OpenMemory 启动请求已发送", "等待服务就绪 (localhost:8080)...");
    setTimeout(async () => {
      const up = await checkOm();
      toast(up ? "OpenMemory 已就绪" : "OpenMemory 启动中", up ? "" : "请稍候或检查 F:\\OpenMemory", !up);
    }, 8000);
  } else {
    toast("OpenMemory 启动失败", r.error, true);
  }
}

async function renderEngines() {
  const c = document.getElementById("content");
  const engPath = config.mounts.engines;
  const exists = await dsh.fs.exists(engPath);
  c.innerHTML = `
    <h2>引擎管理</h2>
    <div class="hint">F:\\00-engines 引擎库 (130+) · 启动/停止/注册为 dsh 工具</div>
    <div class="card">
      <h3>引擎库</h3>
      <div class="row">
        <label>路径</label><input type="text" value="${esc(engPath)}" disabled />
        <button class="btn sm ghost" onclick="dsh.win.openPath('${esc(engPath)}')">打开目录</button>
      </div>
      <div class="hint" style="margin-bottom:0">${exists ? "目录存在, 引擎按域分类: DEV / MEDIA / ART / WORK / LLM / STUDY / WRITE" : "目录不存在!"}</div>
    </div>
    <div class="card">
      <h3>MCP 服务器 (F:\\MCP\\servers)</h3>
      <div class="row">
        <label>配置</label><input type="text" value="${esc(config.mounts.mcp)}" disabled />
        <button class="btn sm ghost" onclick="dsh.win.openPath('${esc(config.mounts.mcp)}')">打开</button>
      </div>
      <div class="hint" style="margin-bottom:0">20+ MCP 服务器: local-llm / gate-check / miao-api / obsidian / comfyui / grok-cookie ... 与 dsh 工具注册联动</div>
    </div>`;
}

async function renderMounts() {
  const c = document.getElementById("content");
  const existsMap = await Promise.all(MOUNTS.map((m) => dsh.fs.exists(config.mounts[m.key] || "")));
  const rows = MOUNTS.map((m, i) => {
    const p = config.mounts[m.key] || "";
    const ok = existsMap[i];
    return `<div class="card">
      <h3>${m.icon} ${m.name} <span class="tag" style="color:${ok ? "var(--ok)" : "var(--err)"}">${ok ? "存在" : "缺失"}</span></h3>
      <div class="row">
        <label>路径</label>
        <input type="text" id="mnt-${m.key}" value="${esc(p)}" />
        <button class="btn sm ghost" onclick="dsh.win.openPath('${esc(p)}')" ${ok ? "" : "disabled"}>打开</button>
      </div>
      <div class="row"><button class="btn sm" onclick="saveMount('${m.key}')">保存</button></div>
    </div>`;
  });
  c.innerHTML = `<h2>资源挂接</h2><div class="hint">修改路径后点保存, 壳子启动时自动校验</div>${rows.join("")}`;
}

async function saveMount(key) {
  const v = document.getElementById("mnt-" + key).value.trim();
  config = await dsh.config.setMount(key, v);
  window.alert("已保存: " + v);
}

async function renderMemory() {
  const c = document.getElementById("content");
  const omUp = omState.up;
  const omText = omUp
    ? "OpenMemory 运行中 (localhost:8080) · 最近检测 " + (omState.lastCheck ? omState.lastCheck.toLocaleTimeString() : "-")
    : "OpenMemory 未运行 (自动监控中, 20s检测一次)";
  c.innerHTML = `
    <h2>记忆中枢</h2>
    <div class="hint">五层记忆架构 · L0工作 / L1闪存 / L2会话 / L3KG结晶 / L4 OpenMemory</div>
    <div class="card">
      <h3>OpenMemory (L4) <span class="tag" style="color:${omUp ? "var(--ok)" : "var(--err)"}">${omUp ? "运行中" : "未运行"}</span></h3>
      <div class="hint" style="margin-bottom:8px">${omText}</div>
      <div class="row" style="margin-top:4px">
        ${omUp
          ? `<button class="btn sm ghost" onclick="dsh.win.openExternal('http://localhost:8080')">打开 OM 面板</button>`
          : `<button class="btn sm" onclick="startOm()">运行 OpenMemory</button>`}
        <button class="btn sm ghost" onclick="dsh.win.openPath('F:\\\\OpenMemory')">打开 OM 目录</button>
        <button class="btn sm ghost" onclick="refreshOm()">立即检测</button>
      </div>
    </div>
    <div class="card">
      <h3>记忆目录</h3>
      <div class="row"><label>记忆中枢</label><input type="text" value="${esc(config.mounts.memory)}" disabled /><button class="btn sm ghost" onclick="dsh.win.openPath('${esc(config.mounts.memory)}')">打开</button></div>
      <div class="row"><label>会话记忆</label><input type="text" value="${esc(config.mounts.memory)}\\会话记忆" disabled /><button class="btn sm ghost" onclick="dsh.win.openPath('${esc(config.mounts.memory)}\\会话记忆')">打开</button></div>
      <div class="row"><label>KG结晶</label><input type="text" value="${esc(config.mounts.memory)}\\KG结晶" disabled /><button class="btn sm ghost" onclick="dsh.win.openPath('${esc(config.mounts.memory)}\\KG结晶')">打开</button></div>
    </div>`;
}

async function renderSystem() {
  const c = document.getElementById("content");
  c.innerHTML = `
    <h2>系统设置</h2>
    <div class="hint">壳子行为配置</div>
    <div class="card">
      <h3>后端</h3>
      <div class="row"><label>引擎路径</label><input type="text" id="sysEngine" value="${esc(config.enginePath)}" /></div>
      <div class="row"><label>端口</label><input type="number" id="sysPort" value="${config.port}" style="max-width:120px" /></div>
      <div class="row"><label>模型</label><input type="text" id="sysModel" value="${esc(config.api.model)}" style="max-width:220px" /></div>
      <div class="row"><button class="btn" onclick="saveSystem()">保存并重启后端</button></div>
    </div>
    <div class="card">
      <h3>快捷键 / 自启</h3>
      <div class="row"><label>用户名</label><input type="text" id="sysUser" value="${esc(config.userName || "海龙龙")}" style="max-width:180px" /></div>
      <div class="row"><label>快捷键</label><input type="text" id="sysHotkey" value="${esc(config.hotkey)}" style="max-width:180px" /></div>
      <div class="row">
        <label>开机自启</label>
        <select id="sysAuto"><option value="false" ${!config.autoStart ? "selected" : ""}>关</option><option value="true" ${config.autoStart ? "selected" : ""}>开</option></select>
      </div>
    </div>
    <div class="card">
      <h3>主题 / 语言</h3>
      <div class="row">
        <label>外观</label>
        <select id="sysTheme"><option value="light" ${config.theme === "light" ? "selected" : ""}>浅色</option><option value="dark" ${config.theme === "dark" ? "selected" : ""}>深色</option><option value="system" ${config.theme === "system" ? "selected" : ""}>跟随系统</option></select>
      </div>
      <div class="row">
        <label>皮肤</label>
        <select id="sysSkin">
          <option value="default-light" ${config.skin === "default-light" ? "selected" : ""}>默认浅色</option>
          <option value="default-dark" ${config.skin === "default-dark" ? "selected" : ""}>默认深色</option>
          <option value="codex-dark" ${config.skin === "codex-dark" ? "selected" : ""}>Codex 暗色</option>
          <option value="vscode-dark" ${config.skin === "vscode-dark" ? "selected" : ""}>VS Code Dark+</option>
          <option value="onedark" ${config.skin === "onedark" ? "selected" : ""}>One Dark Pro</option>
          <option value="tokyo-night" ${config.skin === "tokyo-night" ? "selected" : ""}>Tokyo Night</option>
          <option value="nord" ${config.skin === "nord" ? "selected" : ""}>Nord</option>
          <option value="kanagawa" ${config.skin === "kanagawa" ? "selected" : ""}>Kanagawa 和风</option>
          <option value="solarized" ${config.skin === "solarized" ? "selected" : ""}>Solarized 复古</option>
          <option value="gruvbox" ${config.skin === "gruvbox" ? "selected" : ""}>Gruvbox 复古暖</option>
          <option value="berserk" ${config.skin === "berserk" ? "selected" : ""}>剑风传奇 Berserk</option>
        </select>
        <span style="font-size:11px;color:var(--text2)">主窗口标题栏 ◐ 即时切换</span>
      </div>
      <div class="row">
        <label>界面语言</label>
        <select id="sysLang">
          <option value="zh" ${config.lang === "zh" ? "selected" : ""}>中文</option>
          <option value="zh-yue" ${config.lang === "zh-yue" ? "selected" : ""}>粤语</option>
          <option value="mn" ${config.lang === "mn" ? "selected" : ""}>蒙古语</option>
          <option value="bo" ${config.lang === "bo" ? "selected" : ""}>藏语</option>
          <option value="ug" ${config.lang === "ug" ? "selected" : ""}>维吾尔语</option>
          <option value="yi" ${config.lang === "yi" ? "selected" : ""}>彝语</option>
        </select>
        <span style="font-size:11px;color:var(--text2)">切换后重启壳子生效</span>
      </div>
    </div>
    <div class="card">
      <h3>关于</h3>
      <div class="row"><label>版本</label><input type="text" value="dsh-desktop v0.1.0 (Electron壳)" disabled style="max-width:220px" /></div>
      <div class="row"><label>引擎</label><input type="text" value="deepseek-harness @deepseek-ai/dsh" disabled style="max-width:260px" /></div>
      <div class="row"><button class="btn sm ghost" onclick="dsh.win.openExternal('https://github.com/deepseek-ai/dsh')">dsh 官方仓库</button></div>
    </div>`;
}

async function saveSystem() {
  const enginePath = document.getElementById("sysEngine").value.trim();
  const port = parseInt(document.getElementById("sysPort").value);
  const model = document.getElementById("sysModel").value.trim();
  const hotkey = document.getElementById("sysHotkey").value.trim();
  const autoStart = document.getElementById("sysAuto").value === "true";
  const theme = document.getElementById("sysTheme").value;
  const skin = document.getElementById("sysSkin").value;
  const lang = document.getElementById("sysLang").value;
  const userName = (document.getElementById("sysUser").value || "海龙龙").trim();
  config = await dsh.config.set({ enginePath, port, hotkey, autoStart, theme, skin, lang, userName });
  applyTheme();
  if (model) config = await dsh.config.set({ api: { ...config.api, model } });
  renderVer();
  renderBackendState(backendState);
  const ok = await dsh.fs.exists(enginePath);
  if (!ok) { window.alert("引擎路径不存在, 请检查"); return; }
  dsh.backend.restart();
  window.alert("已保存, 后端重启中");
}

init();