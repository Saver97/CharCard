
const LEVEL_NAMES=['敌对','冷淡','中立','友好','亲密','热恋'];
function getLevel(v){const n=parseInt(v)||0;if(n<=-51)return LEVEL_NAMES[0];if(n<=-11)return LEVEL_NAMES[1];if(n<=10)return LEVEL_NAMES[2];if(n<=50)return LEVEL_NAMES[3];if(n<=80)return LEVEL_NAMES[4];return LEVEL_NAMES[5]}
function getProp(obj,path,def){const keys=path.split('.');let r=obj;for(const k of keys){if(r&&typeof r==='object'&&k in r)r=r[k];else return def}return r!==undefined?r:def}
window.npcImageCache={};
window.cachedData = null;

// ===== BANGBOO GALLERY =====
const ALL_BANGBOOS = [
  { name: "伊埃斯", faction: "法厄同·特殊", skill: "感官同步·HDD远程操控" },
  { name: "阿全", faction: "治安局", skill: "360°视野·报警联动" },
  { name: "企鹅布", faction: "维多利亚家政", skill: "冰霜弹·减速领域" },
  { name: "纸袋布", faction: "白祇重工", skill: "以太护盾·伤害减免" },
  { name: "鲨鱼布", faction: "维多利亚家政", skill: "鲨鱼冲刺·破甲" },
  { name: "恶魔布", faction: "卡吕冬之子", skill: "影子潜伏·暴击加成" },
  { name: "巴特勒", faction: "独立", skill: "急救喷雾·HP回复" },
  { name: "格列佛", faction: "白祇重工", skill: "钻头猛击·眩晕" },
  { name: "招财布", faction: "独立", skill: "黄金律·掉率+5%" },
  { name: "共鸣布", faction: "天琴座", skill: "声呐扫描·弱点击破" },
  { name: "飓风布", faction: "卡吕冬之子", skill: "疾风步·移速+30%" },
  { name: "静电布", faction: "狡兔屋", skill: "EMP脉冲·机械瘫痪" }
];

