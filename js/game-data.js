// game-data.js — All static game data (enemies, items, equipment, skills, classes, achievements)
// To add/remove anything: edit this file only. The engine reads from these arrays.

// ---- SKILLS ----
export const SKILLS = [
  {
    id: 'peek',
    name: '偷看',
    mpCost: 10,
    desc: '查看對手1張手牌',
    phase: 'any',
    effect: 'peek_enemy_card',
  },
  {
    id: 'swap',
    name: '換牌',
    mpCost: 20,
    desc: '重抽1張手牌',
    phase: 'preflop',
    effect: 'replace_hole_card',
  },
  {
    id: 'sixth_card',
    name: '第六張牌',
    mpCost: 30,
    desc: '獲得第3張底牌，從3張選最佳組合',
    phase: 'preflop',
    effect: 'add_extra_hole',
  },
  {
    id: 'foresight',
    name: '預知',
    mpCost: 15,
    desc: '查看下一張公共牌',
    phase: 'any',
    effect: 'peek_next_community',
  },
  {
    id: 'read_mind',
    name: '讀心',
    mpCost: 20,
    desc: '顯示敵人牌力評估（弱/普通/強）',
    phase: 'any',
    effect: 'read_enemy_strength',
  },
  {
    id: 'freeze',
    name: '凍結',
    mpCost: 30,
    desc: '本輪敵人無法Raise',
    phase: 'any',
    effect: 'freeze_enemy_raise',
  },
  {
    id: 'bluff_skill',
    name: '詐唬',
    mpCost: 20,
    desc: '提高敵人Fold機率',
    phase: 'any',
    effect: 'increase_enemy_fold',
  },
  {
    id: 'chip_absorb',
    name: '籌碼吸收',
    mpCost: 25,
    desc: '獲勝時額外獲得部分POT',
    phase: 'any',
    effect: 'extra_pot_on_win',
  },
  {
    id: 'redo_hand',
    name: '再來一手',
    mpCost: 50,
    desc: '本手牌失敗後可重新進行一次',
    phase: 'any',
    effect: 'redo_on_loss',
  },
  {
    id: 'rewrite_fate',
    name: '命運改寫',
    mpCost: 100,
    desc: 'River重新發牌',
    phase: 'river',
    effect: 'redeal_river',
  },
  {
    id: 'royal_summon',
    name: '皇家召喚',
    mpCost: 150,
    desc: '提高獲得超強牌型機率',
    phase: 'preflop',
    effect: 'boost_strong_hand',
  },
  {
    id: 'time_stop',
    name: '時間停止',
    mpCost: 200,
    desc: '查看敵人全部手牌',
    phase: 'any',
    effect: 'reveal_all_enemy',
  },
];

// ---- ITEMS ----
export const ITEMS = [
  {
    id: 'beer',
    name: '啤酒',
    desc: '本手下注額有機率翻倍',
    icon: '🍺',
    buyPrice: 2000,
    effect: 'double_bet_chance',
    useTiming: 'in_hand',
  },
  {
    id: 'cola',
    name: '可樂',
    desc: '下一手獲得KK機率提高',
    icon: '🥤',
    buyPrice: 1500,
    effect: 'boost_kk_chance',
    useTiming: 'pre_hand',
  },
  {
    id: 'energy_drink',
    name: '能量飲料',
    desc: '下一手獲得AK機率提高',
    icon: '⚡',
    buyPrice: 1500,
    effect: 'boost_ak_chance',
    useTiming: 'pre_hand',
  },
  {
    id: 'lucky_coin',
    name: '幸運硬幣',
    desc: '重新生成下一張公共牌',
    icon: '🪙',
    buyPrice: 3000,
    effect: 'replace_next_community',
    useTiming: 'in_hand',
  },
  {
    id: 'cigarette',
    name: '香菸',
    desc: '偷看Turn牌',
    icon: '🚬',
    buyPrice: 2000,
    effect: 'peek_turn',
    useTiming: 'in_hand',
  },
  {
    id: 'whiskey',
    name: '威士忌',
    desc: '降低敵人判斷能力（AI更差）',
    icon: '🥃',
    buyPrice: 2500,
    effect: 'debuff_enemy_ai',
    useTiming: 'pre_hand',
  },
  {
    id: 'dealer_tip',
    name: '荷官小費',
    desc: '開局查看1張Flop',
    icon: '💵',
    buyPrice: 2000,
    effect: 'peek_one_flop',
    useTiming: 'pre_hand',
  },
  {
    id: 'chip_insurance',
    name: '籌碼保險',
    desc: '本場戰鬥失敗時減少損失50%',
    icon: '🛡️',
    buyPrice: 5000,
    effect: 'reduce_loss',
    useTiming: 'pre_battle',
  },
  {
    id: 'cheat_dice',
    name: '老千骰子',
    desc: '隨機提升1張手牌點數',
    icon: '🎲',
    buyPrice: 3500,
    effect: 'upgrade_hole_card',
    useTiming: 'preflop',
  },
  {
    id: 'black_card',
    name: '黑卡會員證',
    desc: '戰鬥勝利額外獲得EXP',
    icon: '🃏',
    buyPrice: 4000,
    effect: 'extra_exp',
    useTiming: 'pre_battle',
  },
];

