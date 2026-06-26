// 变量输出格式 — 纯格式契约，对齐 tavern-cards skill 标准
// 合法路径/类型/range 由「变量更新规则」单一权威提供，本文件只规定输出外壳
module.exports = `<update_variable_rules>
rule:
  - you must output the update analysis and the actual update commands at once in the end of the next reply
  - the update commands must strictly follow the **JSON Patch (RFC 6902)** standard, and can only use the following operations: \`replace\` (replace the value of existing paths), \`add\` (only used to insert new items into an object or array, use "-" as array index to append to end), \`remove\`; that is, the output must be a valid JSON array containing operation objects
  - paths must start with / and must be the exact paths listed in the 变量更新规则 white list (JSON Pointer form, no stat_data prefix); do not output any path not listed there
  - **严禁编造路径**：只能使用「变量更新规则」白名单中列出的路径。以下路径全部非法、绝对禁止：/contacts、/quests、/party、/inventory、/timeline、/events、/relationships、/stats、/skills、/equipment、/location、/time、/notes、/flags 等任何英文键名。NPC 用 /NPCs/{名称}，任务用 /任务/详情/{任务名}，同伴用 /主角/同伴/-，背包用 /主角/背包/{物品名}，时间用 /世界/当前时间。任何不在白名单的路径都会被丢弃，导致数据丢失
  - obey the operation allowed for each path: object/array append uses \`add /path/-\`, object dynamic key uses \`add /path/keyName\`, record (e.g. 背包/任务详情) must NOT use \`/-\`
  - **更新前先读当前值**：参考「变量列表」中展示的 stat_data 当前值，仅在值确实变化时才输出对应 patch；未变化的变量不要输出
format: |-
  <UpdateVariable>
  <Analysis>\${用中文，不超过 80 字}
  - \${计算时间流逝或场景变化: ...}
  - \${判断是否允许剧烈变动(特殊情境或时间跨度大于寻常): 是/否}
  - \${对照各变量的 check 规则，仅依据当前回合而非过往剧情，逐项分析受影响变量: ...}
  - \${若数值变化，写出计算: 旧值(X) + 变化量(Y) = 新值(Z)}
  - \${确认本次所有 patch 路径均在白名单内: 是/否}
  </Analysis>
  <JSONPatch>
  [
    { "op": "replace", "path": "\${/path/to/variable}", "value": \${new_value} },
    { "op": "add", "path": "\${/path/to/array/-}", "value": \${new_item} },
    { "op": "add", "path": "\${/path/to/object/newKey}", "value": \${content} },
    { "op": "remove", "path": "\${/path/to/array/0}" }
  ]
  </JSONPatch>
  </UpdateVariable>
</update_variable_rules>`;
