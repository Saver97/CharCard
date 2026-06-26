// 邦布面板 — 伊埃斯与邦布伙伴状态
const panel = {
  name: "邦布面板",
  description: "伊埃斯电量与当前携带邦布",
  triggers: ["邦布", "Bangboo", "伊埃斯", "Eous", "电量", "bangboo"],
  variables: {
    "bangboo.伊埃斯电量": { type: "number", default: 100, desc: "0~100%，低于20%无法进入空洞" },
    "bangboo.邦布伙伴": { type: "array", default: ["伊埃斯"], desc: "当前携带的邦布列表" },
    "bangboo.装备技能": { type: "string", default: "", desc: "当前邦布装备的技能/芯片名称" },
    "bangboo.维修状态": { type: "string", default: "正常", desc: "正常/需维护/故障" },
    "bangboo.邦布心情": { type: "string", default: "开心", desc: "邦布情绪：开心/疲惫/闹脾气/兴奋/想偷懒" }
  },
  rules: [
    "① 在空洞中每回合消耗伊埃斯电量5~15%（视操作复杂度）",
    "② 电量低于20%时HDD系统发出警告",
    "③ 在Random Play充电可恢复至100%",
    "④ 可携带多个邦布轮换使用",
    "⑤ 芯片可在邦布改装店（涡轮改装店）安装/更换",
    "⑥ 维修状态影响邦布性能（故障时无法使用技能）",
    "⑦ 邦布心情影响工作效率（开心时探索速度+10%，闹脾气时可能偷懒）"
  ]
};
module.exports = panel;