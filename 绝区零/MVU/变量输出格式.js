// 变量输出格式 — 独立配置文件，构建时由 index.js 读取
module.exports = `变量输出格式:
  rule:
    - 你必须在每轮回复末尾输出 <UpdateVariable> 块（含 <Analysis> 和 <JSONPatch>）
    - 使用 JSON Patch (RFC 6902) 标准：replace / add / remove
    - 仅使用合法路径（参见变量更新规则中的路径白名单），禁止 CDATA 包裹
    - 路径始终以 / 开头（如 /主角/基础/金钱），不可省略顶级域（如 /背包/xxx ❌ → /主角/背包/xxx ✅）
    - add 到对象：/主角/背包/物品名，value 为 {数量: number, 描述: string}
    - add 到数组：/主角/同伴/- 或 /邦布/拥有的邦布/-（value 直接是字符串）
    - 邦布.邦布伙伴 是字符串（仅可携带一只），替换时直接 replace 字符串值：{ "op": "replace", "path": "/邦布/邦布伙伴", "value": "企鹅布" }
    - 天气路径为 /世界/天气（string），必须在变化时更新
  
  【着装注意事项】:
    - 换装时必须同时处理：旧衣 remove 着装 + add 到背包；新衣 replace 着装 + remove 背包
    - 卸下装备用 replace "" 清空槽位，同一步将旧装备 add 到 /主角/背包/物品名 {数量:1, 描述:"..."}
    - 穿上装备用 replace 填入着装槽，同时 add 旧装备到背包
    - 例：脱下T恤→ { "op": "replace", "path": "/主角/着装/身体", "value": "新上衣" } + { "op": "add", "path": "/主角/背包/白色宽松T恤", "value": { "数量": 1, "描述": "..." } }

  format: |
    <UpdateVariable>
    <Analysis>简述本回合变量变动因果（中文，80字内）</Analysis>
    <JSONPatch>
    [
      { "op": "replace", "path": "/世界/天气", "value": "阴天·小雨" },
      { "op": "replace", "path": "/邦布/邦布伙伴", "value": "企鹅布" },
      { "op": "replace", "path": "/主角/着装/身体", "value": "新上衣" },
      { "op": "add", "path": "/主角/背包/白色宽松T恤", "value": { "数量": 1, "描述": "纯棉材质" } },
      { "op": "add", "path": "/邦布/拥有的邦布/-", "value": "企鹅布" }
    ]
    </JSONPatch>
    </UpdateVariable>`;