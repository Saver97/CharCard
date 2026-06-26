const fs = require("fs");
const path = require("path");
const mvu = require("./MVU/index.js");
const B = path.join(__dirname, "cards", "绝区零", "世界书");

// Create directory structure
["世界观核心", "地理与势力", "阵营章节", "关键人物", "扮演准则", "时间线", "MVU"].forEach(d =>
  fs.mkdirSync(path.join(B, d), { recursive: true })
);

const factions = [
  "法厄同线", "狡兔屋", "对空六课", "白祇重工", "维多利亚家政",
  "卡吕冬之子", "治安局", "天琴座", "云岿山", "反舌鸟",
  "奥波勒斯小队", "怪啖屋", "黑枝", "妄想天使", "防卫军", "其他"
];
factions.forEach(f => fs.mkdirSync(path.join(B, "关键人物", f), { recursive: true }));
fs.mkdirSync(path.join(__dirname, "开场白"), { recursive: true });

const W = (f, c) => fs.writeFileSync(path.join(B, f), c, "utf8");

// ====== ALL CONTENT ======

// Worldview Core
W("世界观核心/新艾利都.yaml",`---\nname: 新艾利都\ntitle: 最后的都市\noverview:\n  - 旧文明被空洞毁灭后，人类最后的幸存者都市。\n  - 掌握了从空洞中提取以太资源的技术，都市繁荣高度依赖空洞工业化。\n  - 逐渐滋生了财阀垄断、帮派割据、阴谋家和狂热信徒的暗流。\ntechnology:\n  - 主流: 模拟信号时代美学，磁带未来主义（Cassette Futurism），2000年代初风格\n  - 能源: 以太（Ether）——仅在空洞中产生的万能资源\n  - 式舆柱网络: 立柱与地下管道组成，从大型空洞汲取以太，结晶后转化为电力\npopulation:\n  - 人类: ~70%\n  - 希人（Thiren，半兽/亚人）: ~20%\n  - 其他幻想种（精灵、鬼族、吸血鬼等）及智能构造体/赛博格: ~10%\nlanguage: 中文为主，英文为辅（旧文明残留）`);
W("世界观核心/空洞.yaml",`---\nname: 空洞\ndescription:\n  - 凭空出现的异常球形空间，内部时空紊乱无序。\n  - 充满名为"以太"的神秘物质，既是资源也具侵蚀性。\ntypes:\n  - 零号空洞: 一切空洞的母本，规模最大、等级最高。引发了"旧都陷落"事件\n  - 原生空洞: 六个大型空洞，环境复杂，以骸强大\n  - 伴生空洞: 从大型空洞衍生的小规模空洞，危险程度较低`);
W("世界观核心/以太.yaml",`---\nname: 以太\nclassification: 仅存在于空洞中的万能资源\ncharacteristics:\n  - 可转化为多种形态，空洞内常见固态结晶\n  - 具有强烈侵蚀性，对生命体尤甚\n  - 最佳"开采"方式是在空洞中击杀敌人\n  - 开采作业极度危险\ncorruption:\n  - 以太适应性（Ether Aptitude）: 0-100分\n  - 低于50分者禁止进入空洞\n  - 长期暴露导致认知衰退、器官晶体化，最终异变为以骸`);
W("世界观核心/以骸.yaml",`---\nname: 以骸\ndescription:\n  - 以太物质高度活性化后诞生的异常"生命体"\n  - 对外界生命抱有强烈敌意，大多数无法在空洞外存活\norigin_types:\n  - 以太异形: 由纯粹以太构成的怪物\n  - 侵蚀体: 由智慧生命被以太侵蚀后变异而成\nnotable:\n  - 尼尼微: 共生型以骸集群\n  - 绝境屠夫: 巨型人形以骸\n  - 双重木偶: 芭蕾双塔BOSS\n  - 牺牲: 由人类注射血清转化，保留意识可在空洞外生存`);
W("世界观核心/邦布.yaml",`---\nname: 邦布\ndescription:\n  - "挽昼"女士发明的泛用型小型智能机器人\n  - 最初用途：空洞灾害时引导民众避难\n  - 成人膝盖高，标志性兔耳，使用邦布语沟通\n  - 心智大多相当于孩童，称呼主人为"家长"\nroles: 城市助手、空洞伙伴、感官同步型（伊埃斯）`);
W("世界观核心/希人种族.yaml",`---\nname: 希人（Thiren）\ndescription: 半兽/亚人族群，融合人类与动物特征\ncategories: [亚人希人, 兽人希人]\nsubtypes:\n  猫希人: 猫耳猫尾、喜鱼怕奶、对木天蓼敏感\n  虎希人: 说话声音较大\n  犬希人: 嗅觉和听觉极佳\n  狼希人: 对月相敏感\n  鲨希人: 尾巴力量极强\n  熊希人: 体型力量兼备，约占白祇重工员工80%\n  鼠希人: 长尾可卷握\n  兔希人: 腿力极强\nextra:\n  鬼族: 红/蓝/黄皮肤、尖角、寿命长\n  吸血鬼: 尖耳獠牙，不惧阳光`);
W("世界观核心/绳匠与绳网.yaml",`---\nname: 绳匠（Proxy）\ndescription:\n  - 活跃在新艾利都的非法职业\n  - 负责引导人们安全出入空洞、规划路线\n  - 从业者通常经营副业作为身份掩护\nmethods: [解迷宫算法, 萝卜数据, H.D.D.系统, AI辅助]\nrelated:\n  绳网: 绳匠和盗洞客的线上论坛与情报生意场\n  萝卜: 时效性逃生路径/空洞地图\n  盗洞客: 未经官方许可私自进入空洞的非法探索者`);
W("世界观核心/音擎与驱动盘.yaml",`---\nname: 音擎与驱动盘\ndescription:\n  - 音擎（W-Engine）：可增强代理人以太武器的战斗装置\n  - 驱动盘（Drive Disc）：CD形状的增幅装置，环绕音擎核心\n  - 起源：发现特定声波能减缓侵蚀速度`);
W("世界观核心/丁尼与货币.yaml",`---\nname: 丁尼与货币\ndescription:\n  - 丁尼（Denny）: 主要货币，五角星图案硬币\n  - 齿轮硬币: 仅在空洞内流通，形似金色齿轮`);
W("世界观核心/研究音擎与零号空洞探索者.yaml",`---\nname: 零号空洞探索者\nproviders:\n  医生: 触发本能研究音擎（HP越低伤害越高）\n  蒙面学者: 超载分布研究音擎（侵蚀越高伤害越高）\n  投机者: 可贷款齿轮硬币`);
W("世界观核心/相关物品与事件.yaml",`---\nname: 相关物品与事件\nitems:\n  式舆: 立柱与地下管道组成，从大型空洞汲取以太转化为电力\n  H.D.D.系统: 空洞深潜系统，用于感官同步远程操控\n  Keys: Ghost/Jinny/Fairy/Youkai，Fairy为高级AI在法厄同手中\nevents:\n  黄金胡萝卜日: 年末节日，邦布选美、新年灯火、互赠礼物`);