// ===== NPC RENDERING =====
function renderNPCs(data){
  const npcContainer=document.getElementById('npc-container');
  let npcs=data?getProp(data,'NPCs',null):null;
  if(!npcs||Object.keys(npcs).length===0){npcContainer.innerHTML='<div class="nodata">暂无NPC数据</div>';return}
  let html='';
  for(const[nName,npc]of Object.entries(npcs)){
    const base=getProp(npc,'基础',{});const rel=getProp(npc,'关系',{});const pdt=getProp(npc,'性格',{});
    const past=getProp(npc,'过往经历','');const look=getProp(npc,'容貌身材','');
    const secret=getProp(npc,'私密档案',{});const organs=getProp(secret,'器官状态',{});
    const bgImg=window.npcImageCache[nName]?`background-image:url('${window.npcImageCache[nName]}');`:'';
    const favor=getProp(rel,'好感度',0);const trust=getProp(rel,'信任度',0);
    const chaos=getProp(rel,'修罗场',0);const lv=getLevel(favor);
    let eqHtml='<div class="npc-grid">';
    const equip=getProp(npc,'着装',{});['头部','身体','足部','饰品','武器'].forEach(part=>{
      const item=equip[part]||{名称:'空置'};
      eqHtml+=`<div class="npc-g-card"><span class="npc-g-label">${part}</span><span class="npc-g-val" style="font-size:11px">${item.名称||'空置'}</span></div>`;
    });eqHtml+='</div>';
    let invHtml='';const nInv=getProp(npc,'背包',{});
    for(const[iName,iData]of Object.entries(nInv))invHtml+=`<div class="kv-row"><span>${iName}</span><span class="kv-v" style="color:var(--gold)">x${iData.数量||1} ${iData.描述||''}</span></div>`;
    let partsHtml='';['唇齿','双峰','双手','双足','幽谷','秘穴'].forEach(p=>{
      const pData=organs[p]||{开发度:'未开发',描述:'保持着原有的状态'};
      partsHtml+=`<div class="npc-g-card"><span class="npc-g-label">${p} · ${pData.开发度}</span><span class="npc-g-val" style="font-size:11px;font-weight:400;color:var(--muted)">${pData.描述}</span></div>`;
    });
    html+=`<div class="npc-card-w" style="${bgImg}"><div class="npc-bg" style="${bgImg}"></div>
      <div class="npc-head" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')">
        <div class="npc-name">${nName}<span class="npc-badge">${lv} · ${favor}</span></div>
        <div class="npc-actions">
          <div class="action-icon" title="设置背景图片" onclick="event.stopPropagation();picUpload('${nName}')">🖼</div>
          <div class="action-icon" style="color:var(--danger);border-color:var(--danger)" title="删除此NPC" onclick="event.stopPropagation();delNpc('${nName}')">🗑</div>
        </div></div>
      <div class="npc-body">
        <div class="ns-title">当前动态</div><div class="text-block">
          <div class="kv-row"><span style="color:var(--muted)">身份</span><span class="kv-v" style="color:var(--gold)">${base.身份||'-'}</span></div>
          <div class="kv-row"><span style="color:var(--muted)">位置/动作</span><span class="kv-v">${base.当前位置||'-'} · ${base.动作||'-'}</span></div>
          <div class="kv-row"><span style="color:var(--muted)">当前目标</span><span class="kv-v" style="color:var(--gold)">${base.当前目标||'-'}</span></div>
          <div class="kv-row"><span style="color:var(--muted)">内心想法</span><span class="kv-v" style="font-style:italic">"${base.实时内心想法||'-'}"</span></div>
        </div>
        <div class="ns-title">基本信息</div><div class="npc-grid">
          <div class="npc-g-card"><span class="npc-g-label">性别/年龄</span><span class="npc-g-val">${base.性别||'-'} / ${base.年龄||'-'}</span></div>
          <div class="npc-g-card"><span class="npc-g-label">金钱</span><span class="npc-g-val" style="color:var(--gold)">${base.金钱||0} 丁尼</span></div>
          <div class="npc-g-card"><span class="npc-g-label">社交网络</span><span class="npc-g-val" style="font-size:11px">${base.个人社交网络||'-'}</span></div>
        </div>
        <div class="ns-title">⚔️ 战斗与个性</div><div class="npc-grid">
          <div class="npc-g-card"><span class="npc-g-label">战斗定位</span><span class="npc-g-val" style="color:var(--orange)">${base.战斗定位||'-'}</span></div>
          <div class="npc-g-card"><span class="npc-g-label">以太适应性</span><span class="npc-g-val" style="color:var(--purple)">${base.以太适应性||'-'}</span></div>
          <div class="npc-g-card"><span class="npc-g-label">当前情绪</span><span class="npc-g-val">${pdt.当前情绪||'-'}</span></div>
          <div class="npc-g-card"><span class="npc-g-label">声线</span><span class="npc-g-val" style="font-size:11px">${pdt.声线||'-'}</span></div>
          <div class="npc-g-card" style="grid-column:1/-1"><span class="npc-g-label">弱点</span><span class="npc-g-val" style="font-size:11px;font-weight:400">${pdt.弱点||'-'}</span></div>
          <div class="npc-g-card" style="grid-column:1/-1"><span class="npc-g-label">专属技能</span><span class="npc-g-val" style="font-size:11px;font-weight:400;color:var(--gold)">${pdt.专属技能||'-'}</span></div>
        </div>
        <div class="ns-title">角色深度设定</div><div class="text-block">
          <div style="font-size:11px;color:var(--pink);margin-bottom:6px;font-weight:700">性格调色盘</div>
          <div class="kv-row"><span style="color:var(--muted)">底色</span><span class="kv-v">${pdt.底色||'-'}</span></div>
          <div class="kv-row"><span style="color:var(--muted)">日常</span><span class="kv-v">${pdt.日常||'-'}</span></div>
          <div class="kv-row"><span style="color:var(--muted)">内在</span><span class="kv-v">${pdt.内在||'-'}</span></div>
          <div style="font-size:11px;color:var(--pink);margin:10px 0 6px;font-weight:700">过往与外貌</div>
          <div class="kv-row"><span style="color:var(--muted)">过往经历</span><span class="kv-v">${past||'-'}</span></div>
          <div class="kv-row"><span style="color:var(--muted)">容貌身材</span><span class="kv-v">${look||'-'}</span></div>
        </div>
        <div class="ns-title">关系与看法</div><div class="text-block">
          <div class="kv-row"><span style="color:var(--muted)">对主角看法</span><span class="kv-v" style="font-style:italic;color:var(--gold)">"${rel.对主角看法||'-'}"</span></div>
          <div class="kv-row" style="margin-top:8px;border-top:1px dashed var(--border);padding-top:8px">
            <span style="color:var(--muted)">好感 / 信任 / 修罗场</span>
            <span class="kv-v"><span style="color:var(--pink)">${favor}</span> / <span style="color:var(--green)">${trust}</span> / <span style="color:var(--danger)">${chaos}</span></span>
          </div>
        </div>
        <div class="ns-title">当前着装</div>${eqHtml}
        <div class="ns-title">背包</div>${invHtml||'<div style="font-size:12px;color:var(--muted);text-align:center;padding:8px">背包为空</div>'}
        <div class="ns-title pink">私密档案</div><div class="text-block">
          <div class="kv-row"><span style="color:var(--muted)">发情度 / 常识崩坏度</span><span class="kv-v"><span style="color:var(--danger)">${secret.发情度||0}</span> / <span style="color:var(--pink)">${secret.常识崩坏度||0}</span></span></div>
          <div class="kv-row"><span style="color:var(--muted)">体温 / 体液分泌</span><span class="kv-v">${secret.体温||'-'} / ${secret.体液分泌||'-'}</span></div>
          <div class="kv-row"><span style="color:var(--muted)">身体反应</span><span class="kv-v">${secret.身体反应||'-'}</span></div>
          <div class="kv-row"><span style="color:var(--muted)">隐藏性癖</span><span class="kv-v" style="color:var(--pink)">${secret.隐藏性癖||'-'}</span></div>
          <div class="kv-row"><span style="color:var(--muted)">生理周期 / 受孕率</span><span class="kv-v">${secret.生理周期||'-'} / ${secret.受孕概率||0}%</span></div>
        </div>  
        <div class="ns-title pink">器官状态</div><div class="npc-grid">${partsHtml}</div>
      </div></div>`;
  }
  npcContainer.innerHTML=html;
}

