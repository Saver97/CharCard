// 空洞探索面板 — 空洞内状态追踪
const panel = {
  name: "空洞探索面板",
  description: "当前空洞、以太浓度、探索进度、研究音擎",
  variables: {
    "hollow.当前空洞": { type: "string", default: "", desc: "所处空洞名称，空=不在空洞中" },
    "hollow.以太浓度": { type: "string", default: "低", desc: "低/中/高/危险" },
    "hollow.探索进度": { type: "number", default: 0, desc: "0~100%" },
    "hollow.研究音擎": { type: "array", default: [], desc: "当前携带的研究音擎列表" }
  },
  rules: [
    "① 进入空洞时设置当前空洞名称和初始以太浓度",
    "② 深入空洞时以太浓度升高，探索进度增加",
    "③ 击杀以骸可能掉落研究音擎，加入列表",
    "④ 离开空洞时清空当前空洞（研究音擎也会消失）"
  ]
};
module.exports = panel;