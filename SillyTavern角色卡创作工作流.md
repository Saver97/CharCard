# SillyTavern 角色卡创作工作流

基于 `幻器与铃木.json` 实例分析与 `tavern-cards` skill 参考文档提炼。

---

## 工作流总览

```
需求对齐 → 世界观构建 → 角色设定 → MVU变量设计 → 前端UI → 正则集成 → 打包输出
   │           │           │           │           │          │          │
   └─ 阶段1 ──┘─── 阶段2 ──┘─── 阶段3 ──┘─── 阶段4 ──┘── 阶段5 ──┘── 阶段6 ──┘
```

---

## 阶段 1：需求对齐

### 输入
- 用户对世界设定、角色定位、玩法偏好的描述

### 执行步骤
1. 明确世界类型（现代/奇幻/科幻/混合）
2. 确定核心玩法（战斗/社交/探索/RPG数值）
3. 梳理势力关系与冲突主线
4. 确认是否需要 MVU 动态变量系统

### 输出
- 需求对齐文档：世界观方向、核心冲突、玩法特征、技术需求清单

---

## 阶段 2：世界观构建（世界书条目创作）

### 输入
- 阶段 1 的需求对齐文档

### 执行步骤

#### 2.1 世界观总纲条目
- `keys: []` — 全局始终注入
- `position: "after_char"` — 放在角色定义之后
- `content` 结构：
  ```xml
  <worldview_overview>
  世界总纲:
    核心背景: ...
    社会阶层: ...
    核心规则: ...
    主要势力: ...
    关键地点: ...
  </worldview_overview>
  ```

#### 2.2 势力详情条目
- 每个势力一个独立条目
- `keys: ["势力名"]` — 精确触发
- `depth: 4` — 深层触发
- 内容结构：定位、人员构成、核心职责、运作规则、关联角色

#### 2.3 场景/地点条目
- `keys: ["地点名"]`
- 内容：位置描述、内部结构、安保/规则、关联势力与角色

#### 2.4 规则条目
- 定义世界核心系统规则（如幻器系统、魔法代价）
- 标记 `constant: true` 确保不被 AI 修改

### 质量检查
- [ ] 每个势力/场景有唯一触发 key
- [ ] 条目间层级清晰，无内容冗余
- [ ] 深度 (`depth`) 设置合理

---

## 阶段 3：角色设定创作

### 输入
- 阶段 2 的世界观条目

### 执行步骤

#### 3.1 主角设定（在角色卡元数据层填写）
- 角色卡 JSON 顶层字段：`name`, `description`, `personality`, `scenario`, `first_mes`, `mes_example`
- 性格描述写入 `personality` 字段
- 开场白写入 `first_mes` 字段

#### 3.2 NPC 条目（世界书内嵌）
- 每个 NPC 一个独立条目
- `keys: ["NPC名"]`
- 标准 XML 内容模板：
  ```xml
  <npc_N>
  NPC_N - 角色名:
    基础信息: { 姓名, 年龄, 性别, 身份 }
    外貌特征: { 整体印象, 关键特征, 穿着风格 }
    性格核心: { 核心特质, 行为模式 }
    关系定位: { 与主角关系, 态度, 互动方式 }
    语言特征: { 说话风格, 4+句参考语料 }
  </npc_N>
  ```

#### 3.3 角色速览条目
- `keys: []` — 全局注入
- `content` 为所有角色卡片式摘要
- 用于 AI 快速检索角色信息

### 创作要点

| 要素 | 要求 | 示例 |
|------|------|------|
| 性格三面性 | 底色/日常/内在 三层 | 底色: 绝对理性 / 日常: 冷酷高效 / 内在: 极端弟控 |
| 外貌Tag | 英文逗号分隔，可用于 AI 绘画 | `1girl, black long hair, red eyes, kimono` |
| 参考语料 | 至少 4 句体现性格的对话 | 确保 AI 能稳定模仿说话风格 |
| 关系定位 | 明确与主角的互动模式和情感态度 | 保护者/支配者/暗恋者 等 |

### 质量检查
- [ ] 每个 NPC 有完整的三面性格
- [ ] 外貌Tag 已填写且为英文格式
- [ ] 参考语料 ≥ 4 句，覆盖不同情绪状态
- [ ] 角色间关系逻辑自洽

---

## 阶段 4：MVU 变量系统设计（可选/高级功能）

> **适用场景**：需要追踪 HP/金钱/装备/NPC好感度等动态数值的角色卡

### 输入
- 阶段 2-3 的世界观和角色设定
- 确定需要追踪的动态变量清单

### 执行步骤

#### 4.1 Zod Schema 定义
- 位置：`tavern_helper.scripts` 中 type=script 的条目
- 结构：
  ```javascript
  export const Schema = z.object({
    世界: z.object({ 当前时间, 当前地点, ... }),
    主角: z.object({
      基础: { 姓名, 性别, 年龄, 身份, 金钱, ... },
      状态: { HP, SAN, SP, ... },    // 带 clamp 约束
      属性: { 力量, 敏捷, 智力, ... },
      着装: { 头部, 身体, ..., 主幻器, 副幻器 },
      背包: z.record(...)
    }),
    任务: z.record(...),
    NPCs: z.record(...)
  });
  ```