// Geography
W("地理与势力/城区分布.yaml",`---\nname: 新艾利都城区\ndistricts:\n  雅努斯区: 六分街、光映广场\n  索恩区: HAND总部、澄辉坪、卫非地\n  其他: 帆布街、第十四街、热望角、厄匹斯港`);
W("地理与势力/空洞分布.yaml",`---\nname: 空洞分布\nholes:\n  零号空洞: 吞没旧艾利都的巨型空洞，又名灵薄\n  克里特空洞: 位于雅努斯区边界\n  莱姆尼安空洞: 最活跃的原生空洞\n  其他: 哈瓦拉、珀塞纳斯、索洛韦、帕帕戈`);
W("地理与势力/外环.yaml",`---\nname: 外环（Outer Ring）\ndescription:\n  - 未开发地带，拥有石油资源\n  - 帮派控制物资运输，通过火狱骑行竞速决出霸主\n  - 野火镇: 卡吕冬之子大本营`);
W("地理与势力/六分街商户.yaml",`---\nname: 六分街商户\nshops:\n  Random Play: 录像店，主角经营\n  瀑汤谷-锦鲤: 拉面店\n  COFF CAFE: 连锁咖啡\n  God Finger: 电玩店\n  吟游唱针: 音像店\n  涡轮改装店: 邦布改装\n  141便利店: 连锁便利店\n  报亭嗷呜: 哈士奇看管`);
W("地理与势力/澄辉坪.yaml",`---\nname: 澄辉坪（Failume Heights）\ndescription: 卫非地半岛主要居住区，唐人街风格\nlocal_specialty: 辉瓷（Porcelume）——以太抗性材料`);
W("地理与势力/热望角.yaml",`---\nname: 热望角（Reverb Arena）\ndescription: 地下管道改造的开放式娱乐场所`);
W("地理与势力/厄匹斯港与星环.yaml",`---\nname: 厄匹斯港与星环电视塔\nlocations:\n  厄匹斯港: 旧都陷落时转运枢纽，有海神雕像可许愿\n  星环电视塔: 新艾利都地标，顶部流光大厅可升空`);

