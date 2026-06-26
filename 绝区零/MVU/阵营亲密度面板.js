// 阵营亲密度面板 — 各阵营关系追踪
const panel = {
  name: "阵营亲密度面板",
  description: "法与各势力的亲密度",
  triggers: ["阵营", "亲密度", "factions", "狡兔屋", "对空六课", "白祇重工", "维多利亚家政", "卡吕冬之子", "治安局", "天琴座", "云岿山", "关系"],
  variables: {
    "factions.狡兔屋": { type: "number", default: 0, desc: "微型派遣社，财务长期赤字" },
    "factions.对空六课": { type: "number", default: 0, desc: "H.A.N.D.下属精锐武装" },
    "factions.白祇重工": { type: "number", default: 0, desc: "建筑公司，熊希人为主" },
    "factions.维多利亚家政": { type: "number", default: 0, desc: "高端家政/纠纷处理集团" },
    "factions.卡吕冬之子": { type: "number", default: 0, desc: "外环机车族" },
    "factions.治安局": { type: "number", default: 0, desc: "新艾利都官方警察" },
    "factions.天琴座": { type: "number", default: 0, desc: "音乐团体，耀嘉音为核心" },
    "factions.云岿山": { type: "number", default: 0, desc: "道教宗门" }
  },
  rules: [
    "① 完成该阵营的委托：+5~+20",
    "② 与该阵营敌对行动：-10~-30",
    "③ 亲密度影响可接取的委托难度和角色态度"
  ]
};
module.exports = panel;