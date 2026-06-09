// main.js — Game state machine, UI rendering, event wiring

import {
  createPokerGame, advancePhase, applyAction, getAvailableActions,
  isBettingRoundOver, bestHand, estimateHandStrength,
  replaceCommunityCard, replaceHoleCard, addExtraHoleCard, peekNextCommunity
} from './poker.js';
import { enemyDecide, onHandStart, onHandEnd } from './ai.js';
import { getPortrait } from './enemy-portraits.js';
import {
  SKILLS, ITEMS, EQUIPMENT, EQUIPMENT_SLOTS, QUALITY_NAMES, QUALITY_COLORS,
  CLASSES, ENEMIES, SPECIAL_ENEMIES, ACHIEVEMENTS, EVENTS,
  expToNext, hpCapForLevel, blindsForEnemy, getShopInventory,
  pickRandomEnemy, pickRandomDrop
} from './game-data.js';

// ===== GAME STATE =====
let G = null; // global game state
let _prevCommunityCount = 0; // tracks revealed community cards for flip animation

function defaultPlayer(name, classId) {
  const cls = CLASSES.find(c => c.id === classId) || CLASSES[0];
  return {
    name,
    classId,
    lv: 1,
    exp: 0,
    hp: 30000,
    hpMax: 30000,
    mp: 100,
    mpMax: 100,
    skills: [...cls.startSkills],
    equipment: {},       // slot -> equipmentId
    inventory: [],       // [{ id, qty }]
    quickSlots: [],      // item ids (max 3)
    activeEffects: {},   // effect flags
    stats: {
      days: 0,
      battlesWon: 0,
      handsWon: 0,
      handWinStreak: 0,
      allInWins: 0,
      skillsUsed: 0,
      totalChipsWon: 0,
      specialsDefeated: 0,
      beatenBosses: [],
    },
    achievements: [],
    settings: { mpRegenPerWin: 10 }
  };
}

function newGame(name, classId) {
  G = {
    player: defaultPlayer(name, classId),
    day: 0,
    phase: 'event',      // 'event' | 'battle' | 'shop' | 'rest' | 'gameover'
    currentEnemy: null,
    pokerState: null,
    selectedEvent: null,
    handCount: 0,
    lastHandWon: false,
    insuranceActive: false,
    extraExpActive: false,
    freezeEnemyRaise: false,
    debuffEnemyAI: false,
    redoOnLoss: false,
    usedRedoThisHand: false,
    enemySkillsUsable: [],
    msgLog: [],
  };
  saveGame();
  showEventScreen();
}

// ===== PERSISTENCE =====
function saveGame() {
  if (!G) return;
  localStorage.setItem('txrpg_save', JSON.stringify(G));
}

function loadGame() {
  try {
    const data = localStorage.getItem('txrpg_save');
    if (data) { G = JSON.parse(data); return true; }
  } catch(e) {}
  return false;
}

function hasSave() {
  return !!localStorage.getItem('txrpg_save');
}

function deleteSave() {
  localStorage.removeItem('txrpg_save');
}

// ===== SCREEN SWITCHING =====
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('screen-' + id);
  if (el) el.classList.add('active');
  if (id === 'battle' || id === 'event') updateHUD();
}

// ===== HUD =====
function updateHUD() {
  if (!G) return;
  const p = G.player;
  const cls = CLASSES.find(c => c.id === p.classId);
  document.getElementById('hud-level').textContent = `LV.${p.lv} ${p.name}`;
  const hpPct = Math.max(0, Math.min(100, (p.hp / p.hpMax) * 100));
  const mpPct = Math.max(0, Math.min(100, (p.mp / p.mpMax) * 100));
  document.getElementById('hud-hp-fill').style.width = hpPct + '%';
  document.getElementById('hud-mp-fill').style.width = mpPct + '%';
  document.getElementById('hud-hp-text').textContent = `${p.hp}/${p.hpMax}`;
  document.getElementById('hud-mp-text').textContent = `${p.mp}/${p.mpMax}`;
}

// ===== EVENT SCREEN =====
function showEventScreen() {
  G.day++;
  G.player.stats.days = G.day;
  G.phase = 'event';

  // Pick 2-3 random events
  const pool = buildEventPool();
  const count = Math.random() < 0.4 ? 3 : 2;
  const selected = [];
  const usedTypes = new Set();
  for (const ev of shuffle(pool)) {
    if (selected.length >= count) break;
    if (!usedTypes.has(ev.type) || ev.type === 'battle') {
      selected.push(ev);
      usedTypes.add(ev.type);
    }
  }

  renderEventScreen(selected);
  showScreen('event');
  checkAchievements();
  saveGame();
}