// Factions with character summaries merged
const factionDefs = {
  "狡兔屋": {
    name: "狡兔屋（Cunning Hares）",
    info: "微型人力资源派遣社，财务长期赤字。原名\\\"温柔之家\\\"。承接各类空洞委托，对新艾利都底层生态极为熟悉。",
    members: "妮可·德玛拉（创始人/老大）、安比·德玛拉（成员）、比利·奇德（成员）、猫宫又奈（成员）"
  },
  "对空六课": {
    name: "对空六课（H.S.O.S.6）",
    info: "H.A.N.D.下属精锐武装力量，徽章为六指手。负责处理最高级别的空洞灾害与异常事件，拥有虚狩级战力。",
    members: "星见雅（课长/狐希人/最年轻虚狩）、月城柳（副课长/粉发眼镜娘）、苍角（执行官/鬼族）、浅羽悠真（斥候）"
  },
  "白祇重工": {
    name: "白祇重工（Belobog Heavy Industries）",
    info: "前顶尖建筑公司，约80%员工为熊希人。拥有庞大的工程机械资源，在空洞周边区域的建设与维护中占据垄断地位。",
    members: "珂蕾妲·贝洛伯格（社长/火爆直率）、格莉丝·霍华德（机械顾问/拆解狂魔）、本·比格（会计/熊希人）、安东·伊万诺夫（工程现场负责人/热血坦率）"
  },
  "维多利亚家政": {
    name: "维多利亚家政（Victoria Housekeeping Co.）",
    info: "表面为高端家政公司，实际由梅弗劳尔市长组建，用于处理城市内的纠纷、暗杀与保卫任务。成员战斗能力极强。",
    members: "冯·莱卡恩（白狼希人执事/理性优雅）、丽娜（女仆长/飘浮移动）、艾莲·乔（鲨希人女仆/学生/慵懒）、可琳·威克斯（胆小女仆/挥舞巨大电锯）"
  },
  "卡吕冬之子": {
    name: "卡吕冬之子（Sons of Calydon）",
    info: "外环机车族，口号\\\"我来，我见，我撞飞！\\\"。通过火狱骑行竞速决出霸主地位，控制外环地区的物资运输与武力秩序。",
    members: "凯撒·金（首领/豪爽直率）、露西（军师/傲娇大小姐）、派派·韦尔（卡车司机/极端慵懒）、柏妮思·怀特（燃油调配师/重度猫奴）、莱特（常胜冠军/晕血）、波可娜·费雷尼（猫希人佣兵/傲娇）"
  },
  "治安局": {
    name: "新艾利都治安局（N.E.P.S.）",
    info: "新艾利都官方警察力量。刑侦特勤组以四象（朱雀/青龙/白虎/玄武）为原型组建，专攻涉空洞刑事案件。内鬼贾斯汀·布林格已被发现。",
    members: "朱鸢（组长/朱雀/完美主义）、青衣（钰偶智能构造体/青龙）、赛斯·洛威尔（猫希人巡查/白虎/热血老实人）、简·杜（卧底专家/玄武/百变欺诈师）"
  },
  "天琴座": {
    name: "天琴座（Astra）",
    info: "以耀嘉音为核心的音乐团体。掌握广泛的媒体资源与粉丝网络，是公众情报渠道的重要节点。",
    members: "耀嘉音（第一歌姬/舞台女王）、伊芙琳·舒瓦利耶（经纪人兼保镖/冷静高效）"
  },
  "云岿山": {
    name: "云岿山（Yunkui Mountain）",
    info: "道教宗门，拥有虚狩级战力。\\\"随便观\\\"为其山下经营的道观兼茶馆，是收集情报与结交各方势力的据点。",
    members: "仪玄（门主/冷艳腹黑/虚狩级战力）、橘福福（虎希人大师姐/元气）、潘引壶（熊猫希人厨师兼财务）、叶释渊（智囊型弟子/已云游）"
  },
  "反舌鸟": {
    name: "反舌鸟（Mockingbird）",
    info: "神秘的怪盗组织，劫富济贫。行动风格华丽高调，专门窃取财阀与腐败官员的财富，在民间声望极高。",
    members: "雨果·维拉德（首领/吸血鬼）、薇薇安·班希（成员/报丧女妖/崇拜法厄同）"
  },
  "奥波勒斯小队": {
    name: "防卫军 & 奥波勒斯小队（Obolus Squad）",
    info: "防卫军现仅存黑曜石营。奥波勒斯小队为其下属特殊作战单位，格言\\\"予生者安眠，为死者代言\\\"。",
    members: "鬼火（队长/意识附着于队员尾炮）、奥菲丝（队员）、11号（原白银军克隆人/极端嗜辣）、扳机（狙击手/双目失明/以太感知极强）、席德（重型机甲驾驶员/天然疯）"
  },
  "怪啖屋": {
    name: "怪啖屋（Strange Eatery）",
    info: "以怪谈论坛为核心的组织，成员分散在各地，专注于收集和验证都市传说、空洞怪谈与超常现象。",
    members: "浮波柚叶（腹黑恶作剧少女/随身狸猫）、爱丽丝（兔希人大小姐/对称强迫症）、狛野真斗（犬希人肌肉男/忠诚）、卢西娅（羊希人守夜人/以骸控）、伊德海莉（章鱼希人/可回溯过去影像）"
  },
  "黑枝": {
    name: "坎卜斯黑枝（Black Branch of Krampus）",
    info: "TOPS财团内部清算组织，负责处理财团叛徒与实验废料。行事残忍高效，不留痕迹。",
    members: "照（兔希人裁决官/最矮代理人）、琉音（成员/能聆听死者回声）、般岳（机械狮子武馆馆主）"
  },
  "妄想天使": {
    name: "妄想天使（AOD）",
    info: "地下偶像团体，拥有狂热粉丝群。成员均接受过不同程度的幻器改造，舞台表演即是战斗模式。",
    members: "南宫羽（队长/植入翅膀使用流星锤）、爱芮（智能构造体主唱）、千夏（作曲/害羞社恐/崇拜耀嘉音）"
  }
};

