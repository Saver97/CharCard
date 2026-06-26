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
  let rules = `# 绝区零 MVU 更新规则 — 由面板定义自动生成\n\n【合法路径白名单】\n`;
  rules += `  世界.当前时间 | 世界.当前地点 | 世界.当前章节 | 世界.当天计划 | 世界.天气 | 世界.城市流言 | 世界.绳网活跃度\n`;
  rules += `  主角.基础.<姓名|是否为法厄同|所属势力|性别|年龄|身份|当前行动|金钱>\n`;
  rules += `  主角.状态.<HP|发情度|以太侵蚀度>\n`;
  rules += `  主角.属性.<以太适应性|战斗能力|种族|特殊能力>\n`;
  rules += `  主角.<角色类型|当前情绪|战斗定位> | 主角.同伴 (string[]) | 主角.着装.<头部|身体|足部|饰品> | 主角.背包.<物品名>\n`;
  rules += `  空洞.<当前空洞|以太浓度|探索进度|研究音擎|以骸威胁等级|萝卜质量|剩余安全时间>\n`;
  rules += `  阵营.<狡兔屋|对空六课|白祇重工|维多利亚家政|卡吕冬之子|治安局|天琴座|云岿山>\n`;
  rules += `  邦布.<伊埃斯电量|邦布伙伴(string[])|装备技能|维修状态|邦布心情|拥有的邦布(string[])>\n`;
  rules += `  NPCs.<名称>.基础.<性别|年龄|身份|当前位置|动作|金钱|当前目标|实时内心想法|个人社交网络>\n`;
  rules += `  NPCs.<名称>.关系.<好感度|信任度|修罗场|对主角看法> | NPCs.<名称>.性格.<底色|日常|内在|当前情绪>\n`;
  rules += `  NPCs.<名称>.<过往经历|容貌身材> | NPCs.<名称>.着装.<部位>.<名称|品质|描述>\n`;
  rules += `  NPCs.<名称>.私密档案.<发情度|...> | NPCs.<名称>.私密档案.器官状态.<部位>.<开发度|描述>\n`;
  rules += `\n`;
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
  return `---\n变量输出格式:\n  rule:\n    - 你必须在回复末尾以 <UpdateVariable> 块输出变量更新，包含 <Analysis> 和 <JSONPatch>\n    - 更新命令遵循 JSON Patch (RFC 6902) 标准，支持 replace / add / remove 操作\n    - 【绝对强制】JSON Patch 中的 path 必须在以下合法路径范围内——绝不允许使用未列出的路径！\n  \n  【合法路径表（仅允许以下路径）】:\n    世界.当前时间 | 世界.当前地点 | 世界.当前章节 | 世界.当天计划 | 世界.天气 | 世界.城市流言 | 世界.绳网活跃度\n    主角.基础.姓名 | 主角.基础.是否为法厄同 | 主角.基础.所属势力 | 主角.基础.性别 | 主角.基础.年龄 | 主角.基础.身份 | 主角.基础.当前行动 | 主角.基础.金钱\n    主角.状态.HP | 主角.状态.发情度 | 主角.状态.以太侵蚀度\n    主角.属性.以太适应性 | 主角.属性.战斗能力 | 主角.属性.种族 | 主角.属性.特殊能力\n    主角.角色类型 | 主角.当前情绪 | 主角.战斗定位\n    主角.同伴（字符串数组，使用 /主角/同伴/0 访问元素，/主角/同伴/- 添加）\n    主角.着装.头部 | 主角.着装.身体 | 主角.着装.足部 | 主角.着装.饰品（均为字符串）\n    主角.背包.{物品名}（每个物品为 {数量: number, 描述: string}，add 时用 /主角/背包/物品名）\n    空洞.当前空洞 | 空洞.以太浓度 | 空洞.探索进度 | 空洞.研究音擎 | 空洞.以骸威胁等级 | 空洞.萝卜质量 | 空洞.剩余安全时间\n    阵营.狡兔屋 | 阵营.对空六课 | 阵营.白祇重工 | 阵营.维多利亚家政 | 阵营.卡吕冬之子 | 阵营.治安局 | 阵营.天琴座 | 阵营.云岿山\n    邦布.伊埃斯电量 | 邦布.邦布伙伴（字符串数组）| 邦布.装备技能 | 邦布.维修状态 | 邦布.邦布心情 | 邦布.拥有的邦布（字符串数组，add 到 /邦布/拥有的邦布/-）\n    NPCs.{名称}.基础.{性别|年龄|身份|当前位置|动作|金钱|当前目标|实时内心想法|个人社交网络}\n    NPCs.{名称}.关系.{好感度|信任度|修罗场|对主角看法}\n    NPCs.{名称}.性格.{底色|日常|内在|当前情绪}\n    NPCs.{名称}.过往经历 | NPCs.{名称}.容貌身材\n    NPCs.{名称}.着装.{头部|身体|足部|饰品|武器}.{名称|品质|描述}（NPC着装是子对象，如 /NPCs/妮可/着装/头部/名称）\n    NPCs.{名称}.私密档案.{发情度|常识崩坏度|体温|体液分泌|身体反应|隐藏性癖|生理周期|受孕概率}\n    NPCs.{名称}.私密档案.器官状态.{唇齿|双峰|双手|双足|幽谷|秘穴}.{开发度|描述}\n  \n  format: |\n    <UpdateVariable>\n    <Analysis>在此简述本回合变量变动因果（中文，不超过80字）</Analysis>\n    <JSONPatch>\n    [\n      { "op": "replace", "path": "/世界/当前时间", "value": "新艾利都历·清晨 07:45" },\n      { "op": "replace", "path": "/主角/基础/金钱", "value": 50000 },\n      { "op": "add", "path": "/NPCs/妮可", "value": { "基础": { "性别": "女", "年龄": "20+岁", "身份": "狡兔屋老大", "当前位置": "六分街", "动作": "算账", "金钱": 1000, "当前目标": "找委托", "实时内心想法": "这个月赤字完蛋了", "个人社交网络": "狡兔屋全员" }, "关系": { "好感度": 55, "信任度": 60, "对主角看法": "老熟人" } } },\n      { "op": "add", "path": "/主角/同伴/-", "value": "安比" },\n      { "op": "add", "path": "/主角/背包/咖啡", "value": { "数量": 1, "描述": "六分街便利店的热咖啡" } },\n      { "op": "remove", "path": "/主角/同伴/0" },\n      ...\n    ]\n    </JSONPatch>\n    </UpdateVariable>`;
}

function formatVar(val) {
  if (typeof val === "string") return `"${val}"`;
  if (Array.isArray(val)) return JSON.stringify(val);
  return String(val);
}

module.exports = { loadAllPanels, generateInitYAML, generateUpdateRules, generatePanelEntries, generateVariableList, generateOutputFormat };