function buildEventPool() {
  const pool = [];
  for (const ev of EVENTS) {
    for (let i = 0; i < ev.weight; i++) pool.push(ev);
  }
  return pool;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderEventScreen(events) {
  document.getElementById('day-number').textContent = `第 ${G.day} 天`;
  const container = document.getElementById('event-cards');
  container.innerHTML = '';

  for (const ev of events) {
    const card = document.createElement('div');
    card.className = 'event-card anim-pop';
    card.innerHTML = `
      <div class="event-icon">${ev.icon}</div>
      <div class="event-text">
        <div class="event-name">${ev.name}</div>
        <div class="event-desc">${getEventDesc(ev)}</div>
      </div>
    `;
    card.addEventListener('click', () => handleEventChoice(ev));
    container.appendChild(card);
  }
}

function getEventDesc(ev) {
  if (ev.type === 'rest') return `回復 ${Math.round(ev.hpRestore * 100)}% HP`;
  if (ev.type === 'shop') return '購買道具或裝備';
  if (ev.type === 'treasure') return '隨機獲得一件物品';
  if (ev.type === 'battle') return '與敵人進行德州撲克對決';
  if (ev.type === 'special_enemy') return '遭遇特殊敵人！';
  return '';
}

function handleEventChoice(ev) {
  G.selectedEvent = ev;
  if (ev.type === 'battle') {
    startBattle(pickRandomEnemy(G.player.lv, false));
  } else if (ev.type === 'special_enemy') {
    startBattle(pickRandomEnemy(G.player.lv, true));
  } else if (ev.type === 'rest') {
    doRestEvent(ev);
  } else if (ev.type === 'shop') {
    showShopScreen();
  } else if (ev.type === 'treasure') {
    doTreasureEvent();
  }
}

function doRestEvent(ev) {
  const restore = Math.floor(G.player.hpMax * ev.hpRestore);
  G.player.hp = Math.min(G.player.hpMax, G.player.hp + restore);
  showToast(`小憩一番，回復 ${restore} HP`);
  saveGame();
  setTimeout(() => showEventScreen(), 1500);
}

function doTreasureEvent() {
  const allDrops = [...ITEMS.map(i => i.id), ...EQUIPMENT.filter(e => e.quality === 'common' || e.quality === 'uncommon').map(e => e.id)];
  const id = allDrops[Math.floor(Math.random() * allDrops.length)];
  giveItem(id);
  const item = ITEMS.find(i => i.id === id) || EQUIPMENT.find(e => e.id === id);
  showToast(`寶箱！獲得 ${item?.name || id}`);
  saveGame();
  setTimeout(() => showEventScreen(), 1800);
}

// ===== BATTLE =====
function startBattle(enemyDef) {
  G.currentEnemy = JSON.parse(JSON.stringify(enemyDef)); // clone
  G.phase = 'battle';
  G.handCount = 0;
  G.insuranceActive = false;
  G.extraExpActive = false;
  G.freezeEnemyRaise = false;
  G.debuffEnemyAI = false;
  G.redoOnLoss = false;
  G.usedRedoThisHand = false;
  G.msgLog = [];

  applyPreBattleItems();
  startNewHand();
  showScreen('battle');
  renderBattleUI();
}

function startNewHand() {
  G.handCount++;
  G.usedRedoThisHand = false;
  _prevCommunityCount = 0;

  const p = G.player;
  const e = G.currentEnemy;
  const { smallBlind, bigBlind } = blindsForEnemy(e.lv);
  const playerIsDealer = Math.random() < 0.5;

  // Dealer bonus from equipment
  const dealerBonus = getEquipEffect('dealer_bonus');
  const playerGetsDealer = dealerBonus > 0 ? Math.random() < (0.5 + dealerBonus) : playerIsDealer;

  G.pokerState = createPokerGame({
    playerHP: p.hp,
    enemyHP: e.hp,
    smallBlind,
    bigBlind,
    playerIsDealer: playerGetsDealer,
  });

  // Apply pre-hand effects
  onHandStart(G.pokerState, e);
  applyPreHandItems();

  G.msgLog.push(...G.pokerState.log);
  G.pokerState.log = [];

  renderBattleUI();
  scheduleEnemyPreflop();
}

function scheduleEnemyPreflop() {
  const ps = G.pokerState;
  // In preflop, BB acts first normally. But in heads-up, dealer (SB) acts first preflop.
  // Determine who goes first this round
  scheduleEnemyIfNeeded();
}

function scheduleEnemyIfNeeded() {
  const ps = G.pokerState;
  if (ps.finished) return handleHandEnd();
  const enemyFirst = !playerGoesFirst();
  // Enemy goes first and nobody has acted yet → schedule enemy
  if (enemyFirst && !ps.enemyActed && !ps.playerActed) {
    setTimeout(() => doEnemyAction(), 600);
    return;
  }
  if (!ps.playerActed && !enemyFirst) return; // wait for player (player goes first)
  if (ps.playerActed && !ps.enemyActed) {
    setTimeout(() => doEnemyAction(), 600);
  }
  if (ps.playerActed && ps.enemyActed && ps.playerBet === ps.enemyBet) {
    setTimeout(() => advanceRound(), 400);
  }
}

function playerGoesFirst() {
  const ps = G.pokerState;
  // In preflop heads-up, dealer/SB acts first
  // In other phases, first to act is the non-dealer (out of position)
  if (ps.phase === 'preflop') {
    return ps.playerIsDealer; // dealer = SB = acts first preflop HU
  }
  return !ps.playerIsDealer; // OOP acts first postflop
}

function doEnemyAction() {
  const ps = G.pokerState;
  if (ps.finished) return;
  if (ps.enemyActed) return;

  // If enemy has 0 stack, auto check/all-in
  if (ps.enemyStack === 0) {
    if (ps.playerBet > ps.enemyBet) {
      // can't call, but all-in already happened — just check/done
    }
    ps.enemyActed = true;
    advanceRound();
    return;
  }

  const enemyDef = { ...G.currentEnemy };
  if (G.freezeEnemyRaise) {
    // wrap AI to never raise
    const orig = enemyDef.aiType;
    enemyDef._freezeRaise = true;
  }
  if (G.debuffEnemyAI) {
    enemyDef.aiType = 'novice'; // downgrade AI
  }

  let decision = enemyDecide(ps, enemyDef);

  // Freeze override
  if (G.freezeEnemyRaise && (decision.action === 'raise' || decision.action === 'allin')) {
    decision = { action: 'call' };
  }

  // Increase fold chance (詐唬 skill / debuff)
  if (G.enemyFoldBoost && decision.action !== 'fold') {
    if (Math.random() < 0.3) decision = { action: 'fold' };
    G.enemyFoldBoost = false;
  }

  applyAction(ps, 'enemy', decision.action, decision.amount || 0);
  G.msgLog.push(...ps.log);
  ps.log = [];

  if (decision.action === 'bet' || decision.action === 'raise' || decision.action === 'allin' || decision.action === 'call') {
    spawnChip(document.getElementById('enemy-hp-text'), document.getElementById('pot-amount'));
  }

  renderBattleLog();
  renderBattleState();

  if (ps.finished) {
    handleHandEnd();
  } else if (isBettingRoundOver(ps)) {
    setTimeout(() => advanceRound(), 500);
  } else if (!ps.playerActed) {
    renderActionButtons();
  }
}

function advanceRound() {
  const ps = G.pokerState;
  if (ps.finished) return;
  if (ps.phase === 'river') {
    advancePhase(ps);
    G.msgLog.push(...ps.log);
    ps.log = [];
    handleHandEnd();
  } else {
    advancePhase(ps);
    const phaseName = { flop: 'Flop', turn: 'Turn', river: 'River', showdown: 'Showdown' }[ps.phase] || ps.phase;
    G.msgLog.push(`--- ${phaseName} ---`);
    renderBattleUI();
    // If either player is all-in, no betting needed — auto-advance through remaining streets
    if (ps.playerStack === 0 || ps.enemyStack === 0) {
      ps.playerActed = true;
      ps.enemyActed = true;
      setTimeout(() => advanceRound(), 900);
      return;
    }
    if (!playerGoesFirst()) {
      setTimeout(() => doEnemyAction(), 600);
    }
  }
}

function handleHandEnd() {
  const ps = G.pokerState;
  const winner = ps.winner;

  // Redo on loss
  if (winner === 'enemy' && G.redoOnLoss && !G.usedRedoThisHand) {
    G.usedRedoThisHand = true;
    G.redoOnLoss = false;
    G.msgLog.push('[再來一手] 技能發動！重新進行這手牌');
    showToast('再來一手！');
    setTimeout(() => startNewHand(), 800);
    return;
  }

  // Compute HP delta
  let potWon = 0;
  if (winner === 'player') {
    potWon = ps.pot;
    // Chip absorb skill — extra 10% pot
    if (G.player.skills.includes('chip_absorb') && G.chipAbsorbActive) {
      potWon += Math.floor(ps.pot * 0.1);
      G.chipAbsorbActive = false;
    }
    // Equipment win bonus
    const winBonus = getEquipEffect('win_bonus');
    if (winBonus > 0) potWon += Math.floor(potWon * winBonus);
    // Tycoon passive
    if (G.player.classId === 'tycoon') potWon += Math.floor(potWon * 0.1);
    // Double pot chance
    const doublePotChance = getEquipEffect('double_pot_chance');
    if (doublePotChance > 0 && Math.random() < doublePotChance) {
      potWon *= 2;
      showToast('雙倍彩金！');
    }

    G.player.hp = Math.min(G.player.hpMax, G.player.hp + potWon);
    G.currentEnemy.hp -= potWon;
    G.player.stats.handsWon++;
    G.player.stats.handWinStreak++;
    G.player.stats.totalChipsWon += potWon;
    G.lastHandWon = true;

    // MP recovery
    const mpRegen = getMpRegen();
    G.player.mp = Math.min(G.player.mpMax, G.player.mp + mpRegen);

    // All-in win tracking
    if (ps.playerStack === 0 || ps.playerBet >= ps.playerHP) {
      G.player.stats.allInWins++;
    }

    G.msgLog.push(`✓ 你贏了這手！+${potWon} HP`);
  } else if (winner === 'enemy') {
    potWon = ps.pot;
    if (G.insuranceActive) {
      potWon = Math.floor(potWon * 0.5);
      G.insuranceActive = false;
      G.msgLog.push('[籌碼保險] 損失減半！');
    }
    G.player.hp -= potWon;
    G.currentEnemy.hp = Math.min(G.currentEnemy.hp, G.currentEnemy.hp + potWon);
    G.player.stats.handWinStreak = 0;
    G.lastHandWon = false;
    G.msgLog.push(`✗ 敵人贏了這手。-${potWon} HP`);
  } else {
    // tie — pot split
    G.msgLog.push('平局，底池平分。');
  }

  // Check enemy/player defeat
  if (G.currentEnemy.hp <= 0) {
    G.currentEnemy.hp = 0;
    setTimeout(() => handleBattleWin(), 600);
    return;
  }
  if (G.player.hp <= 0) {
    G.player.hp = 0;
    setTimeout(() => handleGameOver(), 600);
    return;
  }

  onHandEnd(ps, G.currentEnemy);

  renderBattleState();
  renderBattleLog();
  checkAchievements();

  // Next hand
  setTimeout(() => startNewHand(), 1000);
}

function handleBattleWin() {
  const e = G.currentEnemy;
  let expGain = e.exp;
  if (G.extraExpActive) { expGain = Math.floor(expGain * 1.5); G.extraExpActive = false; }

  G.player.exp += expGain;
  G.player.stats.battlesWon++;
  if (e.special) G.player.stats.specialsDefeated++;
  if (e.isFinalBoss || e.isBoss) G.player.stats.beatenBosses.push(e.id);

  // Drops
  let droppedItem = null;
  if (e.noChipReward && e.giftDrops) {
    droppedItem = pickRandomDrop(e.giftDrops);
  } else {
    droppedItem = pickRandomDrop(e.drops);
  }
  if (droppedItem) giveItem(droppedItem);

  G.msgLog.push(`戰鬥勝利！獲得 ${expGain} EXP`);
  if (droppedItem) {
    const item = ITEMS.find(i => i.id === droppedItem) || EQUIPMENT.find(eq => eq.id === droppedItem);
    if (item) G.msgLog.push(`掉落：${item.name}`);
  }

  checkLevelUp();
  checkAchievements();
  renderBattleLog();
  renderBattleState();
  saveGame();

  setTimeout(() => showEventScreen(), 1500);
}

function handleGameOver() {
  G.phase = 'gameover';
  checkAchievements();
  saveGame();
  renderGameOverScreen();
  showScreen('gameover');
}

// ===== LEVEL UP =====
function checkLevelUp() {
  const p = G.player;
  let leveled = false;
  while (p.exp >= expToNext(p.lv)) {
    p.exp -= expToNext(p.lv);
    p.lv++;
    const newHpMax = hpCapForLevel(p.lv);
    const hpGain = newHpMax - p.hpMax;
    p.hpMax = newHpMax;
    p.hp = Math.min(p.hpMax, p.hp + hpGain);
    leveled = true;
    showToast(`升級！LV.${p.lv} HP上限 +${hpGain}`);
  }
  if (leveled) updateHUD();
}

// ===== MP REGEN =====
function getMpRegen() {
  const cls = CLASSES.find(c => c.id === G.player.classId);
  const base = cls?.mpRegen || 10;
  const equip = getEquipEffect('mp_regen');
  return base + equip;
}

// ===== BATTLE UI =====
function renderBattleUI() {
  renderEnemy();
  renderBattleState();
  renderCommunityCards();
  renderHoleCards();
  renderActionButtons();
  renderBattleLog();
  renderQuickItems();
  updateDealerButton();
  updateHUD();
}

function renderEnemy() {
  const e = G.currentEnemy;
  if (!e) return;
  document.getElementById('enemy-name').textContent = `${e.name} Lv.${e.lv}`;
  document.getElementById('enemy-quote').textContent = e.quote || '...';
  const baseHp = ENEMIES.find(x => x.id === e.id)?.hp || SPECIAL_ENEMIES.find(x => x.id === e.id)?.hp || e.hp;
  const hpPct = Math.max(0, Math.min(100, (e.hp / baseHp) * 100));
  document.getElementById('enemy-hp-fill').style.width = hpPct + '%';
  document.getElementById('enemy-hp-text').textContent = e.hp;
  document.getElementById('enemy-figure').innerHTML = getPortrait(e.id);
}

function renderBattleState() {
  const ps = G.pokerState;
  if (!ps) return;
  const phaseNames = { preflop: 'Pre-Flop', flop: 'Flop', turn: 'Turn', river: 'River', showdown: 'Showdown' };
  document.getElementById('round-phase').textContent = phaseNames[ps.phase] || ps.phase;
  document.getElementById('pot-amount').textContent = ps.pot;
  document.getElementById('blind-small').textContent = ps.smallBlind;
  document.getElementById('blind-big').textContent = ps.bigBlind;

  // Battle stats
  document.getElementById('stat-player-chips').textContent = G.player.hp;
  document.getElementById('stat-enemy-chips').textContent = G.currentEnemy.hp;
  document.getElementById('stat-current-bet').textContent = ps.playerBet;
  document.getElementById('stat-pot').textContent = ps.pot;

  // Win rate (mathematician passive)
  const cls = CLASSES.find(c => c.id === G.player.classId);
  const winRateEl = document.getElementById('win-rate-badge');
  if (cls?.passive?.id === 'odds_calc' && ps.communityCards.length > 0) {
    const wr = Math.round(estimateHandStrength(ps.playerHole, ps.communityCards, 100) * 100);
    winRateEl.textContent = `勝率 ${wr}%`;
    winRateEl.style.display = 'inline-block';
  } else {
    winRateEl.style.display = 'none';
  }

  // Psychologist emotion display
  const emotionEl = document.getElementById('enemy-emotion');
  if (cls?.passive?.id === 'mind_read' && ps.communityCards.length > 0) {
    const str = estimateHandStrength(ps.enemyHole, ps.communityCards, 80);
    const emotion = str > 0.65 ? '😎 自信' : str > 0.35 ? '😐 普通' : '😰 緊張';
    emotionEl.textContent = emotion;
    emotionEl.style.display = 'inline-block';
  } else {
    emotionEl.style.display = 'none';
  }
}

function renderCommunityCards() {
  const ps = G.pokerState;
  if (!ps) return;
  const container = document.getElementById('community-cards');
  container.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const card = document.createElement('div');
    if (i < ps.communityCards.length) {
      const c = ps.communityCards[i];
      const isNew = i >= _prevCommunityCount;
      card.className = `card ${isRed(c.suit) ? 'red' : 'black'}${isNew ? ' flip-in' : ''}`;
      if (isNew) card.style.animationDelay = `${(i - _prevCommunityCount) * 0.12}s`;
      card.innerHTML = `<div class="card-rank">${c.rank}</div><div class="card-suit">${c.suit}</div>`;
    } else {
      card.className = 'card face-down';
    }
    container.appendChild(card);
  }
  _prevCommunityCount = ps.communityCards.length;
}