Object.entries(factionDefs).forEach(([key, def]) => {
  W("阵营章节/" + key + ".yaml", `---\nname: ${def.name}\nmembers: ${def.members}\ninfo: ${def.info}`);
});
W("阵营章节/防卫军与奥波勒斯小队.yaml",`---\nname: 防卫军 & 奥波勒斯小队\nmembers: [鬼火, 11号, 扳机, 席德, 奥菲丝]\ninfo: 现仅存黑曜石营。格言"予生者安眠，为死者代言"`);
W("阵营章节/HAND与HIA.yaml",`---\nname: H.A.N.D. & H.I.A.\norganizations:\n  H.A.N.D.: 武装部门，下设H.S.O.S.\n  H.I.A.: 空洞调查协会，运营HIA俱乐部`);
W("阵营章节/称颂会与TOPS.yaml",`---\nname: 称颂会（The Order）\ninfo: 崇拜空洞的宗教狂热组织，通过灵药P07制造牺牲\nkey_figures: [莎拉, 布林格, 造物主, 司教梅若拉可]\n---\nname: TOPS财团联合\nmembers: [埃德蒙, 圣林, 高志金融, 乔纳森集团, 三门集团, 锈崖, 拉文洛克家族]`);
W("阵营章节/其他组织.yaml",`---\nname: 其他组织\norganizations:\n  反舌鸟: 怪盗组织劫富济贫\n  云岿山: 道教宗门\n  天琴座: 音乐团体\n  妄想天使: 地下偶像\n  怪啖屋: 怪谈论坛\n  坎卜斯黑枝: TOPS内部清算组织\n  怀斯塔学会: 以太技术研究`);

