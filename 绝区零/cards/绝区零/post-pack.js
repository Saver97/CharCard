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

	// 2b. 修正 MVU 条目 depth=0（始终注入，优先保证变量更新与面板显示）
	let depthFixed = 0;
	for (const entry of card.data.character_book.entries) {
	  if (entry.extensions.group === 'MVU' && entry.extensions.position === 4) {
	    if (entry.extensions.depth !== 0) {
	      entry.extensions.depth = 0;
	      depthFixed++;
	    }
	  }
	}
	console.log(`✓ MVU 条目 depth 修正为 0: ${depthFixed} 个`);

	// 2c. HTML 正则补 markdown 代码块标记
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

	// 2d. (removed — 变量更新美化正则已删除)

// 2e. 修正「对AI隐藏变量更新」正则：skill 默认 promptOnly:true 会在 MVU 引擎解析前清掉更新块
//     改用经验证可用的配置：markdownOnly:true(前端隐藏) + 简单非贪婪 findRegex
let hideFixed = 0;
for (const r of card.data.extensions.regex_scripts) {
  if ((r.scriptName || r.id) === '对AI隐藏变量更新') {
    r.findRegex = '/<UpdateVariable>([\\s\\S]*?)<\\/UpdateVariable>/g';
    r.markdownOnly = true;
    r.promptOnly = false;
    r.placement = [1, 2];
    hideFixed++;
  }
}
console.log(`✓ 对AI隐藏变量更新正则改为前端隐藏(防MVU解析前被清): ${hideFixed} 个`);

	// 2f. selective→constant：仅MVU/EJS/扮演准则常驻，其余按需关键词触发
	const CONSTANT_GROUPS = new Set(['MVU', 'EJS', '扮演准则']);
	let constFixed = 0;
	for (const entry of card.data.character_book.entries) {
	  const g = entry.extensions.group || '';
	  if (!entry.constant && entry.selective && CONSTANT_GROUPS.has(g)) {
	    entry.constant = true;
	    entry.selective = false;
	    constFixed++;
	  }
	}
console.log(`✓ selective→constant(缓存优化): ${constFixed} 个条目`);

// 3. 统计最终 group 分布
const g = {};
card.data.character_book.entries.forEach(e => { g[e.extensions.group || '(空)'] = (g[e.extensions.group || '(空)'] || 0) + 1; });
console.log('最终 group 分布:', JSON.stringify(g, null, 2));

fs.writeFileSync(cardPath, JSON.stringify(card, null, 2), 'utf8');
console.log('✓ 后处理完成:', cardPath);
