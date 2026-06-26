// NPC社交面板 — 单个NPC好感度和社交状态
// 路径严格对齐 schema：NPCs.{名称}.关系/性格/基础/着装/私密档案
// 首次遇到任意女角色时自动创建该NPC的社交条目
const panel = {
  name: "NPC社交面板",
  description: "每个NPC独立的好感度、关系状态和互动记录",
  triggers: ["NPC", "社交", "好感度", "好感", "关系", "性关系", "记忆", "互动", "npc", "女角色"],
  variableTemplate: {
    "NPCs.{NPC名称}.基础.性别": { type: "string", default: "未知", desc: "性别" },
    "NPCs.{NPC名称}.基础.年龄": { type: "string", default: "未知", desc: "年龄" },
    "NPCs.{NPC名称}.基础.身份": { type: "string", default: "未知", desc: "身份/职业" },
    "NPCs.{NPC名称}.基础.当前位置": { type: "string", default: "未知", desc: "当前所在位置" },
    "NPCs.{NPC名称}.基础.动作": { type: "string", default: "无", desc: "当前动作" },
    "NPCs.{NPC名称}.基础.金钱": { type: "number", default: 0, desc: "持有金钱(丁尼)" },
    "NPCs.{NPC名称}.基础.当前目标": { type: "string", default: "无", desc: "当前目标" },
    "NPCs.{NPC名称}.基础.实时内心想法": { type: "string", default: "无", desc: "实时内心想法(仅AI可见)" },
    "NPCs.{NPC名称}.基础.个人社交网络": { type: "string", default: "无", desc: "社交关系网络" },
    "NPCs.{NPC名称}.关系.好感度": { type: "number", default: 0, desc: "0~100" },
    "NPCs.{NPC名称}.关系.信任度": { type: "number", default: 0, desc: "0~100" },
    "NPCs.{NPC名称}.关系.修罗场": { type: "number", default: 0, desc: "0~100" },
    "NPCs.{NPC名称}.关系.对主角看法": { type: "string", default: "", desc: "对主角的看法" },
    "NPCs.{NPC名称}.性格.底色": { type: "string", default: "", desc: "性格底色" },
    "NPCs.{NPC名称}.性格.日常": { type: "string", default: "", desc: "日常表现" },
    "NPCs.{NPC名称}.性格.内在": { type: "string", default: "", desc: "内在特质" },
    "NPCs.{NPC名称}.性格.当前情绪": { type: "string", default: "", desc: "当前情绪" },
    "NPCs.{NPC名称}.过往经历": { type: "string", default: "", desc: "过往经历" },
    "NPCs.{NPC名称}.容貌身材": { type: "string", default: "", desc: "容貌身材描述" },
    "NPCs.{NPC名称}.私密档案.发情度": { type: "number", default: 0, desc: "0~100" }
  },
  rules: [
    "① 【强制规则】首次登场的女角色→自动创建完整NPC社交条目(add /NPCs/{名称} 对象，含基础/关系/性格/着装/私密档案)",
    "② 好感度范围：0(陌生)~100(热恋)，配合信任度/修罗场共同反映关系",
    "③ 好感度变动规则：完成委托+5~20、救对方性命+20~40、表白+20~40、接受邀请+3~10、送礼+2~15、共同战斗+3~8、信任事件+10~30、拒绝委托-5~15、背叛/伤害-50~100",
    "④ 关系仅4字段：好感度/信任度/修罗场/对主角看法——禁止额外字段(如关键记忆/好感等级等)",
    "⑤ 着装6格固定key：上衣/下装/内衣/内裤/鞋子/饰品，值{名称,品质,描述}",
    "⑥ NPC路径一律以 NPCs.{名称} 开头(大写NPCs)，禁止小写 npc 前缀"
  ]
};
module.exports = panel;
