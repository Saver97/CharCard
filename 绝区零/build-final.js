const fs = require("fs");
const path = require("path");

// Step 1: Read all worldbook YAML files
const worldbookDir = path.join(__dirname, "cards", "绝区零", "世界书");
const openingsDir = path.join(__dirname, "开场白");

function readAllFiles(dir, baseDir) {
  const entries = [];
  let uid = 0;
  const orderCounter = {};

  function walk(currentDir) {
    const files = fs.readdirSync(currentDir, { withFileTypes: true });
    files.sort((a, b) => a.name.localeCompare(b.name));
    for (const file of files) {
      const fullPath = path.join(currentDir, file.name);
      if (file.isDirectory()) walk(fullPath);
      else if (file.name.endsWith(".yaml")) {
        const content = fs.readFileSync(fullPath, "utf8").trim();
        const relativePath = path.relative(worldbookDir, fullPath);
        const relParts = relativePath.replace(/\\/g, "/").split("/");
        
        // comment = filename without extension
        const comment = file.name.replace(/\.yaml$/, "");
        
        // Determine position and group from folder path
        const folder = relParts[0]; // e.g. "世界观核心"
        const posMap = {
          "世界观核心": 0, "地理与势力": 1, "阵营章节": 2,
          "关键人物": 3, "扮演准则": 4, "时间线": 5, "MVU": 6
        };
        const position = posMap[folder] || 0;

        // Determine if it's a character entry (under 关键人物/子文件夹/) or general entry
        const isCharacter = folder === "关键人物" && relParts.length >= 3;
        const isDepth = folder === "MVU";

        // Build keys from content
        const keys = [];
        const keyMatch = content.match(/^name:\s*(.+)/m);
        if (keyMatch) keys.push(keyMatch[1].trim());

        // Determine secondary_keys
        const secondaryKeys = [];

        // Determine if constant
        const isConstant = folder === "扮演准则" || folder === "时间线";

        orderCounter[folder] = (orderCounter[folder] || 0) + 1;
        const order = orderCounter[folder];

          entries.push({
          id: uid,
          keys: keys,
          secondary_keys: secondaryKeys,
          comment: comment,
          content: content,
          constant: true,
          selective: true,
          selectiveLogic: 0,
          addMemo: true,
          order: isCharacter ? (1000 + uid) : (10 + uid),
          position: 0, // before_char
          disable: true,
          excludeRecursion: false,
          preventRecursion: isConstant || false,
          matchPersonaDescription: false,
          matchCharacterDescription: false,
          matchCharacterPersonality: false,
          matchCharacterDepthPrompt: false,
          matchScenario: false,
          matchCreatorNotes: false,
          delayUntilRecursion: false,
          probability: 100,
          useProbability: true,
          depth: isDepth ? 4 : 4,
          group: folder,
          groupOverride: false,
          groupWeight: 100,
          scanDepth: null,
          caseSensitive: null,
          matchWholeWords: null,
          useGroupScoring: isConstant ? null : false,
          automationId: "",
          role: null,
          sticky: 0,
          cooldown: 0,
          delay: 0,
          uid: uid,
          displayIndex: uid,
          ignoreBudget: false,
          outletName: "",
          triggers: [],
          characterFilter: { isExclude: false, names: [], tags: [] }
        });
        uid++;
      }
    }
  }
  walk(dir);
  return entries;
}

const entries = readAllFiles(worldbookDir);

// Step 2: Read opening files
const openingFiles = fs.readdirSync(openingsDir).filter(f => f.endsWith(".txt")).sort();
const alternateGreetings = openingFiles.map(f => fs.readFileSync(path.join(openingsDir, f), "utf8"));

// Step 3: Read MVU initial variables
const initVarPath = path.join(worldbookDir, "MVU", "初始变量.yaml");
const mvuVars = fs.existsSync(initVarPath) ? fs.readFileSync(initVarPath, "utf8") : "";

// Read update rules
const updateRulesPath = path.join(worldbookDir, "MVU", "变量更新规则.yaml");
const mvuRules = fs.existsSync(updateRulesPath) ? fs.readFileSync(updateRulesPath, "utf8") : "";

// Read variable list
const varListPath = path.join(worldbookDir, "MVU", "变量列表.yaml");
const mvuVarList = fs.existsSync(varListPath) ? fs.readFileSync(varListPath, "utf8") : "";