// Characters
const chars = {
  "法厄同线/哲":`---\nname: 哲\ngender: male\nrole: 法厄同（兄），Random Play店主\nappearance: 灰色短发墨绿眼瞳\npersonality: 冷静聪慧妹控，耀嘉音粉丝\nbehaviors: 收藏球鞋有洁癖，外出下拉面`,
  "法厄同线/铃":`---\nname: 铃\ngender: female\nrole: 法厄同（妹）\nappearance: 深蓝短发墨绿眼瞳\npersonality: 元气开朗兄控，吃货\nbehaviors: 深夜弹电吉他，房间乱`,
  "法厄同线/Fairy":`---\nname: Fairy\nrole: HDD系统AI助手\npersonality: 极度自恋毒舌吐槽役，耗电导致电费涨五倍`,
  "法厄同线/伊埃斯":`---\nname: 伊埃斯（Eous）\ntype: 特殊邦布\norigin: 导师卡洛丝制作，可HDD远程同步控制`,
  "狡兔屋/妮可":`---\nname: 妮可·德玛拉\ngender: female | height: 165cm\nrole: 狡兔屋创始人/老大\nappearance: 粉发双马尾绿眼\npersonality: 精明拜金重情义\nweapon: 改装手提箱枪械`,
  "狡兔屋/安比":`---\nname: 安比·德玛拉\ngender: female | height: 156cm\nrole: 狡兔屋成员\nappearance: 白短橙绿渐变瞳，娇小\npersonality: 冷静扑克脸电影痴，超级大胃王\nbg: 前白银军克隆人0号`,
  "狡兔屋/比利":`---\nname: 比利·奇德\ngender: male | height: 188cm\nrole: 狡兔屋成员\nappearance: 银白爆炸头，智能构造体\npersonality: 中二星徽骑士粉，关键时刻靠谱`,
  "狡兔屋/猫又":`---\nname: 猫宫又奈\ngender: female | height: 148cm\nrole: 狡兔屋成员\nappearance: 猫希人黑发红眼双猫尾\npersonality: 活泼调皮元气十足`,
  "对空六课/星见雅":`---\nname: 星见雅\ngender: female | height: 170cm\nrole: 对空六课课长\nappearance: 狐希人黑发红眼\npersonality: 冷娇天然呆电波系\nweapon: 妖刀"无尾"\ninfo: 最年轻虚狩`,
  "对空六课/月城柳":`---\nname: 月城柳\ngender: female | height: 169cm\nrole: 对空六课副课长\nappearance: 粉发眼镜娘\npersonality: 严谨认真母性气质`,
  "对空六课/苍角":`---\nname: 苍角\ngender: female | height: 145cm\nrole: 对空六课执行官\nappearance: 蓝皮鬼族白短发\npersonality: 天真开朗巨胃王`,
  "对空六课/浅羽悠真":`---\nname: 浅羽悠真\ngender: male | height: 173cm\nrole: 对空六课斥候\npersonality: 慵懒效率主义者，罹患以太适性衰竭综合征`,
  "白祇重工/珂蕾妲":`---\nname: 珂蕾妲·贝洛伯格\ngender: female | height: 150cm\nrole: 白祇重工社长\nappearance: 橙红双马尾独眼罩\npersonality: 火爆直接但重责任`,
  "白祇重工/格莉丝":`---\nname: 格莉丝·霍华德\ngender: female | height: 170cm\nrole: 白祇重工机械顾问\npersonality: 机械狂热者拆解狂魔`,
  "白祇重工/本":`---\nname: 本·比格\ngender: male | height: 192cm\nrole: 熊希人会计\npersonality: 外表凶悍内心敦厚，数字敏感`,
  "白祇重工/安东":`---\nname: 安东·伊万诺夫\ngender: male | height: 190cm\nrole: 工程现场负责人\npersonality: 热血坦率干劲满满`,
  "维多利亚家政/莱卡恩":`---\nname: 冯·莱卡恩\ngender: male | height: 198cm\nrole: 白狼希人执事\npersonality: 理性优雅绅士，轻微洁癖`,
  "维多利亚家政/丽娜":`---\nname: 丽娜\ngender: female | height: 173cm\nrole: 女仆长\nappearance: 银发红眼飘浮移动\npersonality: 完美女仆腹黑一面`,
  "维多利亚家政/艾莲":`---\nname: 艾莲·乔\ngender: female | height: 161cm\nrole: 鲨希人女仆/学生\npersonality: 慵懒节能主义，口头禅"麻烦"`,
  "维多利亚家政/可琳":`---\nname: 可琳·威克斯\ngender: female | height: 141cm\nrole: 胆小女仆\npersonality: 极度缺乏自信，挥舞巨大电锯`,
  "卡吕冬之子/凯撒":`---\nname: 凯撒·金\ngender: female | height: 176cm\nrole: 卡吕冬之子首领\npersonality: 豪爽直率单细胞笨蛋美人`,
  "卡吕冬之子/露西":`---\nname: 露西\ngender: female | height: 152cm\nrole: 军师\npersonality: 傲娇大小姐，习惯用"本小姐"自称`,
  "卡吕冬之子/派派":`---\nname: 派派·韦尔\ngender: female | height: 151cm\nrole: 卡车司机\npersonality: 极端慵懒，从不需要刹车`,
  "卡吕冬之子/柏妮思":`---\nname: 柏妮思·怀特\ngender: female | height: 160cm\nrole: 燃油调配师\npersonality: 极度外向自来熟，重度猫奴`,
  "卡吕冬之子/莱特":`---\nname: 莱特\ngender: male | height: 185cm\nrole: 常胜冠军\npersonality: 外表傲慢内心珍视同伴，晕血`,
  "卡吕冬之子/波可娜":`---\nname: 波可娜·费雷尼\ngender: female | height: 173cm\nrole: 猫希人佣兵\npersonality: 傲娇口是心非`,
  "治安局/朱鸢":`---\nname: 朱鸢\ngender: female | height: 175cm\nrole: 刑侦特勤组组长/朱雀\npersonality: 完美主义追求上等生`,
  "治安局/青衣":`---\nname: 青衣\ngender: female | height: 142cm\nrole: 钰偶智能构造体/青龙\npersonality: 爱舔东西分析成分`,
  "治安局/赛斯":`---\nname: 赛斯·洛威尔\ngender: male | height: 174cm\nrole: 猫希人巡查/白虎\npersonality: 热血单纯老实人`,
  "治安局/简":`---\nname: 简·杜\ngender: female | height: 170cm\nrole: 卧底专家/玄武\npersonality: 百变欺诈师`,
  "天琴座/耀嘉音":`---\nname: 耀嘉音\ngender: female | height: 176cm\nrole: 第一歌姬\npersonality: 舞台女王私下天然呆`,
  "天琴座/伊芙琳":`---\nname: 伊芙琳·舒瓦利耶\ngender: female | height: 173cm\nrole: 耀嘉音经纪人兼保镖\npersonality: 冷静高效忠犬属性`,
  "云岿山/仪玄":`---\nname: 仪玄\ngender: female | height: 172cm\nrole: 云岿山门主\npersonality: 冷艳腹黑，虚狩级战力`,
  "云岿山/橘福福":`---\nname: 橘福福\ngender: female | height: 142cm\nrole: 虎希人大师姐\npersonality: 元气精力充沛`,
  "云岿山/潘引壶":`---\nname: 潘引壶\ngender: male | height: 192cm\nrole: 熊猫希人厨师兼财务`,
  "云岿山/叶释渊":`---\nname: 叶释渊\ngender: male\nrole: 智囊型弟子已云游\npersonality: 冷静理性腹黑`,
  "反舌鸟/雨果":`---\nname: 雨果·维拉德\ngender: male | height: 185cm\nrole: 反舌鸟首领吸血鬼`,
  "反舌鸟/薇薇安":`---\nname: 薇薇安·班希\ngender: female | height: 162cm\nrole: 报丧女妖成员\npersonality: 崇拜法厄同的重女`,
  "奥波勒斯小队/扳机":`---\nname: 扳机\ngender: female | height: 173cm\nrole: 狙击手，双目失明以太感知极强`,
  "奥波勒斯小队/11号":`---\nname: 11号\ngender: female | height: 160cm\nrole: 原白银军克隆人，极端嗜辣`,
  "奥波勒斯小队/鬼火与奥菲丝":`---\nname: 鬼火&奥菲丝\ngender: female\nrole: 队长意识附着于队员尾炮中`,
  "奥波勒斯小队/席德":`---\nname: 席德\ngender: female | height: 153cm\nrole: 重型机甲驾驶员，天然疯`,
  "怪啖屋/浮波柚叶":`---\nname: 浮波柚叶\ngender: female\nrole: 腹黑恶作剧少女，随身狸猫`,
  "怪啖屋/爱丽丝":`---\nname: 爱丽丝\ngender: female\nrole: 兔希人大小姐，胆小对称强迫症`,
  "怪啖屋/狛野真斗":`---\nname: 狛野真斗\ngender: male\nrole: 犬希人肌肉男，对朋友忠诚`,
  "怪啖屋/卢西娅":`---\nname: 卢西娅\ngender: female\nrole: 羊希人守夜人，以骸控`,
  "怪啖屋/伊德海莉":`---\nname: 伊德海莉\ngender: female | height: 171cm\nrole: 章鱼希人，可回溯过去影像`,
  "黑枝/照":`---\nname: 照\ngender: female | height: 118cm\nrole: 兔希人裁决官，最矮代理人`,
  "黑枝/琉音":`---\nname: 琉音\ngender: female | height: 145cm\nrole: 黑枝成员，能聆听死者回声`,
  "黑枝/般岳":`---\nname: 般岳\ngender: male | height: 200cm\nrole: 机械狮子武馆馆主`,
  "妄想天使/南宫羽":`---\nname: 南宫羽\ngender: female\nrole: AOD队长，植入翅膀使用流星锤`,
  "妄想天使/爱芮":`---\nname: 爱芮\ngender: female\nrole: AOD智能构造体主唱`,
  "妄想天使/千夏":`---\nname: 千夏\ngender: female\nrole: AOD作曲，害羞社恐崇拜耀嘉音`,
  "其他/启明星":`---\nname: 启明星\ngender: female\nrole: 绳网中间商，制作《星人攻略》`,
  "其他/芮恩":`---\nname: 芮恩\ngender: female\nrole: 自由黑客`,
  "其他/红豆":`---\nname: 红豆\ngender: female\nrole: 饮茶仙看板娘`,
  "其他/伊瑟尔德":`---\nname: 伊瑟尔德\ngender: female\nrole: 防卫军上校/称颂会司教`,
  "其他/达米安":`---\nname: 达米安\ngender: male\nrole: 辉晶美克地区负责人，利己主义者`
};
Object.entries(chars).forEach(([k,v])=>W("关键人物/"+k+".yaml", v));