// ===== Utilities =====
window.picUpload=function(npcName){
  const input=document.createElement('input');input.type='file';input.accept='image/*';
  input.onchange=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();
    reader.onload=ev=>{window.npcImageCache[npcName]=ev.target.result;try{localStorage.setItem('zzz_npc_bg_'+npcName,ev.target.result)}catch(e){}renderAll()};reader.readAsDataURL(file);};input.click();};
window.delNpc=function(npcName){if(confirm('确定要移除NPC ['+npcName+'] 吗？')){if(typeof triggerSlash==='function')triggerSlash('/send 请移除NPC ['+npcName+']|/trigger');}};
window.closeModal=function(){document.getElementById('overlay').classList.remove('show');document.getElementById('pickModal').classList.remove('show');};
window.currentPickCallback=null;
window.showPickModal=function(title,items,callback){
  document.getElementById('pickTitle').textContent=title;
  let html='';if(items.length===0)html='<div class="nodata">暂无可用选项</div>';
  else items.forEach((it,i)=>{html+=`<div class="pick-item" onclick="selectPick(${i})"><div class="pick-name">${it.name}</div><div class="pick-desc">${it.desc||''}</div></div>`;});
  document.getElementById('pickList').innerHTML=html;
  window._pickItems=items;window.currentPickCallback=callback;
  document.getElementById('overlay').classList.add('show');document.getElementById('pickModal').classList.add('show');
};
window.selectPick=function(idx){const item=window._pickItems[idx];closeModal();if(window.currentPickCallback)window.currentPickCallback(item);};

// ===== Tabs =====
document.querySelectorAll('.tab-btn').forEach(btn=>{btn.addEventListener('click',()=>{
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
  btn.classList.add('active');document.getElementById('tab-'+btn.dataset.tab).classList.add('active');
});});

