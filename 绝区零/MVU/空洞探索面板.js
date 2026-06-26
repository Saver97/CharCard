// 空洞探索面板 — 空洞内状态追踪
const panel = {
  name: "空洞探索面板",
  description: "当前空洞、以太浓度、探索进度、研究音擎",
  triggers: ["空洞", "探索", "以太浓度", "hollow", "以骸", "萝卜", "研究音擎"],
  variables: {
    "hollow.当前空洞": { type: "string", default: "", desc: "所处空洞名称，空=不在空洞中" },
    "hollow.以太浓度": { type: "string", default: "低", desc: "低/中/高/危险" },
    "hollow.探索进度": { type: "number", default: 0, desc: "0~100%" },
    "hollow.研究音擎": { type: "array", default: [], desc: "当前携带的研究音擎列表" },
    "hollow.以骸威胁等级": { type: "string", default: "安全", desc: "安全/警戒/危险/致命" },
    "hollow.萝卜质量": { type: "string", default: "普通", desc: "地图质量：优质/普通/残破/无" },
    "hollow.剩余安全时间": { type: "string", default: "无限制", desc: "时间限制提示，如'30分钟''无限制'" }
  },
  rules: [
    "① 进入空洞时设置当前空洞名称和初始以太浓度",
    "② 深入空洞时以太浓度升高，探索进度增加",
    "③ 击杀以骸可能掉落研究音擎，加入列表",
    "④ 离开空洞时清空当前空洞（研究音擎也会消失）",
    "⑤ 以骸威胁等级随深度和以太浓度自动调整",
    "⑥ 萝卜质量影响探索进度获取速度（优质+50%、残破-50%）",
    "⑦ 剩余安全时间到达后必须撤离，否则被困"
  ]
};
module.exports = panel;