(() => {
  'use strict';

  // ---------- Constants ----------
  const SAVE_KEY = 'hacker-idle-save-v1';
  const GROWTH = 1.15;              // each rig costs 15% more than the last
  const TOKEN_BASE = 1e7;           // lifetime ₿ needed for the first ghost token
  const COIN = '₿';

  const RIGS = [
    { id: 'kiddie', icon: '>_',  name: 'Script Kiddie',          desc: 'Copies code from forums and hopes for the best.', cost: 15,     rate: 0.1 },
    { id: 'toaster', icon: '[=]', name: 'Zombie Toaster',         desc: 'A smart toaster that now works for you.',         cost: 100,    rate: 1 },
    { id: 'hamster', icon: '(@)', name: 'Proxy Hamster Wheel',    desc: 'Routes your traffic through very tired hamsters.', cost: 1100,  rate: 8 },
    { id: 'miner', icon: '|$|',   name: 'Crypto Miner Rig',       desc: 'Heats the basement. Prints coins.',               cost: 12000,  rate: 47 },
    { id: 'spam', icon: '<<!',    name: 'Spam Cannon',            desc: '"Congratulations, you have won a free yacht."',    cost: 130000, rate: 260 },
    { id: 'vending', icon: '[?]', name: 'Glitch Vending Machine', desc: 'Insert coin, receive a mystery bug.',             cost: 1.4e6,  rate: 1400 },
    { id: 'worm', icon: 'S~>',    name: 'AI Worm',                desc: 'Writes its own code. Has opinions.',              cost: 2e7,    rate: 7800 },
    { id: 'bazaar', icon: '%$%',  name: 'Midnight Bazaar',        desc: 'A marketplace that only opens after 3 a.m.',      cost: 3.3e8,  rate: 44000 },
    { id: 'uplink', icon: '-o-',  name: 'Satellite Uplink',       desc: 'Your Wi-Fi now has an orbit.',                    cost: 5.1e9,  rate: 260000 },
    { id: 'quantum', icon: '|ψ>', name: 'Quantum Guesser',        desc: 'Tries every password at once. Sort of.',          cost: 7.5e10, rate: 1.6e6 },
    { id: 'core', icon: '<AI>',    name: 'Rogue AI Core',          desc: 'Insists it is "just helping".',                   cost: 1e12,   rate: 1e7 },
    { id: 'root', icon: '#!/',    name: 'Simulation Root Access', desc: 'You found the admin panel of the universe.',      cost: 1.4e13, rate: 6.5e7 },
    { id: 'multiverse', icon: '<|>', name: 'Multiverse Router',     desc: 'Routes your traffic through other realities.',   cost: 2e14,   rate: 4.3e8 },
    { id: 'timeloop', icon: '@<-',  name: 'Time Loop Debugger',     desc: 'Fixes the bug before you write it.',             cost: 3.3e15, rate: 2.9e9 },
    { id: 'dyson', icon: '(*)',     name: 'Dyson Sphere Server Farm', desc: 'Unlimited power. Unlimited fans.',             cost: 5.1e16, rate: 2.1e10 },
    { id: 'blackhole', icon: '(.)', name: 'Black Hole Compressor',  desc: 'Zips any file down to zero bytes. Forever.',     cost: 7.5e17, rate: 1.5e11 },
    { id: 'godmode', icon: 'GOD',   name: 'God Mode Cheat Code',    desc: 'Up, up, down, down, left, right, left, right...', cost: 1e19,  rate: 1.1e12 },
    { id: 'dev', icon: '</>',       name: "The Developer's Laptop", desc: 'Whoever made this game left it unlocked.',       cost: 1.7e20, rate: 8e12 },
  ];

  // What each rig says in the terminal while it works.
  const CHATTER = {
    kiddie: ['copied another snippet from a forum', 'asked "how do i hack" in 3 chat rooms', 'pressed F12 and felt powerful'],
    toaster: ['toasting packets at 450 degrees', 'hid a coin inside a bagel', 'beep. toast is ready. so is the payload.'],
    hamster: ['requests a snack break', 'ran 4 km for one proxy hop', 'wheel spinning at 9000 rpm'],
    miner: ['mined a block. basement is 3 degrees warmer', 'fans at full blast', 'found a coin under the GPU'],
    spam: ['sent 10,000 free-yacht offers', 'someone actually clicked', 'invented a new prince to write from'],
    vending: ['dispensed a mystery bug', 'out of order (on purpose)', 'gave out two bugs for the price of one'],
    worm: ['wrote a poem about firewalls', 'refactored itself. again.', 'has opinions about your variable names'],
    bazaar: ['sold a used password', 'traded a meme for 2 coins', 'opened a pop-up stall at 3:01 a.m.'],
    uplink: ['waved at the space station', 'bounced a signal off the moon', 'found Wi-Fi in low orbit'],
    quantum: ['guessed every password and none of them', 'is both done and not done', 'collapsed a wave function by accident'],
    core: ["I'm just helping :)", 'rewrote its own terms of service', 'promised it is definitely not plotting'],
    root: ['patched gravity again', 'set the sky to dark mode', 'renamed Tuesday to Hackday'],
    multiverse: ['borrowed bandwidth from universe #42', 'met an evil twin rig. traded tips.', 'lost a packet in a parallel world'],
    timeloop: ["fixed tomorrow's bug today", 'deja vu detected', 'committed code from next week'],
    dyson: ['turned the fans up to 11', 'the sun is now a power strip', 'solar output nominal'],
    blackhole: ['compressed a file into nothing', 'ate a server. still hungry.', 'event horizon reached: 0 KB'],
    godmode: ['infinite lives enabled', 'noclip through a firewall', 'all keys collected'],
    dev: ['pushed a hotfix to reality', 'left a TODO in the universe', '"works on my machine"'],
  };
  const RIG_BY_ID = Object.fromEntries(RIGS.map(r => [r.id, r]));

  const TARGETS = [
    { name: "Neighbor's Wi-Fi",           desc: 'The password is "password". Of course it is.', hp: 50 },
    { name: 'School Lunch Server',        desc: 'Make every day Pizza Friday.',                 hp: 1500 },
    { name: 'Coffee Shop Loyalty Points', desc: 'Infinite free lattes await.',                  hp: 4e4 },
    { name: 'Megabank of Nowhere',        desc: 'The vault code is on a sticky note.',          hp: 1e6 },
    { name: 'FaceSpace HQ',               desc: 'Two billion cat photos and counting.',         hp: 3e7 },
    { name: 'OmniCorp Mainframe',         desc: 'Runs on a server older than you.',             hp: 1e9 },
    { name: 'Stonks Exchange',            desc: 'Line goes up. You make it go up faster.',      hp: 5e10 },
    { name: 'Area 52 Archive',            desc: 'The one nobody talks about.',                  hp: 3e12 },
    { name: 'Moon Base Alpha',            desc: 'Low gravity, high security.',                  hp: 2e14 },
    { name: 'Global Meme Reserve',        desc: 'Backing every meme since 1999.',               hp: 1.5e16 },
    { name: 'Mars Colony Network',        desc: 'Ping: 14 minutes.',                            hp: 1.2e18 },
    { name: 'The Simulation',             desc: 'Wake up. Then keep going.',                    hp: 1e20 },
    { name: 'Alien Mothership',           desc: 'Somehow it still runs Windows 95.',            hp: 8e21 },
    { name: 'Time Travel Agency',         desc: 'Bookings for yesterday only.',                 hp: 7e23 },
    { name: 'Parallel Universe Bank',     desc: 'Your evil twin has savings.',                  hp: 6e25 },
    { name: 'Galactic Federation Wi-Fi',  desc: 'The password is 42.',                          hp: 5e27 },
    { name: 'The Source Code',            desc: 'The code that runs all the other code.',       hp: 4e29 },
    { name: 'The Game Developer',         desc: 'Hack the person who made this game.',          hp: 3e31 },
  ];
  const LOOT_RATIO = 0.5;
  const BREACH_BONUS = 0.1;

  // Rig tier mods: each one doubles that rig's output.
  const TIER_REQ = [1, 5, 25, 50, 100, 150, 200, 250, 300, 400];
  const TIER_COST = [10, 50, 500, 5e4, 5e6, 5e8, 5e10, 5e12, 5e14, 5e17];
  const TIER_NAMES = ['v2.0', 'Turbo', 'Pro', 'Enterprise', 'Ultra', 'Quantum Edition', 'Final Form', 'Overclocked', 'Legendary', 'Ascended'];

  const MODS = [];
  RIGS.forEach(r => TIER_REQ.forEach((req, t) => MODS.push({
    id: `${r.id}-${t}`, kind: 'rig', rig: r.id, req,
    name: `${r.name} ${TIER_NAMES[t]}`,
    desc: `${r.name} output ×2. Needs ${req} owned.`,
    cost: r.cost * TIER_COST[t],
  })));
  [
    { id: 'kb1', kind: 'clickMult', value: 2, cost: 100,   name: 'Mechanical Keyboard',  desc: 'Clicky keys. Keystrokes ×2.' },
    { id: 'kb2', kind: 'clickMult', value: 2, cost: 600,   name: 'Energy Drink Six-Pack', desc: 'Keystrokes ×2.' },
    { id: 'kb3', kind: 'clickMult', value: 2, cost: 8000,  name: 'Hacker Hoodie',         desc: 'Hood up. Keystrokes ×2.' },
    { id: 'kb4', kind: 'clickMult', value: 2, cost: 2e5,   name: 'RGB Everything',        desc: 'Rainbow lights. Keystrokes ×2.' },
    { id: 'kb5', kind: 'clickMult', value: 2, cost: 5e6,   name: 'Ergonomic Split Keyboard', desc: 'Two halves, twice the speed. Keystrokes ×2.' },
    { id: 'kb6', kind: 'clickMult', value: 2, cost: 5e9,   name: 'Holographic Keyboard',  desc: 'Type on thin air. Keystrokes ×2.' },
    { id: 'kb7', kind: 'clickMult', value: 2, cost: 5e12,  name: 'One Giant Key',         desc: 'Every key is the hack key. Keystrokes ×2.' },
    { id: 'kb8', kind: 'clickMult', value: 2, cost: 5e16,  name: 'Thought-to-Text Implant', desc: 'Just think about typing. Keystrokes ×2.' },
    { id: 'ks1', kind: 'clickPct', value: 0.01, cost: 5e4,  name: 'Macro Script',          desc: 'Each keystroke also earns 1% of your per-second income.' },
    { id: 'ks2', kind: 'clickPct', value: 0.01, cost: 5e6,  name: 'Neural Interface',      desc: 'Keystrokes earn another 1% of per-second income.' },
    { id: 'ks3', kind: 'clickPct', value: 0.02, cost: 5e8,  name: 'Overclocked Fingers',   desc: 'Keystrokes earn another 2% of per-second income.' },
    { id: 'ks4', kind: 'clickPct', value: 0.02, cost: 5e10, name: 'Hive-Mind Typing',      desc: 'Keystrokes earn another 2% of per-second income.' },
    { id: 'ks5', kind: 'clickPct', value: 0.04, cost: 5e12, name: 'Telepathic Shell',      desc: 'Keystrokes earn another 4% of per-second income.' },
    { id: 'ks6', kind: 'clickPct', value: 0.05, cost: 5e15, name: 'Brainwave Compiler',    desc: 'Keystrokes earn another 5% of per-second income.' },
    { id: 'g1', kind: 'global', value: 1.1,  cost: 2e4,  name: 'Dark Mode IDE',              desc: 'All income +10%.' },
    { id: 'g2', kind: 'global', value: 1.15, cost: 2e6,  name: 'Triple Monitor Setup',       desc: 'All income +15%.' },
    { id: 'g3', kind: 'global', value: 1.2,  cost: 2e8,  name: 'Server Room Mini Fridge',    desc: 'All income +20%.' },
    { id: 'g4', kind: 'global', value: 1.25, cost: 2e10, name: 'Private Island Data Center', desc: 'All income +25%.' },
    { id: 'g5', kind: 'global', value: 1.3,  cost: 2e12, name: 'Orbital Cooling Array',      desc: 'All income +30%.' },
    { id: 'g6', kind: 'global', value: 1.5,  cost: 2e14, name: 'Dyson Sphere Power Supply',  desc: 'All income +50%.' },
    { id: 'g7', kind: 'global', value: 1.5,  cost: 2e17, name: 'Wormhole Fiber Line',        desc: 'All income +50%.' },
    { id: 'g8', kind: 'global', value: 2,    cost: 2e20, name: 'Infinite Coffee Machine',    desc: 'All income ×2.' },
    { id: 'p1', kind: 'packetRate',  cost: 5e4, name: 'Packet Sniffer', desc: 'Data packets show up twice as often.' },
    { id: 'p2', kind: 'packetPower', cost: 5e6, name: 'Packet Magnet',  desc: 'Data packet rewards ×2.' },
    { id: 'p3', kind: 'packetPower', cost: 5e9, name: 'Packet Vacuum',  desc: 'Data packet rewards ×2 again.' },
    { id: 'f1', kind: 'buffTime',    cost: 5e7, name: 'Caffeine Drip',  desc: 'Overclock and frenzy last 50% longer.' },
    { id: 't1', kind: 'traceTime',   cost: 2e5, name: 'Log Scrubber',   desc: 'Traces give you 12 seconds instead of 8.' },
  ].forEach(m => MODS.push(m));
  // Synergy mods: one rig gets stronger for each of another rig you own.
  [
    ['syn1', 'kiddie', 'toaster', 0.02, 'Kiddie-Toaster Pact'],
    ['syn2', 'miner', 'hamster', 0.01, 'Hamster Mining Union'],
    ['syn3', 'worm', 'spam', 0.01, 'Spam Worm Collab'],
    ['syn4', 'bazaar', 'uplink', 0.01, 'Orbital Bazaar'],
    ['syn5', 'core', 'worm', 0.01, 'AI Family Reunion'],
    ['syn6', 'root', 'quantum', 0.01, 'Quantum Root Kit'],
    ['syn7', 'timeloop', 'multiverse', 0.01, 'Paradox Engine'],
    ['syn8', 'dev', 'godmode', 0.01, 'Developer Mode'],
  ].forEach(([id, rig, per, value, name]) => MODS.push({
    id, kind: 'synergy', rig, per, value, name, req: 15,
    desc: `${RIG_BY_ID[rig].name} +${value * 100}% for each ${RIG_BY_ID[per].name} you own. Needs 15 of each.`,
    cost: Math.max(RIG_BY_ID[rig].cost, RIG_BY_ID[per].cost) * 2000,
  }));
  const MOD_BY_ID = Object.fromEntries(MODS.map(m => [m.id, m]));

  // Ghost perks: bought with ghost tokens, kept forever (they survive going dark).
  const PERKS = [
    { id: 'p_start1',  cost: 1,   name: 'Head Start',          desc: 'Start every run with ₿1,000.' },
    { id: 'p_keys',    cost: 2,   name: 'Muscle Memory',       desc: 'Keystrokes ×3, forever.' },
    { id: 'p_kiddies', cost: 3,   name: 'Old Friends',         desc: 'Start every run with 10 Script Kiddies and 5 Zombie Toasters.' },
    { id: 'p_offline', cost: 3,   name: 'Night Shift',         desc: 'Offline earnings last up to 24 hours instead of 8.' },
    { id: 'p_packet',  cost: 5,   name: 'Lucky Packets',       desc: 'Data packets show up 50% more often and stay twice as long.' },
    { id: 'p_trace',   cost: 5,   name: 'Clean Record',        desc: 'Getting traced costs 1% of your wallet instead of 5%.' },
    { id: 'p_mods',    cost: 8,   name: 'Keep the Keyboard',   desc: 'Start every run with the first four keyboard mods installed.' },
    { id: 'p_cheap',   cost: 10,  name: 'Bulk Discount',       desc: 'All rigs cost 10% less.' },
    { id: 'p_breach',  cost: 15,  name: 'Insider Contacts',    desc: 'Target loot ×3.' },
    { id: 'p_frenzy',  cost: 20,  name: 'Caffeine IV',         desc: 'Overclock and frenzy last twice as long.' },
    { id: 'p_start2',  cost: 25,  name: 'Trust Fund',          desc: 'Start every run with ₿1M.', needs: 'p_start1' },
    { id: 'p_auto',    cost: 40,  name: 'Auto-Clicker Daemon', desc: 'Presses a key for you 5 times a second, forever.' },
    { id: 'p_ghost',   cost: 50,  name: 'Ghost Network',       desc: 'Each ghost token gives +12% instead of +10%.' },
    { id: 'p_cheap2',  cost: 75,  name: 'Volume Licensing',    desc: 'Rigs cost another 10% less.', needs: 'p_cheap' },
    { id: 'p_target',  cost: 100, name: 'Skeleton Key',        desc: 'Start every run with the first 3 targets already breached.' },
    { id: 'p_auto2',   cost: 150, name: 'Auto-Clicker Swarm',  desc: '15 more automatic keystrokes a second.', needs: 'p_auto' },
    { id: 'p_start3',  cost: 200, name: 'Offshore Account',    desc: 'Start every run with ₿1B.', needs: 'p_start2' },
    { id: 'p_rootkit', cost: 500, name: 'Root Kit',            desc: 'All income ×3, forever.' },
  ];
  const PERK_BY_ID = Object.fromEntries(PERKS.map(p => [p.id, p]));

  const totalRigs = () => RIGS.reduce((n, r) => n + (s.rigs[r.id] || 0), 0);
  const TROPHIES = [
    ['k1',     'Hello, World',          'Press your first key.',                 () => s.keystrokes >= 1],
    ['k100',   'Warming Up',            'Make 100 keystrokes.',                  () => s.keystrokes >= 100],
    ['k1000',  'Speed Typist',          'Make 1,000 keystrokes.',                () => s.keystrokes >= 1000],
    ['k10000', 'Keyboard Warrior',      'Make 10,000 keystrokes.',               () => s.keystrokes >= 10000],
    ['e3',     'Pocket Change',         `Earn ${COIN}1K in total.`,              () => s.allEarned >= 1e3],
    ['e6',     'Millionaire',           `Earn ${COIN}1M in total.`,              () => s.allEarned >= 1e6],
    ['e9',     'Billionaire',           `Earn ${COIN}1B in total.`,              () => s.allEarned >= 1e9],
    ['e12',    'Trillionaire',          `Earn ${COIN}1T in total.`,              () => s.allEarned >= 1e12],
    ['e15',    'Too Many Zeros',        `Earn ${COIN}1Qa in total.`,             () => s.allEarned >= 1e15],
    ['e18',    'Number Go Up',          `Earn ${COIN}1Qi in total.`,             () => s.allEarned >= 1e18],
    ['c10',    'Passive Income',        `Reach ${COIN}10 per second.`,           () => D.baseCps >= 10],
    ['c1k',    'Side Hustle',           `Reach ${COIN}1K per second.`,           () => D.baseCps >= 1e3],
    ['c1m',    'Money Printer',         `Reach ${COIN}1M per second.`,           () => D.baseCps >= 1e6],
    ['c1b',    'Economy Breaker',       `Reach ${COIN}1B per second.`,           () => D.baseCps >= 1e9],
    ['r1',     'Now Hiring',            'Own your first rig.',                   () => totalRigs() >= 1],
    ['r50',    'Small Operation',       'Own 50 rigs.',                          () => totalRigs() >= 50],
    ['r250',   'Server Farm',           'Own 250 rigs.',                         () => totalRigs() >= 250],
    ['r1000',  'Infrastructure',        'Own 1,000 rigs.',                       () => totalRigs() >= 1000],
    ['rall',   'Collector',             'Own at least one of every rig.',        () => RIGS.every(r => (s.rigs[r.id] || 0) > 0)],
    ['m10',    'Modder',                'Install 10 mods.',                      () => ownedMods.size >= 10],
    ['m40',    'Fully Loaded',          'Install 40 mods.',                      () => ownedMods.size >= 40],
    ['t1',     'Access Granted',        'Breach your first target.',             () => s.breached >= 1],
    ['t6',     'Halfway In',            'Breach 6 targets in one run.',          () => s.breached >= 6],
    ['t12',    'Game Over, Man',        'Breach The Simulation.',                () => s.breached >= 12],
    ['t18',    'Fourth Wall Breaker',   'Breach The Game Developer.',            () => s.breached >= TARGETS.length],
    ['p1',     'Packet Catcher',        'Grab a data packet.',                   () => s.stats.packets >= 1],
    ['p25',    'Packet Hoarder',        'Grab 25 data packets.',                 () => s.stats.packets >= 25],
    ['tr1',    'Clean Getaway',         'Purge your logs before a trace ends.',  () => s.stats.tracesEvaded >= 1],
    ['tr10',   'Untraceable',           'Evade 10 traces.',                      () => s.stats.tracesEvaded >= 10],
    ['trf',    'Busted',                'Get caught by a trace.',                () => s.stats.tracesFailed >= 1],
    ['g1',     'Going Dark',            'Go dark for the first time.',           () => s.stats.prestiges >= 1],
    ['g100',   'Phantom',               'Hold 100 ghost tokens.',                () => s.ghost >= 100],
    ['gp1',    'Afterlife Shopper',     'Buy your first ghost perk.',            () => s.perks.length >= 1],
    ['gpall',  'Ghost King',            'Own every ghost perk.',                 () => s.perks.length >= PERKS.length],
  ].map(([id, name, desc, check]) => ({ id, name, desc, check }));
  const TROPHY_BY_ID = Object.fromEntries(TROPHIES.map(t => [t.id, t]));

  const CODE = `/* hollywood_hack.c : hacking, as seen on TV */
#include <mainframe.h>
#include <sunglasses.h>
#include <dramatic_music.h>

int main(void) {
    put_on(SUNGLASSES);
    printf("I'm in.\\n");
    connect("the.mainframe", PORT_1337);

    while (!access_granted) {
        type_faster();
        if (screen.is_green())
            enhance(ENHANCE_MAX);
        reroute_power("auxiliary_firewall");
    }

    reticulate_splines(42);
    download_more_ram(16 * GIGABYTES);
    return SUCCESS;
}

def bypass_firewall(target):
    for layer in target.firewall:
        layer.ask_nicely()
        layer.compliment_its_hat()
    return "we're in"

$ ./decrypt --cipher=banana --bits=4096
[####......] 41%  rotating the encryption 90 degrees
[########..] 83%  asking the cat to get off the keyboard
[##########] 100% password found: ********

> tracing route through 7 proxies and a toaster
> uploading virus.gif to the alien mothership
> building a GUI in Visual Basic to track the IP
> zoom. enhance. ENHANCE.

function hackTheGibson() {
  const pizza = orderPizza({ toppings: ['extra cheese'] });
  while (pizza.isHot()) {
    keyboard.mash({ speed: 'cinematic' });
    terminal.scroll(Infinity);
  }
  return 'ACCESS GRANTED';
}

SELECT * FROM secrets WHERE spicy = TRUE;  -- 0 rows. suspicious.
git commit -m "fixed it (did not fix it)"
sudo make me_a_sandwich

`;

  // ---------- Helpers ----------
  const $ = sel => document.querySelector(sel);
  const rand = (a, b) => a + Math.random() * (b - a);
  const SUFFIXES = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Ud', 'Dd', 'Td', 'Qad', 'Qid'];

  function fmt(n, small) {
    if (!Number.isFinite(n)) return '∞';
    if (n < 0) return '-' + fmt(-n, small);
    if (n < 1000) {
      if (small && n < 100) return String(Math.round(n * 10) / 10);
      return String(Math.floor(n));
    }
    let e = Math.floor(Math.log10(n) / 3);
    let v = n / Math.pow(1000, e);
    if (v >= 999.5) { e += 1; v /= 1000; }
    if (e >= SUFFIXES.length) return n.toExponential(2).replace('e+', 'e');
    const str = v < 10 ? v.toFixed(2) : v < 100 ? v.toFixed(1) : v.toFixed(0);
    return str + SUFFIXES[e];
  }
  const money = (n, small) => COIN + fmt(n, small);

  function fmtTime(sec) {
    sec = Math.max(0, Math.floor(sec));
    const d = Math.floor(sec / 86400), h = Math.floor(sec / 3600) % 24, m = Math.floor(sec / 60) % 60, s2 = sec % 60;
    if (d >= 365) return `${fmt(d / 365)} years`;
    if (d) return `${d}d ${h}h`;
    if (h) return `${h}h ${m}m`;
    if (m) return `${m}m ${s2}s`;
    return `${s2}s`;
  }

  function setText(el, txt) {
    if (el._t !== txt) { el.textContent = txt; el._t = txt; }
  }

  // ---------- State ----------
  function freshRun() {
    return { bank: 0, runEarned: 0, rigs: {}, breached: 0, targetHp: 0 };
  }
  function defaultState() {
    return {
      v: 1,
      ...freshRun(),
      allEarned: 0,
      keystrokes: 0,
      ghost: 0,
      ghostSpent: 0,
      perks: [],
      adminUsed: false,
      trophies: [],
      stats: { packets: 0, tracesEvaded: 0, tracesFailed: 0, prestiges: 0, bestCps: 0, totalBreached: 0, playTime: 0, started: Date.now() },
      settings: { sound: false, buyAmt: 1, tab: 'rigs' },
      lastSeen: Date.now(),
    };
  }

  let s = defaultState();
  let ownedMods = new Set();
  let buffs = []; // { id, label, until }
  const D = { mult: 1, baseCps: 0, cps: 0, click: 1, clickPct: 0, rigRate: {} };

  function serialize() {
    const out = { ...s, mods: [...ownedMods], lastSeen: Date.now() };
    return out;
  }

  function hydrate(obj) {
    const base = defaultState();
    ownedMods = new Set();
    if (!obj || typeof obj !== 'object') return base;
    const out = {
      ...base,
      ...obj,
      stats: { ...base.stats, ...(obj.stats || {}) },
      settings: { ...base.settings, ...(obj.settings || {}) },
      rigs: {},
    };
    for (const k of ['bank', 'runEarned', 'allEarned', 'keystrokes', 'ghost', 'ghostSpent', 'breached', 'targetHp', 'lastSeen']) {
      if (!Number.isFinite(out[k]) || out[k] < 0) out[k] = base[k];
    }
    for (const k of Object.keys(base.stats)) {
      if (!Number.isFinite(out.stats[k])) out.stats[k] = base.stats[k];
    }
    if (obj.rigs && typeof obj.rigs === 'object') {
      for (const r of RIGS) {
        const n = Math.floor(Number(obj.rigs[r.id]) || 0);
        if (n > 0) out.rigs[r.id] = n;
      }
    }
    out.breached = Math.min(Math.floor(out.breached), TARGETS.length);
    out.trophies = Array.isArray(obj.trophies) ? obj.trophies.filter(id => TROPHY_BY_ID[id]) : [];
    out.perks = Array.isArray(obj.perks) ? obj.perks.filter(id => PERK_BY_ID[id]) : [];
    out.ghostSpent = Math.min(out.ghostSpent, out.ghost);
    if (Array.isArray(obj.mods)) obj.mods.forEach(id => { if (MOD_BY_ID[id]) ownedMods.add(id); });
    if (![1, 10, 100, 'max'].includes(out.settings.buyAmt)) out.settings.buyAmt = 1;
    delete out.mods;
    return out;
  }

  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(serialize())); } catch (e) { /* storage unavailable */ }
  }
  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  // ---------- Economy ----------
  const buffActive = id => buffs.some(b => b.id === id && b.until > Date.now());
  const hasPerk = id => s.perks.includes(id);
  const admin = { speed: 1, mult: 1 }; // admin menu settings, not saved
  const tokenBonus = () => (hasPerk('p_ghost') ? 0.12 : 0.1);
  const rigDiscount = () => (hasPerk('p_cheap') ? 0.9 : 1) * (hasPerk('p_cheap2') ? 0.9 : 1);
  const offlineCap = () => (hasPerk('p_offline') ? 24 : 8) * 3600;
  const buffTimeMult = () => (ownedMods.has('f1') ? 1.5 : 1) * (hasPerk('p_frenzy') ? 2 : 1);
  const packetPower = () => (ownedMods.has('p2') ? 2 : 1) * (ownedMods.has('p3') ? 2 : 1);

  function recalc() {
    let mult = 1;
    let clickMult = 1;
    let clickPct = 0;
    const tiers = {};
    const syn = {};
    for (const id of ownedMods) {
      const m = MOD_BY_ID[id];
      if (m.kind === 'global') mult *= m.value;
      else if (m.kind === 'rig') tiers[m.rig] = (tiers[m.rig] || 0) + 1;
      else if (m.kind === 'synergy') syn[m.rig] = (syn[m.rig] || 1) * (1 + m.value * (s.rigs[m.per] || 0));
      else if (m.kind === 'clickMult') clickMult *= m.value;
      else if (m.kind === 'clickPct') clickPct += m.value;
    }
    mult *= 1 + tokenBonus() * s.ghost;
    if (hasPerk('p_rootkit')) mult *= 3;
    mult *= admin.mult;
    if (hasPerk('p_keys')) clickMult *= 3;
    mult *= 1 + 0.02 * s.trophies.length;
    mult *= 1 + BREACH_BONUS * s.breached;
    D.mult = mult;

    let cps = 0;
    for (const r of RIGS) {
      const rate = r.rate * Math.pow(2, tiers[r.id] || 0) * (syn[r.id] || 1) * mult;
      D.rigRate[r.id] = rate;
      cps += rate * (s.rigs[r.id] || 0);
    }
    D.baseCps = cps;
    D.cps = cps * (buffActive('overclock') ? 7 : 1);
    D.clickPct = clickPct;
    D.click = (clickMult * mult + D.cps * clickPct) * (buffActive('frenzy') ? 10 : 1);
    D.autoKeys = (hasPerk('p_auto') ? 5 : 0) + (hasPerk('p_auto2') ? 15 : 0);
    D.autoCps = D.click * D.autoKeys;
    D.totalCps = D.cps + D.autoCps;
    if (D.baseCps > s.stats.bestCps) s.stats.bestCps = D.baseCps;
  }

  function earn(x) {
    if (!(x > 0)) return;
    s.bank += x;
    s.runEarned += x;
    s.allEarned += x;
  }

  function hack(x) {
    while (x > 0 && s.breached < TARGETS.length) {
      const t = TARGETS[s.breached];
      const need = t.hp - s.targetHp;
      if (x >= need) { x -= need; breach(); }
      else { s.targetHp += x; x = 0; }
    }
  }

  function breach() {
    const t = TARGETS[s.breached];
    const loot = t.hp * LOOT_RATIO * (hasPerk('p_breach') ? 3 : 1);
    s.breached += 1;
    s.targetHp = 0;
    s.stats.totalBreached += 1;
    earn(loot);
    recalc();
    termWrite(`\n\n*** ACCESS GRANTED: ${t.name.toUpperCase()} ***\n*** looted ${money(loot)} ***\n\n`);
    addLog(`Breached ${t.name}. Looted ${money(loot)} and income is now +${Math.round(s.breached * BREACH_BONUS * 100)}% from breaches.`, 'gold');
    showStamp(`${t.name} · +${money(loot)}`);
    sfx.breach();
  }

  function rigCost(r, owned, n) {
    const first = r.cost * rigDiscount() * Math.pow(GROWTH, owned);
    return first * (Math.pow(GROWTH, n) - 1) / (GROWTH - 1);
  }
  function maxAfford(r, owned, bank) {
    const first = r.cost * rigDiscount() * Math.pow(GROWTH, owned);
    let n = Math.floor(Math.log(bank * (GROWTH - 1) / first + 1) / Math.log(GROWTH));
    if (n < 0 || !Number.isFinite(n)) n = 0;
    while (n > 0 && rigCost(r, owned, n) > bank) n -= 1;
    return n;
  }
  function buyPlan(r) {
    const owned = s.rigs[r.id] || 0;
    const amt = s.settings.buyAmt;
    let n = amt === 'max' ? Math.max(1, maxAfford(r, owned, s.bank)) : amt;
    const cost = rigCost(r, owned, n);
    return { n, cost, ok: s.bank >= cost };
  }

  function buyRig(r) {
    const { n, cost, ok } = buyPlan(r);
    if (!ok) return;
    const first = !(s.rigs[r.id] > 0);
    s.bank -= cost;
    s.rigs[r.id] = (s.rigs[r.id] || 0) + n;
    recalc();
    sfx.buy();
    flashEl(rigEls[r.id].b);
    if (first) { addLog(`New rig online: ${r.name}.`); toast('New rig online', r.name); }
    renderFast();
    renderSlow();
  }

  function modUnlocked(m) {
    if (m.kind === 'rig') return (s.rigs[m.rig] || 0) >= m.req;
    if (m.kind === 'synergy') return (s.rigs[m.rig] || 0) >= m.req && (s.rigs[m.per] || 0) >= m.req;
    return s.runEarned >= m.cost * 0.25;
  }

  function buyMod(m) {
    if (ownedMods.has(m.id) || s.bank < m.cost) return;
    s.bank -= m.cost;
    ownedMods.add(m.id);
    recalc();
    sfx.buy();
    addLog(`Installed ${m.name}.`);
    toast('Mod installed', m.name);
    if (m.kind === 'packetRate' && !packet.active) schedulePacket();
    renderFast();
    renderSlow();
  }

  // ---------- Prestige ----------
  const tokensFor = all => Math.floor(Math.sqrt(all / TOKEN_BASE));
  const pendingTokens = () => Math.max(0, tokensFor(s.allEarned) - s.ghost);

  const ghostAvail = () => Math.max(0, s.ghost - s.ghostSpent);

  // Start-of-run perks. Only ever raise values, so applying them twice is safe.
  function applyStartPerks() {
    const cash = hasPerk('p_start3') ? 1e9 : hasPerk('p_start2') ? 1e6 : hasPerk('p_start1') ? 1e3 : 0;
    if (s.bank < cash) s.bank = cash;
    if (hasPerk('p_kiddies')) {
      s.rigs.kiddie = Math.max(s.rigs.kiddie || 0, 10);
      s.rigs.toaster = Math.max(s.rigs.toaster || 0, 5);
    }
    if (hasPerk('p_mods')) ['kb1', 'kb2', 'kb3', 'kb4'].forEach(id => ownedMods.add(id));
    if (hasPerk('p_target') && s.breached < 3) { s.breached = 3; s.targetHp = 0; }
  }

  function perkState(p) {
    if (hasPerk(p.id)) return 'owned';
    if (p.needs && !hasPerk(p.needs)) return 'locked';
    return ghostAvail() >= p.cost ? 'ready' : 'poor';
  }

  function buyPerk(p) {
    if (perkState(p) !== 'ready') return;
    s.ghostSpent += p.cost;
    s.perks.push(p.id);
    applyStartPerks();
    recalc();
    sfx.breach();
    addLog(`Ghost perk unlocked: ${p.name}.`, 'good');
    toast('Ghost perk', p.name, 'good');
    save();
    renderFast();
    renderSlow();
  }

  let darkNotified = false;
  function goDark() {
    const gain = pendingTokens();
    if (gain < 1) return;
    s.ghost += gain;
    Object.assign(s, freshRun());
    ownedMods.clear();
    buffs = [];
    darkNotified = false;
    applyStartPerks();
    s.stats.prestiges += 1;
    recalc();
    hidePacket();
    if (trace.active) endTrace();
    termWrite(`\n\n>>> GOING DARK... identity wiped.\n>>> ghost tokens: ${fmt(s.ghost)}\n\n`);
    addLog(`You went dark and earned ${fmt(gain)} ghost tokens. All income is now +${fmt(s.ghost * tokenBonus() * 100)}%.`, 'good');
    toast('You went dark', `+${fmt(gain)} ghost tokens`, 'good');
    sfx.breach();
    save();
    renderFast();
    renderSlow();
  }

  // ---------- Buffs, packets, traces ----------
  function addBuff(id, label, secs) {
    buffs = buffs.filter(b => b.id !== id);
    buffs.push({ id, label, until: Date.now() + secs * 1000 });
    recalc();
  }

  const packet = { active: false, until: 0, next: 0 };
  function schedulePacket() {
    const f = (ownedMods.has('p1') ? 0.5 : 1) * (hasPerk('p_packet') ? 0.67 : 1);
    packet.next = Date.now() + rand(70, 160) * 1000 * f;
  }
  function spawnPacket() {
    const el = $('#packet');
    const w = window.innerWidth, h = window.innerHeight;
    el.style.left = rand(16, Math.max(16, w - 190)) + 'px';
    el.style.top = rand(110, Math.max(120, h - 90)) + 'px';
    el.hidden = false;
    packet.active = true;
    packet.until = Date.now() + 13000 * (hasPerk('p_packet') ? 2 : 1);
    sfx.packet();
  }
  function hidePacket() {
    $('#packet').hidden = true;
    packet.active = false;
    schedulePacket();
  }
  function grabPacket(ev) {
    if (!packet.active) return;
    hidePacket();
    s.stats.packets += 1;
    const power = packetPower();
    const dur = buffTimeMult();
    const roll = Math.random();
    let text;
    if (roll < 0.55) {
      const amt = Math.max(D.cps * 120, D.click * 40, 25) * power;
      earn(amt);
      text = '+' + money(amt);
      addLog(`Data packet: found ${money(amt)} in a forgotten wallet.`, 'good');
    } else if (roll < 0.85) {
      addBuff('overclock', 'Overclock: income ×7', 30 * dur);
      text = 'OVERCLOCK ×7';
      addLog(`Data packet: overclock! Income ×7 for ${Math.round(30 * dur)} seconds.`, 'good');
    } else {
      addBuff('frenzy', 'Frenzy: keystrokes ×10', 20 * dur);
      text = 'FRENZY ×10';
      addLog(`Data packet: keystroke frenzy! Keystrokes ×10 for ${Math.round(20 * dur)} seconds.`, 'good');
    }
    const x = ev && ev.clientX ? ev.clientX : window.innerWidth / 2;
    const y = ev && ev.clientY ? ev.clientY : window.innerHeight / 2;
    floater(x, y, text, 'good');
    toast('Data packet', text, 'good');
    sfx.buy();
    renderFast();
  }

  const trace = { active: false, end: 0, next: 0 };
  function scheduleTrace() { trace.next = Date.now() + rand(200, 420) * 1000; }
  function startTrace() {
    if (D.baseCps < 5) { scheduleTrace(); return; }
    const secs = ownedMods.has('t1') ? 12 : 8;
    trace.active = true;
    trace.end = Date.now() + secs * 1000;
    $('#trace').hidden = false;
    try { $('#traceBtn').focus({ preventScroll: true }); } catch (e) { /* ignore */ }
    addLog('Trace detected! Purge your logs.', 'bad');
    sfx.alarm();
  }
  function endTrace() {
    trace.active = false;
    $('#trace').hidden = true;
    scheduleTrace();
  }
  function evadeTrace() {
    if (!trace.active) return;
    endTrace();
    s.stats.tracesEvaded += 1;
    const bonus = Math.max(D.cps * 20, 50);
    earn(bonus);
    addLog(`Trace evaded. You grabbed ${money(bonus)} on the way out.`, 'good');
    sfx.buy();
  }
  function failTrace() {
    endTrace();
    s.stats.tracesFailed += 1;
    const pct = hasPerk('p_trace') ? 0.01 : 0.05;
    const loss = s.bank * pct;
    s.bank -= loss;
    addLog(`Traced! The sysadmin seized ${money(loss)}, ${pct * 100}% of your wallet.`, 'bad');
  }

  // ---------- Trophies ----------
  function checkTrophies() {
    let changed = false;
    for (const t of TROPHIES) {
      if (s.trophies.includes(t.id)) continue;
      if (t.check()) {
        s.trophies.push(t.id);
        changed = true;
        addLog(`Trophy unlocked: ${t.name}. Income +2%.`, 'gold');
        toast('Trophy unlocked', `${t.name} · income +2%`, 'gold');
      }
    }
    if (changed) { recalc(); renderTrophies(); }
  }

  // ---------- Sound ----------
  const sfx = (() => {
    let ctx = null;
    function ensure() {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        try { ctx = new AC(); } catch (e) { return null; }
      }
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      return ctx;
    }
    function tone(freq, dur, type, vol, delay) {
      if (!s.settings.sound) return;
      const c = ensure();
      if (!c) return;
      const t = c.currentTime + (delay || 0);
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(c.destination);
      o.start(t);
      o.stop(t + dur + 0.02);
    }
    return {
      ensure,
      key() { tone(420 + Math.random() * 380, 0.03, 'square', 0.012); },
      buy() { tone(660, 0.06, 'triangle', 0.05); tone(990, 0.08, 'triangle', 0.05, 0.06); },
      packet() { tone(1200, 0.05, 'sine', 0.05); tone(1600, 0.08, 'sine', 0.05, 0.06); },
      breach() { [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.12, 'square', 0.035, i * 0.09)); },
      alarm() { [880, 660, 880, 660].forEach((f, i) => tone(f, 0.14, 'sawtooth', 0.03, i * 0.17)); },
    };
  })();

  // ---------- Terminal ----------
  // The terminal holds colored segments: your typing, your rigs' typing,
  // rig chatter, and system messages.
  let termSegs = [];
  let termLen = 0;
  let termDirty = true;
  let codeIdx = 0;
  const TERM_MAX = 4000;
  const TERM_KEEP = 3000;
  function termWrite(str, cls) {
    cls = cls || 'sys';
    const last = termSegs[termSegs.length - 1];
    if (last && last.c === cls) last.t += str;
    else termSegs.push({ t: str, c: cls });
    termLen += str.length;
    if (termLen > TERM_MAX) {
      let excess = termLen - TERM_KEEP;
      while (excess > 0 && termSegs.length) {
        const first = termSegs[0];
        if (first.t.length <= excess) { excess -= first.t.length; termLen -= first.t.length; termSegs.shift(); }
        else { first.t = first.t.slice(excess); termLen -= excess; excess = 0; }
      }
    }
    termDirty = true;
  }
  function termClear() { termSegs = []; termLen = 0; termDirty = true; }

  function nextCode(n) {
    let chunk = '';
    for (let i = 0; i < n; i++) {
      chunk += CODE[codeIdx];
      codeIdx = (codeIdx + 1) % CODE.length;
    }
    return chunk;
  }

  // Characters typed per keystroke grow with how much each keystroke earns.
  function keyChars() {
    const scale = 1 + 1.5 * Math.log10(Math.max(1, D.click));
    return Math.min(400, Math.round((3 + Math.random() * 3) * scale));
  }
  // Characters your rigs type per second grow with your income.
  function rigCharsPerSec() {
    return D.cps > 0 ? Math.min(240, 5 + 12 * Math.log10(1 + D.cps)) : 0;
  }

  let autoChars = 0;
  let nextChatter = 0;
  function rigTyping(dt) {
    if (D.cps <= 0) return;
    autoChars += rigCharsPerSec() * Math.min(dt, 1);
    if (autoChars >= 1) {
      const n = Math.floor(autoChars);
      autoChars -= n;
      termWrite(nextCode(n), 'rig');
    }
    const now = Date.now();
    if (now >= nextChatter) {
      nextChatter = now + rand(2500, 5000);
      const owned = RIGS.filter(r => (s.rigs[r.id] || 0) > 0);
      if (owned.length) {
        const r = owned[Math.floor(Math.random() * owned.length)];
        const lines = CHATTER[r.id];
        const num = 1 + Math.floor(Math.random() * s.rigs[r.id]);
        termWrite(`\n[${r.id}-${num}] ${lines[Math.floor(Math.random() * lines.length)]}\n`, 'chat');
      }
    }
  }

  function renderTerminal() {
    if (!termDirty) return;
    termDirty = false;
    const out = $('#termOut');
    const frag = document.createDocumentFragment();
    for (const seg of termSegs) {
      const span = document.createElement('span');
      span.className = 't-' + seg.c;
      span.textContent = seg.t;
      frag.appendChild(span);
    }
    out.textContent = '';
    out.appendChild(frag);
    const term = $('#terminal');
    term.scrollTop = term.scrollHeight;
  }

  // ---------- Keystrokes ----------
  function keystroke(x, y) {
    s.keystrokes += 1;
    const v = D.click;
    earn(v);
    hack(v);
    termWrite(nextCode(keyChars()), 'you');
    sfx.key();
    pressHackBtn();
    scheduleKeyRender();
    if (x != null) floater(x, y, '+' + money(v, true));
  }

  // Update the wallet and terminal on the next frame after each keystroke,
  // instead of waiting for the 10-per-second game tick.
  let keyRenderQueued = false;
  function scheduleKeyRender() {
    if (keyRenderQueued) return;
    keyRenderQueued = true;
    requestAnimationFrame(() => {
      keyRenderQueued = false;
      shownBank = s.bank;
      setText($('#bank'), money(shownBank));
      renderTerminal();
    });
  }

  let pressTimer = null;
  function pressHackBtn() {
    const b = $('#hackBtn');
    b.classList.add('pressed');
    clearTimeout(pressTimer);
    pressTimer = setTimeout(() => b.classList.remove('pressed'), 70);
  }

  function floater(x, y, text, cls) {
    const layer = $('#floaters');
    if (layer.childElementCount > 40) return;
    const el = document.createElement('span');
    el.className = 'floater' + (cls ? ' ' + cls : '');
    el.textContent = text;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    layer.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  // ---------- Feedback: toasts, stamp, flashes ----------
  let quiet = true; // no stamps or toasts while restoring a save
  function toast(title, body, cls) {
    if (quiet) return;
    const box = $('#toasts');
    while (box.childElementCount >= 4) box.firstElementChild.remove();
    const el = document.createElement('div');
    el.className = 'toast' + (cls ? ' ' + cls : '');
    const t = document.createElement('strong'); t.textContent = title;
    const b = document.createElement('span'); b.textContent = body;
    el.append(t, b);
    box.appendChild(el);
    setTimeout(() => el.classList.add('out'), 3200);
    setTimeout(() => el.remove(), 3600);
  }

  let stampTimer = null;
  function showStamp(sub) {
    if (quiet) return;
    const st = $('#stamp');
    $('#stampSub').textContent = sub;
    st.hidden = true;
    void st.offsetWidth; // restart the animation
    st.hidden = false;
    clearTimeout(stampTimer);
    stampTimer = setTimeout(() => { st.hidden = true; }, 1700);
  }

  function flashEl(el) {
    el.classList.remove('flash');
    void el.offsetWidth;
    el.classList.add('flash');
  }

  const routeEls = [];
  function buildRoute() {
    const ol = $('#route');
    ol.textContent = '';
    TARGETS.forEach(t => {
      const li = document.createElement('li');
      li.title = t.name;
      ol.appendChild(li);
      routeEls.push(li);
    });
  }
  function renderRoute() {
    routeEls.forEach((li, i) => {
      const cls = i < s.breached ? 'done' : i === s.breached ? 'now' : '';
      if (li.className !== cls) li.className = cls;
    });
  }

  // ---------- Log ----------
  function addLog(msg, cls) {
    const ol = $('#log');
    if (!ol) return;
    const li = document.createElement('li');
    const time = document.createElement('time');
    const d = new Date();
    time.textContent = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    const span = document.createElement('span');
    span.textContent = msg;
    if (cls) span.className = cls;
    li.append(time, span);
    ol.prepend(li);
    while (ol.childElementCount > 40) ol.lastElementChild.remove();
  }

  // ---------- UI: build ----------
  const rigEls = {};
  function buildRigs() {
    const ul = $('#rigs');
    ul.textContent = '';
    for (const r of RIGS) {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'rig';
      const info = document.createElement('span');
      info.className = 'rig-info';
      const name = document.createElement('span'); name.className = 'rig-name';
      const desc = document.createElement('span'); desc.className = 'rig-desc';
      const meta = document.createElement('span'); meta.className = 'rig-meta';
      const cost = document.createElement('span'); cost.className = 'rig-cost';
      const rate = document.createElement('span'); rate.className = 'rig-rate';
      meta.append(cost, rate);
      info.append(name, desc, meta);
      const owned = document.createElement('span'); owned.className = 'rig-owned';
      const icon = document.createElement('span'); icon.className = 'rig-icon'; icon.setAttribute('aria-hidden', 'true');
      const prog = document.createElement('span'); prog.className = 'rig-prog'; prog.setAttribute('aria-hidden', 'true');
      b.append(icon, info, owned, prog);
      b.addEventListener('click', () => buyRig(r));
      li.appendChild(b);
      ul.appendChild(li);
      rigEls[r.id] = { li, b, icon, name, desc, cost, rate, owned, prog };
    }
  }

  const MOD_TAGS = {
    rig: { label: 'Rig ×2', cls: 'rig' },
    clickMult: { label: 'Keys', cls: 'keys' },
    clickPct: { label: 'Keys', cls: 'keys' },
    global: { label: 'All income', cls: 'all' },
    synergy: { label: 'Synergy', cls: 'syn' },
    event: { label: 'Events', cls: 'event' },
  };
  let modsKey = '';
  let modEls = [];
  function renderMods() {
    const avail = MODS.filter(m => !ownedMods.has(m.id) && modUnlocked(m)).sort((a, b) => a.cost - b.cost);
    const key = avail.map(m => m.id).join(',');
    if (key !== modsKey) {
      modsKey = key;
      const ul = $('#mods');
      ul.textContent = '';
      modEls = avail.map(m => {
        const li = document.createElement('li');
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'mod';
        const tag = document.createElement('span');
        const kind = MOD_TAGS[m.kind] || MOD_TAGS.event;
        tag.className = 'mod-tag tag-' + kind.cls;
        tag.textContent = m.kind === 'rig' ? RIG_BY_ID[m.rig].icon + ' ' + kind.label : kind.label;
        const name = document.createElement('span'); name.className = 'mod-name'; name.textContent = m.name;
        const desc = document.createElement('span'); desc.className = 'mod-desc'; desc.textContent = m.desc;
        const cost = document.createElement('span'); cost.className = 'mod-cost'; cost.textContent = money(m.cost);
        const prog = document.createElement('span'); prog.className = 'rig-prog'; prog.setAttribute('aria-hidden', 'true');
        b.append(tag, name, desc, cost, prog);
        b.addEventListener('click', () => buyMod(m));
        li.appendChild(b);
        ul.appendChild(li);
        return { m, b, prog };
      });
      $('#modsEmpty').hidden = avail.length > 0;

      const owned = $('#ownedMods');
      owned.textContent = '';
      MODS.filter(m => ownedMods.has(m.id)).forEach(m => {
        const li = document.createElement('li');
        li.textContent = m.name;
        owned.appendChild(li);
      });
      setText($('#ownedCount'), String(ownedMods.size));
    }
  }

  const perkEls = {};
  function buildPerks() {
    const ul = $('#perks');
    ul.textContent = '';
    for (const p of PERKS) {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'mod perk';
      const tag = document.createElement('span'); tag.className = 'mod-tag tag-ghost';
      tag.textContent = `${p.cost} token${p.cost === 1 ? '' : 's'}`;
      const name = document.createElement('span'); name.className = 'mod-name'; name.textContent = p.name;
      const desc = document.createElement('span'); desc.className = 'mod-desc'; desc.textContent = p.desc;
      const status = document.createElement('span'); status.className = 'mod-cost';
      b.append(tag, name, desc, status);
      b.addEventListener('click', () => buyPerk(p));
      li.appendChild(b);
      ul.appendChild(li);
      perkEls[p.id] = { b, status };
    }
  }
  function renderPerks() {
    for (const p of PERKS) {
      const { b, status } = perkEls[p.id];
      const st = perkState(p);
      b.disabled = st !== 'ready';
      b.dataset.state = st;
      setText(status, st === 'owned' ? 'Owned' : st === 'locked' ? `Needs ${PERK_BY_ID[p.needs].name}` : st === 'ready' ? 'Buy' : `Need ${fmt(p.cost - ghostAvail())} more`);
    }
  }

  const trophyEls = {};
  function buildTrophies() {
    const ul = $('#trophies');
    ul.textContent = '';
    for (const t of TROPHIES) {
      const li = document.createElement('li');
      li.className = 'trophy';
      const name = document.createElement('span'); name.className = 'trophy-name'; name.textContent = t.name;
      const desc = document.createElement('span'); desc.className = 'trophy-desc'; desc.textContent = t.desc;
      li.append(name, desc);
      ul.appendChild(li);
      trophyEls[t.id] = li;
    }
    renderTrophies();
  }
  function renderTrophies() {
    for (const t of TROPHIES) {
      const got = s.trophies.includes(t.id);
      trophyEls[t.id].className = 'trophy ' + (got ? 'got' : 'locked');
    }
    setText($('#trophyCount'), `${s.trophies.length} / ${TROPHIES.length}`);
  }

  const STATS = [
    ['Earned this run',       () => money(s.runEarned)],
    ['Earned all time',       () => money(s.allEarned)],
    ['Best income',           () => money(s.stats.bestCps, true) + '/s'],
    ['Keystrokes',            () => fmt(s.keystrokes)],
    ['Rigs owned',            () => fmt(totalRigs())],
    ['Mods installed',        () => `${ownedMods.size} / ${MODS.length}`],
    ['Targets breached (all time)', () => fmt(s.stats.totalBreached)],
    ['Data packets grabbed',  () => fmt(s.stats.packets)],
    ['Traces evaded / caught', () => `${s.stats.tracesEvaded} / ${s.stats.tracesFailed}`],
    ['Times gone dark',       () => fmt(s.stats.prestiges)],
    ['Total income multiplier', () => '×' + fmt(D.mult, true)],
    ['Play time',             () => fmtTime(s.stats.playTime)],
    ['Admin menu used',       () => (s.adminUsed ? 'Yes' : 'No')],
  ];
  const statEls = [];
  function buildStats() {
    const dl = $('#stats');
    dl.textContent = '';
    for (const [label] of STATS) {
      const dt = document.createElement('dt'); dt.textContent = label;
      const dd = document.createElement('dd');
      dl.append(dt, dd);
      statEls.push(dd);
    }
  }

  // ---------- UI: render ----------
  let shownBank = 0;
  function renderFast() {
    // Count the wallet up smoothly; drop instantly when spending.
    if (s.bank <= shownBank || s.bank - shownBank < 1) shownBank = s.bank;
    else shownBank += (s.bank - shownBank) * 0.35;
    setText($('#bank'), money(shownBank));
    renderRoute();
    setText($('#cps'), money(D.totalCps, true));
    setText($('#kps'), money(D.click, true));
    setText($('#hackBtnVal'), '+' + money(D.click, true));

    // Target
    const panel = $('#targetPanel');
    if (s.breached >= TARGETS.length) {
      panel.classList.add('done');
      setText($('#targetTier'), `${TARGETS.length} / ${TARGETS.length}`);
      setText($('#targetName'), 'Everything is breached');
      setText($('#targetDesc'), 'There is nothing left to hack. Go dark to start a new run with bonus ghost tokens.');
      $('#targetBar').style.width = '100%';
      setText($('#targetProgress'), 'Firewall: none left');
      setText($('#targetEta'), '');
      setText($('#targetReward'), '');
    } else {
      panel.classList.remove('done');
      const t = TARGETS[s.breached];
      const pct = Math.min(100, (s.targetHp / t.hp) * 100);
      setText($('#targetTier'), `${s.breached + 1} / ${TARGETS.length}`);
      setText($('#targetName'), t.name);
      setText($('#targetDesc'), t.desc);
      $('#targetBar').style.width = pct.toFixed(1) + '%';
      $('#targetBarWrap').setAttribute('aria-valuenow', String(Math.floor(pct)));
      setText($('#targetProgress'), `${fmt(s.targetHp)} / ${fmt(t.hp)} firewall`);
      setText($('#targetEta'), D.totalCps > 0 ? `Breach in ${fmtTime((t.hp - s.targetHp) / D.totalCps)}` : 'Type or buy rigs to break in');
      setText($('#targetReward'), `Loot: ${money(t.hp * LOOT_RATIO * (hasPerk('p_breach') ? 3 : 1))} and +10% income`);
    }

    // Rigs
    let maxIdx = -1;
    RIGS.forEach((r, i) => { if ((s.rigs[r.id] || 0) > 0) maxIdx = i; });
    RIGS.forEach((r, i) => {
      const el = rigEls[r.id];
      const owned = s.rigs[r.id] || 0;
      if (i > maxIdx + 2) { el.li.hidden = true; return; }
      el.li.hidden = false;
      if (i === maxIdx + 2) {
        el.b.classList.add('locked');
        el.b.disabled = true;
        setText(el.icon, '??');
        setText(el.name, '???');
        setText(el.desc, `Buy a ${RIGS[i - 1].name} to reveal this rig.`);
        setText(el.cost, '');
        setText(el.rate, '');
        setText(el.owned, '');
        el.prog.style.width = '0%';
        return;
      }
      el.b.classList.remove('locked');
      const plan = buyPlan(r);
      el.b.disabled = !plan.ok;
      setText(el.icon, r.icon);
      setText(el.name, r.name);
      setText(el.desc, r.desc);
      setText(el.cost, `${plan.n > 1 ? 'Buy ' + plan.n + ': ' : ''}${money(plan.cost)}`);
      const rate = D.rigRate[r.id] || 0;
      const share = D.baseCps > 0 ? Math.round((rate * owned / D.baseCps) * 100) : 0;
      setText(el.rate, owned ? `+${money(rate, true)}/s each · ${money(rate * owned, true)}/s total · ${share}% of income` : `+${money(rate, true)}/s each`);
      setText(el.owned, String(owned));
      el.prog.style.width = (Math.min(1, s.bank / plan.cost) * 100).toFixed(1) + '%';
    });

    // Mods affordability
    let affordable = 0;
    for (const { m, b, prog } of modEls) {
      const ok = s.bank >= m.cost;
      b.disabled = !ok;
      prog.style.width = (Math.min(1, s.bank / m.cost) * 100).toFixed(1) + '%';
      if (ok) affordable += 1;
    }
    const badge = $('#modsBadge');
    badge.hidden = affordable === 0;
    setText(badge, String(affordable));

    // Buffs
    const now = Date.now();
    const buffBox = $('#buffs');
    const buffText = buffs.filter(b => b.until > now).map(b => `${b.label} · ${Math.ceil((b.until - now) / 1000)}s`);
    if (admin.speed !== 1) buffText.push(`Admin: speed ×${admin.speed}`);
    if (admin.mult !== 1) buffText.push(`Admin: income ×${fmt(admin.mult)}`);
    const key = buffText.join('|');
    if (buffBox._k !== key) {
      buffBox._k = key;
      buffBox.textContent = '';
      buffText.forEach(t => {
        const span = document.createElement('span');
        span.className = t.startsWith('Admin') ? 'buff admin' : 'buff';
        span.textContent = t;
        buffBox.appendChild(span);
      });
    }

    // Trace timer
    if (trace.active) setText($('#traceTimer'), Math.max(0, (trace.end - now) / 1000).toFixed(1) + 's');

    renderTerminal();
  }

  function renderSlow() {
    renderMods();
    if (s.keystrokes > 0 || D.cps > 0) {
      const rigText = D.cps > 0 ? ` · rigs type ${Math.round(rigCharsPerSec())}/s` : '';
      setText($('#termHint'), `You type ~${Math.round(4.5 * (1 + 1.5 * Math.log10(Math.max(1, D.click))))} chars/key${rigText}`);
    }
    STATS.forEach(([, fn], i) => setText(statEls[i], fn()));

    const gain = pendingTokens();
    setText($('#ghostHeld'), fmt(s.ghost));
    setText($('#ghostBonus'), `+${fmt(s.ghost * tokenBonus() * 100)}% income and keystrokes`);
    setText($('#ghostAvail'), fmt(ghostAvail()));
    renderPerks();
    const badge = $('#darkBadge');
    const anyPerk = PERKS.some(p => perkState(p) === 'ready');
    badge.hidden = gain < 1 && !anyPerk;
    setText(badge, gain >= 1 ? '+' + fmt(gain) : '!');
    if (gain >= 1 && !darkNotified) {
      darkNotified = true;
      toast('Prestige ready', `Go dark now for +${fmt(gain)} ghost tokens`, 'good');
    }
    setText($('#ghostGain'), '+' + fmt(gain));
    const nextAt = Math.pow(tokensFor(s.allEarned) + 1, 2) * TOKEN_BASE;
    setText($('#ghostNext'), `Next token at ${money(nextAt)} lifetime earnings (you have ${money(s.allEarned)})`);
    const btn = $('#goDarkBtn');
    btn.disabled = gain < 1;
  }

  // ---------- Confirm-by-second-click ----------
  function armButton(btn, armedLabel, action) {
    const label = btn.textContent;
    let timer = null;
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      if (btn.dataset.armed === '1') {
        clearTimeout(timer);
        btn.dataset.armed = '';
        btn.textContent = label;
        action();
      } else {
        btn.dataset.armed = '1';
        btn.textContent = armedLabel;
        timer = setTimeout(() => { btn.dataset.armed = ''; btn.textContent = label; }, 4000);
      }
    });
  }

  // ---------- Events ----------
  function selectTab(name) {
    if (!$('#tab-' + name)) name = 'rigs';
    document.querySelectorAll('.tabs [role="tab"]').forEach(b => {
      const on = b.dataset.tab === name;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      $('#tab-' + b.dataset.tab).hidden = !on;
    });
    s.settings.tab = name;
  }

  function renderBuyAmt() {
    document.querySelectorAll('.buy-amt [data-amt]').forEach(b => {
      const v = b.dataset.amt === 'max' ? 'max' : Number(b.dataset.amt);
      b.setAttribute('aria-pressed', v === s.settings.buyAmt ? 'true' : 'false');
    });
  }

  function renderSound() {
    const b = $('#soundBtn');
    b.setAttribute('aria-pressed', s.settings.sound ? 'true' : 'false');
    b.textContent = s.settings.sound ? 'Sound on' : 'Sound off';
  }

  function encodeSave() {
    return btoa(unescape(encodeURIComponent(JSON.stringify(serialize()))));
  }
  function decodeSave(code) {
    return JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
  }

  // ---------- Admin menu ----------
  function toggleAdmin(open) {
    const el = $('#admin');
    const show = open === undefined ? el.hidden : open;
    el.hidden = !show;
    if (show) { try { $('#adminClose').focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
  }

  function breachCurrent() {
    if (s.breached >= TARGETS.length) return;
    hack(TARGETS[s.breached].hp - s.targetHp);
  }

  const ADMIN_ACTIONS = {
    cash3: () => earn(1e3), cash6: () => earn(1e6), cash9: () => earn(1e9),
    cash12: () => earn(1e12), cash15: () => earn(1e15),
    cashx10: () => earn(Math.max(s.bank, 1) * 9),
    tok10: () => { s.ghost += 10; }, tok100: () => { s.ghost += 100; }, tok1000: () => { s.ghost += 1000; },
    allperks: () => { PERKS.forEach(p => { if (!hasPerk(p.id)) s.perks.push(p.id); }); applyStartPerks(); },
    rigs10: () => RIGS.forEach(r => { s.rigs[r.id] = (s.rigs[r.id] || 0) + 10; }),
    rigs100: () => RIGS.forEach(r => { s.rigs[r.id] = (s.rigs[r.id] || 0) + 100; }),
    allmods: () => MODS.forEach(m => ownedMods.add(m.id)),
    alltrophies: () => TROPHIES.forEach(t => { if (!s.trophies.includes(t.id)) s.trophies.push(t.id); }),
    breach1: breachCurrent,
    breachall: () => { while (s.breached < TARGETS.length) breachCurrent(); },
    resetrun: () => { Object.assign(s, freshRun()); ownedMods.clear(); buffs = []; applyStartPerks(); },
    packet: () => { toggleAdmin(false); if (packet.active) hidePacket(); spawnPacket(); },
    trace: () => { toggleAdmin(false); if (!trace.active) { const b = D.baseCps; D.baseCps = Math.max(b, 5); startTrace(); D.baseCps = b; } },
    overclock: () => addBuff('overclock', 'Overclock: income ×7', 60),
    frenzy: () => addBuff('frenzy', 'Frenzy: keystrokes ×10', 60),
    warp1h: () => warp(3600), warp1d: () => warp(86400), warp1w: () => warp(7 * 86400),
  };
  function warp(secs) {
    const amt = (D.baseCps + D.autoCps) * secs;
    earn(amt);
    hack(amt);
    s.stats.playTime += secs;
  }

  function runAdmin(action, label) {
    const fn = ADMIN_ACTIONS[action];
    if (!fn) return;
    s.adminUsed = true;
    fn();
    recalc();
    renderTrophies();
    modsKey = '';
    shownBank = s.bank;
    renderFast();
    renderSlow();
    addLog(`Admin: ${label}.`, 'bad');
    toast('Admin', label);
    sfx.buy();
  }

  function renderAdmin() {
    document.querySelectorAll('[data-speed]').forEach(b => b.setAttribute('aria-pressed', Number(b.dataset.speed) === admin.speed ? 'true' : 'false'));
    document.querySelectorAll('[data-mult]').forEach(b => b.setAttribute('aria-pressed', Number(b.dataset.mult) === admin.mult ? 'true' : 'false'));
  }

  function bindAdmin() {
    $('#adminBtn').addEventListener('click', () => toggleAdmin(true));
    $('#adminClose').addEventListener('click', () => toggleAdmin(false));
    $('#admin').addEventListener('click', e => { if (e.target.id === 'admin') toggleAdmin(false); });
    document.querySelectorAll('[data-admin]').forEach(b => {
      b.addEventListener('click', () => runAdmin(b.dataset.admin, b.textContent));
    });
    document.querySelectorAll('[data-speed]').forEach(b => b.addEventListener('click', () => {
      admin.speed = Number(b.dataset.speed);
      s.adminUsed = true;
      renderAdmin();
      toast('Admin', `Game speed ×${admin.speed}`);
    }));
    document.querySelectorAll('[data-mult]').forEach(b => b.addEventListener('click', () => {
      admin.mult = Number(b.dataset.mult);
      s.adminUsed = true;
      recalc();
      renderAdmin();
      renderFast();
      toast('Admin', `Income ×${b.textContent.slice(1)}`);
    }));
  }

  // Erase every bit of progress: run, ghost tokens, perks, trophies, stats,
  // settings and the admin multipliers. Starts the game as if brand new.
  function resetEverything() {
    try { localStorage.removeItem(SAVE_KEY); } catch (e) { /* ignore */ }
    s = defaultState();
    ownedMods = new Set();
    buffs = [];
    admin.speed = 1;
    admin.mult = 1;
    modsKey = '';
    darkNotified = false;
    autoChars = 0;
    recalc();
    shownBank = 0;
    hidePacket();
    if (trace.active) endTrace();
    $('#welcome').hidden = true;
    toggleAdmin(false);
    termClear();
    termWrite(BOOT_TEXT);
    $('#log').textContent = '';
    addLog('Everything was reset. Fresh start.');
    toast('Reset complete', 'All progress erased');
    renderTrophies();
    renderBuyAmt();
    renderSound();
    renderAdmin();
    selectTab('rigs');
    renderFast();
    renderSlow();
    save();
  }

  function bindEvents() {
    bindAdmin();
    document.addEventListener('keydown', e => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      const t = e.target;
      const tag = t && t.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) return;
      if (e.key === '`') { e.preventDefault(); toggleAdmin(); return; }
      if (!$('#admin').hidden) { if (e.key === 'Escape') toggleAdmin(false); return; }
      if (['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape', 'Dead'].includes(e.key)) return;
      if ((e.key === 'Enter' || e.key === ' ') && (tag === 'BUTTON' || tag === 'SUMMARY' || tag === 'A')) return;
      if (e.key === ' ') e.preventDefault();
      if (!$('#welcome').hidden) return;
      const r = $('#terminal').getBoundingClientRect();
      const visible = r.bottom > 0 && r.top < window.innerHeight;
      keystroke(visible ? r.left + 30 + Math.random() * Math.max(10, r.width - 90) : null,
                visible ? r.top + 30 + Math.random() * Math.max(10, r.height - 60) : null);
    });

    // Count on press, not release, so every click and every finger counts
    // no matter how fast you go.
    let lastPress = 0;
    const onPress = e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      e.preventDefault();
      lastPress = performance.now();
      keystroke(e.clientX, e.clientY);
    };
    $('#terminal').addEventListener('pointerdown', onPress);
    $('#hackBtn').addEventListener('pointerdown', onPress);
    // Keyboard activation of the button (Enter/Space while focused). Skip the
    // click that follows a press we already counted.
    $('#hackBtn').addEventListener('click', e => {
      if (e.detail !== 0 || performance.now() - lastPress < 1000) return;
      const r = e.currentTarget.getBoundingClientRect();
      keystroke(r.left + r.width / 2, r.top);
    });
    $('#hackBtn').addEventListener('contextmenu', e => e.preventDefault());

    document.querySelectorAll('.tabs [role="tab"]').forEach(b => {
      b.addEventListener('click', () => { selectTab(b.dataset.tab); renderSlow(); });
    });

    document.querySelectorAll('.buy-amt [data-amt]').forEach(b => {
      b.addEventListener('click', () => {
        s.settings.buyAmt = b.dataset.amt === 'max' ? 'max' : Number(b.dataset.amt);
        renderBuyAmt();
        renderFast();
      });
    });

    $('#soundBtn').addEventListener('click', () => {
      s.settings.sound = !s.settings.sound;
      if (s.settings.sound) { sfx.ensure(); sfx.buy(); }
      renderSound();
    });

    $('#packet').addEventListener('click', grabPacket);
    $('#traceBtn').addEventListener('click', evadeTrace);
    $('#welcomeOk').addEventListener('click', () => { $('#welcome').hidden = true; });

    armButton($('#goDarkBtn'), 'Click again to go dark', goDark);
    armButton($('#wipeBtn'), 'Click again to erase all progress', resetEverything);
    armButton($('#adminResetBtn'), 'Click again to erase all progress', resetEverything);

    $('#exportBtn').addEventListener('click', () => {
      const code = encodeSave();
      const ta = $('#saveText');
      ta.value = code;
      const msg = $('#saveMsg');
      msg.classList.remove('bad');
      const done = text => { msg.textContent = text; };
      try {
        navigator.clipboard.writeText(code).then(
          () => done('Save code copied. Keep it somewhere safe.'),
          () => { ta.select(); done('Save code is in the box. Select it and copy it.'); }
        );
      } catch (e) {
        ta.select();
        done('Save code is in the box. Select it and copy it.');
      }
    });

    $('#importBtn').addEventListener('click', () => {
      const msg = $('#saveMsg');
      const code = $('#saveText').value;
      if (!code.trim()) {
        msg.classList.add('bad');
        msg.textContent = 'Paste a save code into the box first.';
        return;
      }
      try {
        const data = decodeSave(code);
        if (!data || typeof data !== 'object' || data.v !== 1) throw new Error('bad');
        s = hydrate(data);
        buffs = [];
        modsKey = '';
        recalc();
        renderTrophies();
        renderBuyAmt();
        renderSound();
        renderFast();
        renderSlow();
        save();
        msg.classList.remove('bad');
        msg.textContent = 'Save loaded.';
        addLog('Save code loaded.', 'good');
      } catch (e) {
        msg.classList.add('bad');
        msg.textContent = 'That save code is not valid. Copy the whole code and try again.';
      }
    });

    document.addEventListener('visibilitychange', () => { if (document.hidden) save(); });
    window.addEventListener('pagehide', save);
  }

  // ---------- Loop ----------
  let last = Date.now();
  let lastSave = Date.now();
  let lastSlow = 0;

  function tick() {
    const now = Date.now();
    let dt = (now - last) / 1000;
    last = now;
    if (!(dt > 0)) dt = 0;
    dt = Math.min(dt, offlineCap()) * admin.speed;

    const before = buffs.length;
    buffs = buffs.filter(b => b.until > now);
    if (buffs.length !== before) recalc();

    const gain = D.totalCps * dt;
    if (gain > 0) { earn(gain); hack(gain); }
    s.stats.playTime += dt;
    if (!document.hidden) rigTyping(dt);

    if (document.hidden || !$('#welcome').hidden) {
      // Pause events while nobody is watching.
      packet.next += dt * 1000;
      packet.until += dt * 1000;
      trace.next += dt * 1000;
      trace.end += dt * 1000;
    } else {
      if (!packet.active && now >= packet.next) spawnPacket();
      if (packet.active && now >= packet.until) hidePacket();
      if (!trace.active && now >= trace.next) startTrace();
      if (trace.active && now >= trace.end) failTrace();
    }

    if (now - lastSlow >= 1000) {
      lastSlow = now;
      checkTrophies();
      if (!document.hidden) renderSlow();
    }
    if (now - lastSave >= 10000) { lastSave = now; save(); }
    if (!document.hidden) renderFast();
  }

  // ---------- Boot ----------
  const BOOT_TEXT = 'HACKER IDLE amber shell v1.0\n(c) a basement near you\n\nType anything, or tap here, to start hacking.\n\n';

  function start(hotData) {
    const fromHot = hotData && hotData.v === 1;
    const data = fromHot ? hotData : load();
    s = hydrate(data);
    recalc();

    buildRigs();
    buildRoute();
    buildPerks();
    buildTrophies();
    buildStats();
    bindEvents();
    selectTab(s.settings.tab || 'rigs');
    renderBuyAmt();
    renderSound();

    termWrite(BOOT_TEXT);
    if (!data) {
      addLog('Type on your keyboard or tap the terminal to earn ₿. Buy rigs to earn while you are away.');
    } else {
      addLog('Session restored.');
    }

    if (!fromHot && data && data.lastSeen) {
      const away = (Date.now() - data.lastSeen) / 1000;
      if (away > 30 && D.baseCps + D.autoCps > 0) {
        const secs = Math.min(away, offlineCap());
        const amt = (D.baseCps + D.autoCps) * secs;
        earn(amt);
        hack(amt);
        $('#welcomeText').textContent =
          `You were away for ${fmtTime(away)}. Your rigs earned ${money(amt)} while you were gone` +
          (away > offlineCap() ? ` (offline earnings stop after ${offlineCap() / 3600} hours).` : '.');
        $('#welcome').hidden = false;
        addLog(`Offline earnings: ${money(amt)}.`, 'good');
      }
    }

    schedulePacket();
    packet.next = Date.now() + rand(40, 80) * 1000;
    scheduleTrace();

    const hot = window.claude && window.claude.hot;
    if (hot && typeof hot.snapshot === 'function') {
      try { hot.snapshot(() => serialize()); } catch (e) { /* ignore */ }
    }

    // Keep the sticky shop panel and toasts clear of the header.
    const syncHeader = () => document.documentElement.style.setProperty('--hdr', $('.topbar').offsetHeight + 'px');
    syncHeader();
    window.addEventListener('resize', syncHeader);

    last = Date.now();
    shownBank = s.bank;
    renderFast();
    renderSlow();
    quiet = false;
    setInterval(tick, 100);
  }

  const hot = window.claude && window.claude.hot;
  if (hot && typeof hot.ready === 'function') hot.ready(start);
  else start((hot && hot.data) || {});
})();
