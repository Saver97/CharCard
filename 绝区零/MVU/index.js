// MVU面板聚合 — 在build-all.js中调用
// 读取所有面板文件并生成完整的初始变量/更新规则/输出格式
const fs = require("fs");
const path = require("path");

const MVU_DIR = __dirname;

function loadAllPanels() {
  const files = fs.readdirSync(MVU_DIR).filter(f => f.endsWith(".js") && f !== "index.js");
  const panels = [];
  for (const f of files) {
    const fp = path.join(MVU_DIR, f);
    try {
      const mod = require(fp);
      panels.push(mod);
    } catch (e) {
      console.warn(`⚠ 无法加载面板 ${f}: ${e.message}`);
    }
  }
  return panels;
}

function generateInitYAML(panels) {
  let yaml = `---\n`;
  for (const panel of panels) {
    for (const [key, v] of Object.entries(panel.variables || {})) {
      yaml += `${key}: ${formatVar(v.default)}\n`;
    }
    for (const [key, v] of Object.entries(panel.variableTemplate || {})) {
      // Use the template key format, but actual NPC names are added dynamically
      // Only include the abstract template in the init
      yaml += `# ${v.desc}\n`;
    }
  }
  return yaml;
}

function generateUpdateRules(panels) {
  let rules = `# 绝区零 MVU 更新规则 — 由面板定义自动生成\n`;
  for (const panel of panels) {
    if (panel.rules && panel.rules.length > 0) {
      rules += `\n# ===== ${panel.name} =====\n`;
      for (const r of panel.rules) {
        rules += `- ${r}\n`;
      }
    }
  }
  return rules;
}

function generateVariableList() {
  return `---\n<status_current_variables>\n{{format_message_variable::stat_data}}\n</status_current_variables>`;
}

function generateOutputFormat() {
  return `---\noutput_format: |\n  <UpdateVariable>\n  <Analysis>简述变动因果</Analysis>\n  <JSONPatch>\n  [{ "op": "replace", "path": "/stat_data/目标路径", "value": 新值 }]\n  </JSONPatch>\n  </UpdateVariable>`;
}

function formatVar(val) {
  if (typeof val === "string") return `"${val}"`;
  if (Array.isArray(val)) return JSON.stringify(val);
  return String(val);
}

module.exports = { loadAllPanels, generateInitYAML, generateUpdateRules, generateVariableList, generateOutputFormat };