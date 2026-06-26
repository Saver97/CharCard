// 世界观面板 — 世界状态追踪
// 用于追踪当前时空位置与活动计划
const panel = {
  name: "世界观面板",
  description: "当前时间、地点、章节与计划",
  triggers: ["世界状态", "当前时间", "当前地点", "当前章节", "当天计划", "时间", "地点", "章节", "world"],
  variables: {
    "world.当前时间": { type: "string", default: "新艾利都·清晨", desc: "日期/时段（清晨/白天/傍晚/深夜）" },
    "world.当前地点": { type: "string", default: "雅努斯区·六分街·Random Play", desc: "所在城区或空洞名称" },
    "world.当前章节": { type: "string", default: "序章·法厄同", desc: "对应剧情节点" },
    "world.当天计划": { type: "string", default: "录像店营业", desc: "当天主要活动" }
  },
  rules: [
    "① 进入空洞时：world.当前地点 → 空洞名称",
    "② 章节推进时：world.当前章节 → 新章节名",
    "③ 每日开始时：world.当天计划 → 录像店营业/绳匠委托/探索空洞/社交活动",
    "④ 时空切换时（如从六分街到光映广场）：更新world.当前地点"
  ]
};
module.exports = panel;