// 批量生成 entryManifest 注册 patch — 从 yaml 条目自动派生
// 运行: node gen-entries.js > entries-patch.json
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const WB = path.join(ROOT, '世界书');

// 类型 → (typeList位置) 映射，与 .cardrc.json typeLists 一致
// part 分类规则
const TYPE_PARTS = {
  '世界观核心': {
    '空洞与以太': ['空洞', '以太', '以骸'],
    '邦布与科技': ['邦布', '音擎与驱动盘', '研究音擎与零号空洞探索者', '相关物品与事件'],
    '职业体系': ['绳匠与绳网', '丁尼与货币', '希人种族', '新艾利都']
  },
  '地理与势力': {
    '城区': ['城区分布', '六分街商户', '澄辉坪', '热望角'],
    '空洞区域': ['空洞分布', '厄匹斯港与星环'],
    '外环': ['外环']
  },
  '阵营章节': {
    '代理人组织': ['狡兔屋', '对空六课', '白祇重工', '维多利亚家政', '卡吕冬之子', '维多利亚家政'],
    '官方机构': ['治安局', 'HAND与HIA', '防卫军与奥波勒斯小队', '奥波勒斯小队'],
    '地下世界': ['天琴座', '怪啖屋', '妄想天使', '反舌鸟'],
    '反派势力': ['称颂会与TOPS', '黑枝', '其他组织']
  },
  '扮演准则': {
    '叙事基调': ['叙事基调'],
    '规则说明': ['规则说明']
  },
  '时间线': {
    '历史': ['历史沿革'],
    '剧情节点': ['剧情节点']
  }
};

// 反向：文件名(无扩展) → part
function findPart(typeName, fileBase) {
  const parts = TYPE_PARTS[typeName];
  if (!parts) return undefined;
  for (const [part, files] of Object.entries(parts)) {
    if (files.includes(fileBase)) return part;
  }
  return undefined;
}

// 从 yaml 提取 name 和摘要
function parseYaml(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const nameMatch = content.match(/^name:\s*(.+)/m);
  const name = nameMatch ? nameMatch[1].trim().replace(/^["']|["']$/g, '') : path.basename(filePath, '.yaml');
  return { content, name };
}

// 生成 abstract：取 name + 首行非 name 描述
function makeAbstract(typeName, fileBase, yaml) {
  const lines = yaml.content.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('---') && !l.startsWith('name:'));
  // 取前2-3个有意义的字段拼摘要
  const fields = lines.slice(0, 3).join('；');
  let abs = `${yaml.name}：${fields}`;
  if (abs.length > 80) abs = abs.slice(0, 77) + '...';
  return abs;
}

const patch = [];
let uid = 0;

// 按类型聚合条目：每个类型一个 add 操作（整体对象），避免中间节点不存在
const typeEntries = {};

function addEntry(typeName, entryName, value) {
  if (!typeEntries[typeName]) typeEntries[typeName] = {};
  typeEntries[typeName][entryName] = value;
}

// 处理非关键人物类型
for (const typeName of ['世界观核心', '地理与势力', '阵营章节', '扮演准则', '时间线']) {
  const dir = path.join(WB, typeName);
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.yaml')).sort();
  for (const file of files) {
    const fileBase = path.basename(file, '.yaml');
    const filePath = path.join(dir, file);
    const yaml = parseYaml(filePath);
    const part = findPart(typeName, fileBase);
    // 阵营章节的 防卫军与奥波勒斯小队 和 奥波勒斯小队 重复，跳过后者
    if (typeName === '阵营章节' && fileBase === '防卫军与奥波勒斯小队') continue;
    // 条目名：用文件名（稳定、无特殊字符），关键词用 yaml name 的中文部分
    const entryName = fileBase;
    const cnName = yaml.name.replace(/[（(].*?[）)]/g, '').trim();
    const relPath = `世界书/${typeName}/${file}`;
    addEntry(typeName, entryName, {
      path: relPath,
      part: part,
      scope: 'catalog',
      abstract: makeAbstract(typeName, fileBase, yaml),
      keywords: [cnName]
    });
  }
}

// 处理关键人物（每个角色独立条目）
const charDir = path.join(WB, '关键人物');
const factions = fs.readdirSync(charDir).filter(d => fs.statSync(path.join(charDir, d)).isDirectory()).sort();
for (const faction of factions) {
  const fDir = path.join(charDir, faction);
  const files = fs.readdirSync(fDir).filter(f => f.endsWith('.yaml')).sort();
  for (const file of files) {
    const fileBase = path.basename(file, '.yaml');
    const filePath = path.join(fDir, file);
    const yaml = parseYaml(filePath);
    // 角色名：取 name 字段，去掉英文名
    let charName = yaml.name.split('/')[0].trim().split('（')[0].split('(')[0].trim();
    const relPath = `世界书/关键人物/${faction}/${file}`;
    addEntry('关键人物', charName, {
      path: relPath,
      part: faction,
      scope: 'specific',
      abstract: makeAbstract('关键人物', fileBase, yaml),
      keywords: [charName]
    });
  }
}

// 生成 patch：每个类型一个 add 操作
for (const [typeName, entries] of Object.entries(typeEntries)) {
  patch.push({
    op: 'add',
    path: `/entryManifest/${typeName}`,
    value: entries
  });
}

process.stdout.write(JSON.stringify(patch, null, 2));
console.error(`\n生成 ${patch.length} 个类型注册操作，共 ${Object.values(typeEntries).reduce((s,e)=>s+Object.keys(e).length,0)} 个条目`);
