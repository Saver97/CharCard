// 角色创建面板 — 非Phaethon角色初始化
// 当"是否为法厄同 = false"时使用此面板定义角色
const panel = {
  name: "角色创建面板（非法厄同）",
  description: "非法厄同角色的身份/背景/能力定义",
  triggers: ["角色创建", "非法厄同", "自定义角色", "角色类型", "角色姓名", "种族", "战斗能力", "所属势力", "特殊能力", "character"],
  variables: {
    "主角.角色类型": { type: "string", default: "", desc: "普通居民/盗洞客/治安官/HIA调查员/绳匠/商人/混混/学生/其他" },
    "主角.基础.姓名": { type: "string", default: "", desc: "自定义角色名" },
    "主角.属性.种族": { type: "string", default: "人类", desc: "人类/希人(猫/虎/犬/狼/鲨/熊/鼠/兔)/鬼族/精灵/吸血鬼/智能构造体" },
    "主角.基础.性别": { type: "string", default: "", desc: "男/女" },
    "主角.基础.年龄": { type: "number", default: 25, desc: "角色年龄" },
    "主角.基础.身份": { type: "string", default: "", desc: "角色背景一句话概括" },
    "主角.属性.以太适应性": { type: "number", default: 60, desc: "0-100，低于50不能进入空洞" },
    "主角.属性.战斗能力": { type: "string", default: "无", desc: "无/弱/中/强/顶尖" },
    "主角.基础.所属势力": { type: "string", default: "无", desc: "所属组织或独立" },
    "主角.属性.特殊能力": { type: "string", default: "无", desc: "如有特殊技能或灵装" }
  },
  rules: [
    "① 只有【是否为法厄同 = false】时启用此面板",
    "② 在开场白中完成角色创建后填充变量",
    "③ 角色类型决定开局剧情方向和可用互动",
    "④ 战斗能力和以太适应性影响可接取的委托难度"
  ]
};
module.exports = panel;