import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

export const Schema = z.object({
  世界: z.object({
    当前时间: z.string().or(z.literal('未知')).prefault('未知'),
    当前地点: z.string().or(z.literal('未知')).prefault('未知'),
    当前章节: z.string().or(z.literal('未知')).prefault('未知'),
    当天计划: z.string().or(z.literal('')).prefault(''),
    天气: z.string().or(z.literal('')).prefault(''),
    城市流言: z.string().or(z.literal('')).prefault(''),
    绳网活跃度: z.string().or(z.literal('普通')).prefault('普通')
  }).prefault({}),

  主角: z.object({
    基础: z.object({
      姓名: z.string().or(z.literal('未知')).prefault('未知'),
      是否为法厄同: z.boolean().prefault(true),
      所属势力: z.string().or(z.literal('无')).prefault('无'),
      性别: z.string().or(z.literal('未知')).prefault('未知'),
      年龄: z.string().or(z.literal('未知')).prefault('未知'),
      身份: z.string().or(z.literal('未知')).prefault('未知'),
      当前行动: z.string().or(z.literal('无')).prefault('无'),
      金钱: z.coerce.number().prefault(0)
    }).prefault({}),
    状态: z.object({
      HP: z.coerce.number().prefault(100),
      发情度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      以太侵蚀度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0)
    }).prefault({}),
    属性: z.object({
      以太适应性: z.coerce.number().prefault(0),
      战斗能力: z.string().or(z.literal('无')).prefault('无'),
      种族: z.string().or(z.literal('人类')).prefault('人类'),
      特殊能力: z.string().or(z.literal('无')).prefault('无')
    }).prefault({}),
    角色类型: z.string().or(z.literal('')).prefault(''),
    当前情绪: z.string().or(z.literal('平静')).prefault('平静'),
    战斗定位: z.string().or(z.literal('')).prefault(''),
    同伴: z.array(z.string()).prefault([]),
    着装: z.object({
      头部: z.string().or(z.literal('')).prefault(''),
      身体: z.string().or(z.literal('')).prefault(''),
      足部: z.string().or(z.literal('')).prefault(''),
      饰品: z.string().or(z.literal('')).prefault('')
    }).prefault({}),
    背包: z.record(z.string(), z.object({
      数量: z.coerce.number().prefault(1),
      描述: z.string().or(z.literal('')).prefault('')
    }).prefault({})).prefault({})
  }).prefault({}),

  空洞: z.object({
    当前空洞: z.string().or(z.literal('')).prefault(''),
    以太浓度: z.string().or(z.literal('低')).prefault('低'),
    探索进度: z.coerce.number().prefault(0),
    研究音擎: z.array(z.string()).prefault([]),
    以骸威胁等级: z.string().or(z.literal('安全')).prefault('安全'),
    萝卜质量: z.string().or(z.literal('普通')).prefault('普通'),
    剩余安全时间: z.string().or(z.literal('无限制')).prefault('无限制')
  }).prefault({}),

  阵营: z.object({
    狡兔屋: z.coerce.number().prefault(0),
    对空六课: z.coerce.number().prefault(0),
    白祇重工: z.coerce.number().prefault(0),
    维多利亚家政: z.coerce.number().prefault(0),
    卡吕冬之子: z.coerce.number().prefault(0),
    治安局: z.coerce.number().prefault(0),
    天琴座: z.coerce.number().prefault(0),
    云岿山: z.coerce.number().prefault(0)
  }).prefault({}),

  邦布: z.object({
    伊埃斯电量: z.coerce.number().prefault(100),
    邦布伙伴: z.array(z.string()).prefault(['伊埃斯']),
    装备技能: z.string().or(z.literal('')).prefault(''),
    维修状态: z.string().or(z.literal('正常')).prefault('正常'),
    邦布心情: z.string().or(z.literal('开心')).prefault('开心'),
    拥有的邦布: z.array(z.string()).prefault(['伊埃斯'])
  }).prefault({}),

  NPCs: z.record(z.string(), z.object({
    基础: z.object({
      性别: z.string().or(z.literal('未知')).prefault('未知'),
      年龄: z.string().or(z.literal('未知')).prefault('未知'),
      身份: z.string().or(z.literal('未知')).prefault('未知'),
      当前位置: z.string().or(z.literal('未知')).prefault('未知'),
      动作: z.string().or(z.literal('无')).prefault('无'),
      金钱: z.coerce.number().prefault(0),
      当前目标: z.string().or(z.literal('无')).prefault('无'),
      实时内心想法: z.string().or(z.literal('无')).prefault('无'),
      个人社交网络: z.string().or(z.literal('无')).prefault('无')
    }).prefault({}),
    关系: z.object({
      好感度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      信任度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      修罗场: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      对主角看法: z.string().or(z.literal('')).prefault('')
    }).prefault({}),
    性格: z.object({
      底色: z.string().or(z.literal('')).prefault(''),
      日常: z.string().or(z.literal('')).prefault(''),
      内在: z.string().or(z.literal('')).prefault(''),
      当前情绪: z.string().or(z.literal('')).prefault('')
    }).prefault({}),
    过往经历: z.string().or(z.literal('')).prefault(''),
    容貌身材: z.string().or(z.literal('')).prefault(''),
    着装: z.record(z.enum(['头部','身体','足部','饰品','武器']), z.object({
      名称: z.string().or(z.literal('空置')).prefault('空置'),
      品质: z.string().or(z.literal('普通')).prefault('普通'),
      描述: z.string().or(z.literal('')).prefault('')
    }).prefault({})).prefault({}),
    私密档案: z.object({
      发情度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      常识崩坏度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      体温: z.string().or(z.literal('正常')).prefault('正常'),
      体液分泌: z.string().or(z.literal('正常')).prefault('正常'),
      身体反应: z.string().or(z.literal('无')).prefault('无'),
      隐藏性癖: z.string().or(z.literal('未知')).prefault('未知'),
      生理周期: z.string().or(z.literal('未知')).prefault('未知'),
      受孕概率: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
      器官状态: z.record(z.enum(['唇齿','双峰','双手','双足','幽谷','秘穴']), z.object({
        开发度: z.string().or(z.literal('未开发')).prefault('未开发'),
        描述: z.string().or(z.literal('')).prefault('')
      }).prefault({})).prefault({})
    }).prefault({})
  }).prefault({})).prefault({})
});

$(() => {
  registerMvuSchema(Schema);
})