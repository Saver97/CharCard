// pack 产物后处理：修正 tavern_helper 结构 + 补条目 group
// 用法: node post-pack.js
const fs = require('fs');
const path = require('path');

const cardPath = path.join(__dirname, '绝区零.json');
const statePath = path.join(__dirname, 'tavern-cards-state.json');
const card = JSON.parse(fs.readFileSync(cardPath, 'utf8'));
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));

// 1. 修正 tavern_helper：entries 数组 → 对象
const th = card.data.extensions.tavern_helper;
if (Array.isArray(th)) {
  const fixed = {};
  for (const [k, v] of th) fixed[k] = v;
  card.data.extensions.tavern_helper = fixed;
  console.log('✓ tavern_helper 修正为对象, keys:', Object.keys(fixed));
}

// 1b. 修正角色卡 name（统一为"绝区零 RPG"）
const CARD_NAME = '绝区零 RPG';
if (card.data.name !== CARD_NAME) {
  card.data.name = CARD_NAME;
  card.name = CARD_NAME;
  console.log('✓ name 修正为:', CARD_NAME);
}

// 2. 补条目 group：从 state.entryManifest 的类型名取
// build-all.js 的 group 逻辑：folder = 类型名（世界观核心/关键人物等）
const entryMap = new Map(); // comment(文件名) → type
for (const [typeName, entries] of Object.entries(state.entryManifest)) {
  for (const [entryName, leaf] of Object.entries(entries)) {
    // path 形如 世界书/类型/...，取第二段作 group
    const segs = (leaf.path || '').split('/');
    const group = segs[1] || typeName;
    entryMap.set(entryName, group);
  }
}

let groupFixed = 0;
for (const entry of card.data.character_book.entries) {
  if (!entry.extensions.group) {
    // 用 comment(文件名无扩展) 反查，或用 keys 匹配
    const baseName = entry.comment.replace(/\.yaml$/, '');
    // 尝试用 comment 直接匹配 entryManifest 内层 key
    let foundGroup = '';
    for (const [typeName, entries] of Object.entries(state.entryManifest)) {
      if (entries[baseName] || entries[entry.comment]) {
        foundGroup = typeName;
        break;
      }
    }
    if (foundGroup) {
      entry.extensions.group = foundGroup;
      groupFixed++;
    }
  }
}
console.log(`✓ 补 group: ${groupFixed} 个条目`);

// 2b. 修正 MVU 条目 depth=2（防止对话增长时被丢弃，与既有实践一致）
let depthFixed = 0;
for (const entry of card.data.character_book.entries) {
  if (entry.extensions.group === 'MVU' && entry.extensions.position === 4) {
    if (entry.extensions.depth !== 2) {
      entry.extensions.depth = 2;
      depthFixed++;
    }
  }
}
console.log(`✓ MVU 条目 depth 修正为 2: ${depthFixed} 个`);

// 2c. HTML 正则补 markdown 代码块标记（markdownOnly 正则需 ```html 包裹才渲染）
let fenceFixed = 0;
for (const r of card.data.extensions.regex_scripts) {
  const rs = r.replaceString || '';
  const isHtml = rs.includes('<!DOCTYPE') || rs.includes('<html') || rs.includes('<style');
  if (isHtml && !rs.startsWith('```')) {
    r.replaceString = '```html\n' + rs + '\n```';
    fenceFixed++;
  }
}
console.log(`✓ HTML 正则补代码块标记: ${fenceFixed} 个`);

// 3. 统计最终 group 分布
const g = {};
card.data.character_book.entries.forEach(e => { g[e.extensions.group || '(空)'] = (g[e.extensions.group || '(空)'] || 0) + 1; });
console.log('最终 group 分布:', JSON.stringify(g, null, 2));

fs.writeFileSync(cardPath, JSON.stringify(card, null, 2), 'utf8');
console.log('✓ 后处理完成:', cardPath);