// ---- EQUIPMENT ----
export const EQUIPMENT_SLOTS = ['帽子', '墨鏡', '上衣', '手套', '項鍊', '戒指', '褲子', '鞋子'];

export const EQUIPMENT = [
  // 普通
  { id: 'lucky_hat', name: '幸運帽', slot: '帽子', quality: 'common', desc: 'AA出現率+5%', effect: { type: 'boost_aa', value: 0.05 }, dropRate: 0.3 },
  { id: 'basic_glasses', name: '普通墨鏡', slot: '墨鏡', quality: 'common', desc: '有5%機率偷看對手1張手牌', effect: { type: 'peek_chance', value: 0.05 }, dropRate: 0.3 },
  { id: 'deal_gloves', name: '發牌手套', slot: '手套', quality: 'common', desc: '每場戰鬥可重抽1次手牌', effect: { type: 'free_swap', value: 1 }, dropRate: 0.25 },
  { id: 'gold_necklace', name: '金幣項鍊', slot: '項鍊', quality: 'common', desc: '戰鬥勝利額外獲得10%籌碼', effect: { type: 'win_bonus', value: 0.1 }, dropRate: 0.25 },
  { id: 'double_ring', name: '雙倍戒指', slot: '戒指', quality: 'common', desc: '5%機率獲得雙倍POT', effect: { type: 'double_pot_chance', value: 0.05 }, dropRate: 0.2 },
  { id: 'dealer_shoes', name: '荷官皮鞋', slot: '鞋子', quality: 'common', desc: '提高成為莊家的機率', effect: { type: 'dealer_bonus', value: 0.2 }, dropRate: 0.25 },
  // 精良
  { id: 'sharp_glasses', name: '老千墨鏡', slot: '墨鏡', quality: 'uncommon', desc: '15%機率偷看對手1張手牌', effect: { type: 'peek_chance', value: 0.15 }, dropRate: 0.15 },
  { id: 'card_coat', name: '賭場西裝', slot: '上衣', quality: 'uncommon', desc: 'MP上限+20', effect: { type: 'mp_max', value: 20 }, dropRate: 0.15 },
  { id: 'lucky_pants', name: '幸運褲', slot: '褲子', quality: 'uncommon', desc: '每手牌贏後+15MP', effect: { type: 'mp_regen', value: 5 }, dropRate: 0.15 },
  // 稀有
  { id: 'pro_hat', name: '職業選手帽', slot: '帽子', quality: 'rare', desc: 'AA/KK出現率+10%', effect: { type: 'boost_premium', value: 0.1 }, dropRate: 0.08 },
  { id: 'fortune_ring', name: '財富戒指', slot: '戒指', quality: 'rare', desc: '15%機率獲得雙倍POT', effect: { type: 'double_pot_chance', value: 0.15 }, dropRate: 0.08 },
  // 史詩
  { id: 'ghost_gloves', name: '幽靈手套', slot: '手套', quality: 'epic', desc: '每場戰鬥可免費換牌2次（不消耗MP）', effect: { type: 'free_swap', value: 2 }, dropRate: 0.04 },
  { id: 'ace_necklace', name: 'ACE項鍊', slot: '項鍊', quality: 'epic', desc: '勝利後額外獲得25%籌碼', effect: { type: 'win_bonus', value: 0.25 }, dropRate: 0.04 },
  // 傳說
  { id: 'legend_hat', name: '賭神帽', slot: '帽子', quality: 'legendary', desc: 'AA出現率+20%，每手牌開始回5MP', effect: { type: 'legend_luck' }, dropRate: 0.01 },
  { id: 'king_coat', name: '撲克之王外套', slot: '上衣', quality: 'legendary', desc: '所有技能MP消耗-30%', effect: { type: 'skill_discount', value: 0.3 }, dropRate: 0.01 },
];