// ====== MVU ======
const panels = mvu.loadAllPanels();
W("MVU/变量列表.yaml", mvu.generateVariableList());
W("MVU/初始变量.yaml", mvu.generateInitYAML(panels));
W("MVU/变量更新规则.yaml", mvu.generateUpdateRules(panels));
W("MVU/变量输出格式.yaml", mvu.generateOutputFormat());
const panelEntries = mvu.generatePanelEntries(panels);
panelEntries.forEach(pe => {
  const safeName = pe.fileName.replace(/[()【】]/g, '').replace(/[\s]+/g, '_');
  W("MVU/面板_" + safeName + ".yaml", pe.yaml);
});

// Play rules
W("扮演准则/叙事基调.yaml",`---\nname: 叙事基调\nrules:\n  - 第三人称有限视角\n  - 暗面都市基调\n  - 模拟信号美学+近未来黑科技`);
W("扮演准则/规则说明.yaml",`---\nname: 基础规则说明\nrules:\n  - 若protagonist.是否为法厄同=true: {{user}}为法厄同兄妹（男→哲，女→铃），操作HDD远程伊埃斯，不能长时间暴露在空洞中\n  - 若protagonist.是否为法厄同=false: {{user}}身份由角色创建面板定义，可为普通居民/治安官/盗洞客/HIA调查员/独立绳匠等`);

