# Hacker Idle

A browser idle/clicker game in a retro amber terminal style. Type on your keyboard (or tap the terminal) to earn ₿, buy rigs that earn for you while you're idle, and break into a series of joke targets, from your neighbor's Wi-Fi all the way to The Game Developer.

All of the hacking is fictional and played for laughs.

## Play

Open `index.html` in any modern browser. It needs no build step and no server.

To host it, push the repo to GitHub and turn on **Settings → Pages** for the default branch.

## How it works

- **Keystrokes:** every key you press, and every tap on the terminal or the HACK button, earns ₿. The more each keystroke earns, the more code it types into the terminal.
- **Rigs:** 18 generators, from Script Kiddie to The Developer's Laptop. Each one costs 15% more than the last. Your rigs type into the terminal every second (faster as your income grows) and post chatter lines about what they're up to.
- **Mods:** one-time upgrades: 10 tiers per rig that each double its output, keyboard upgrades, all-income boosts, data packet and trace upgrades, and synergy mods that make one rig stronger for every copy of another rig you own.
- **Targets:** 18 of them. Your income also chips away at the current target's firewall. Breaching a target pays out loot and adds a permanent +10% income bonus for the rest of the run.
- **Data packets:** a glowing packet shows up every minute or two. Grab it for a cash bonus, a ×7 income overclock or a ×10 keystroke frenzy.
- **Traces:** once you're earning, a sysadmin sometimes starts tracing you. Press **Purge logs** before the timer runs out or you lose 5% of your wallet.
- **Prestige (go dark):** reset your run for ghost tokens based on your lifetime earnings. Every token gives +10% to everything, forever. Spend tokens on 18 permanent ghost perks, such as starting cash, auto-clickers, rig discounts, triple loot, the Skeleton Key and Root Kit (all income ×3). Spending tokens never lowers their bonus.
- **Trophies:** 34 achievements, each worth +2% income.
- **Admin menu:** press the red **Admin** button in the header or the backtick key (`` ` ``) for cheats: add money, tokens and rigs, install every mod, unlock perks and trophies, breach targets, spawn packets and traces, skip time, and change game speed (up to ×100) or income (up to ×1M). The speed and income multipliers reset when you reload.
- **Saving:** the game autosaves to your browser every 10 seconds and pays out offline earnings for up to 8 hours. Under **System** you can export a save code and load it on another device. To start over from scratch, press **Reset everything** in the System tab or the Admin menu (click twice to confirm).

## Files

| File | What it holds |
| --- | --- |
| `index.html` | Page markup |
| `style.css` | Amber CRT terminal styling |
| `game.js` | Game data, economy, events, saving and rendering |