export const QUALITY_NAMES = {
  common: '普通',
  uncommon: '精良',
  rare: '稀有',
  epic: '史詩',
  legendary: '傳說',
};

export const QUALITY_COLORS = {
  common: '#888',
  uncommon: '#4a9',
  rare: '#46f',
  epic: '#a4f',
  legendary: '#fa0',
};

// ---- CLASSES ----
export const CLASSES = [
  {
    id: 'gambler',
    name: '賭徒',
    subtitle: 'Gambler',
    desc: '高風險高報酬',
    passive: { id: 'lucky_goddess', name: '幸運女神', desc: 'AA/KK機率略增+3%' },
    startSkills: ['bluff_skill'],
    mpRegen: 10,
    color: '#c44',
  },
  {
    id: 'cheater',
    name: '老千',
    subtitle: 'Cheater',
    desc: '操控牌局',
    passive: { id: 'cheat_tech', name: '出千技巧', desc: '技能消耗MP降低10%' },
    startSkills: ['peek'],
    mpRegen: 10,
    color: '#44c',
  },
  {
    id: 'psychologist',
    name: '心理學家',
    subtitle: 'Psychologist',
    desc: '控制對手',
    passive: { id: 'mind_read', name: '讀心術', desc: '顯示敵人情緒（緊張/普通/自信）' },
    startSkills: ['bluff_skill'],
    mpRegen: 10,
    color: '#a44',
  },
  {
    id: 'mathematician',
    name: '數學家',
    subtitle: 'Mathematician',
    desc: '計算流，顯示目前勝率',
    passive: { id: 'odds_calc', name: '勝率計算', desc: '戰鬥畫面顯示即時勝率%' },
    startSkills: ['foresight'],
    mpRegen: 10,
    color: '#48a',
  },
  {
    id: 'dealer',
    name: '荷官',
    subtitle: 'Dealer',
    desc: '控制牌桌',
    passive: { id: 'house_edge', name: '莊家優勢', desc: '較容易獲得Button' },
    startSkills: ['swap'],
    mpRegen: 10,
    color: '#4a4',
  },
  {
    id: 'tycoon',
    name: '資本家',
    subtitle: 'Tycoon',
    desc: '籌碼成長最快',
    passive: { id: 'compound', name: '資本增值', desc: '獲得籌碼+10%' },
    startSkills: ['chip_absorb'],
    mpRegen: 10,
    color: '#ca4',
  },
  {
    id: 'pro',
    name: '職業選手',
    subtitle: 'Pro Player',
    desc: '最均衡，弱牌不容易被壓制',
    passive: { id: 'steady', name: '穩定發揮', desc: '弱牌不容易被壓制（fold門檻降低）' },
    startSkills: ['read_mind'],
    mpRegen: 12,
    color: '#777',
  },
];