function updateDealerButton() {
  const ps = G.pokerState;
  const btn = document.getElementById('dealer-btn');
  if (!ps || !btn) return;
  btn.classList.remove('player-side', 'enemy-side', 'visible');
  if (ps.playerIsDealer) {
    btn.classList.add('player-side', 'visible');
  } else {
    btn.classList.add('enemy-side', 'visible');
  }
}

function spawnChip(fromEl, toEl) {
  if (!fromEl || !toEl) return;
  const fr = fromEl.getBoundingClientRect();
  const tr = toEl.getBoundingClientRect();
  const chip = document.createElement('div');
  chip.className = 'chip-fly';
  chip.textContent = '●';
  chip.style.left = (fr.left + fr.width / 2) + 'px';
  chip.style.top  = (fr.top  + fr.height / 2) + 'px';
  chip.style.setProperty('--tx', (tr.left + tr.width/2  - fr.left - fr.width/2)  + 'px');
  chip.style.setProperty('--ty', (tr.top  + tr.height/2 - fr.top  - fr.height/2) + 'px');
  document.body.appendChild(chip);
  chip.addEventListener('animationend', () => chip.remove(), { once: true });
}

function renderHoleCards() {
  const ps = G.pokerState;
  if (!ps) return;
  const container = document.getElementById('hole-cards');
  container.innerHTML = '';
  for (const c of ps.playerHole) {
    const card = document.createElement('div');
    card.className = `card large ${isRed(c.suit) ? 'red' : 'black'}`;
    card.innerHTML = `<div class="card-rank">${c.rank}</div><div class="card-suit">${c.suit}</div>`;
    container.appendChild(card);
  }
}