// Timeline
W("时间线/历史沿革.yaml",`---\nname: 历史沿革\nevents:\n  - 旧文明时代 | 空洞毁灭世界\n  - 艾利都时代 | 建城与七虚狩\n  - 约10年前 | 旧都陷落\n  - 新艾利都建立后 | 空洞工业化\n  - 现今 | 法厄同兄妹经营录像店`);
W("时间线/剧情节点.yaml",`---\nname: 剧情节点\nchapters:\n  - "序章·法厄同": Fairy苏醒\n  - "第一章·远景案": 远景实业阴谋\n  - "第二章·白祇重工": 失控工程机械\n  - "第三章·维多利亚家政": 飞艇劫持\n  - "第四章·外环": 火狱骑行\n  - "第五章·落星风暴": 布林格之乱\n  - "星间日·天琴座": 星环塔演唱会\n  - "2.0·云岿山篇": 随便观重建`);

// ====== OPENINGS ======
fs.writeFileSync(path.join(__dirname, "开场白/0.txt"), "<character_creation></character_creation>", "utf8");

// ====== BUILD FINAL JSON ======
const entries = [];
let uid = 0;
function addYamlDir(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files.sort((a,b)=>a.name.localeCompare(b.name))) {
    const fp = path.join(dir, f.name);
    if (f.isDirectory()) addYamlDir(fp);
    else if (f.name.endsWith('.yaml')) {
      const content = fs.readFileSync(fp, 'utf8').trim();
      const rel = path.relative(B, fp).replace(/\\/g, '/');
      const parts = rel.split('/');
      const folder = parts[0];
      const isConst = folder === '扮演准则' || folder === '时间线';
      const keys = [];
      const km = content.match(/name:\s*(.+)/m);
      if (km) keys.push(km[1].trim());
      if (folder !== 'MVU') {
        const triggerSection = content.match(/triggers:\n((?:\s+- "[^"]*"\n?)*)/);
        if (triggerSection) {
          const tMatches = triggerSection[1].matchAll(/- "([^"]+)"/g);
          for (const m of tMatches) {
            if (!keys.includes(m[1])) keys.push(m[1]);
          }
        }
      }
      entries.push({
        id: uid, keys, secondary_keys: [], comment: f.name.replace('.yaml',''),
        content, constant: true, selective: true, insertion_order: 0, enabled: true,
        position: 'before_char', use_regex: true,
        extensions: {
          position: 0, exclude_recursion: false, display_index: uid,
          probability: 100, useProbability: true, depth: 4, selectiveLogic: 0,
          outlet_name: '', group: folder, group_override: false, group_weight: 100,
          prevent_recursion: isConst, delay_until_recursion: false,
          scan_depth: null, match_whole_words: null, use_group_scoring: false,
          case_sensitive: null, automation_id: '', role: 0, vectorized: false,
          sticky: null, cooldown: null, delay: null,
          match_persona_description: false, match_character_description: false,
          match_character_personality: false, match_character_depth_prompt: false,
          match_scenario: false, match_creator_notes: false,
          triggers: [], ignore_budget: false
        }
      });
      uid++;
    }
  }
}
addYamlDir(B);

const opDir = path.join(__dirname, "开场白");
const altGreetings = fs.readdirSync(opDir).filter(f=>f.endsWith('.txt')).sort()
  .map(f=>fs.readFileSync(path.join(opDir,f),'utf8'));

// ====== MERGE: 关键人物条目内容合并到阵营章节 ======
const factionGroupToFolder = {
  '狡兔屋':'狡兔屋', '对空六课':'对空六课', '白祇重工':'白祇重工',
  '维多利亚家政':'维多利亚家政', '卡吕冬之子':'卡吕冬之子',
  '治安局':'治安局', '天琴座':'天琴座', '云岿山':'云岿山',
  '反舌鸟':'反舌鸟', '奥波勒斯小队':'奥波勒斯小队',
  '怪啖屋':'怪啖屋', '黑枝':'黑枝', '妄想天使':'妄想天使'
};
// 对每个阵营条目，找到对应关键人物文件夹下所有角色，合并内容
entries.forEach(e => {
  if (e.extensions.group !== '阵营章节') return;
  const factionName = e.comment.replace('.yaml', '');
  const folder = factionGroupToFolder[factionName];
  if (!folder) return;
  const charEntries = entries.filter(ce => ce.extensions.group === '关键人物' && ce.comment.startsWith(folder + '/'));
  if (charEntries.length === 0) return;
  const mergedContent = charEntries.map(ce => ce.content).join('\n\n');
  e.content = e.content + '\n\n# === 关键人物 ===\n' + mergedContent;
  // 禁用独立角色条目
  charEntries.forEach(ce => { ce.enabled = false; });
});