// ---- ENEMIES ----
export const ENEMIES = [
  { id: 'street_gambler', name: '街頭賭徒', lv: 1, hp: 5000, aiType: 'novice', exp: 30, drops: ['beer', 'cola'], quote: '來一手怎麼樣？' },
  { id: 'underground_player', name: '地下賭場玩家', lv: 2, hp: 8000, aiType: 'lag', exp: 60, drops: ['lucky_coin', 'energy_drink'], quote: '你看起來有錢。' },
  { id: 'pro_gambler', name: '職業賭手', lv: 3, hp: 12000, aiType: 'tag', exp: 100, drops: ['whiskey', 'lucky_hat'], quote: '我一天贏的比你一年多。' },
  { id: 'scammer', name: '詐欺師', lv: 4, hp: 15000, aiType: 'bluffer', exp: 150, drops: ['cheat_dice', 'dealer_tip'], quote: '別那麼緊張，就是個遊戲。' },
  { id: 'casino_boss', name: '賭場莊家', lv: 5, hp: 25000, aiType: 'boss', exp: 300, drops: ['sharp_glasses', 'black_card'], quote: '你以為你能贏我？' },
  { id: 'loan_shark', name: '地下錢莊老大', lv: 6, hp: 30000, aiType: 'tag', exp: 400, drops: ['fortune_ring', 'chip_insurance'], quote: '你的命，就是我的籌碼。' },
  { id: 'poker_ace', name: '撲克高手', lv: 8, hp: 40000, aiType: 'boss', exp: 600, drops: ['pro_hat', 'ghost_gloves'], quote: '坐下，讓我教你什麼叫德州撲克。' },
  { id: 'god_of_gamblers', name: '賭神', lv: 10, hp: 60000, aiType: 'boss', exp: 1000, drops: ['legend_hat', 'king_coat'], quote: '......', isFinalBoss: true },
];

// ---- SPECIAL ENEMIES ----
export const SPECIAL_ENEMIES = [
  {
    id: 'dongguabang',
    name: '冬瓜幫',
    lv: 3,
    hp: 20000, // shared pool
    special: true,
    isTeam: true,
    aiType: 'lag',
    exp: 200,
    drops: ['cola', 'beer', 'lucky_coin'],
    quote: '兩打一，你行嗎？',
    skills: ['partner_swap'],
  },
  {
    id: 'beibaoxia',
    name: '背包俠',
    lv: 4,
    hp: 18000,
    special: true,
    aiType: 'tag',
    exp: 250,
    drops: ['dealer_tip', 'cheat_dice'],
    quote: '哎，少了點什麼？',
    skills: ['pickpocket', 'chip_recycle'],
  },
  {
    id: 'xiaofeigui',
    name: '小飛棍',
    lv: 2,
    hp: 10000,
    special: true,
    aiType: 'lag',
    exp: 120,
    drops: ['beer', 'energy_drink'],
    quote: '全下！全下！全他媽的下！',
    skills: ['yolo'],
  },
  {
    id: 'ayi',
    name: '阿姨',
    lv: 5,
    hp: 22000,
    special: true,
    aiType: 'tag',
    exp: 280,
    drops: ['lucky_coin', 'whiskey'],
    quote: '...（靜靜地等待）',
    skills: ['only_monsters'],
  },
  {
    id: 'majidi',
    name: '麻吉弟弟',
    lv: 1,
    hp: 3000,
    special: true,
    aiType: 'novice',
    exp: 10,
    drops: [],
    giftDrops: ['beer', 'lucky_coin', 'peek', 'energy_drink'], // gives items/skills instead of chips
    noChipReward: true,
    quote: '沒關係，輸了就輸了，送你點東西！',
    skills: ['broke', 'generosity'],
  },
  {
    id: 'sharkplayer',
    name: '鯊魚玩家',
    lv: 9,
    hp: 50000,
    special: true,
    aiType: 'boss',
    exp: 800,
    drops: ['ace_necklace', 'king_coat'],
    quote: '感覺到了嗎？那是你在顫抖。',
    skills: ['peek', 'swap', 'foresight', 'bluff_skill'],
    isBoss: true,
  },
];