function isRed(suit) { return suit === '♥' || suit === '♦'; }

function renderActionButtons() {
  const ps = G.pokerState;
  const bar = document.getElementById('action-bar');
  if (!ps || ps.finished || ps.phase === 'showdown') {
    bar.innerHTML = '';
    return;
  }

  // Suppress buttons when waiting for enemy to go first
  const enemyFirst = !playerGoesFirst();
  if (enemyFirst && !ps.enemyActed && !ps.playerActed) {
    bar.innerHTML = '<div style="text-align:center;padding:10px;color:#888;font-size:0.8rem;width:100%">等待敵人行動…</div>';
    return;
  }

  const available = getAvailableActions(ps);
  const callAmt = ps.enemyBet - ps.playerBet;
  const minBet = ps.bigBlind;

  bar.innerHTML = '';

  // Fold
  addActionBtn(bar, 'fold', 'Fold', available.includes('fold'));
  // Check
  addActionBtn(bar, 'check', 'Check', available.includes('check'));
  // Bet
  const betBtn = addActionBtn(bar, 'bet', `Bet\n${minBet}`, available.includes('bet'));
  betBtn.addEventListener('click', () => showBetModal('bet', minBet, ps.playerStack));
  // Call
  const callLabel = callAmt > 0 ? `Call\n${callAmt}` : 'Call';
  addActionBtn(bar, 'call', callLabel, available.includes('call'));
  // Raise
  const raiseExtra = ps.bigBlind * 2;
  const raiseBtn = addActionBtn(bar, 'raise', `Raise\n${callAmt + raiseExtra}`, available.includes('raise'));
  raiseBtn.addEventListener('click', () => showBetModal('raise', raiseExtra, ps.playerStack - callAmt));
  // All-in
  addActionBtn(bar, 'allin', 'All-in', available.includes('allin'));
}