// ===== Rendering =====
function loadNpcBgCache(){try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k.startsWith('zzz_npc_bg_')){const name=k.replace('zzz_npc_bg_','');window.npcImageCache[name]=localStorage.getItem(k)}}}catch(e){}}loadNpcBgCache();

function renderAll(){
  try{
    let sd=null;
    if(typeof getAllVariables==='function'){const all=getAllVariables();const parsed=typeof _!=='undefined'?_.get(all,'stat_data'):(all.stat_data||all);if(parsed&&Object.keys(parsed).length>0)sd=parsed}
    window.cachedData=sd;
    if(!sd){renderFactions(null);renderNPCs(null);renderBangbooGallery(null);renderOwnedBangboos(null);document.getElementById('refreshBadge').textContent='○ 等待数据';document.getElementById('refreshBadge').style.color='var(--muted)';return}
    document.getElementById('w-time').textContent=getProp(sd,'世界.当前时间','-');
    document.getElementById('w-loc').textContent=getProp(sd,'世界.当前地点','-');
    document.getElementById('w-chapter').textContent=getProp(sd,'世界.当前章节','-');
    document.getElementById('w-plan').textContent=getProp(sd,'世界.当天计划','-');
    document.getElementById('w-weather').textContent=getProp(sd,'世界.天气','-');
    document.getElementById('w-rumor').textContent=getProp(sd,'世界.城市流言','')||'-';
    document.getElementById('w-activity').textContent=getProp(sd,'世界.绳网活跃度','-');
    const isP=getProp(sd,'主角.基础.是否为法厄同',null);
    document.getElementById('h-is-phaethon').textContent=getProp(sd,'主角.基础.身份','')||(isP===true?'法厄同·传奇绳匠':isP===false?'（待初始化）':'（待初始化）');
    document.getElementById('h-identity').textContent=getProp(sd,'主角.基础.姓名','')||getProp(sd,'主角.主人身份','-');
    const hp=getProp(sd,'主角.状态.HP',getProp(sd,'主角.HP',100));
    document.getElementById('h-hp-txt').textContent=hp+'/100';document.getElementById('h-hp-bar').style.width=hp+'%';
    const horny=getProp(sd,'主角.状态.发情度',getProp(sd,'主角.发情度',0));
    document.getElementById('h-horny-txt').textContent=horny+'/100';document.getElementById('h-horny-bar').style.width=horny+'%';
    const ether=getProp(sd,'主角.状态.以太侵蚀度',getProp(sd,'主角.以太侵蚀度',0));
    document.getElementById('h-ether-txt').textContent=ether+'/100';document.getElementById('h-ether-bar').style.width=ether+'%';
    const mindProt=Math.max(0,100-ether);document.getElementById('h-mind-txt').textContent=mindProt+'/100';document.getElementById('h-mind-bar').style.width=mindProt+'%';
    document.getElementById('h-denny').textContent=(getProp(sd,'主角.基础.金钱',getProp(sd,'主角.丁尼余额',0)))+' 丁尼';
    const comps=getProp(sd,'主角.同伴',[]);document.getElementById('h-companions').textContent=Array.isArray(comps)&&comps.length>0?comps.join(', '):'无';
    document.getElementById('ho-name').textContent=getProp(sd,'空洞.当前空洞',getProp(sd,'空洞.当前空洞',''))||'（不在空洞中）';
    document.getElementById('ho-density').textContent=getProp(sd,'空洞.以太浓度',getProp(sd,'空洞.以太浓度','-'));
    const prog=getProp(sd,'空洞.探索进度',getProp(sd,'空洞.探索进度',0));
    document.getElementById('ho-progress-txt').textContent=prog+'%';document.getElementById('ho-progress-bar').style.width=prog+'%';
    document.getElementById('ho-resonia').textContent=[].concat(getProp(sd,'空洞.研究音擎',getProp(sd,'空洞.研究音擎',[]))).join(', ')||'无';
    document.getElementById('ho-threat').textContent=getProp(sd,'空洞.以骸威胁等级',getProp(sd,'空洞.以骸威胁等级','-'));
    document.getElementById('ho-carrot').textContent=getProp(sd,'空洞.萝卜质量',getProp(sd,'空洞.萝卜质量','-'));
    document.getElementById('ho-timeleft').textContent=getProp(sd,'空洞.剩余安全时间',getProp(sd,'空洞.剩余安全时间','-'));
    const bat=getProp(sd,'邦布.伊埃斯电量',getProp(sd,'邦布.伊埃斯电量',100));
    document.getElementById('b-battery-txt').textContent=bat+'%';document.getElementById('b-battery-bar').style.width=bat+'%';
    const bp=getProp(sd,'邦布.邦布伙伴',getProp(sd,'邦布.邦布伙伴',[]));
    document.getElementById('b-partners').textContent=Array.isArray(bp)&&bp.length>0?bp.join(', '):'-';
    document.getElementById('b-skill').textContent=getProp(sd,'邦布.装备技能',getProp(sd,'邦布.装备技能',''))||'-';
    document.getElementById('b-repair').textContent=getProp(sd,'邦布.维修状态',getProp(sd,'邦布.维修状态','-'));
    document.getElementById('b-mood').textContent=getProp(sd,'邦布.邦布心情',getProp(sd,'邦布.邦布心情','-'));
    document.getElementById('h-gear-head').textContent=getProp(sd,'主角.着装.头部',getProp(sd,'主角.着装.头部',''))||'空置';
    document.getElementById('h-gear-body').textContent=getProp(sd,'主角.着装.身体',getProp(sd,'主角.着装.身体',''))||'空置';
    document.getElementById('h-gear-foot').textContent=getProp(sd,'主角.着装.足部',getProp(sd,'主角.着装.足部',''))||'空置';
    document.getElementById('h-gear-acc').textContent=getProp(sd,'主角.着装.饰品',getProp(sd,'主角.着装.饰品',''))||'空置';
    document.getElementById('h-combat-role').textContent=getProp(sd,'主角.战斗定位',getProp(sd,'主角.战斗定位',''))||'-';
    document.getElementById('h-ether-apt').textContent=getProp(sd,'主角.属性.以太适应性',getProp(sd,'主角.属性.以太适应性','-'));
    document.getElementById('h-mood').textContent=getProp(sd,'主角.当前情绪',getProp(sd,'主角.当前情绪','-'));
    const inv=getProp(sd,'主角.背包',getProp(sd,'主角.背包',{}));
    const invContainer=document.getElementById('hero-inventory');
    let invHtml='';
    if(typeof inv==='object'&&Object.keys(inv).length>0){
      for(const[iName,iData]of Object.entries(inv)){
        const qty=typeof iData==='object'?iData.数量||1:iData;
        const desc=typeof iData==='object'?iData.描述||'':'';
        invHtml+=`<div class="kv-row" style="cursor:pointer" onclick="editHeroItem('${iName}',${qty})" title="点击编辑"><span>${iName}</span><span class="kv-v" style="color:var(--gold)">x${qty} ${desc}</span></div>`;
      }
    }else{invHtml='<div style="font-size:12px;color:var(--muted);text-align:center;padding:8px">暂无道具记录</div>'}
    invContainer.innerHTML=invHtml;
    renderFactions(sd);
    renderNPCs(sd);
    renderBangbooGallery(sd);
    renderOwnedBangboos(sd);
    document.getElementById('refreshBadge').textContent='● 已连接';
    document.getElementById('refreshBadge').style.color='var(--green)';
  }catch(e){renderNPCs(null);renderFactions(null);renderBangbooGallery(null);renderOwnedBangboos(null)}
}