// ---- ACHIEVEMENTS ----
export const ACHIEVEMENTS = [
  { id: 'first_win', name: '初出茅廬', desc: '贏得第一場戰鬥', icon: '🃏', condition: { type: 'battles_won', value: 1 } },
  { id: 'survive_7', name: '一週老鳥', desc: '生存7天', icon: '📅', condition: { type: 'days', value: 7 } },
  { id: 'survive_30', name: '鐵血賭徒', desc: '生存30天', icon: '⚔️', condition: { type: 'days', value: 30 } },
  { id: 'survive_100', name: '百日傳說', desc: '生存100天', icon: '🏆', condition: { type: 'days', value: 100 } },
  { id: 'near_death', name: '起死回生', desc: 'HP低於1000時仍贏得戰鬥', icon: '💀', condition: { type: 'win_low_hp', value: 1000 } },
  { id: 'allin_wins', name: '全下勇者', desc: 'All-in獲勝10次', icon: '💥', condition: { type: 'allin_wins', value: 10 } },
  { id: 'skill_user', name: '技術流', desc: '累計使用技能50次', icon: '✨', condition: { type: 'skills_used', value: 50 } },
  { id: 'millionaire', name: '富可敵國', desc: '累計獲得100萬籌碼', icon: '💰', condition: { type: 'total_chips_won', value: 1000000 } },
  { id: 'final_boss', name: '破關者', desc: '擊敗賭神', icon: '👑', condition: { type: 'beat_boss', value: 'god_of_gamblers' } },
  { id: 'win_streak_5', name: '連勝機器', desc: '連續贏5手牌', icon: '🔥', condition: { type: 'hand_win_streak', value: 5 } },
  { id: 'beat_special', name: '特別之敵', desc: '擊敗任意一名特殊敵人', icon: '⭐', condition: { type: 'beat_special', value: 1 } },
  { id: 'lv10', name: '老江湖', desc: '達到LV10', icon: '🎖️', condition: { type: 'level', value: 10 } },
  { id: 'no_item', name: '純技術流', desc: '不使用任何道具完成一場戰鬥', icon: '🧘', condition: { type: 'win_no_items', value: 1 } },
  { id: 'broke_win', name: '神蹟', desc: '最後一手All-in獲勝逆轉戰局', icon: '🌟', condition: { type: 'comeback_allin', value: 1 } },
];

// ---- EVENTS (Roguelike pool) ----
export const EVENTS = [
  { id: 'battle', name: '遭遇戰鬥', icon: '⚔️', weight: 60, type: 'battle' },
  { id: 'shop', name: '神秘商店', icon: '🏪', weight: 20, type: 'shop' },
  { id: 'rest', name: '小憩一番', icon: '🛌', weight: 10, type: 'rest', hpRestore: 0.15 },
  { id: 'treasure', name: '神秘寶箱', icon: '📦', weight: 7, type: 'treasure' },
  { id: 'special', name: '奇怪的挑戰', icon: '❓', weight: 3, type: 'special_enemy' },
];

// ---- LEVEL TABLE ----
// expToNext[n] = EXP needed to go from LV n to LV n+1
export function expToNext(lv) {
  return lv * 100;
}

export function hpCapForLevel(lv) {
  return 30000 + (lv - 1) * 5000;
}

export function blindsForEnemy(enemyLv) {
  const sb = enemyLv * 250;
  return { smallBlind: sb, bigBlind: sb * 2 };
}

// Shop inventory (random subset shown each visit)
export function getShopInventory(playerLv) {
  const allItems = ITEMS.filter(() => Math.random() < 0.6);
  const allEquip = EQUIPMENT.filter(e => {
    const qualityWeight = { common: 0.7, uncommon: 0.4, rare: playerLv >= 5 ? 0.3 : 0, epic: playerLv >= 8 ? 0.15 : 0, legendary: 0 };
    return Math.random() < (qualityWeight[e.quality] ?? 0);
  });
  return { items: allItems.slice(0, 4), equipment: allEquip.slice(0, 3) };
}

// Pick random enemy appropriate for player level
export function pickRandomEnemy(playerLv, forceSpecial = false) {
  if (forceSpecial) {
    return SPECIAL_ENEMIES[Math.floor(Math.random() * SPECIAL_ENEMIES.length)];
  }
  const pool = ENEMIES.filter(e => Math.abs(e.lv - playerLv) <= 2);
  if (!pool.length) return ENEMIES[0];
  return pool[Math.floor(Math.random() * pool.length)];
}

export function pickRandomDrop(drops) {
  if (!drops || drops.length === 0) return null;
  return drops[Math.floor(Math.random() * drops.length)];
}