// Read output format
const outputFormatPath = path.join(worldbookDir, "MVU", "变量输出格式.yaml");
const mvuOutput = fs.existsSync(outputFormatPath) ? fs.readFileSync(outputFormatPath, "utf8") : "";

// Step 4: Build tavern_helper variables
const tavernHelperVariables = {};
try {
  const initVarContent = fs.readFileSync(initVarPath, "utf8");
  const statData = {};
  let currentSection = "";
  const lines = initVarContent.split("\n");
  for (const line of lines) {
    const sectionMatch = line.match(/^(\w+):$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      statData[currentSection] = {};
      continue;
    }
    const kvMatch = line.match(/^\s+(\S[^:]+?):\s*(.*)/);
    if (kvMatch && currentSection) {
      let val = kvMatch[2].trim();
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      if (val.startsWith("[") && val.endsWith("]")) {
        try { val = JSON.parse(val); } catch(e) {}
      }
      if (val === "true") val = true;
      else if (val === "false") val = false;
      else if (!isNaN(val) && val !== "") val = Number(val);
      statData[currentSection][kvMatch[1].trim()] = val;
    }
  }
  tavernHelperVariables.stat_data = statData;
} catch(e) {
  tavernHelperVariables.stat_data = {};
}

// Step 5: Build the complete card
const card = {
  spec: "chara_card_v2",
  spec_version: "2.0",
  name: "绝区零 RPG",
  fav: false,
  description: "{{char}} is not a character or entity, but a setting—the world of Zenless Zone Zero (绝区零). {{char}} acts as the DM and narrator of this role-play, guiding {{user}} through New Eridu, its Hollows, factions, and mysteries.\n\n{{user}} takes the role of a Proxy, specifically one of the legendary Phaethon sibling duo—Wise (male protagonist) or Belle (female protagonist)—who manage Random Play video store on Sixth Street while secretly navigating Hollows.\n\nThe setting spans from the last surviving city New Eridu to the dangerous Hollows, from the cunning Cunning Hares to the elite Section 6, from biker gangs of the Outer Ring to the corporate conspiracies of TOPS and the cultist Order of the Exaltists.",
  personality: "",
  scenario: "",
  first_mes: alternateGreetings[0] || "",
  mes_example: "",
  tags: ["绝区零", "Zenless Zone Zero", "RPG", "DM", "Roleplay", "New Eridu", "Hollow", "Proxy", "Action", "Fantasy", "Urban", "Anime", "Chinese"],
  create_date: "2026-06-26T05:00:00.000Z",
  creatorcomment: "绝区零世界书角色卡 - 法厄同视角",
  avatar: "none",
  talkativeness: 0.5,
  data: {
    name: "绝区零 RPG",
    description: "{{char}} is the world of Zenless Zone Zero, acting as DM and narrator.\n{{user}} is the Proxy Phaethon (Wise/Belle).",
    personality: "",
    first_mes: alternateGreetings[0] || "",
    avatar: "none",
    mes_example: "",
    scenario: "",
    creator_notes: "绝区零世界书角色卡 - 法厄同视角",
    system_prompt: "",
    post_history_instructions: "",
    alternate_greetings: alternateGreetings.slice(1),
    tags: ["绝区零", "Zenless Zone Zero", "RPG", "Roleplay", "Anime"],
    creator: "tavern-cards-forge",
    character_version: "1.0",
    extensions: {
      chub: {
        id: 0,
        full_path: "绝区零/zzz-rpg",
        related_lorebooks: [],
        background_image: "",
        preset: null,
        extensions: []
      },
      depth_prompt: {
        depth: 4,
        prompt: "",
        role: "system"
      },
      fav: false,
      talkativeness: "0.5",
      world: "绝区零",
      tavern_helper: {
        scripts: [],
        variables: {
          ...tavernHelperVariables
        }
      }
    },
    character_book: {
      entries: entries
    }
  }
};

// Step 6: Write output
const outputPath = path.join(__dirname, "cards", "绝区零", "绝区零.json");
fs.writeFileSync(outputPath, JSON.stringify(card, null, 2), "utf8");

console.log(`✅ 绝区零角色卡构建完成！`);
console.log(`   - 世界书条目: ${entries.length} 条`);
console.log(`   - 开场白: ${alternateGreetings.length} 个（含主体）`);
console.log(`   - 输出文件: ${outputPath}`);