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
      panels.push({ ...mod, filename: f.replace('.js', '') });
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

function generatePanelEntries(panels) {
  // Generate individual YAML entries for each panel with name + triggers
  const entries = [];
  for (const panel of panels) {
    const fileName = panel.filename || panel.name.replace(/[()]/g, '').replace(/\s+/g, '_');
    let yaml = `---\nname: "${panel.name}"\ntriggers:\n`;
    if (panel.triggers && panel.triggers.length > 0) {
      for (const t of panel.triggers) {
        yaml += `  - "${t}"\n`;
      }
    }
    yaml += `description: "${panel.description || ''}"\n`;
    if (panel.variables) {
      yaml += `variables:\n`;
      for (const [key, v] of Object.entries(panel.variables)) {
        yaml += `  ${key}: { type: "${v.type}", default: ${formatVar(v.default)}, desc: "${v.desc}" }\n`;
      }
    }
    if (panel.variableTemplate) {
      yaml += `variable_template:\n`;
      for (const [key, v] of Object.entries(panel.variableTemplate)) {
        yaml += `  ${key}: { type: "${v.type}", default: ${formatVar(v.default)}, desc: "${v.desc}" }\n`;
      }
    }
    yaml += `rules:\n`;
    if (panel.rules) {
      for (const r of panel.rules) {
        yaml += `  - "${r.replace(/"/g, '\\"')}"\n`;
      }
    }
    entries.push({ name: panel.name, fileName, yaml });
  }
  return entries;
}

function generateVariableList() {
  return `---\n<status_current_variables>\n{{format_message_variable::stat_data}}\n</status_current_variables>`;
}

function generateOutputFormat() {
  return `---\n变量输出格式:\n  rule:\n    - 你必须在回复末尾输出变量更新分析和实际更新命令\n    - 更新命令遵循 JSON Patch (RFC 6902) 标准，必须是包含操作对象的有效 JSON 数组\n    - 支持以下操作：\n      - replace: 替换现有路径的值\n      - add: 向对象或数组中插入新项（使用 \\"-\\" 作为数组索引表示追加到末尾）\n      - remove: 删除路径\n    - 不要更新以 \\"_\\" 开头的字段名，它们是只读的\n  format: |\n    <UpdateVariable>\n    <Analysis>在此简述本回合的变量变动因果（中文，不超过80字）</Analysis>\n    <JSONPatch>\n    [\n      { "op": "replace", "path": "/世界/当前时间", "value": "..." },\n      { "op": "replace", "path": "/主角/基础/金钱", "value": 5000 },\n      { "op": "add", "path": "/NPCs/角色名", "value": { "基础": {...}, "关系": {...} } },\n      { "op": "add", "path": "/主角/道具/-", "value": "..." },\n      { "op": "remove", "path": "/主角/道具/0" },\n      ...\n    ]\n    </JSONPatch>\n    </UpdateVariable>`;
}

function formatVar(val) {
  if (typeof val === "string") return `"${val}"`;
  if (Array.isArray(val)) return JSON.stringify(val);
  return String(val);
}

module.exports = { loadAllPanels, generateInitYAML, generateUpdateRules, generatePanelEntries, generateVariableList, generateOutputFormat };