#### 4.2 初始变量定义 (initvar)
- 世界书条目，`comment: "[initvar]变量初始化勿开"`
- YAML 格式定义所有变量初始值
- 用于初始化面板注入和断点续接

#### 4.3 变量更新规则 (mvu_update)
- 世界书条目，`comment: "[mvu_update]变量更新规则"`
- 定义 AI 每回合应遵循的变量更新逻辑
- 核心原则：
  - **绝对静默法则**：未变化的变量直接忽略
  - **防打包覆写**：禁止 replace 父级对象，必须精确到叶子节点
  - **任务与物质守恒**：交易必须同步更新双方
  - **死者静默**：死亡 NPC 停止更新
  - **强制初始化**：新建 NPC 必须全量覆盖所有档案字段

#### 4.4 变量输出格式
- 世界书条目，定义 AI 回复末尾的标准输出模板：
  ```xml
  <UpdateVariable>
  <Analysis>时间流逝: ... / 是否允许剧烈更新: yes/no / 变量分析: ...</Analysis>
  <JSONPatch>
  [
    { "op": "replace", "path": "/路径/到/变量", "value": "新值" },
    { "op": "delta",   "path": "/路径/到/数值",  "value": ±delta },
    { "op": "insert",  "path": "/路径/新增键",  "value": {...} },
    { "op": "remove",  "path": "/路径/删除键" }
  ]
  </JSONPatch>
  </UpdateVariable>
  ```
  支持操作：`replace`, `delta`, `insert`, `remove`, `move`

#### 4.5 变量展示条目
- `comment: "变量列表"` — 用 `{{format_message_variable::stat_data}}` 在上下文中注入当前变量快照
- 让 AI 实时感知所有变量状态

### 质量检查
- [ ] Schema 有合理的 `clamp`/`transform` 防越界
- [ ] 更新规则覆盖所有可能变化的变量类型
- [ ] 输出格式模板清晰可执行
- [ ] 初始变量值与初始化面板一致

---

## 阶段 5：前端 UI 设计

### 输入
- 阶段 4 的 MVU Schema（决定 UI 展示的数据结构）

### 执行步骤

#### 5.1 状态栏面板
- 位置：`regex_scripts` 中替换 `<StatusPlaceHolderImpl/>`
- 功能模块建议：
  - **顶部状态栏**：时间、地点、核心指标
  - **标签页切换**：状态 / 装备 / 背包 / 任务 / 社交 / 地图
  - **状态页**：基本信息卡片 + 生存资源条（HP/SAN/SP）+ 核心属性
  - **装备页**：6 部位装备网格，可点击操作
  - **背包页**：分类物品列表，可装备/使用/丢弃
  - **任务页**：任务卡片（状态/目标/奖励）
  - **社交页**：NPC 折叠面板，含完整档案、装备、私密档案
  - **地图页**：可拖拽缩放的世界地图 + 节点标记

#### 5.2 初始化面板
- 位置：`regex_scripts` 中替换 `<character_creation>...</character_creation>`
- 流程步骤：
  1. **路线选择**：预设角色 / 自定义角色
  2. **数据录入**：姓名、性别、年龄、身份
  3. **属性加点**：分配点数到各属性
  4. **初始装备**：盲盒抽卡（可选 LLM API 集成）
  5. **坐标锁定**：点击地图节点确定起始位置
- 最终生成 JSON Patch 数组注入初始变量

#### 5.3 主题系统（可选）
- 多套 CSS 主题（赛博朋克/樱花/极道/财阀）
- 主题切换按钮 + localStorage 持久化

#### 5.4 地图系统（可选）
- 拖拽平移 + 滚轮缩放
- 节点标记（主角位置、NPC 位置）
- IndexedDB 存储自定义底图
- 导入/导出地图数据

#### 5.5 数据持久化
- NPC 头像图片：IndexedDB 存储（Base64）
- 地图底图：IndexedDB 或 localStorage
- 主题偏好：localStorage

### 技术注意事项
- 所有 UI 代码写在 `replaceString` 字段的 HTML 字符串内
- 通过 `getAllVariables()` 读取实时变量数据
- 通过 `triggerSlash()` 向 AI 发送指令
- `placement: 2` — 注入到 AI 侧回复中

### 质量检查
- [ ] UI 与 MVU Schema 字段一一对应
- [ ] 所有交互按钮有实际功能
- [ ] 响应式设计适配移动端
- [ ] 数据更新触发 UI 重新渲染

---

## 阶段 6：正则脚本与系统集成

### 输入
- 阶段 4 的变量格式定义
- 阶段 5 的 UI 面板代码

### 执行步骤

