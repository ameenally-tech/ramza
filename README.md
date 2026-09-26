# Ramza — رَمْزًا

An Islamic guessing game. Hold the phone sideways against your forehead, your
friends give the clues, and guess as many as you can before the time runs out.
Tilt **down** when you get it, tilt **up** to pass.

**Play it here:** https://ameenally-tech.github.io/ramza/

The name is from Āl ʿImrān 3:41 — the sign given to Zakariyya (AS) was that he
would not speak to people for three days *illā ramzā*, except by gesture.

## What's in here

| File | What it is |
|---|---|
| `index.html` | The web version of the game |
| `cards.json` | Every deck and card — the app reads this |
| `manifest.json` | A tiny version check the apps read on launch |
| `site.webmanifest`, `icon-*.png` | Home-screen icon and app metadata |

## Adding cards

`cards.json` holds the decks. Each card has three parts:

```json
{
  "word": "Cave of Hira",
  "clues": ["Mountain of Light", "First revelation", "Seclusion"],
  "info": "The cave on Jabal an-Nur where the Prophet ﷺ used to retreat, and where Jibril (AS) brought the first revelation."
}
```

`clues` are for whoever is giving the hints; `info` is what a player reads
afterwards about a card they missed.

When cards change, bump `version` in **both** `cards.json` and `manifest.json`,
set `cardCount` and a short `note` in `manifest.json`, and commit. Every phone
offers the update on its next launch.