function addActionBtn(container, action, label, enabled) {
  const btn = document.createElement('button');
  btn.className = `btn-action ${action}`;
  btn.innerHTML = label.replace('\n', '<br>');
  btn.disabled = !enabled;
  if (enabled && action !== 'bet' && action !== 'raise') {
    btn.addEventListener('click', () => playerAction(action, 0));
  }
  container.appendChild(btn);
  return btn;
}

function showBetModal(type, minAmount, maxAmount) {
  const modal = document.getElementById('bet-modal');
  const slider = document.getElementById('bet-slider');
  const valueDisplay = document.getElementById('bet-value');
  const step = G.pokerState.bigBlind;

  slider.min = minAmount;
  slider.max = maxAmount;
  slider.step = step;
  slider.value = minAmount;
  valueDisplay.textContent = minAmount;

  slider.oninput = () => {
    const v = Math.round(slider.value / step) * step;
    slider.value = v;
    valueDisplay.textContent = v;
  };

  document.getElementById('bet-confirm').onclick = () => {
    const amount = parseInt(slider.value);
    modal.style.display = 'none';
    playerAction(type, amount);
  };

  document.getElementById('bet-cancel').onclick = () => {
    modal.style.display = 'none';
  };

  modal.style.display = 'flex';
}

function playerAction(action, amount = 0) {
  const ps = G.pokerState;
  if (!ps || ps.finished) return;

  applyAction(ps, 'player', action, amount);
  G.msgLog.push(...ps.log);
  ps.log = [];

  if (action === 'bet' || action === 'raise' || action === 'allin' || action === 'call') {
    spawnChip(document.getElementById('stat-player-chips'), document.getElementById('pot-amount'));
  }

  renderBattleState();
  renderBattleLog();
  renderActionButtons();

  if (ps.finished) {
    handleHandEnd();
    return;
  }

  if (isBettingRoundOver(ps)) {
    setTimeout(() => advanceRound(), 400);
  } else if (!ps.enemyActed) {
    setTimeout(() => doEnemyAction(), 600);
  }
}

function renderBattleLog() {
  const log = document.getElementById('msg-log');
  const entries = G.msgLog.slice(-20);
  log.innerHTML = entries.map(msg => {
    let cls = '';
    if (msg.startsWith('✓')) cls = 'good';
    else if (msg.startsWith('✗') || msg.includes('偷走') || msg.includes('損失')) cls = 'highlight';
    else if (msg.startsWith('---') || msg.startsWith('[')) cls = 'system';
    return `<p class="${cls}">${msg}</p>`;
  }).join('');
  log.scrollTop = log.scrollHeight;
}

function renderQuickItems() {
  const container = document.getElementById('quick-items');
  container.innerHTML = '';
  const slots = G.player.quickSlots.slice(0, 3);
  for (const itemId of slots) {
    const itemDef = ITEMS.find(i => i.id === itemId);
    if (!itemDef) continue;
    const inv = G.player.inventory.find(i => i.id === itemId);
    if (!inv || inv.qty <= 0) continue;
    const slot = document.createElement('div');
    slot.className = 'quick-item-slot';
    slot.title = itemDef.desc;
    slot.innerHTML = `${itemDef.icon}<span class="quick-item-count">${inv.qty}</span>`;
    slot.addEventListener('click', () => useItem(itemId));
    container.appendChild(slot);
  }
}

// ===== ITEMS =====
function giveItem(id) {
  const itemDef = ITEMS.find(i => i.id === id);
  const equipDef = EQUIPMENT.find(e => e.id === id);
  const skillId = SKILLS.find(s => s.id === id)?.id;

  if (skillId && !G.player.skills.includes(skillId)) {
    G.player.skills.push(skillId);
    showToast(`學會技能：${SKILLS.find(s=>s.id===skillId).name}`);
    return;
  }

  const inv = G.player.inventory;
  const existing = inv.find(i => i.id === id);
  if (existing) existing.qty++;
  else inv.push({ id, qty: 1 });

  // Auto-add to quick slots if it's an item and slot available
  if (itemDef && G.player.quickSlots.length < 3 && !G.player.quickSlots.includes(id)) {
    G.player.quickSlots.push(id);
  }
}

