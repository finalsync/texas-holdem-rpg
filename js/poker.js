// poker.js — Texas Hold'em engine

const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const RANK_VALUE = { '2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':11,'Q':12,'K':13,'A':14 };

function createDeck() {
  const deck = [];
  for (const suit of SUITS)
    for (const rank of RANKS)
      deck.push({ suit, rank, value: RANK_VALUE[rank] });
  return deck;
}

function shuffle(deck) {
  const d = [...deck];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

// ---- Hand Evaluation ----

function getCombinations(arr, k) {
  if (k === 0) return [[]];
  if (arr.length < k) return [];
  const [first, ...rest] = arr;
  return [
    ...getCombinations(rest, k - 1).map(c => [first, ...c]),
    ...getCombinations(rest, k)
  ];
}

// Returns { rank, name, tiebreakers } — higher rank = better hand
function evaluateFive(cards) {
  const values = cards.map(c => c.value).sort((a, b) => b - a);
  const suits = cards.map(c => c.suit);
  const isFlush = new Set(suits).size === 1;

  const isStraight = (() => {
    const uniq = [...new Set(values)];
    if (uniq.length === 5 && uniq[0] - uniq[4] === 4) return true;
    // A-2-3-4-5
    if (JSON.stringify(uniq) === JSON.stringify([14, 5, 4, 3, 2])) return true;
    return false;
  })();

  const counts = {};
  for (const v of values) counts[v] = (counts[v] || 0) + 1;
  const groups = Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || b[0] - a[0])
    .map(([v, c]) => ({ v: +v, c }));

  const isLowStraight = isFlush && new Set(values).size === 5 &&
    JSON.stringify([...new Set(values)].sort((a,b)=>b-a)) === JSON.stringify([14,5,4,3,2]);

  let rank, name, tiebreakers;

  if (isFlush && isStraight) {
    const high = isLowStraight ? 5 : values[0];
    if (high === 14) { rank = 9; name = '皇家同花順'; }
    else { rank = 8; name = '同花順'; }
    tiebreakers = [high];
  } else if (groups[0].c === 4) {
    rank = 7; name = '四條';
    tiebreakers = [groups[0].v, groups[1].v];
  } else if (groups[0].c === 3 && groups[1].c === 2) {
    rank = 6; name = '葫蘆';
    tiebreakers = [groups[0].v, groups[1].v];
  } else if (isFlush) {
    rank = 5; name = '同花';
    tiebreakers = values;
  } else if (isStraight) {
    const high = isLowStraight ? 5 : values[0];
    rank = 4; name = '順子';
    tiebreakers = [high];
  } else if (groups[0].c === 3) {
    rank = 3; name = '三條';
    tiebreakers = [groups[0].v, ...groups.slice(1).map(g => g.v)];
  } else if (groups[0].c === 2 && groups[1].c === 2) {
    rank = 2; name = '兩對';
    tiebreakers = [Math.max(groups[0].v, groups[1].v), Math.min(groups[0].v, groups[1].v), groups[2].v];
  } else if (groups[0].c === 2) {
    rank = 1; name = '一對';
    tiebreakers = [groups[0].v, ...groups.slice(1).map(g => g.v)];
  } else {
    rank = 0; name = '高牌';
    tiebreakers = values;
  }

  return { rank, name, tiebreakers };
}

function bestHand(holeCards, communityCards) {
  const all = [...holeCards, ...communityCards];
  const combos = getCombinations(all, 5);
  let best = null;
  for (const combo of combos) {
    const result = evaluateFive(combo);
    if (!best || compareHands(result, best) > 0) best = result;
  }
  return best;
}

function compareHands(a, b) {
  if (a.rank !== b.rank) return a.rank - b.rank;
  for (let i = 0; i < Math.max(a.tiebreakers.length, b.tiebreakers.length); i++) {
    const av = a.tiebreakers[i] ?? 0;
    const bv = b.tiebreakers[i] ?? 0;
    if (av !== bv) return av - bv;
  }
  return 0;
}

