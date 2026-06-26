// 变量输出格式 — 纯格式契约，对齐 tavern-cards skill 标准
// 合法路径/类型/range 由「变量更新规则」单一权威提供，本文件只规定输出外壳
module.exports = `<update_variable_rules>
rule:
  - you must output the update analysis and the actual update commands at once in the end of the next reply
  - the update commands must strictly follow the **JSON Patch (RFC 6902)** standard, and can only use the following operations: \`replace\` (replace the value of existing paths), \`add\` (only used to insert new items into an object or array, use "-" as array index to append to end), \`remove\`; that is, the output must be a valid JSON array containing operation objects
  - paths must start with / and must be the exact paths listed in the 变量更新规则 white list (JSON Pointer form, no stat_data prefix); do not output any path not listed there
  - obey the operation allowed for each path: object/array append uses \`add /path/-\`, object dynamic key uses \`add /path/keyName\`, record (e.g. 背包/任务详情) must NOT use \`/-\`
format: |-
  <UpdateVariable>
  <Analysis>\${用中文，不超过 80 字}
  - \${计算时间流逝或场景变化: ...}
  - \${判断是否允许剧烈变动(特殊情境或时间跨度大于寻常): 是/否}
  - \${对照各变量的 check 规则，仅依据当前回合而非过往剧情，逐项分析受影响变量: ...}
  - \${若数值变化，写出计算: 旧值(X) + 变化量(Y) = 新值(Z)}
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
