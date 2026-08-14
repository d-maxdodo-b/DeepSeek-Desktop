// dsh 界面多语言词条表 · 扩展语言包
// key: 源文案(英文/中文) → 各语言翻译
// 语言码: zh(中文) / zh-yue(粤语) / mn(蒙古语) / bo(藏语) / ug(维吾尔语) / yi(彝语) ...
// 用法: 由 ui-inject.js 的 translateStrings 按当前语言码取映射
// 少数民族语言翻译为拼音近似/常用注音方案, 实际应用中可替换为标准文字

const LANG_PACKS = {
  zh: {
    "Session log": "会话日志",
    "Session Log": "会话日志",
    "Explore": "探索",
    "Settings": "设置",
    "New session": "新会话",
    "New Session": "新会话",
    "Create mode": "创造模式",
    "creative mode": "创造模式",
    "Workspace": "工作区",
    "Conversation": "对话",
    "Trajectory": "轨迹",
    "Stop": "停止",
    "Send": "发送",
    "Model": "模型"
  },
  "zh-yue": {
    "Session log": "對話紀錄",
    "Settings": "設定",
    "New session": "新對話",
    "Explore": "探索",
    "Workspace": "工作區",
    "Conversation": "對話",
    "Trajectory": "軌跡"
  },
  mn: {
    "Session log": "会话日志 (Харилцааны тэмдэглэл)",
    "Settings": "设置 (Тохиргоо)",
    "New session": "新会话 (Шинэ яриа)",
    "Conversation": "对话 (Яриа)",
    "Trajectory": "轨迹 (Мөр)"
  },
  bo: {
    "Session log": "会话日志 (གླེང་མོལ་ཐོ་གཞུང)",
    "Settings": "设置 (སྒྲིག་སྟངས)",
    "New session": "新会话 (གླེང་མོལ་གསར་པ)",
    "Conversation": "对话 (གླེང་མོལ)",
    "Trajectory": "轨迹 (རྗེས་རྟགས)"
  },
  ug: {
    "Session log": "会话日志 (سۆھبەت خاتىرىسى)",
    "Settings": "设置 (تەڭشەك)",
    "New session": "新会话 (يېڭى سۆھبەت)",
    "Conversation": "对话 (سۆھبەت)",
    "Trajectory": "轨迹 (ئىز)"
  },
  yi: {
    "Session log": "会话日志 (ꉂꏣꀘꐛ)",
    "Settings": "设置 (ꌧꇐ)",
    "New session": "新会话 (ꉂꏣꃅꇏ)",
    "Conversation": "对话 (ꉂꏣ)",
    "Trajectory": "轨迹 (ꄿꃛ)"
  }
};

// 可用语言列表(供壳子设置面板选择)
const LANG_CODES = Object.keys(LANG_PACKS);

if (typeof window !== "undefined") {
  window.__dshLangs = { LANG_PACKS, LANG_CODES };
}
if (typeof module !== "undefined") {
  module.exports = { LANG_PACKS, LANG_CODES };
}