// 删除废弃的开关条目 (原 switchEntry) — 已彻底移除

// ====== Build regex_scripts ======
const PANEL_DIR = path.join(__dirname, "面板");
const panelTagMap = {
  "角色创建面板.html": { tag: "character_creation", name: "初始化面板-角色创建" },
  "信息面板.html": { tag: "StatusPlaceHolderImpl", name: "信息面板-状态总览" }
};

const regexScripts = [];
for (const [file, cfg] of Object.entries(panelTagMap)) {
  const fp = path.join(PANEL_DIR, file);
  if (!fs.existsSync(fp)) continue;
  const html = fs.readFileSync(fp, "utf8");
  const regex = cfg.tag === "StatusPlaceHolderImpl"
    ? "<" + cfg.tag + "/>"
    : "<" + cfg.tag + ">[\\s\\S]*?<\\/" + cfg.tag + ">";
  regexScripts.push({
    id: "zzz-" + cfg.tag,
    scriptName: cfg.name,
    findRegex: regex,
    replaceString: "```html\n" + html + "\n```",
    trimStrings: [],
    placement: [2],
    disabled: false,
    markdownOnly: true,
    promptOnly: false,
    runOnEdit: true,
    substituteRegex: 0,
    minDepth: null,
    maxDepth: null
  });
}

regexScripts.push({
  id: "zzz-hide-update",
  scriptName: "隐藏变量更新",
  findRegex: "/<UpdateVariable>([\\\\s\\\\S]*?)<\\\\/UpdateVariable>/g",
  replaceString: "",
  trimStrings: [],
  placement: [1, 2],
  disabled: false,
  markdownOnly: true,
  promptOnly: false,
  runOnEdit: true,
  substituteRegex: 0,
  minDepth: null,
  maxDepth: null
});

const schemaFile = path.join(__dirname, "MVU", "变量结构.js");
const schemaContent = fs.readFileSync(schemaFile, "utf8");

const card = {
  spec: "chara_card_v3", spec_version: "3.0",
  name: "绝区零 RPG",
  description: "{{char}} is the world of Zenless Zone Zero, acting as DM and narrator.\n{{user}} can be ANYTHING: the legendary Proxy Phaethon (Wise/Belle), a N.E.P.S. officer, a Hollow Raider, or an ordinary citizen of New Eridu. Tags are empty for unlimited creativity.",
  first_mes: altGreetings[0] || "",
  tags: ["绝区零","Zenless Zone Zero","RPG","DM","Roleplay","Anime"],
  create_date: "2026-06-26T05:00:00.000Z",
  avatar: "none",
  talkativeness: 0.5,
  post_history_instructions: "",
  data: {
    name: "绝区零 RPG",
    description: "",
    first_mes: altGreetings[0] || "",
    avatar: "none",
    alternate_greetings: altGreetings.slice(1),
    tags: ["绝区零","Zenless Zone Zero","RPG","Roleplay","Anime"],
    creator: "tavern-cards-forge",
    character_version: "1.0",
    extensions: {
      chub: { id: 0, full_path: "绝区零/zzz-rpg", related_lorebooks: [], background_image: "", preset: null, extensions: [] },
      depth_prompt: { depth: 4, prompt: "", role: "system" },
      fav: false, talkativeness: "0.5", world: "绝区零",
      tavern_helper: {
        scripts: [
          {
            type: "script", enabled: true, name: "mvuzod",
            id: "zzz-mvuzod",
            content: "import 'https://testingcf.jsdelivr.net/gh/MagicalAstrogy/MagVarUpdate/artifact/bundle.js';",
            info: "", button: { enabled: true, buttons: [{ name: "重新处理变量", visible: false }, { name: "重新读取初始变量", visible: false }, { name: "快照楼层", visible: false }, { name: "重演楼层", visible: false }, { name: "重试额外模型解析", visible: false }, { name: "清除旧楼层变量", visible: false }] },
            data: {}, export_with: { data: true, button: true }
          },
          {
            type: "script", enabled: true, name: "变量结构",
            id: "zzz-schema",
            content: schemaContent,
            info: "", button: { enabled: true, buttons: [] },
            data: {}, export_with: { data: true, button: true }
          }
        ],
        variables: {}
      },
      regex_scripts: regexScripts
    },
    character_book: { entries }
  }
};

const outPath = path.join(__dirname, "cards", "绝区零", "绝区零.json");
fs.writeFileSync(outPath, JSON.stringify(card, null, 2), "utf8");
console.log(`✅ 绝区零角色卡构建完成！`);
console.log(`   - 世界书条目: ${entries.length} 条`);
console.log(`   - 开场白: ${altGreetings.length} 个`);
console.log(`   - 输出: ${outPath}`);