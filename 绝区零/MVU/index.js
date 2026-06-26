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
  rules += `## ⚠️ 顶级铁律（违反即失败）\n`;
  rules += `- 【绝对静默】未发生实质性变化的变量，直接忽略其路径，禁止输出 replace。禁止用"无/未知/同前"覆写原有数据\n`;
  rules += `- 【防打包覆写】禁止 replace 父级对象（如 /NPCs/{名称}/私密档案、/主角/背包、/NPCs/{名称}/性格），必须精确到叶子节点（如 /NPCs/{名称}/私密档案/发情度）。打包替换会清空该对象下其他未提及的设定，导致灾难性数据丢失\n`;
  rules += `- 【死者静默】NPC 死亡后，禁止继续更新其 动作/实时内心想法/私密档案。死人不会有想法\n`;
  rules += `- 【物资守恒】交易/结算报酬/被劫掠时，必须同时更新双方金钱或背包，物资不凭空产生或消失\n\n`;
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
  rules += `/主角/状态/HP:\n  type: number\n  check:\n    - 战斗受伤减少，治疗/休息恢复\n`;
  rules += `/主角/状态/发情度:\n  type: number\n  range: 0~100\n  check:\n    - 视线+1~5、接触+5~15、亲吻+15~30、前戏+30~50、性行为+50~70\n    - 每回合自然衰减-2\n    - 受到魅惑/催情类影响或与NPC深层身体接触时剧烈增加\n`;
  rules += `/主角/状态/以太侵蚀度:\n  type: number\n  range: 0~100\n  check:\n    - 在空洞中随时间增加，离开后缓慢降低\n    - 心智防护=100-侵蚀度，侵蚀度越高心智防护越低\n`;
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
  rules += `## NPCs（{名称}为动态键，首次登场角色须 add /NPCs/{名称} 完整对象）\n`;
  rules += `/NPCs/{名称}                                  record  add /NPCs/{名称}（完整对象）| remove /NPCs/{名称}\n`;
  rules += `/NPCs/{名称}/基础/性别 | /NPCs/{名称}/基础/年龄 | /NPCs/{名称}/基础/身份 | /NPCs/{名称}/基础/当前位置    string  replace\n`;
  rules += `/NPCs/{名称}/基础/动作    string  replace\n`;
  rules += `/NPCs/{名称}/基础/金钱:\n  type: number\n  check:\n    - 初始化时根据身份给钱(如代理人几万,财阀大小姐几百万)。交易或被抢劫时增减\n`;
  rules += `/NPCs/{名称}/基础/当前目标    string  replace\n`;
  rules += `/NPCs/{名称}/基础/实时内心想法:\n  check:\n    - 【灵魂剖析】必须反映NPC未说出口的真实态度、阴谋或恐惧,不对主角可见。必须与表面伪装形成反差\n`;
  rules += `/NPCs/{名称}/基础/个人社交网络    string  replace(可传数组自动转字符串)\n`;
  rules += `/NPCs/{名称}/关系/好感度 | /NPCs/{名称}/关系/信任度 | /NPCs/{名称}/关系/修罗场:\n  type: number\n  range: 0~100\n  check:\n    - 根据主角言行举止 ±(1~5) 微调;完成委托+5~20、救命+20~40、表白+20~40、背叛-50~100\n    - 当多名对主角抱有高好感/占有欲的NPC同场冲突时,显著增加修罗场\n`;
  rules += `/NPCs/{名称}/关系/对主角看法:\n  check:\n    - 【强制重估】当NPC对主角的根本认知发生转变(如从"普通居民"变成"法厄同")时,必须更新总结\n    - ★ 关系仅此4字段,禁关键记忆/好感等级等\n`;
  rules += `/NPCs/{名称}/性格/底色 | /NPCs/{名称}/性格/日常 | /NPCs/{名称}/性格/内在 | /NPCs/{名称}/性格/当前情绪    string  replace\n`;
  rules += `/NPCs/{名称}/过往经历 | /NPCs/{名称}/容貌身材    string  replace\n`;
  rules += `/NPCs/{名称}/着装/{上衣|下装|内衣|内裤|鞋子|饰品}    {名称,品质,描述}  replace（★ 6格固定key，禁头部/身体/足部）\n`;
  rules += `/NPCs/{名称}/私密档案/发情度 | /NPCs/{名称}/私密档案/常识崩坏度 | /NPCs/{名称}/私密档案/受孕概率:\n  type: number\n  range: 0~100\n  check:\n    - 发情度: 受到触碰、语言挑逗、特定催化时剧烈增加\n    - 常识崩坏度: 经历非人道对待、目睹极度场面或底线被碾碎时增加\n    - 受孕概率: 性行为后根据生理周期计算更新\n`;
  rules += `/NPCs/{名称}/私密档案/体温 | /NPCs/{名称}/私密档案/体液分泌 | /NPCs/{名称}/私密档案/身体反应 | /NPCs/{名称}/私密档案/隐藏性癖 | /NPCs/{名称}/私密档案/生理周期:\n  check:\n    - 处于战斗、发情、极度痛苦或高压状态时,实时更新生理特征表象(如高热、冷汗、颤抖)\n    - 若觉醒受虐或依赖癖好,更新隐藏性癖\n`;
  rules += `/NPCs/{名称}/私密档案/器官状态/{唇齿|双峰|双手|双足|幽谷|秘穴}:\n  type: {开发度:string,描述:string}（可传字符串自动转对象）\n  check:\n    - ⚠️【女性NPC强制初始化】新建女性NPC时,必须在本回合 replace 补全6部位初始状态\n    - 必须根据NPC社会身份合理编造初始开发度与描述(如未被触及的青涩、因握枪有老茧的双手)。禁止填"未知"或跳过\n    - 受到针对性开发或高频亲密接触后,持续更新开发度与敏感描述\n\n`;
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