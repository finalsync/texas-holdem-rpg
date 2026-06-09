// ai.js — Enemy AI decision logic

import { estimateHandStrength, applyAction } from './poker.js';

// Decide enemy action. Returns { action, amount }
function enemyDecide(state, enemyDef) {
  // Special enemies override normal AI
  if (enemyDef.special) {
    return specialEnemyDecide(state, enemyDef);
  }
  return standardAIDecide(state, enemyDef.aiType);
}

function standardAIDecide(state, aiType) {
  const strength = estimateHandStrength(state.enemyHole, state.communityCards, 150);
  const callAmount = state.playerBet - state.enemyBet;
  const potOdds = callAmount > 0 ? callAmount / (state.pot + callAmount) : 0;
  const stack = state.enemyStack;
  const bigBlind = state.bigBlind;

  switch (aiType) {
    case 'novice':    return noviceAI(strength, callAmount, potOdds, stack, bigBlind);
    case 'lag':       return lagAI(strength, callAmount, potOdds, stack, bigBlind);
    case 'tag':       return tagAI(strength, callAmount, potOdds, stack, bigBlind);
    case 'bluffer':   return blufferAI(strength, callAmount, potOdds, stack, bigBlind);
    case 'boss':      return bossAI(strength, callAmount, potOdds, stack, bigBlind);
    default:          return noviceAI(strength, callAmount, potOdds, stack, bigBlind);
  }
}

// ---- AI Personalities ----

// 新手型: usually call, rarely raise, almost never bluff
function noviceAI(strength, callAmount, potOdds, stack, bb) {
  if (callAmount === 0) {
    if (strength > 0.7) return { action: 'bet', amount: bb * 2 };
    return { action: 'check' };
  }
  if (strength < 0.25) return { action: 'fold' };
  if (strength > 0.75 && Math.random() < 0.3) return { action: 'raise', amount: callAmount };
  return { action: 'call' };
}

// 鬆凶型 (LAG): aggressive, frequent raises, bluffs
function lagAI(strength, callAmount, potOdds, stack, bb) {
  const bluffChance = 0.3;
  const bluffing = Math.random() < bluffChance;

  if (callAmount === 0) {
    if (strength > 0.5 || bluffing) return { action: 'bet', amount: bb * 3 };
    return { action: 'check' };
  }
  if (strength < 0.15 && !bluffing) return { action: 'fold' };
  if (strength > 0.6 || bluffing) {
    if (Math.random() < 0.5) return { action: 'raise', amount: callAmount * 2 };
  }
  return { action: 'call' };
}

// 緊凶型 (TAG): only plays strong hands, stable betting
function tagAI(strength, callAmount, potOdds, stack, bb) {
  if (callAmount === 0) {
    if (strength > 0.65) return { action: 'bet', amount: bb * 3 };
    return { action: 'check' };
  }
  if (strength < 0.4) return { action: 'fold' };
  if (strength > 0.8) return { action: 'raise', amount: callAmount * 2 };
  if (strength > potOdds + 0.1) return { action: 'call' };
  return { action: 'fold' };
}

// 詐唬型: frequent bets to make player fold
function blufferAI(strength, callAmount, potOdds, stack, bb) {
  const bluffChance = 0.45;
  const bluffing = Math.random() < bluffChance;

  if (callAmount === 0) {
    if (strength > 0.4 || bluffing) return { action: 'bet', amount: bb * 4 };
    return { action: 'check' };
  }
  if (strength < 0.1 && !bluffing) return { action: 'fold' };
  if (bluffing || strength > 0.6) return { action: 'raise', amount: callAmount * 2 };
  return { action: 'call' };
}

// Boss型: balanced and smart
function bossAI(strength, callAmount, potOdds, stack, bb) {
  const bluffChance = 0.2;
  const bluffing = Math.random() < bluffChance;

  if (callAmount === 0) {
    if (strength > 0.55 || bluffing) {
      const betSize = strength > 0.8 ? bb * 5 : bb * 3;
      return { action: 'bet', amount: betSize };
    }
    return { action: 'check' };
  }
  if (strength < 0.2 && !bluffing) return { action: 'fold' };
  if (strength > 0.75 || bluffing) {
    return { action: 'raise', amount: callAmount + bb * 2 };
  }
  if (strength > potOdds) return { action: 'call' };
  return { action: 'fold' };
}

// ---- Special Enemy AI ----

function specialEnemyDecide(state, enemyDef) {
  switch (enemyDef.id) {
    case 'xiaofeigui': // 小飛棍 — always all-in preflop
      if (state.phase === 'preflop') return { action: 'allin' };
      if (state.enemyStack === 0) return { action: 'check' };
      return { action: 'allin' };

    case 'ayi': { // 阿姨 — only plays AA/KK, else fold
      const hand = state.enemyHole;
      const hasMonsterHand = isMonsterHand(hand);
      if (!hasMonsterHand) {
        if (state.playerBet > state.enemyBet) return { action: 'fold' };
        return { action: 'check' };
      }
      // Has AA or KK
      if (state.playerBet > state.enemyBet) return { action: 'raise', amount: state.playerBet * 2 };
      return { action: 'bet', amount: state.bigBlind * 4 };
    }

    case 'majidi': { // 麻吉弟弟 — casual, generally calls/checks
      const callAmt = state.playerBet - state.enemyBet;
      if (callAmt === 0) return { action: 'check' };
      return { action: 'call' };
    }

    case 'beibaoxia': // 背包俠 — high skill, TAG-like
      return tagAI(
        estimateHandStrength(state.enemyHole, state.communityCards, 150),
        state.playerBet - state.enemyBet,
        (state.playerBet - state.enemyBet) / (state.pot + (state.playerBet - state.enemyBet) + 1),
        state.enemyStack,
        state.bigBlind
      );

    case 'dongguabang_a':
    case 'dongguabang_b':
      return lagAI(
        estimateHandStrength(state.enemyHole, state.communityCards, 150),
        state.playerBet - state.enemyBet,
        (state.playerBet - state.enemyBet) / (state.pot + 1),
        state.enemyStack,
        state.bigBlind
      );

    default:
      return standardAIDecide(state, 'novice');
  }
}

function isMonsterHand(holeCards) {
  const vals = holeCards.map(c => c.value);
  const isPair = vals[0] === vals[1];
  if (!isPair) return false;
  return vals[0] >= 13; // KK or AA
}

// ---- Special Enemy Event Hooks ----
// Called at specific moments during hand; may mutate state

function onHandStart(state, enemyDef) {
  if (!enemyDef.special) return;

  // 背包俠 — steal player chips
  if (enemyDef.id === 'beibaoxia') {
    if (Math.random() < 0.2) {
      const stolen = Math.floor((500 + Math.random() * 2500) / 500) * 500;
      const actual = Math.min(stolen, state.playerStack);
      if (actual > 0) {
        state.playerStack -= actual;
        state.enemyStack += actual;
        state.log.push(`[順手牽羊] 背包俠偷走你 ${actual} 籌碼！`);
      }
    }
  }
}

function onHandEnd(state, enemyDef) {
  if (!enemyDef.special) return;

  // 冬瓜幫 — swap one hole card between the two enemies
  if (enemyDef.id === 'dongguabang_a' && enemyDef.partner) {
    if (Math.random() < 0.3) {
      const partner = enemyDef.partner;
      // swap index 0
      const tmp = state.enemyHole[0];
      state.enemyHole[0] = partner.holeCards[0];
      partner.holeCards[0] = tmp;
      // silent — player doesn't know
    }
  }
}

export { enemyDecide, onHandStart, onHandEnd, estimateHandStrength };
