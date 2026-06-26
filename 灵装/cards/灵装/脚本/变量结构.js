import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

export const Schema = z.object({
  世界: z.object({
    当前时间: z.string().or(z.literal('未知')).prefault('未知'),
    当前地点: z.string().or(z.literal('未知')).prefault('未知'),
    公安关注度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0)
  }).prefault({}),

  主角: z.object({
    基础: z.object({
      姓名: z.string().or(z.literal('未知')).prefault('未知'),
      性别: z.string().or(z.literal('男')).prefault('男'),
      年龄: z.string().or(z.literal('17岁')).prefault('17岁'),
      身份: z.string().or(z.literal('未知')).prefault('未知'),
      当前行动: z.string().or(z.literal('无')).prefault('无'),
      金钱: z.coerce.number().prefault(0)
    }).prefault({}),
    状态: z.object({
      MaxHP: z.coerce.number().prefault(100),
      HP: z.coerce.number().prefault(100),
      MaxSAN: z.coerce.number().prefault(100),
      SAN: z.coerce.number().prefault(100),
      MaxSP: z.coerce.number().prefault(100),
      SP: z.coerce.number().prefault(100),
      发情度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0)
    }).transform(data => {
      data.HP = _.clamp(data.HP, 0, data.MaxHP);
      data.SAN = _.clamp(data.SAN, 0, data.MaxSAN);
      data.SP = _.clamp(data.SP, 0, data.MaxSP);
      return data;
    }).prefault({}),
    属性: z.object({
      体能: z.coerce.number().prefault(10),
      精神: z.coerce.number().prefault(10),
      灵感: z.coerce.number().prefault(10),
      契合: z.coerce.number().prefault(10),
      抗性: z.coerce.number().prefault(10),
      交涉: z.coerce.number().prefault(10)
    }).prefault({}),
    着装: z.record(
      z.enum(['头部', '身体', '足部', '饰品', '主灵装', '副灵装']),
      z.object({
        名称: z.string().or(z.literal('空置')).prefault('空置'),
        品质: z.string().or(z.literal('普通')).prefault('普通'),
        描述: z.string().or(z.literal('')).prefault(''),
        被动词条: z.string().optional()
      }).prefault({})
    ).prefault({}),
    背包: z.record(
      z.string().describe('物品分类'),
      z.record(
        z.string().describe('物品名'),
        z.object({
          类型: z.string().or(z.literal('未知')).prefault('未知'),
          部位: z.string().optional(),
          品质: z.string().or(z.literal('普通')).prefault('普通'),
          数量: z.coerce.number().prefault(1),
          描述: z.string().or(z.literal('')).prefault('')
        })
      ).transform(data => _.pickBy(data, ({ 数量 }) => 数量 > 0))
    ).prefault({})
  }).prefault({}),

  任务: z.record(
    z.string().describe('任务名'),
    z.object({
      状态: z.string().or(z.literal('未开始')).prefault('未开始'),
      目标: z.string().or(z.literal('')).prefault(''),
      奖励: z.string().or(z.literal('未知')).prefault('未知')
    })
  ).prefault({}),

  NPCs: z.record(
    z.string().describe('NPC名'),
    z.object({
      基础: z.object({
        年龄: z.string().or(z.literal('未知')).prefault('未知'),
        性别: z.string().or(z.literal('未知')).prefault('未知'),
        身份: z.string().or(z.literal('未知')).prefault('未知'),
        当前位置: z.string().or(z.literal('未知')).prefault('未知'),
        动作: z.string().or(z.literal('无')).prefault('无'),
        金钱: z.coerce.number().prefault(0),
        当前目标: z.string().or(z.literal('无')).prefault('无'),
        实时内心想法: z.string().or(z.literal('无')).prefault('无'),
        // 容错：允许传入数组并自动转为字符串
        个人社交网络: z.string().or(z.array(z.string()).transform(arr => arr.join(', '))).or(z.literal('无')).prefault('无')
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
        内在: z.string().or(z.literal('')).prefault('')
      }).prefault({}),
      过往经历: z.string().or(z.literal('')).prefault(''),
      容貌身材: z.string().or(z.literal('')).prefault(''),
      外貌Tag: z.string().or(z.literal('')).prefault(''),
      着装: z.record(
        z.enum(['头部', '身体', '足部', '饰品', '主灵装', '副灵装']),
        z.object({
          名称: z.string().or(z.literal('空置')).prefault('空置'),
          品质: z.string().or(z.literal('普通')).prefault('普通'),
          描述: z.string().or(z.literal('')).prefault(''),
          被动词条: z.string().optional()
        }).prefault({})
      ).prefault({}),
      背包: z.record(
        z.string().describe('物品名'),
        z.object({
          类型: z.string().or(z.literal('未知')).prefault('未知'),
          数量: z.coerce.number().prefault(1),
          描述: z.string().or(z.literal('')).prefault('')
        })
      ).transform(data => _.pickBy(data, ({ 数量 }) => 数量 > 0)).prefault({}),
      私密档案: z.object({
        发情度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
        常识崩坏度: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
        体温: z.string().or(z.literal('正常')).prefault('正常'),
        体液分泌: z.string().or(z.literal('正常')).prefault('正常'),
        身体反应: z.string().or(z.literal('无')).prefault('无'),
        隐藏性癖: z.string().or(z.literal('未知')).prefault('未知'),
        生理周期: z.string().or(z.literal('未知')).prefault('未知'),
        受孕概率: z.coerce.number().transform(v => _.clamp(v, 0, 100)).prefault(0),
        器官状态: z.record(
          z.enum(['唇齿', '双峰', '双手', '双足', '幽谷', '秘穴']),
          z.object({
            开发度: z.string().or(z.literal('未开发')).prefault('未开发'),
            描述: z.string().or(z.literal('')).prefault('')
          }).or(z.string().transform(str => ({ 开发度: '未开发', 描述: str }))) // 容错：允许传入字符串并自动转为对象
            .prefault({})
        ).prefault({})
      }).prefault({})
    }).prefault({})
  ).prefault({})
});

$(() => {
  registerMvuSchema(Schema);
})
