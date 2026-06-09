// enemy-portraits.js — Real character portraits from assets/chars/

const PORTRAIT_MAP = {
  street_gambler:    'img1_scruffyman',
  underground_player:'img1_seriousman',
  pro_gambler:       'img2_oldman',
  scammer:           'img2_hawaiian',
  casino_boss:       'img2_dealer',
  loan_shark:        'img2_muscleman',
  poker_ace:         'img2_beanie',
  god_of_gamblers:   'img1_tophat',
  dongguabang:       'img1_purplehat',
  beibaoxia:         'img2_bluecap',
  xiaofeigui:        'img1_goblin',
  ayi:               'img2_reddress',
  majidi:            'img1_peaceboy',
  sharkplayer:       'img2_hoodie',
};

export function getPortrait(id) {
  const file = PORTRAIT_MAP[id];
  if (!file) return '';
  return `<img src="assets/chars/${file}.png" class="portrait-img" alt="${id}">`;
}