function applyPreBattleItems() {
  const toRemove = [];
  for (const inv of G.player.inventory) {
    const def = ITEMS.find(i => i.id === inv.id);
    if (!def || def.useTiming !== 'pre_battle' || inv.qty <= 0) continue;
    // auto-apply insurance if in inventory (player must manually use pre_battle items — skip auto)
  }
}

function applyPreHandItems() {
  // boosted hands: cola (KK), energy_drink (AK)
  const ps = G.pokerState;
  const effects = G.player.activeEffects;
  if (effects.boost_kk) {
    // re-deal until KK or timeout (just boost probability by checking, no guarantee)
    delete effects.boost_kk;
  }
  if (effects.boost_ak) {
    delete effects.boost_ak;
  }
}

function useItem(id) {
  const inv = G.player.inventory.find(i => i.id === id);
  const def = ITEMS.find(i => i.id === id);
  if (!inv || inv.qty <= 0 || !def) return;

  document.getElementById('item-confirm-icon').textContent = def.icon;
  document.getElementById('item-confirm-name').textContent = def.name;
  document.getElementById('item-confirm-desc').textContent = def.desc;
  document.getElementById('item-confirm-use').onclick = () => {
    document.getElementById('item-confirm-modal').style.display = 'none';
    executeUseItem(id);
  };
  document.getElementById('item-confirm-cancel').onclick = () => {
    document.getElementById('item-confirm-modal').style.display = 'none';
  };
  document.getElementById('item-confirm-modal').style.display = 'flex';
}

function executeUseItem(id) {
  const inv = G.player.inventory.find(i => i.id === id);
  const def = ITEMS.find(i => i.id === id);
  if (!inv || inv.qty <= 0 || !def) return;

  const ps = G.pokerState;

  switch (def.effect) {
    case 'double_bet_chance':
      showToast('啤酒！下注額可能翻倍！');
      G.player.activeEffects.double_bet = true;
      break;
    case 'boost_kk_chance':
      showToast('可樂！下一手KK機率提升！');
      G.player.activeEffects.boost_kk = true;
      break;
    case 'boost_ak_chance':
      showToast('能量飲料！下一手AK機率提升！');
      G.player.activeEffects.boost_ak = true;
      break;
    case 'replace_next_community':
      if (ps && ps.communityCards.length > 0) {
        const idx = ps.communityCards.length - 1;
        replaceCommunityCard(ps, idx);
        renderCommunityCards();
        showToast('幸運硬幣！公共牌已重新生成！');
      }
      break;
    case 'peek_turn':
      if (ps) {
        const next = peekNextCommunity(ps);
        if (next) showToast(`香菸！下一張牌：${next.rank}${next.suit}`);
      }
      break;
    case 'debuff_enemy_ai':
      G.debuffEnemyAI = true;
      showToast('威士忌！敵人判斷能力降低！');
      break;
    case 'peek_one_flop':
      if (ps && ps._flop) showToast(`荷官小費！Flop第一張：${ps._flop[0].rank}${ps._flop[0].suit}`);
      break;
    case 'reduce_loss':
      G.insuranceActive = true;
      showToast('籌碼保險啟動！損失減半！');
      break;
    case 'upgrade_hole_card':
      if (ps && ps.playerHole.length > 0) {
        // Boost first hole card value by 1 rank (max A)
        const card = ps.playerHole[0];
        const rankOrder = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
        const idx = rankOrder.indexOf(card.rank);
        if (idx < rankOrder.length - 1) {
          card.rank = rankOrder[idx + 1];
          card.value++;
        }
        renderHoleCards();
        showToast('老千骰子！手牌點數提升！');
      }
      break;
    case 'extra_exp':
      G.extraExpActive = true;
      showToast('黑卡會員證！勝利後獲得額外EXP！');
      break;
    default:
      showToast(`使用了 ${def.name}`);
  }

  inv.qty--;
  if (inv.qty <= 0) {
    G.player.inventory = G.player.inventory.filter(i => i.id !== id || i.qty > 0);
    G.player.quickSlots = G.player.quickSlots.filter(s => s !== id);
  }

  G.player.stats.itemsUsed = (G.player.stats.itemsUsed || 0) + 1;
  renderQuickItems();
  saveGame();
}

// ===== SKILLS =====
function useSkill(skillId) {
  const ps = G.pokerState;
  const def = SKILLS.find(s => s.id === skillId);
  if (!def) return;

  const mp = G.player.mp;
  const cost = getSkillCost(def);
  if (mp < cost) { showToast('MP不足！'); return; }

  switch (def.effect) {
    case 'peek_enemy_card':
      if (ps) {
        const card = ps.enemyHole[0];
        showToast(`偷看：敵人有 ${card.rank}${card.suit}`);
      }
      break;
    case 'replace_hole_card':
      if (ps) {
        replaceHoleCard(ps, 0);
        renderHoleCards();
        showToast('換牌！重抽了一張手牌');
      }
      break;
    case 'add_extra_hole':
      if (ps) {
        addExtraHoleCard(ps);
        renderHoleCards();
        showToast('第六張牌！獲得額外底牌');
      }
      break;
    case 'peek_next_community':
      if (ps) {
        const next = peekNextCommunity(ps);
        if (next) showToast(`預知：下一張公共牌是 ${next.rank}${next.suit}`);
        else showToast('無法預知');
      }
      break;
    case 'read_enemy_strength':
      if (ps) {
        const str = estimateHandStrength(ps.enemyHole, ps.communityCards.length ? ps.communityCards : [], 100);
        const level = str > 0.65 ? '強' : str > 0.35 ? '普通' : '弱';
        showToast(`讀心：敵人牌力 [${level}]`);
      }
      break;
    case 'freeze_enemy_raise':
      G.freezeEnemyRaise = true;
      showToast('凍結！本輪敵人無法加注！');
      break;
    case 'increase_enemy_fold':
      G.enemyFoldBoost = true;
      showToast('詐唬！敵人棄牌率提高！');
      break;
    case 'extra_pot_on_win':
      G.chipAbsorbActive = true;
      showToast('籌碼吸收！勝利額外獲得籌碼！');
      break;
    case 'redo_on_loss':
      G.redoOnLoss = true;
      showToast('再來一手！本手失敗可重玩！');
      break;
    case 'redeal_river':
      if (ps && ps.phase === 'river') {
        const newCard = ps.deck.shift();
        if (newCard) {
          ps.communityCards[4] = newCard;
          renderCommunityCards();
          showToast('命運改寫！River重新發牌！');
        }
      }
      break;
    case 'boost_strong_hand':
      showToast('皇家召喚！（效果已記錄）');
      G.player.activeEffects.boost_strong = true;
      break;
    case 'reveal_all_enemy':
      if (ps) {
        const cards = ps.enemyHole.map(c => `${c.rank}${c.suit}`).join(' ');
        showToast(`時間停止！敵人手牌：${cards}`);
      }
      break;
    default:
      showToast(`使用了 ${def.name}`);
  }

  G.player.mp -= cost;
  G.player.stats.skillsUsed++;
  updateHUD();
  saveGame();
  checkAchievements();
}

