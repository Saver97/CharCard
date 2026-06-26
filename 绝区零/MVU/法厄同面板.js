// 法厄同面板 — 主角状态追踪
// 为法厄同开关设置初始值 + HP/SAN/发情度追踪
const panel = {
  name: "法厄同面板",
  description: "法厄同状态、是否为法厄同、生存参数",
  triggers: ["法厄同", "Phaethon", "主角", "HP", "SAN", "发情度", "侵蚀度", "丁尼", "同伴", "protagonist"],
  variables: {
    "protagonist.是否为法厄同": { type: "boolean", default: true, desc: "false=不扮演法厄同(普通居民/盗洞客等) , true=扮演法厄同兄妹" },
    "protagonist.主人身份": { type: "string", default: "", desc: "男→哲，女→铃，空=待选择" },
    "protagonist.HP": { type: "number", default: 100, desc: "体力，0=失去意识" },
    "protagonist.发情度": { type: "number", default: 0, desc: "0~100，越高越需要发泄" },
    "protagonist.以太侵蚀度": { type: "number", default: 0, desc: "0~100，超标则异变；心智防护=100-侵蚀度" },
    "protagonist.丁尼余额": { type: "number", default: 5000, desc: "货币，单位丁尼" },
    "protagonist.同伴": { type: "array", default: [], desc: "当前一同行动的代理人列表" },
    "protagonist.着装.头部": { type: "string", default: "", desc: "主角当前头部装备/饰品" },
    "protagonist.着装.身体": { type: "string", default: "", desc: "主角当前身体服装" },
    "protagonist.着装.足部": { type: "string", default: "", desc: "主角当前足部装备" },
    "protagonist.着装.饰品": { type: "string", default: "", desc: "主角当前佩戴的饰品" },
    "protagonist.背包": { type: "object", default: {}, desc: "主角背包物品，键为物品名，值为{数量,描述}" },
    "protagonist.战斗定位": { type: "string", default: "", desc: "主角战斗定位：独立绳匠/治安官/盗洞客/HIA调查员等" },
    "protagonist.以太适应性": { type: "number", default: 0, desc: "0~100，低于50禁止进入空洞" },
    "protagonist.当前情绪": { type: "string", default: "平静", desc: "主角当前情绪状态：平静/焦虑/兴奋/低落/困倦/专注等" }
  },
  rules: [
    "① 开关关闭时：不追踪法厄同特有变量，可扮演任意角色",
    "② 开关打开时：根据{{user}}性别自动设置主人身份",
    "③ HP调整：战斗受伤减少，治疗/休息恢复",
    "④ 心智防护：由以太侵蚀度反向计算（防护=100-侵蚀度），侵蚀度越高心智防护越低",
    "⑤ 发情度调整：视线+1~5、接触+5~15、亲吻+15~30、前戏+30~50、性行为+50~70，每回合-2自然衰减",
    "⑥ 以太侵蚀度：在空洞中随时间增加，离开后缓慢降低",
    "⑦ 着装与背包：可由用户通过信息面板手动修改，AI也可在剧情中增减物品",
    "⑧ 战斗定位/以太适应性/当前情绪：可由用户通过信息面板手动修改"
  ]
};
module.exports = panel;