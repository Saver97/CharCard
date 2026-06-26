// MVU面板聚合 — 在build-all.js中调用
const fs = require("fs");
const path = require("path");
const MVU_DIR = __dirname;

function loadAllPanels() {
  const files = fs.readdirSync(MVU_DIR).filter(f => f.endsWith(".js") && f !== "index.js");
  const panels = [];
  for (const f of files) {
    const fp = path.join(MVU_DIR, f);
    try { const mod = require(fp); if (mod && typeof mod === 'object' && mod.name) panels.push({ ...mod, filename: f.replace('.js', '') }); }
    catch (e) { console.warn(`⚠ 无法加载面板 ${f}: ${e.message}`); }
  }
  return panels;
}

function generateInitYAML(panels) {
  let yaml = `---\n`;
  for (const panel of panels) {
    for (const [key, v] of Object.entries(panel.variables || {}))
      yaml += `${key}: ${formatVar(v.default)}\n`;
    for (const [key, v] of Object.entries(panel.variableTemplate || {}))
      yaml += `# ${v.desc}\n`;
  }
  return yaml;
}

function generateUpdateRules(panels) {
  let rules = `# 绝区零 MVU 更新规则 — 由面板定义自动生成\n\n> 【合法路径白名单】\n> 世界.<当前时间|当前地点|当前章节|当天计划|天气|城市流言|绳网活跃度>\n> 主角.基础.<姓名|是否为法厄同|所属势力|性别|年龄|身份|当前行动|金钱>\n> 主角.状态.<HP|发情度|以太侵蚀度> / 主角.属性.<以太适应性|战斗能力|种族|特殊能力>\n> 主角.<角色类型|当前情绪|战斗定位> / 主角.着装.<头部|身体|足部|饰品> / 主角.背包.<物品名>\n> 空洞.<当前空洞|以太浓度|探索进度|研究音擎|以骸威胁等级|萝卜质量|剩余安全时间>\n> 阵营.<狡兔屋|对空六课|白祇重工|维多利亚家政|卡吕冬之子|治安局|天琴座|云岿山>\n> 邦布.<伊埃斯电量|邦布伙伴|装备技能|维修状态|邦布心情|拥有的邦布>\n> NPCs.<名称>.基础.<性别|年龄|身份|当前位置|动作|金钱|当前目标|实时内心想法|个人社交网络>\n> NPCs.<名称>.关系.<好感度|信任度|修罗场|对主角看法> / NPCs.<名称>.性格.<底色|日常|内在|当前情绪>\n> NPCs.<名称>.着装.<部位>.<名称|品质|描述>\n> NPCs.<名称>.私密档案.<发情度|常识崩坏度|体温|体液分泌|身体反应|隐藏性癖|生理周期|受孕概率>\n> NPCs.<名称>.私密档案.器官状态.<部位>.<开发度|描述>\n\n`;
  for (const panel of panels) {
    if (panel.rules && panel.rules.length > 0) {
      rules += `\n# ===== ${panel.name} =====\n`;
      for (const r of panel.rules) rules += `- ${r}\n`;
    }
  }
  return rules;
}

function generatePanelEntries(panels) {
  const entries = [];
  for (const panel of panels) {
    const fileName = panel.filename || panel.name.replace(/[()]/g, '').replace(/\s+/g, '_');
    let yaml = `---\nname: "${panel.name}"\ntriggers:\n`;
    if (panel.triggers) for (const t of panel.triggers) yaml += `  - "${t}"\n`;
    yaml += `description: "${panel.description || ''}"\n`;
    if (panel.variables) { yaml += `variables:\n`; for (const [key, v] of Object.entries(panel.variables)) yaml += `  ${key}: { type: "${v.type}", default: ${formatVar(v.default)}, desc: "${v.desc}" }\n`; }
    if (panel.variableTemplate) { yaml += `variable_template:\n`; for (const [key, v] of Object.entries(panel.variableTemplate)) yaml += `  ${key}: { type: "${v.type}", default: ${formatVar(v.default)}, desc: "${v.desc}" }\n`; }
    yaml += `rules:\n`;
    if (panel.rules) for (const r of panel.rules) yaml += `  - "${r.replace(/"/g, '\\"')}"\n`;
    entries.push({ name: panel.name, fileName, yaml });
  }
  return entries;
}

function generateVariableList() {
  return `---\n<status_current_variables>\n{{format_message_variable::stat_data}}\n</status_current_variables>`;
}

function generateOutputFormat() {
  try {
    const fmt = require("./变量输出格式.js");
    return `---\n` + (typeof fmt === 'string' ? fmt : JSON.stringify(fmt));
  } catch(e) {
    console.warn("⚠ 无法加载 变量输出格式.js，使用默认格式");
    return `---\n变量输出格式:\n  format: |\n    <UpdateVariable>\n    <Analysis>简述本回合变量变动因果（中文，80字内）</Analysis>\n    <JSONPatch>\n    [...]\n    </JSONPatch>\n    </UpdateVariable>`;
  }
}

function formatVar(val) {
  if (typeof val === "string") return `"${val}"`;
  if (Array.isArray(val)) return JSON.stringify(val);
  return String(val);
}

module.exports = { loadAllPanels, generateInitYAML, generateUpdateRules, generatePanelEntries, generateVariableList, generateOutputFormat };