function getSkillCost(def) {
  let cost = def.mpCost;
  const cls = CLASSES.find(c => c.id === G.player.classId);
  if (cls?.passive?.id === 'cheat_tech') cost = Math.floor(cost * 0.9);
  const skillDiscount = getEquipEffect('skill_discount');
  if (skillDiscount > 0) cost = Math.floor(cost * (1 - skillDiscount));
  return cost;
}

// ===== EQUIPMENT =====
function getEquipEffect(effectType) {
  let total = 0;
  for (const slotId of Object.values(G.player.equipment)) {
    const equip = EQUIPMENT.find(e => e.id === slotId);
    if (equip?.effect?.type === effectType) total += equip.effect.value || 0;
  }
  return total;
}

function equipItem(equipId) {
  const def = EQUIPMENT.find(e => e.id === equipId);
  if (!def) return;
  G.player.equipment[def.slot] = equipId;
  // Remove from inventory if it was there
  const inv = G.player.inventory.find(i => i.id === equipId);
  if (inv) inv.qty--;
  saveGame();
  showToast(`裝備了 ${def.name}`);
}

// ===== SHOP =====
function showShopScreen() {
  G.phase = 'shop';
  const inv = getShopInventory(G.player.lv);
  renderShopScreen(inv);
  showScreen('shop');
}

function renderShopScreen(inventory) {
  document.getElementById('shop-chips').textContent = `籌碼：${G.player.hp}`;
  const grid = document.getElementById('shop-grid');
  grid.innerHTML = '';

  for (const item of inventory.items) {
    grid.appendChild(createShopCard(item, item.buyPrice, 'item'));
  }
  for (const equip of inventory.equipment) {
    const price = getEquipPrice(equip);
    grid.appendChild(createShopCard(equip, price, 'equip'));
  }

  document.getElementById('shop-leave').onclick = () => {
    showEventScreen();
  };
}

function getEquipPrice(equip) {
  const base = { common: 3000, uncommon: 6000, rare: 12000, epic: 25000, legendary: 50000 };
  return base[equip.quality] || 3000;
}

function createShopCard(def, price, type) {
  const card = document.createElement('div');
  card.className = 'shop-item';

  const canAfford = G.player.hp > price;
  const qualColor = def.quality ? QUALITY_COLORS[def.quality] : '';
  const qualName = def.quality ? QUALITY_NAMES[def.quality] : '';

  card.innerHTML = `
    <div class="shop-item-icon">${def.icon || '📦'}</div>
    ${def.quality ? `<span class="quality-badge" style="background:${qualColor}">${qualName}</span>` : ''}
    <div class="shop-item-name">${def.name}</div>
    <div class="shop-item-desc">${def.desc}</div>
    <div class="shop-item-price">💰 ${price}</div>
    <button class="btn shop-item-buy" ${canAfford ? '' : 'disabled'}>購買</button>
  `;

  card.querySelector('button').addEventListener('click', () => {
    if (G.player.hp <= price) { showToast('籌碼不足！'); return; }
    G.player.hp -= price;
    giveItem(def.id);
    showToast(`購買了 ${def.name}`);
    document.getElementById('shop-chips').textContent = `籌碼：${G.player.hp}`;
    card.querySelector('button').disabled = true;
    updateHUD();
    saveGame();
  });

  return card;
}

// ===== OVERLAYS =====
function showBackpack() {
  const overlay = document.getElementById('overlay-backpack');
  const list = overlay.querySelector('.inventory-list');
  list.innerHTML = '';
  for (const inv of G.player.inventory) {
    if (inv.qty <= 0) continue;
    const def = ITEMS.find(i => i.id === inv.id) || EQUIPMENT.find(e => e.id === inv.id);
    if (!def) continue;
    const el = document.createElement('div');
    el.className = 'inventory-item';
    el.innerHTML = `
      <div class="inventory-icon">${def.icon || '📦'}</div>
      <div class="inventory-info">
        <div class="inventory-name">${def.name} x${inv.qty}</div>
        <div class="inventory-desc">${def.desc}</div>
      </div>
      <div class="inventory-actions">
        ${ITEMS.find(i=>i.id===inv.id) ? `<button class="btn inventory-btn">使用</button>` : `<button class="btn inventory-btn">裝備</button>`}
      </div>
    `;
    const actionBtn = el.querySelector('.inventory-btn');
    actionBtn.addEventListener('click', () => {
      if (ITEMS.find(i => i.id === inv.id)) useItem(inv.id);
      else equipItem(inv.id);
      showBackpack(); // refresh
    });
    list.appendChild(el);
  }
  overlay.style.display = 'flex';
}