// ---- Hand Strength Estimation (for AI) ----
// Quick Monte Carlo: simulate N random outcomes and count wins
function estimateHandStrength(holeCards, communityCards, simulations = 200) {
  let wins = 0;
  const knownCards = new Set([...holeCards, ...communityCards].map(c => c.suit + c.rank));

  for (let i = 0; i < simulations; i++) {
    const deck = shuffle(createDeck().filter(c => !knownCards.has(c.suit + c.rank)));
    const needed = 5 - communityCards.length;
    const simCommunity = [...communityCards, ...deck.slice(0, needed)];
    const oppHole = deck.slice(needed, needed + 2);

    const myBest = bestHand(holeCards, simCommunity);
    const oppBest = bestHand(oppHole, simCommunity);
    if (compareHands(myBest, oppBest) > 0) wins++;
  }
  return wins / simulations;
}

// ---- Poker State Machine ----

const PHASES = ['preflop', 'flop', 'turn', 'river', 'showdown'];

function createPokerGame({ playerHP, enemyHP, smallBlind, bigBlind, playerIsDealer }) {
  const deck = shuffle(createDeck());
  let idx = 0;
  const deal = (n) => deck.splice(0, n);

  const playerHole = deal(2);
  const enemyHole = deal(2);
  deal(1); // burn
  const flop = deal(3);
  deal(1); // burn
  const turn = deal(1);
  deal(1); // burn
  const river = deal(1);

  // Who posts blind? In heads-up: dealer = small blind
  const playerSB = playerIsDealer;
  const psb = playerSB ? smallBlind : bigBlind;
  const esb = playerSB ? bigBlind : smallBlind;

  const state = {
    phase: 'preflop',
    deck,
    playerHole,
    enemyHole,
    communityCards: [],
    _flop: flop, _turn: turn, _river: river,
    pot: psb + esb,
    playerBet: psb,
    enemyBet: esb,
    playerStack: playerHP - psb,
    enemyStack: enemyHP - esb,
    playerHP,
    enemyHP,
    smallBlind,
    bigBlind,
    playerIsDealer,
    playerActed: false,
    enemyActed: false,
    finished: false,
    winner: null,   // 'player' | 'enemy' | 'tie'
    handResult: null,
    log: [],
  };

  if (playerSB) {
    state.log.push(`你 下注小盲 ${smallBlind}`);
    state.log.push(`敵人 下注大盲 ${bigBlind}`);
  } else {
    state.log.push(`敵人 下注小盲 ${smallBlind}`);
    state.log.push(`你 下注大盲 ${bigBlind}`);
  }

  return state;
}

function advancePhase(state) {
  if (state.phase === 'preflop') {
    state.communityCards = [...state._flop];
    state.phase = 'flop';
  } else if (state.phase === 'flop') {
    state.communityCards.push(...state._turn);
    state.phase = 'turn';
  } else if (state.phase === 'turn') {
    state.communityCards.push(...state._river);
    state.phase = 'river';
  } else if (state.phase === 'river') {
    state.phase = 'showdown';
    resolveShowdown(state);
  }
  state.playerBet = 0;
  state.enemyBet = 0;
  state.playerActed = false;
  state.enemyActed = false;
}

function resolveShowdown(state) {
  const ph = bestHand(state.playerHole, state.communityCards);
  const eh = bestHand(state.enemyHole, state.communityCards);
  const cmp = compareHands(ph, eh);
  if (cmp > 0) {
    state.winner = 'player';
    state.handResult = { player: ph, enemy: eh };
  } else if (cmp < 0) {
    state.winner = 'enemy';
    state.handResult = { player: ph, enemy: eh };
  } else {
    state.winner = 'tie';
    state.handResult = { player: ph, enemy: eh };
  }
  state.finished = true;
  state.log.push(`--- 攤牌 ---`);
  state.log.push(`你: ${ph.name}`);
  state.log.push(`敵人: ${eh.name}`);
  if (state.winner === 'player') state.log.push(`你獲勝！`);
  else if (state.winner === 'enemy') state.log.push(`敵人獲勝`);
  else state.log.push(`平局`);
}

// Returns whether both players have acted and bets are equal (round over)
function isBettingRoundOver(state) {
  if (!state.playerActed || !state.enemyActed) return false;
  return state.playerBet === state.enemyBet;
}