#### 6.1 变量更新提取脚本
```
名称: "隐藏变量更新"
findRegex: "/<UpdateVariable>([\\s\\S]*?)<\/UpdateVariable>/g"
replaceString: ""          // 从对话中隐藏 XML 块
placement: [1, 2]         // 用户侧和 AI 侧都处理
runOnEdit: true            // 编辑后也运行
markdownOnly: true         // 仅在渲染中隐藏，不影响实际内容
```

#### 6.2 UI 占位替换脚本
```
名称: "状态栏"
findRegex: "<StatusPlaceHolderImpl/>"
replaceString: "```html\n...完整 HTML 代码...\n```"
placement: [2]             // 仅在 AI 侧替换
```

```
名称: "初始化面板"
findRegex: "<character_creation>[\\s\\S]*?</character_creation>"
replaceString: "```html\n...完整 HTML 代码...\n```"
placement: [2]
```

#### 6.3 系统级脚本配置
- `tavern_helper.scripts`：加载 MVU 变量更新库
- `registerMvuSchema(Schema)`：注册 Zod Schema
- 变量更新监听：`eventOn(Mvu.events.VARIABLE_UPDATE_ENDED, callback)`

### 关键配置项
| 配置 | 说明 | 推荐值 |
|------|------|--------|
| `placement` | 运行位置 | 1=用户侧, 2=AI侧 |
| `runOnEdit` | 编辑后运行 | true |
| `markdownOnly` | 仅在渲染层处理 | UI脚本=true, 变量脚本=false |
| `minDepth/maxDepth` | 深度限制 | null（不限制） |

### 质量检查
- [ ] 变量提取脚本不会干扰 UI 渲染
- [ ] UI 占位符不会在纯文本模式泄漏
- [ ] `runOnEdit` 设置合理

---

## 阶段 7：配置推导与打包输出

### 输入
- 完成的角色卡 JSON 和世界书条目

### 执行步骤

#### 7.1 配置推导
- 使用 `tavern-cards-forge configure <project>` 自动推导：
  - 条目的 `position`（注入位置）
  - `insertion_order`（优先级）
  - `strategy`（触发策略）

#### 7.2 状态初始化
- 使用 `tavern-cards-forge init <project>` 从 `.cardrc.json` 初始化 `state.json`

#### 7.3 变量校验
- 使用 `tavern-cards-forge validate-mvu <project>` 用 Zod 校验初始变量

#### 7.4 打包
- 角色卡：`tavern-cards-forge pack <project>` → 输出 PNG（内嵌 JSON）
- 世界书：`tavern-cards-forge pack <project>` → 输出 JSON

---

## 快速检查清单

完成全部阶段后，按此清单自检：

### 世界观
- [ ] 世界总纲条目 content 完整，keys 为空（全局注入）
- [ ] 每个势力/场景有独立条目和唯一触发 key
- [ ] 规则条目标记 `constant: true`

### 角色
- [ ] 角色卡顶层字段（name, description, personality, scenario, first_mes）已填写
- [ ] 每个 NPC 有完整的 `<npc_N>` 条目
- [ ] NPC 外貌Tag 为英文格式
- [ ] NPC 参考语料 ≥ 4 句
- [ ] 角色速览条目覆盖所有角色

### MVU
- [ ] Zod Schema 定义完整且有合理的约束
- [ ] initvar 条目定义所有初始值
- [ ] 更新规则条目覆盖所有变量类型
- [ ] 输出格式条目模板清晰
- [ ] 变量列表条目可用 `{{format_message_variable}}` 注入

### UI
- [ ] 状态栏 HTML 面板功能完整
- [ ] 初始化面板流程完整（至少含路线选择+坐标锁定）
- [ ] 数据绑定到 MVU 变量
- [ ] 操作按钮可生成指令

### 正则
- [ ] 变量更新提取脚本配置正确
- [ ] UI 占位替换脚本配置正确
- [ ] `tavern_helper.scripts` 加载了必要的库

### 配置
- [ ] 条目 `depth` 设置合理
- [ ] 条目 `insertion_order` 优先级正确
- [ ] `position` 注入位置符合设计意图

---

## 典型目录结构（项目开发态）

```
project/
├── .cardrc.json              # 项目元数据
├── state.json                # 打包中间状态
├── initvar.yaml              # 初始变量
├── README.md                 # 项目说明
├── assets/
│   └── avatar.png            # 角色头像
├── character/
│   ├── basic-info.md         # 角色基础信息
│   ├── personality.md        # 性格调色盘
│   └── first-message.md      # 开场白
├── worldbook/
│   ├── worldview.md          # 世界观总纲
│   ├── factions/             # 势力条目
│   ├── locations/            # 场景条目
│   ├── rules/                # 规则条目
│   └── npcs/                 # NPC 条目
├── mvu/
│   ├── schema.ts             # Zod Schema
│   ├── initvar.yaml          # 初始变量
│   └── update-rules.yaml     # 更新规则
└── ui/
    ├── status-panel.html     # 状态栏
    └── init-panel.html       # 初始化面板