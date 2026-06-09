// enemy-portraits.js — Half-body SVG portraits for all enemies

function wrap(inner) {
  return `<svg viewBox="0 0 100 130" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%" filter="url(#sketchy)">${inner}</svg>`;
}

const P = {

  // 街頭賭徒 Lv1 — worn cap, stubble, torn vest, card in hand
  street_gambler: wrap(`
    <ellipse cx="50" cy="14" rx="22" ry="5" fill="#7a5020" stroke="#2a1a0a" stroke-width="2"/>
    <rect x="29" y="11" width="42" height="8" rx="3" fill="#6a4010" stroke="#2a1a0a" stroke-width="1.5"/>
    <path d="M27 16 Q24 19 21 17" fill="#6a4010" stroke="#2a1a0a" stroke-width="1.5"/>
    <circle cx="50" cy="30" r="18" fill="#f5e8d0" stroke="#2a1a0a" stroke-width="2.5"/>
    <ellipse cx="43" cy="29" rx="3" ry="2" fill="#2a1a0a"/>
    <ellipse cx="57" cy="29" rx="3" ry="2" fill="#2a1a0a"/>
    <circle cx="43" cy="38" r="1.2" fill="#9a7a4a"/>
    <circle cx="50" cy="39" r="1.2" fill="#9a7a4a"/>
    <circle cx="57" cy="38" r="1.2" fill="#9a7a4a"/>
    <path d="M44 36 Q52 40 57 36" fill="none" stroke="#2a1a0a" stroke-width="1.5"/>
    <rect x="44" y="48" width="12" height="10" fill="#f5e8d0"/>
    <path d="M12 57 L8 130 L92 130 L88 57 L68 50 L50 53 L32 50 Z" fill="#8B6510" stroke="#2a1a0a" stroke-width="2"/>
    <path d="M10 80 L6 92 L12 102 L8 116" fill="none" stroke="#2a1a0a" stroke-width="1.5"/>
    <line x1="16" y1="64" x2="4" y2="98" stroke="#f5e8d0" stroke-width="12" stroke-linecap="round"/>
    <line x1="16" y1="64" x2="4" y2="98" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
    <line x1="84" y1="64" x2="96" y2="97" stroke="#f5e8d0" stroke-width="12" stroke-linecap="round"/>
    <line x1="84" y1="64" x2="96" y2="97" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
    <rect x="89" y="91" width="11" height="15" rx="1.5" fill="white" stroke="#c0392b" stroke-width="1.5" transform="rotate(12,94,98)"/>
    <text x="91" y="101" font-size="7" fill="#c0392b" font-family="serif" transform="rotate(12,94,98)">A</text>
  `),

  // 地下賭場玩家 Lv2 — backward cap, hoodie, cigarette, heavy-lidded eyes
  underground_player: wrap(`
    <ellipse cx="50" cy="16" rx="24" ry="7" fill="#1a1a2e" stroke="#2a1a0a" stroke-width="2"/>
    <rect x="27" y="13" width="46" height="8" rx="2" fill="#2a2a4a" stroke="#2a1a0a" stroke-width="1.5"/>
    <path d="M72 13 L78 13" stroke="#e0e0e0" stroke-width="3" stroke-linecap="round"/>
    <circle cx="50" cy="32" r="18" fill="#f5e8d0" stroke="#2a1a0a" stroke-width="2.5"/>
    <ellipse cx="43" cy="31" rx="3" ry="1.8" fill="#2a1a0a"/>
    <ellipse cx="57" cy="31" rx="3" ry="1.8" fill="#2a1a0a"/>
    <ellipse cx="43" cy="34" rx="3.5" ry="1.5" fill="none" stroke="#8a6a4a" stroke-width="1"/>
    <ellipse cx="57" cy="34" rx="3.5" ry="1.5" fill="none" stroke="#8a6a4a" stroke-width="1"/>
    <path d="M44 38 Q50 40 56 38" fill="none" stroke="#2a1a0a" stroke-width="1.5"/>
    <rect x="54" y="37" width="7" height="2.5" rx="1" fill="#d4b896" transform="rotate(20,57,38)"/>
    <circle cx="61" cy="35" r="1.5" fill="#d4b896" transform="rotate(20,57,38)"/>
    <rect x="44" y="50" width="12" height="10" fill="#3a3a5a"/>
    <rect x="12" y="57" width="76" height="73" rx="8" fill="#3a3a5a" stroke="#2a1a0a" stroke-width="2"/>
    <rect x="37" y="100" width="26" height="20" rx="2" fill="#2a2a4a"/>
    <line x1="16" y1="65" x2="5" y2="100" stroke="#3a3a5a" stroke-width="14" stroke-linecap="round"/>
    <line x1="16" y1="65" x2="5" y2="100" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
    <line x1="84" y1="65" x2="95" y2="100" stroke="#3a3a5a" stroke-width="14" stroke-linecap="round"/>
    <line x1="84" y1="65" x2="95" y2="100" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
  `),

  // 職業賭手 Lv3 — slick hair, dark suit, tie
  pro_gambler: wrap(`
    <path d="M32 18 Q50 8 68 18 Q65 10 50 7 Q35 10 32 18" fill="#1a1a0a"/>
    <path d="M34 20 Q50 13 66 20" fill="none" stroke="#3a3a3a" stroke-width="1.5"/>
    <circle cx="50" cy="32" r="18" fill="#f5e8d0" stroke="#2a1a0a" stroke-width="2.5"/>
    <path d="M41 28 L46 30" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
    <circle cx="43" cy="30" r="1.5" fill="#2a1a0a"/>
    <path d="M54 28 L59 30" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
    <circle cx="57" cy="30" r="1.5" fill="#2a1a0a"/>
    <path d="M44 39 Q50 41 56 39" fill="none" stroke="#2a1a0a" stroke-width="1.5"/>
    <rect x="44" y="50" width="12" height="10" fill="#f5f0e8"/>
    <path d="M12 57 L8 130 L92 130 L88 57 L70 50 Q60 55 50 52 Q40 55 30 50 Z" fill="#1a2a4a" stroke="#2a1a0a" stroke-width="2"/>
    <path d="M30 50 L22 60 L35 62" fill="none" stroke="#f5f0e8" stroke-width="2.5"/>
    <path d="M70 50 L78 60 L65 62" fill="none" stroke="#f5f0e8" stroke-width="2.5"/>
    <path d="M46 55 L50 82 L54 55" fill="#c0a020" stroke="#2a1a0a" stroke-width="1.5"/>
    <line x1="16" y1="64" x2="5" y2="100" stroke="#1a2a4a" stroke-width="14" stroke-linecap="round"/>
    <line x1="16" y1="64" x2="5" y2="100" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
    <line x1="84" y1="64" x2="95" y2="100" stroke="#1a2a4a" stroke-width="14" stroke-linecap="round"/>
    <line x1="84" y1="64" x2="95" y2="100" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
  `),

  // 詐欺師 Lv4 — oil hair highlight, sunglasses, fancy jacket, smirk
  scammer: wrap(`
    <path d="M35 16 Q50 6 65 16 Q63 8 50 5 Q37 8 35 16" fill="#1a1a0a"/>
    <path d="M35 16 Q45 11 55 16 Q55 12 50 10 Q45 12 35 16" fill="#c8a020" opacity="0.8"/>
    <circle cx="50" cy="30" r="18" fill="#f5e8d0" stroke="#2a1a0a" stroke-width="2.5"/>
    <rect x="38" y="25" width="11" height="7" rx="3" fill="#1a1a1a" stroke="#2a1a0a" stroke-width="1.5"/>
    <rect x="51" y="25" width="11" height="7" rx="3" fill="#1a1a1a" stroke="#2a1a0a" stroke-width="1.5"/>
    <line x1="49" y1="28" x2="51" y2="28" stroke="#2a1a0a" stroke-width="1.5"/>
    <path d="M44 37 Q50 41 57 38" fill="none" stroke="#2a1a0a" stroke-width="1.8"/>
    <path d="M35 16 Q28 20 26 26" fill="none" stroke="#c8a020" stroke-width="1.5"/>
    <rect x="44" y="48" width="12" height="10" fill="#f5e8d0"/>
    <path d="M10 55 L6 130 L94 130 L90 55 L72 48 Q62 54 50 51 Q38 54 28 48 Z" fill="#2a2a3a" stroke="#2a1a0a" stroke-width="2"/>
    <path d="M28 48 L18 58 L32 60" fill="none" stroke="#e8c840" stroke-width="2"/>
    <path d="M72 48 L82 58 L68 60" fill="none" stroke="#e8c840" stroke-width="2"/>
    <path d="M36 65 L36 105 M40 63 L40 103" fill="none" stroke="#333333" stroke-width="1" opacity="0.5"/>
    <line x1="14" y1="62" x2="2" y2="100" stroke="#2a2a3a" stroke-width="14" stroke-linecap="round"/>
    <line x1="14" y1="62" x2="2" y2="100" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
    <line x1="86" y1="62" x2="98" y2="98" stroke="#2a2a3a" stroke-width="14" stroke-linecap="round"/>
    <line x1="86" y1="62" x2="98" y2="98" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
  `),

  // 賭場莊家 Lv5 — green dealer visor, bow tie, dark uniform, chip pin
  casino_boss: wrap(`
    <ellipse cx="50" cy="11" rx="20" ry="6" fill="#276e26" stroke="#2a1a0a" stroke-width="2"/>
    <rect x="30" y="8" width="40" height="8" rx="2" fill="#1e5a1d" stroke="#2a1a0a" stroke-width="1.5"/>
    <circle cx="50" cy="31" r="18" fill="#f5e8d0" stroke="#2a1a0a" stroke-width="2.5"/>
    <ellipse cx="43" cy="30" rx="3" ry="2.5" fill="#2a1a0a"/>
    <ellipse cx="57" cy="30" rx="3" ry="2.5" fill="#2a1a0a"/>
    <path d="M44 39 Q50 41 56 39" fill="none" stroke="#2a1a0a" stroke-width="1.5"/>
    <rect x="44" y="49" width="12" height="10" fill="#f0f0f0"/>
    <path d="M10 56 L6 130 L94 130 L90 56 L70 49 Q60 53 50 51 Q40 53 30 49 Z" fill="#1a1a2e" stroke="#2a1a0a" stroke-width="2"/>
    <rect x="38" y="57" width="24" height="32" fill="#f0f0f0" rx="2"/>
    <path d="M30 49 L20 60 L34 62" fill="none" stroke="#f0f0f0" stroke-width="2.5"/>
    <path d="M70 49 L80 60 L66 62" fill="none" stroke="#f0f0f0" stroke-width="2.5"/>
    <path d="M44 53 L50 57 L56 53" fill="#c0392b" stroke="#2a1a0a" stroke-width="1.5"/>
    <path d="M44 61 L50 57 L56 61" fill="#c0392b" stroke="#2a1a0a" stroke-width="1.5"/>
    <circle cx="32" cy="68" r="4" fill="#c8a020" stroke="#2a1a0a" stroke-width="1.2"/>
    <line x1="14" y1="63" x2="4" y2="100" stroke="#1a1a2e" stroke-width="14" stroke-linecap="round"/>
    <line x1="14" y1="63" x2="4" y2="100" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
    <line x1="86" y1="63" x2="96" y2="100" stroke="#1a1a2e" stroke-width="14" stroke-linecap="round"/>
    <line x1="86" y1="63" x2="96" y2="100" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
  `),

  // 地下錢莊老大 Lv6 — fat face, double chin, Chinese MaQua collar, bills
  loan_shark: wrap(`
    <circle cx="50" cy="33" r="22" fill="#f5e8d0" stroke="#2a1a0a" stroke-width="2.5"/>
    <path d="M30 46 Q50 54 70 46" fill="#f0dbc0" stroke="none"/>
    <ellipse cx="41" cy="31" rx="3.5" ry="2.5" fill="#2a1a0a"/>
    <ellipse cx="59" cy="31" rx="3.5" ry="2.5" fill="#2a1a0a"/>
    <path d="M41 26 L46 28" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
    <path d="M54 28 L59 26" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
    <path d="M43 42 Q50 45 57 42" fill="none" stroke="#2a1a0a" stroke-width="1.8"/>
    <rect x="8" y="55" width="84" height="75" rx="10" fill="#8B1a1a" stroke="#2a1a0a" stroke-width="2"/>
    <path d="M34 55 Q34 63 50 63 Q66 63 66 55" fill="none" stroke="#f0dbc0" stroke-width="3"/>
    <line x1="50" y1="63" x2="50" y2="76" stroke="#f0dbc0" stroke-width="2"/>
    <line x1="12" y1="67" x2="2" y2="106" stroke="#8B1a1a" stroke-width="18" stroke-linecap="round"/>
    <line x1="12" y1="67" x2="2" y2="106" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
    <line x1="88" y1="67" x2="98" y2="104" stroke="#8B1a1a" stroke-width="18" stroke-linecap="round"/>
    <line x1="88" y1="67" x2="98" y2="104" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
    <rect x="84" y="89" width="18" height="11" rx="1.5" fill="#c8a020" stroke="#2a1a0a" stroke-width="1.5"/>
    <line x1="87" y1="92" x2="99" y2="92" stroke="#2a1a0a" stroke-width="0.8"/>
    <line x1="87" y1="95" x2="99" y2="95" stroke="#2a1a0a" stroke-width="0.8"/>
  `),

  // 撲克高手 Lv8 — fitted cap, polo collar, crossed arms, focused
  poker_ace: wrap(`
    <ellipse cx="50" cy="16" rx="20" ry="8" fill="#2a2a4a" stroke="#2a1a0a" stroke-width="2"/>
    <rect x="30" y="12" width="40" height="10" rx="3" fill="#1a1a3a" stroke="#2a1a0a" stroke-width="1.5"/>
    <path d="M28 15 L72 15" stroke="#c0a020" stroke-width="1.5"/>
    <circle cx="50" cy="32" r="18" fill="#f5e8d0" stroke="#2a1a0a" stroke-width="2.5"/>
    <path d="M41 29 L47 31" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
    <circle cx="44" cy="31" r="1.5" fill="#2a1a0a"/>
    <path d="M53 29 L59 31" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
    <circle cx="56" cy="31" r="1.5" fill="#2a1a0a"/>
    <path d="M44 39 Q50 41 56 39" fill="none" stroke="#2a1a0a" stroke-width="1.5"/>
    <rect x="43" y="50" width="14" height="10" fill="#f0e8d8"/>
    <path d="M10 57 L7 130 L93 130 L90 57 L70 50 Q60 55 50 52 Q40 55 30 50 Z" fill="#1a4a7a" stroke="#2a1a0a" stroke-width="2"/>
    <path d="M40 58 Q35 59 35 61" fill="none" stroke="#cce8ff" stroke-width="2"/>
    <path d="M60 58 Q65 59 65 61" fill="none" stroke="#cce8ff" stroke-width="2"/>
    <line x1="22" y1="71" x2="78" y2="71" stroke="#1a4a7a" stroke-width="10"/>
    <line x1="22" y1="71" x2="78" y2="71" stroke="#2a1a0a" stroke-width="2"/>
    <line x1="14" y1="63" x2="22" y2="71" stroke="#1a4a7a" stroke-width="14" stroke-linecap="round"/>
    <line x1="14" y1="63" x2="22" y2="71" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
    <line x1="86" y1="63" x2="78" y2="71" stroke="#1a4a7a" stroke-width="14" stroke-linecap="round"/>
    <line x1="86" y1="63" x2="78" y2="71" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
  `),

  // 賭神 Lv10 Final Boss — golden halo, white suit, serene expression, back-card
  god_of_gamblers: wrap(`
    <path d="M24 13 Q50 -3 76 13" fill="none" stroke="#c8a020" stroke-width="2.5"/>
    <path d="M28 15 Q50 2 72 15" fill="none" stroke="#e8d060" stroke-width="1.5" opacity="0.7"/>
    <circle cx="50" cy="31" r="18" fill="#f5e8d0" stroke="#2a1a0a" stroke-width="2.5"/>
    <path d="M41 28 Q44 26 47 28" fill="none" stroke="#2a1a0a" stroke-width="1.8"/>
    <circle cx="44" cy="29" r="1.5" fill="#2a1a0a"/>
    <path d="M53 28 Q56 26 59 28" fill="none" stroke="#2a1a0a" stroke-width="1.8"/>
    <circle cx="56" cy="29" r="1.5" fill="#2a1a0a"/>
    <path d="M44 39 Q50 42 56 39" fill="none" stroke="#2a1a0a" stroke-width="1.5"/>
    <rect x="44" y="49" width="12" height="10" fill="#f5f0e8"/>
    <path d="M10 56 L7 130 L93 130 L90 56 L68 49 Q60 54 50 51 Q40 54 32 49 Z" fill="#e8e4dc" stroke="#c8a020" stroke-width="2"/>
    <path d="M32 49 L22 60 L36 62" fill="none" stroke="#c8a020" stroke-width="2.5"/>
    <path d="M68 49 L78 60 L64 62" fill="none" stroke="#c8a020" stroke-width="2.5"/>
    <path d="M45 54 L50 82 L55 54" fill="#c8a020" stroke="#2a1a0a" stroke-width="1.5"/>
    <line x1="14" y1="63" x2="4" y2="100" stroke="#e8e4dc" stroke-width="14" stroke-linecap="round"/>
    <line x1="14" y1="63" x2="4" y2="100" stroke="#c8a020" stroke-width="2" stroke-linecap="round"/>
    <line x1="86" y1="63" x2="94" y2="100" stroke="#e8e4dc" stroke-width="14" stroke-linecap="round"/>
    <line x1="86" y1="63" x2="94" y2="100" stroke="#c8a020" stroke-width="2" stroke-linecap="round"/>
    <rect x="85" y="88" width="13" height="18" rx="2" fill="#2a1a2a" stroke="#c8a020" stroke-width="1.5"/>
    <ellipse cx="91" cy="95" rx="4" ry="3" fill="#c8a020" opacity="0.4"/>
  `),

  // 冬瓜幫 Lv3 — two small figures side by side
  dongguabang: wrap(`
    <ellipse cx="25" cy="19" rx="14" ry="4" fill="#5a5a5a" stroke="#2a1a0a" stroke-width="1.5"/>
    <rect x="12" y="16" width="26" height="6" rx="2" fill="#3a3a3a" stroke="#2a1a0a" stroke-width="1"/>
    <circle cx="25" cy="31" r="12" fill="#f5e8d0" stroke="#2a1a0a" stroke-width="2"/>
    <circle cx="21" cy="30" r="2" fill="#2a1a0a"/>
    <circle cx="29" cy="30" r="2" fill="#2a1a0a"/>
    <path d="M21 36 Q25 39 29 36" fill="none" stroke="#2a1a0a" stroke-width="1.2"/>
    <rect x="8" y="43" width="34" height="52" rx="4" fill="#5a7a3a" stroke="#2a1a0a" stroke-width="1.5"/>
    <line x1="10" y1="51" x2="1" y2="77" stroke="#5a7a3a" stroke-width="10" stroke-linecap="round"/>
    <line x1="10" y1="51" x2="1" y2="77" stroke="#2a1a0a" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="40" y1="51" x2="49" y2="75" stroke="#5a7a3a" stroke-width="10" stroke-linecap="round"/>
    <line x1="40" y1="51" x2="49" y2="75" stroke="#2a1a0a" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M62 19 Q75 14 88 19 Q88 11 75 11 Q62 11 62 19" fill="#3a3a3a" stroke="#2a1a0a" stroke-width="1.5"/>
    <circle cx="75" cy="31" r="12" fill="#f5e8d0" stroke="#2a1a0a" stroke-width="2"/>
    <circle cx="71" cy="30" r="2" fill="#2a1a0a"/>
    <circle cx="79" cy="30" r="2" fill="#2a1a0a"/>
    <path d="M71 36 Q75 40 79 36" fill="none" stroke="#2a1a0a" stroke-width="1.2"/>
    <rect x="58" y="43" width="34" height="52" rx="4" fill="#5a7a3a" stroke="#2a1a0a" stroke-width="1.5"/>
    <line x1="60" y1="51" x2="51" y2="74" stroke="#5a7a3a" stroke-width="10" stroke-linecap="round"/>
    <line x1="60" y1="51" x2="51" y2="74" stroke="#2a1a0a" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="90" y1="51" x2="99" y2="77" stroke="#5a7a3a" stroke-width="10" stroke-linecap="round"/>
    <line x1="90" y1="51" x2="99" y2="77" stroke="#2a1a0a" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="42" y1="57" x2="58" y2="57" stroke="#2a1a0a" stroke-width="1" stroke-dasharray="3,2"/>
  `),

  // 背包俠 Lv4 — hunched, massive backpack, cap
  beibaoxia: wrap(`
    <ellipse cx="32" cy="15" rx="14" ry="5" fill="#4a5a2a" stroke="#2a1a0a" stroke-width="2"/>
    <rect x="19" y="12" width="27" height="7" rx="3" fill="#3a4a1a" stroke="#2a1a0a" stroke-width="1.5"/>
    <circle cx="38" cy="31" r="16" fill="#f5e8d0" stroke="#2a1a0a" stroke-width="2.5"/>
    <circle cx="33" cy="30" r="2.5" fill="#2a1a0a"/>
    <circle cx="44" cy="30" r="2.5" fill="#2a1a0a"/>
    <path d="M33 38 Q38 40 44 38" fill="none" stroke="#2a1a0a" stroke-width="1.5"/>
    <rect x="46" y="47" width="12" height="10" fill="#f5e8d0"/>
    <path d="M8 54 L4 130 L74 130 L70 54 L56 47 Q48 51 38 48 Q30 51 22 47 Z" fill="#4a5a2a" stroke="#2a1a0a" stroke-width="2"/>
    <rect x="66" y="36" width="30" height="58" rx="5" fill="#8B6510" stroke="#2a1a0a" stroke-width="2"/>
    <rect x="70" y="42" width="22" height="14" rx="3" fill="#7a5510" stroke="#2a1a0a" stroke-width="1.5"/>
    <path d="M23 47 Q23 41 66 50" fill="none" stroke="#6a4510" stroke-width="3" stroke-linecap="round"/>
    <path d="M40 47 Q46 42 66 56" fill="none" stroke="#6a4510" stroke-width="3" stroke-linecap="round"/>
    <line x1="10" y1="62" x2="1" y2="98" stroke="#4a5a2a" stroke-width="14" stroke-linecap="round"/>
    <line x1="10" y1="62" x2="1" y2="98" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
  `),

  // 小飛棍 Lv2 — wild spiky hair, screaming open mouth, arms raised
  xiaofeigui: wrap(`
    <line x1="50" y1="10" x2="50" y2="1" stroke="#c0392b" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="10" x2="59" y2="2" stroke="#c0392b" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="10" x2="65" y2="7" stroke="#c0392b" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="10" x2="41" y2="2" stroke="#c0392b" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="10" x2="35" y2="7" stroke="#c0392b" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="10" x2="30" y2="14" stroke="#c0392b" stroke-width="3" stroke-linecap="round"/>
    <line x1="50" y1="10" x2="70" y2="14" stroke="#c0392b" stroke-width="3" stroke-linecap="round"/>
    <circle cx="50" cy="28" r="18" fill="#f5e8d0" stroke="#2a1a0a" stroke-width="2.5"/>
    <circle cx="42" cy="26" r="4" fill="white" stroke="#2a1a0a" stroke-width="2"/>
    <circle cx="42" cy="26" r="2.5" fill="#2a1a0a"/>
    <circle cx="58" cy="26" r="4" fill="white" stroke="#2a1a0a" stroke-width="2"/>
    <circle cx="58" cy="26" r="2.5" fill="#2a1a0a"/>
    <ellipse cx="50" cy="38" rx="7" ry="5" fill="#8B1a1a" stroke="#2a1a0a" stroke-width="2"/>
    <ellipse cx="50" cy="38" rx="5" ry="3.5" fill="#2a1a0a"/>
    <rect x="44" y="46" width="12" height="10" fill="#f5e8d0"/>
    <path d="M14 54 L10 130 L90 130 L86 54 L68 48 L50 51 L32 48 Z" fill="#c0392b" stroke="#2a1a0a" stroke-width="2"/>
    <line x1="17" y1="62" x2="2" y2="35" stroke="#f5e8d0" stroke-width="12" stroke-linecap="round"/>
    <line x1="17" y1="62" x2="2" y2="35" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
    <line x1="83" y1="62" x2="98" y2="35" stroke="#f5e8d0" stroke-width="12" stroke-linecap="round"/>
    <line x1="83" y1="62" x2="98" y2="35" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
  `),

  // 阿姨 Lv5 — hair bun, apron, stern furrowed brows, basket
  ayi: wrap(`
    <ellipse cx="50" cy="9" rx="8" ry="6" fill="#3a2a1a" stroke="#2a1a0a" stroke-width="2"/>
    <path d="M42 12 Q50 7 58 12" fill="none" stroke="#2a1a0a" stroke-width="1.5"/>
    <path d="M33 22 Q32 14 38 12" fill="none" stroke="#3a2a1a" stroke-width="3" stroke-linecap="round"/>
    <path d="M67 22 Q68 14 62 12" fill="none" stroke="#3a2a1a" stroke-width="3" stroke-linecap="round"/>
    <circle cx="50" cy="30" r="18" fill="#f5e8d0" stroke="#2a1a0a" stroke-width="2.5"/>
    <path d="M39 24 L44 26" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="43" cy="28" rx="3" ry="2" fill="#2a1a0a"/>
    <path d="M61 24 L56 26" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
    <ellipse cx="57" cy="28" rx="3" ry="2" fill="#2a1a0a"/>
    <path d="M44 39 Q50 38 56 39" fill="none" stroke="#2a1a0a" stroke-width="2"/>
    <rect x="44" y="48" width="12" height="10" fill="#f5e8d0"/>
    <rect x="10" y="55" width="80" height="75" rx="6" fill="#d4a0c0" stroke="#2a1a0a" stroke-width="2"/>
    <circle cx="30" cy="70" r="2.5" fill="#e8c8d8" opacity="0.8"/>
    <circle cx="42" cy="78" r="2" fill="#e8c8d8" opacity="0.8"/>
    <circle cx="62" cy="68" r="2.5" fill="#e8c8d8" opacity="0.8"/>
    <circle cx="72" cy="80" r="2" fill="#e8c8d8" opacity="0.8"/>
    <rect x="35" y="58" width="30" height="52" rx="3" fill="#f8f4ec" stroke="#d0c0a0" stroke-width="1.5"/>
    <rect x="39" y="88" width="22" height="12" rx="2" fill="#eee8dc" stroke="#c0b090" stroke-width="1"/>
    <line x1="14" y1="63" x2="4" y2="100" stroke="#d4a0c0" stroke-width="14" stroke-linecap="round"/>
    <line x1="14" y1="63" x2="4" y2="100" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
    <line x1="86" y1="63" x2="96" y2="100" stroke="#d4a0c0" stroke-width="14" stroke-linecap="round"/>
    <line x1="86" y1="63" x2="96" y2="100" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
    <rect x="88" y="88" width="14" height="12" rx="3" fill="#c8a060" stroke="#2a1a0a" stroke-width="1.5"/>
    <path d="M88 88 Q95 82 102 88" fill="none" stroke="#2a1a0a" stroke-width="1.5"/>
  `),

  // 麻吉弟弟 Lv1 — big happy smile, rosy cheeks, heart shirt, thumbs up
  majidi: wrap(`
    <circle cx="50" cy="30" r="20" fill="#f5e8d0" stroke="#2a1a0a" stroke-width="2.5"/>
    <path d="M39 26 Q43 23 47 26" fill="none" stroke="#2a1a0a" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M53 26 Q57 23 61 26" fill="none" stroke="#2a1a0a" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M38 37 Q50 48 62 37" fill="none" stroke="#2a1a0a" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="35" cy="36" rx="6" ry="3" fill="#f0a0a0" opacity="0.5"/>
    <ellipse cx="65" cy="36" rx="6" ry="3" fill="#f0a0a0" opacity="0.5"/>
    <rect x="44" y="50" width="12" height="10" fill="#f5e8d0"/>
    <path d="M12 58 L8 130 L92 130 L88 58 L68 51 L50 54 L32 51 Z" fill="#e8a020" stroke="#2a1a0a" stroke-width="2"/>
    <path d="M42 72 Q42 67 46 67 Q50 67 50 71 Q50 67 54 67 Q58 67 58 72 L50 80 Z" fill="#c0392b" stroke="#2a1a0a" stroke-width="1"/>
    <line x1="16" y1="65" x2="5" y2="100" stroke="#e8a020" stroke-width="14" stroke-linecap="round"/>
    <line x1="16" y1="65" x2="5" y2="100" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
    <line x1="84" y1="65" x2="92" y2="92" stroke="#e8a020" stroke-width="14" stroke-linecap="round"/>
    <line x1="84" y1="65" x2="92" y2="92" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
    <rect x="88" y="80" width="10" height="14" rx="4" fill="#f5e8d0" stroke="#2a1a0a" stroke-width="1.5"/>
    <rect x="88" y="75" width="8" height="8" rx="3" fill="#f5e8d0" stroke="#2a1a0a" stroke-width="1.5" transform="rotate(-20,92,79)"/>
  `),

  // 鯊魚玩家 Lv9 — shark fin hair, muscle tank, tattoo, scowl
  sharkplayer: wrap(`
    <path d="M42 20 L50 2 L58 20 Z" fill="#3a6a8a" stroke="#2a1a0a" stroke-width="2"/>
    <circle cx="50" cy="30" r="18" fill="#f5e8d0" stroke="#2a1a0a" stroke-width="2.5"/>
    <path d="M32 24 Q32 18 42 18" fill="none" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round"/>
    <path d="M68 24 Q68 18 58 18" fill="none" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round"/>
    <path d="M38 22 L43 24" stroke="#2a1a0a" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="43" cy="28" rx="3.5" ry="2.5" fill="#2a1a0a"/>
    <path d="M62 22 L57 24" stroke="#2a1a0a" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="57" cy="28" rx="3.5" ry="2.5" fill="#2a1a0a"/>
    <path d="M44 38 Q50 37 56 38" fill="none" stroke="#2a1a0a" stroke-width="2"/>
    <rect x="44" y="48" width="12" height="10" fill="#f5e8d0"/>
    <path d="M6 55 L2 130 L98 130 L94 55 L72 46 L50 50 L28 46 Z" fill="#1a1a1a" stroke="#2a1a0a" stroke-width="2"/>
    <path d="M38 70 Q50 68 62 70" fill="none" stroke="#333" stroke-width="1.5"/>
    <path d="M40 86 Q50 84 60 86" fill="none" stroke="#333" stroke-width="1.5"/>
    <path d="M4 75 Q7 72 10 75 Q13 78 16 75" fill="none" stroke="#3a6a8a" stroke-width="2"/>
    <path d="M3 83 Q6 80 9 83 Q12 86 15 83" fill="none" stroke="#3a6a8a" stroke-width="2"/>
    <line x1="10" y1="60" x2="2" y2="98" stroke="#1a1a1a" stroke-width="18" stroke-linecap="round"/>
    <line x1="10" y1="60" x2="2" y2="98" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
    <line x1="90" y1="60" x2="98" y2="98" stroke="#1a1a1a" stroke-width="18" stroke-linecap="round"/>
    <line x1="90" y1="60" x2="98" y2="98" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
  `),

};

P._default = wrap(`
  <circle cx="50" cy="30" r="18" fill="#f5e8d0" stroke="#2a1a0a" stroke-width="2.5"/>
  <circle cx="43" cy="29" r="2.5" fill="#2a1a0a"/>
  <circle cx="57" cy="29" r="2.5" fill="#2a1a0a"/>
  <path d="M43 38 Q50 41 57 38" fill="none" stroke="#2a1a0a" stroke-width="1.5"/>
  <rect x="14" y="57" width="72" height="73" rx="5" fill="#5a5a5a" stroke="#2a1a0a" stroke-width="2"/>
  <rect x="44" y="48" width="12" height="10" fill="#f5e8d0"/>
  <line x1="10" y1="64" x2="1" y2="100" stroke="#5a5a5a" stroke-width="14" stroke-linecap="round"/>
  <line x1="10" y1="64" x2="1" y2="100" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
  <line x1="90" y1="64" x2="99" y2="100" stroke="#5a5a5a" stroke-width="14" stroke-linecap="round"/>
  <line x1="90" y1="64" x2="99" y2="100" stroke="#2a1a0a" stroke-width="2" stroke-linecap="round"/>
`);

export function getPortrait(id) {
  return P[id] || P._default;
}
