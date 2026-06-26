// 法厄同面板 — 主角状态追踪
// 为法厄同开关设置初始值 + HP/SAN/发情度追踪
const panel = {
  name: "法厄同面板",
  description: "法厄同状态、是否为法厄同、生存参数",
  variables: {
    "protagonist.是否为法厄同": { type: "boolean", default: true, desc: "false=不扮演法厄同(普通居民/盗洞客等) , true=扮演法厄同兄妹" },
    "protagonist.主人身份": { type: "string", default: "", desc: "男→哲，女→铃，空=待选择" },
    "protagonist.HP": { type: "number", default: 100, desc: "体力，0=失去意识" },
    "protagonist.SAN": { type: "number", default: 100, desc: "理智值，0=精神崩溃" },
    "protagonist.发情度": { type: "number", default: 0, desc: "0~100，越高越需要发泄" },
    "protagonist.以太侵蚀度": { type: "number", default: 0, desc: "0~100，超标则异变" },
    "protagonist.丁尼余额": { type: "number", default: 5000, desc: "货币，单位丁尼" },
    "protagonist.同伴": { type: "array", default: [], desc: "当前一同行动的代理人列表" }
  },
  rules: [
    "① 开关关闭时：不追踪法厄同特有变量，可扮演任意角色",
    "② 开关打开时：根据{{user}}性别自动设置主人身份",
    "③ HP调整：战斗受伤减少，治疗/休息恢复",
    "④ SAN调整：目睹恐怖场景/调查黑暗真相减少，放松活动恢复",
    "⑤ 发情度调整：视线+1~5、接触+5~15、亲吻+15~30、前戏+30~50、性行为+50~70，每回合-2自然衰减",
    "⑥ 以太侵蚀度：在空洞中随时间增加，离开后缓慢降低"
  ]
};
module.exports = panel;