function showEquipment() {
  const overlay = document.getElementById('overlay-equip');
  const grid = overlay.querySelector('.equip-grid');
  grid.innerHTML = '';
  for (const slot of EQUIPMENT_SLOTS) {
    const equippedId = G.player.equipment[slot];
    const equip = equippedId ? EQUIPMENT.find(e => e.id === equippedId) : null;
    const el = document.createElement('div');
    el.className = `equip-slot ${equip ? 'filled' : ''}`;
    el.innerHTML = `
      <div class="equip-slot-label">${slot}</div>
      ${equip ? `<div class="equip-slot-name">${equip.name}</div>` : '<div style="opacity:0.4">空</div>'}
    `;
    grid.appendChild(el);
  }
  overlay.style.display = 'flex';
}

function showSkills() {
  const overlay = document.getElementById('overlay-skills');
  const list = overlay.querySelector('.skill-list');
  list.innerHTML = '';
  for (const skillId of G.player.skills) {
    const def = SKILLS.find(s => s.id === skillId);
    if (!def) continue;
    const cost = getSkillCost(def);
    const canUse = G.player.mp >= cost;
    const el = document.createElement('div');
    el.className = 'skill-item';
    el.innerHTML = `
      <span class="skill-mp-cost">${cost} MP</span>
      <div class="skill-info">
        <div class="skill-name">${def.name}</div>
        <div class="skill-desc">${def.desc}</div>
      </div>
      <button class="btn skill-use-btn" ${canUse && G.phase === 'battle' ? '' : 'disabled'}>使用</button>
    `;
    el.querySelector('button').addEventListener('click', () => {
      useSkill(skillId);
      overlay.style.display = 'none';
    });
    list.appendChild(el);
  }
  overlay.style.display = 'flex';
}

// ===== ACHIEVEMENTS =====
function checkAchievements() {
  if (!G) return;
  const p = G.player;
  const s = p.stats;

  for (const ach of ACHIEVEMENTS) {
    if (p.achievements.includes(ach.id)) continue;
    let unlocked = false;
    const c = ach.condition;

    switch(c.type) {
      case 'battles_won': unlocked = s.battlesWon >= c.value; break;
      case 'days': unlocked = s.days >= c.value; break;
      case 'win_low_hp': unlocked = (p.hp <= c.value && G.lastHandWon); break;
      case 'allin_wins': unlocked = s.allInWins >= c.value; break;
      case 'skills_used': unlocked = s.skillsUsed >= c.value; break;
      case 'total_chips_won': unlocked = s.totalChipsWon >= c.value; break;
      case 'beat_boss': unlocked = s.beatenBosses.includes(c.value); break;
      case 'hand_win_streak': unlocked = s.handWinStreak >= c.value; break;
      case 'beat_special': unlocked = s.specialsDefeated >= c.value; break;
      case 'level': unlocked = p.lv >= c.value; break;
      case 'win_no_items': unlocked = (s.battlesWon >= 1 && (s.itemsUsed || 0) === 0); break;
      case 'comeback_allin': unlocked = (s.allInWins >= 1 && G.lastHandWon && p.hp <= 2000); break;
    }

    if (unlocked) {
      p.achievements.push(ach.id);
      showToast(`🏆 成就解鎖：${ach.name}`);
    }
  }
}

// ===== GAME OVER SCREEN =====
function renderGameOverScreen() {
  const p = G.player;
  const s = p.stats;

  document.getElementById('result-days').textContent = s.days;
  document.getElementById('result-level').textContent = `LV.${p.lv}`;
  document.getElementById('result-battles').textContent = s.battlesWon;
  document.getElementById('result-chips').textContent = s.totalChipsWon.toLocaleString();
  document.getElementById('result-hands').textContent = s.handsWon;

  const achList = document.getElementById('achievement-list-result');
  achList.innerHTML = '';
  for (const ach of ACHIEVEMENTS) {
    const unlocked = p.achievements.includes(ach.id);
    const el = document.createElement('div');
    el.className = `achievement-item ${unlocked ? 'unlocked' : 'locked'}`;
    el.innerHTML = `
      <div class="achievement-icon">${ach.icon}</div>
      <div class="achievement-name">${ach.name}</div>
      <div style="font-size:0.65rem;color:#888">${ach.desc}</div>
      ${unlocked ? '<div class="achievement-check">✓</div>' : ''}
    `;
    achList.appendChild(el);
  }
}

// ===== TOAST =====
function showToast(msg, duration = 2000) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Title screen
  document.getElementById('btn-new-game').addEventListener('click', () => {
    showScreen('create');
  });

  document.getElementById('btn-continue').addEventListener('click', () => {
    if (loadGame()) {
      if (G.phase === 'gameover') {
        renderGameOverScreen();
        showScreen('gameover');
      } else if (G.phase === 'battle' && G.pokerState) {
        showScreen('battle');
        renderBattleUI();
      } else {
        showEventScreen();
      }
    }
  });

  // Update continue button visibility
  if (hasSave()) {
    document.getElementById('btn-continue').style.display = 'block';
  }

  // Character creation
  const classCards = document.querySelectorAll('.class-card');
  let selectedClass = CLASSES[0].id;
  classCards.forEach(card => {
    card.addEventListener('click', () => {
      classCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedClass = card.dataset.classId;
    });
  });

  document.getElementById('btn-start-game').addEventListener('click', () => {
    const name = document.getElementById('player-name').value.trim() || '冒險者';
    newGame(name, selectedClass);
  });

  // HUD icons
  document.getElementById('hud-btn-bag').addEventListener('click', showBackpack);
  document.getElementById('hud-btn-equip').addEventListener('click', showEquipment);
  document.getElementById('hud-btn-skills').addEventListener('click', showSkills);

  // Overlay close buttons
  document.querySelectorAll('.overlay-close').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.overlay').style.display = 'none';
    });
  });

  // Game over
  document.getElementById('btn-restart').addEventListener('click', () => {
    deleteSave();
    showScreen('title');
  });

  // Init title
  showScreen('title');
});
