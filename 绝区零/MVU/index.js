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
  let rules = `# 绝区零 MVU 更新规则 — 合法路径白名单（与 schema.ts 单一对齐）\n\n`;
  rules += `# 路径采用 JSON Pointer 形式（斜杠分隔，无 stat_data 前缀）\n`;
  rules += `# 操作标注：replace=替换值 | add /-=数组追加 | add /key=对象动态键 | remove=删除\n`;
  rules += `# ★ 标记为高频错误点，务必遵守操作约束\n\n`;
  rules += `## 世界\n`;
  rules += `/世界/当前时间        string  replace\n`;
  rules += `/世界/当前地点        string  replace\n`;
  rules += `/世界/当前章节        string  replace\n`;
  rules += `/世界/当天计划        string  replace\n`;
  rules += `/世界/天气            string  replace\n`;
  rules += `/世界/城市流言        string  replace（★ 禁止 add）\n`;
  rules += `/世界/绳网活跃度      string  replace\n\n`;
  rules += `## 主角\n`;
  rules += `/主角/基础/姓名          string   replace\n`;
  rules += `/主角/基础/是否为法厄同  boolean  replace\n`;
  rules += `/主角/基础/所属势力      string   replace\n`;
  rules += `/主角/基础/性别          string   replace\n`;
  rules += `/主角/基础/年龄          string   replace\n`;
  rules += `/主角/基础/身份          string   replace\n`;
  rules += `/主角/基础/当前行动      string   replace\n`;
  rules += `/主角/基础/当前目标      string   replace\n`;
  rules += `/主角/基础/金钱          number   replace\n`;
  rules += `/主角/状态/HP            number   replace\n`;
  rules += `/主角/状态/发情度        number   replace（range 0~100）\n`;
  rules += `/主角/状态/以太侵蚀度    number   replace（range 0~100）\n`;
  rules += `/主角/属性/以太适应性    number   replace（range 0~100）\n`;
  rules += `/主角/属性/战斗能力      string   replace\n`;
  rules += `/主角/属性/种族          string   replace\n`;
  rules += `/主角/属性/特殊能力      string   replace\n`;
  rules += `/主角/角色类型           string   replace\n`;
  rules += `/主角/当前情绪           string   replace\n`;
  rules += `/主角/战斗定位           string   replace\n`;
  rules += `/主角/同伴               string[] add /主角/同伴/- | remove /主角/同伴/{索引}\n`;
  rules += `/主角/着装/上衣          string   replace（★ 6格固定key）\n`;
  rules += `/主角/着装/下装          string   replace\n`;
  rules += `/主角/着装/内衣          string   replace\n`;
  rules += `/主角/着装/内裤          string   replace\n`;
  rules += `/主角/着装/鞋子          string   replace\n`;
  rules += `/主角/着装/饰品          string   replace\n`;
  rules += `/主角/背包/{物品名}      {数量:number,描述:string}  add /主角/背包/{物品名}（★ record 禁用 /-）| remove /主角/背包/{物品名}\n\n`;
  rules += `## 空洞\n`;
  rules += `/空洞/当前空洞       string   replace\n`;
  rules += `/空洞/以太浓度       string   replace\n`;
  rules += `/空洞/探索进度       number   replace\n`;
  rules += `/空洞/研究音擎       string[] add /空洞/研究音擎/- | remove /空洞/研究音擎/{索引}\n`;
  rules += `/空洞/以骸威胁等级   string   replace\n`;
  rules += `/空洞/萝卜质量       string   replace\n`;
  rules += `/空洞/剩余安全时间   string   replace\n\n`;
  rules += `## 阵营（8个，仅 number）\n`;
  rules += `/阵营/狡兔屋 | /阵营/对空六课 | /阵营/白祇重工 | /阵营/维多利亚家政 | /阵营/卡吕冬之子 | /阵营/治安局 | /阵营/天琴座 | /阵营/云岿山    number  replace\n\n`;
  rules += `## 邦布\n`;
  rules += `/邦布/伊埃斯电量     number   replace\n`;
  rules += `/邦布/邦布伙伴       string   replace（★ 仅1只，旧邦布自动回拥有的邦布列表）\n`;
  rules += `/邦布/装备技能       string   replace\n`;
  rules += `/邦布/维修状态       string   replace\n`;
  rules += `/邦布/邦布心情       string   replace\n`;
  rules += `/邦布/拥有的邦布     string[] add /邦布/拥有的邦布/-（★ 禁止 add 对象到 /邦布/xxx）\n\n`;
  rules += `## 任务\n`;
  rules += `/任务/已激活                     string[] add /任务/已激活/- | remove /任务/已激活/{索引}\n`;
  rules += `/任务/详情/{任务名}              record   add /任务/详情/{任务名}（对象）| remove /任务/详情/{任务名}\n`;
  rules += `/任务/详情/{任务名}/状态         string   replace\n`;
  rules += `/任务/详情/{任务名}/委托人       string   replace\n`;
  rules += `/任务/详情/{任务名}/报酬         string   replace\n`;
  rules += `/任务/详情/{任务名}/线索         string[] add /任务/详情/{任务名}/线索/-\n\n`;
  rules += `## NPCs（{名称}为动态键，首次登场女角色须 add /NPCs/{名称} 完整对象）\n`;
  rules += `/NPCs/{名称}                                  record  add /NPCs/{名称}（完整对象）| remove /NPCs/{名称}\n`;
  rules += `/NPCs/{名称}/基础/性别 | /NPCs/{名称}/基础/年龄 | /NPCs/{名称}/基础/身份 | /NPCs/{名称}/基础/当前位置 | /NPCs/{名称}/基础/动作 | /NPCs/{名称}/基础/金钱 | /NPCs/{名称}/基础/当前目标 | /NPCs/{名称}/基础/实时内心想法 | /NPCs/{名称}/基础/个人社交网络    replace\n`;
  rules += `/NPCs/{名称}/关系/好感度 | /NPCs/{名称}/关系/信任度 | /NPCs/{名称}/关系/修罗场    number  replace（range 0~100）\n`;
  rules += `/NPCs/{名称}/关系/对主角看法    string  replace（★ 关系仅此4字段，禁关键记忆/好感等级等）\n`;
  rules += `/NPCs/{名称}/性格/底色 | /NPCs/{名称}/性格/日常 | /NPCs/{名称}/性格/内在 | /NPCs/{名称}/性格/当前情绪    string  replace\n`;
  rules += `/NPCs/{名称}/过往经历 | /NPCs/{名称}/容貌身材    string  replace\n`;
  rules += `/NPCs/{名称}/着装/{上衣|下装|内衣|内裤|鞋子|饰品}    {名称,品质,描述}  replace（★ 6格固定key，禁头部/身体/足部）\n`;
  rules += `/NPCs/{名称}/私密档案/发情度 | /NPCs/{名称}/私密档案/常识崩坏度 | /NPCs/{名称}/私密档案/受孕概率    number  replace（range 0~100）\n`;
  rules += `/NPCs/{名称}/私密档案/体温 | /NPCs/{名称}/私密档案/体液分泌 | /NPCs/{名称}/私密档案/身体反应 | /NPCs/{名称}/私密档案/隐藏性癖 | /NPCs/{名称}/私密档案/生理周期    string  replace\n`;
  rules += `/NPCs/{名称}/私密档案/器官状态/{唇齿|双峰|双手|双足|幽谷|秘穴}    {开发度,描述}  replace\n\n`;
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