// ===== Inventory & gear editing (auto-send) =====
function sendSlash(cmd){if(typeof triggerSlash==='function')triggerSlash(cmd);else console.log('Slash:',cmd)}
window.pickGear=function(slot){
  const sd=window.cachedData;
  const inv=getProp(sd,'主角.背包',getProp(sd,'主角.背包',{}));
  const items=[{name:'卸下(空置)',desc:'移除当前装备'}];
  if(typeof inv==='object'){for(const[iName,iData]of Object.entries(inv)){const qty=typeof iData==='object'?iData.数量||1:iData;const desc=typeof iData==='object'?iData.描述||'':('x'+qty);items.push({name:iName,desc:desc});}}
  showPickModal('选择着装 - '+slot,items,function(item){
    if(item.name==='卸下(空置)') sendSlash('/setvar 主角.着装.'+slot+' null|/trigger');
    else sendSlash('/setvar 主角.着装.'+slot+' "'+item.name.replace(/"/g,'\\"')+'"|/trigger');
    setTimeout(renderAll,300);
  });
};
window.editHeroString=function(label,elId){
  const el=document.getElementById(elId);const cur=el.textContent==='-'?'':el.textContent;
  const keyMap={战斗定位:'战斗定位',当前情绪:'当前情绪'};const key=keyMap[label];if(!key)return;
  const val=prompt('编辑'+label,cur);if(val===null)return;
  sendSlash('/setvar 主角.'+key+' "'+val.replace(/"/g,'\\"')+'"|/trigger');
  setTimeout(renderAll,300);
};
window.editHeroNumber=function(label,elId){
  const el=document.getElementById(elId);const cur=el.textContent==='-'?'':el.textContent;
  const keyMap={以太适应性:'以太适应性'};const key=keyMap[label];if(!key)return;
  const val=prompt('编辑'+label+' (0-100)',cur);if(val===null)return;
  const num=parseInt(val);if(isNaN(num)||num<0||num>100){alert('请输入0-100的数字');return}
  sendSlash('/setvar 主角.'+key+' '+num+'|/trigger');
  setTimeout(renderAll,300);
};
window.addHeroItem=function(){
  const nameEl=document.getElementById('inv-new-name');const qtyEl=document.getElementById('inv-new-qty');
  const name=nameEl.value.trim();const qty=parseInt(qtyEl.value)||1;
  if(!name)return;sendSlash('/setvar 主角.背包.'+name+' '+qty+'|/trigger');
  nameEl.value='';qtyEl.value='1';setTimeout(renderAll,300);
};
window.editHeroItem=function(name,qty){
  const newName=prompt('物品名',name);if(!newName)return;
  const newQty=parseInt(prompt('数量',qty))||0;
  if(newQty<=0){if(confirm('删除物品 ['+newName+'] ？'))sendSlash('/setvar 主角.背包.'+newName+' null|/trigger');}
  else sendSlash('/setvar 主角.背包.'+newName+' '+newQty+'|/trigger');
  setTimeout(renderAll,300);
};

// ===== Factions =====
function getFactionTitle(v){if(v<=-51)return '仇敌';if(v<=-11)return '冷淡';if(v<=10)return '陌生人';if(v<=50)return '朋友';if(v<=80)return '盟友';return '至交';}
function renderFactions(data){
  const fc=document.getElementById('faction-container');
  if(!data){fc.innerHTML='<div class="nodata">暂无阵营数据</div>';return}
  const FNS=['狡兔屋','对空六课','白祇重工','维多利亚家政','卡吕冬之子','治安局','天琴座','云岿山'];
  let factions={};
  FNS.forEach(f=>{
    const val=getProp(data,'阵营.'+f,getProp(data,'factions.'+f,0));
    const title=getProp(data,'阵营.'+f+'_称号',getProp(data,'factions.'+f+'_称号',''))||getFactionTitle(val);
    const quest=getProp(data,'阵营.'+f+'_委托',getProp(data,'factions.'+f+'_委托',false));
    factions[f]={val,title,quest};
  });
  let html='';
  for(const [name,f] of Object.entries(factions)){
    const visualPct=Math.max(0,Math.min(100,((f.val+100)/2)|0));
    html+=`<div style="margin-bottom:10px;border-bottom:1px dashed rgba(255,255,255,.04);padding-bottom:8px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="font-size:13px;font-weight:600;color:var(--text)">${name}</span>
        <span style="font-size:11px;color:var(--muted)">${f.title} · ${f.val} ${f.quest?'🟢':'⚪'}</span>
      </div>
      <div style="height:6px;background:rgba(255,255,255,.05);border-radius:3px;overflow:hidden">
        <div style="height:100%;width:${visualPct}%;background:${f.val<0?'var(--danger)':'var(--green)'};border-radius:3px;transition:width .5s"></div>
      </div>
    </div>`;
  }
  fc.innerHTML=html||'<div class="nodata">暂无阵营数据</div>';
}

// ===== Bangboos =====
function renderOwnedBangboos(data){
  const list=document.getElementById('owned-bangboo-list');
  const owned=getProp(data,'邦布.拥有的邦布',getProp(data,'bangboo.拥有的邦布',[]));
  const partners=getProp(data,'邦布.邦布伙伴',getProp(data,'bangboo.邦布伙伴',[]));
  if(!Array.isArray(owned)||owned.length===0){list.innerHTML='<div class="nodata" style="grid-column:1/-1">暂无拥有邦布</div>';return}
  let html='';
  owned.forEach(bbName=>{
    const info=ALL_BANGBOOS.find(b=>b.name===bbName)||{faction:'?',skill:'?'};
    const isActive=Array.isArray(partners)&&partners.includes(bbName);
    html+=`<div class="npc-g-card" onclick="${isActive?'':'swapBangboo(\''+bbName+'\')'}" style="${isActive?'border-color:var(--orange);background:rgba(255,167,38,.08)':''};cursor:${isActive?'default':'pointer'}">
      <span class="npc-g-label" style="color:${isActive?'var(--orange)':'var(--muted)'}">${isActive?'★ 已携带':info.faction}</span>
      <span class="npc-g-val" style="font-size:12px">${bbName}</span>
      <span style="font-size:10px;color:var(--muted);display:block;margin-top:2px">${info.skill}</span>
      ${!isActive?'<span style="font-size:9px;color:var(--gold);display:block;margin-top:3px">点击携带</span>':''}
    </div>`;
  });
  list.innerHTML=html;
}
function renderBangbooGallery(data){
  const gallery=document.getElementById('bangboo-gallery');
  const owned=getProp(data,'邦布.拥有的邦布',getProp(data,'bangboo.拥有的邦布',[]));
  const partners=getProp(data,'邦布.邦布伙伴',getProp(data,'bangboo.邦布伙伴',[]));
  let html='';
  ALL_BANGBOOS.forEach(bb=>{
    const isOwned=Array.isArray(owned)&&owned.includes(bb.name);
    const isActive=Array.isArray(partners)&&partners.includes(bb.name);
    html+=`<div class="npc-g-card" style="${isActive?'border-color:var(--orange);background:rgba(255,167,38,.08)':isOwned?'border-color:var(--green)':''}">
      <span class="npc-g-label" style="color:${isActive?'var(--orange)':isOwned?'var(--green)':'var(--muted)'}">${isActive?'★ 携带中':isOwned?'✓ 已拥有':bb.faction}</span>
      <span class="npc-g-val" style="font-size:12px">${bb.name}</span>
      <span style="font-size:10px;color:var(--muted);display:block;margin-top:2px">${bb.skill}</span>
    </div>`;
  });
  gallery.innerHTML=html;
}
window.swapBangboo=function(name){
  if(confirm('确定要将邦布伙伴替换为 「'+name+'」 吗？')){
    sendSlash('/setvar 邦布.邦布伙伴 ["'+name+'"]|/trigger');
    setTimeout(renderAll,300);
  }
};
window.addBangboo=function(){
  const nameEl=document.getElementById('bb-new-name');const factionEl=document.getElementById('bb-new-faction');const skillEl=document.getElementById('bb-new-skill');
  const name=nameEl.value.trim();if(!name)return;
  sendSlash('/setvar 邦布.拥有的邦布 add "'+name+'"|/trigger');
  nameEl.value='';factionEl.value='';skillEl.value='';setTimeout(renderAll,300);
};

renderAll();
if(typeof eventOn==='function'&&typeof Mvu!=='undefined'){try{eventOn(Mvu.events.VARIABLE_UPDATE_ENDED,()=>{setTimeout(renderAll,200)})}catch(e){}}