// Apply a player action. Returns updated state (mutates in place).
function applyAction(state, actor, action, amount = 0) {
  const isPlayer = actor === 'player';
  const myBetKey = isPlayer ? 'playerBet' : 'enemyBet';
  const oppBetKey = isPlayer ? 'enemyBet' : 'playerBet';
  const myStackKey = isPlayer ? 'playerStack' : 'enemyStack';
  const actedKey = isPlayer ? 'playerActed' : 'enemyActed';

  const callAmount = state[oppBetKey] - state[myBetKey];
  const name = isPlayer ? '你' : '敵人';

  switch (action) {
    case 'fold':
      state.winner = isPlayer ? 'enemy' : 'player';
      state.finished = true;
      state.log.push(`${name} 棄牌`);
      break;

    case 'check':
      state[actedKey] = true;
      state.log.push(`${name} 過牌`);
      break;

    case 'call': {
      const clampedCall = Math.max(0, callAmount);
      const actual = Math.min(clampedCall, state[myStackKey]);
      state[myBetKey] += actual;
      state[myStackKey] -= actual;
      state.pot += actual;
      state[actedKey] = true;
      state.log.push(`${name} 跟注 ${actual}`);
      break;
    }

    case 'bet': {
      const actual = Math.min(amount, state[myStackKey]);
      state[myBetKey] += actual;
      state[myStackKey] -= actual;
      state.pot += actual;
      state[actedKey] = true;
      // opponent needs to act again
      const oppActedKey = isPlayer ? 'enemyActed' : 'playerActed';
      state[oppActedKey] = false;
      state.log.push(`${name} 下注 ${actual}`);
      break;
    }

    case 'raise': {
      const toCall = callAmount;
      const raiseExtra = amount;
      const total = Math.min(toCall + raiseExtra, state[myStackKey]);
      state[myBetKey] += total;
      state[myStackKey] -= total;
      state.pot += total;
      state[actedKey] = true;
      const oppActedKey2 = isPlayer ? 'enemyActed' : 'playerActed';
      state[oppActedKey2] = false;
      state.log.push(`${name} 加注 ${total}`);
      break;
    }

    case 'allin': {
      const allInAmt = state[myStackKey];
      state[myBetKey] += allInAmt;
      state[myStackKey] = 0;
      state.pot += allInAmt;
      state[actedKey] = true;
      const oppActedKey3 = isPlayer ? 'enemyActed' : 'playerActed';
      state[oppActedKey3] = false;
      state.log.push(`${name} 全下 ${allInAmt}`);
      break;
    }
  }

  return state;
}

// Compute available actions for player
function getAvailableActions(state) {
  const callAmount = Math.max(0, state.enemyBet - state.playerBet);
  const actions = [];

  if (callAmount === 0) {
    actions.push('check');
    if (state.playerStack > 0) actions.push('bet');
  } else {
    actions.push('fold');
    if (state.playerStack >= callAmount) actions.push('call');
  }

  if (state.playerStack > callAmount && callAmount > 0) actions.push('raise');
  if (state.playerStack > 0) actions.push('allin');

  return actions;
}

// Replace a community card (幸運硬幣 effect)
function replaceCommunityCard(state, index) {
  const newCard = state.deck.shift();
  if (!newCard) return;
  if (index < state.communityCards.length) {
    state.communityCards[index] = newCard;
  }
}

// Replace a player hole card (換牌 skill)
function replaceHoleCard(state, index) {
  const newCard = state.deck.shift();
  if (!newCard) return;
  state.playerHole[index] = newCard;
}

// Give player a 3rd hole card (第六張牌 skill)
function addExtraHoleCard(state) {
  const newCard = state.deck.shift();
  if (!newCard) return;
  state.playerHole.push(newCard);
}

// Peek next community card to be revealed
function peekNextCommunity(state) {
  if (state.phase === 'preflop') return state._flop[0];
  if (state.phase === 'flop') return state._turn[0];
  if (state.phase === 'turn') return state._river[0];
  return null;
}

export {
  createDeck, shuffle, evaluateFive, bestHand, compareHands,
  estimateHandStrength, createPokerGame, advancePhase, applyAction,
  getAvailableActions, isBettingRoundOver, resolveShowdown,
  replaceCommunityCard, replaceHoleCard, addExtraHoleCard, peekNextCommunity,
  SUITS, RANKS, RANK_VALUE, PHASES
};
