# Veronika Hniličková: an island portfolio

A portfolio you can walk around in. Visitors play a little bird in a pink beanie hopping
between the art islands of the Seto Inland Sea, drawn in an oil-pastel and gouache style.
Each island holds one part of the portfolio. Visitors walk on land and row a boat on the water.

| Island | Building | Section |
| --- | --- | --- |
| Takamatsu Port | wooden sign | Hello (intro and island guide; where you start) |
| Naoshima | concrete museum in a hill | Latest projects |
| Teshima | white water-drop dome | CV |
| Inujima | old brick smelter | Talks & workshops (lectures, workshops, talks) |
| Shodoshima | olive-park windmill | Leading teams |
| Megijima | the ogre cave | Weird & wonderful (quirky facts) |
| Ogijima | ferry terminal with a letter-covered roof | Say hello (contact) |

### Curiosities and the stamp book

Little things are hidden around the islands. Walk up to one and press <kbd>E</kbd> (or tap it):
it says something, does a little burst of hearts or sparkles, and adds a stamp to the
**stamp book** (the pink *Stamps* button). They include the yellow and red pumpkins, the
heartbeat hut, a friendly oni on Megijima, cats on Ogijima and at the port, a vending machine,
the red lighthouse, a seaside torii and an old olive tree on Shodoshima.

The **bike rental** kiosk on Naoshima rents you a bike: ride about 1.75× faster on land,
take it with you in the boat, and return it at the kiosk. Seagulls fly overhead and a ferry
runs the Takamatsu ↔ Naoshima route.

It's plain HTML, CSS and JavaScript, with no build step and no dependencies.

## Editing the content

Almost everything lives in **`js/content.js`**: your name, tagline, and each place's
title, text and project cards. The `body` of each place is plain HTML. The `curiosities`
list at the bottom holds the little things and what they say, so you can add, move or reword them.

To add a project image, put the file in `assets/` and uncomment the `image` and `imageAlt`
lines on a project card.

## Mobile-first

Phones are the main target. The CSS base styles are for phones, and larger screens are layered on with
`min-width` and `(hover: hover) and (pointer: fine)` media queries.

- **Touch controls:** tap to walk, or **hold** and the bird follows your finger. Tap a building or
  curiosity to walk over and use it. Tap targets have extra padding.
- **Panels** open as a **bottom sheet** on phones (swipe down to close) and as a centered card on wider screens.
- **In-world text** (labels, prompts, speech bubbles) is drawn at a fixed on-screen size, so it stays
  readable however far the map is zoomed out.
- Instructions switch between touch and keyboard wording (`.for-touch` / `.for-keys` in `content.js`).
- The page respects safe areas (notches, home indicator), blocks pull-to-refresh and double-tap zoom on the
  map, and gives a small vibration when you collect a stamp on Android.
- It can be added to the home screen as an app (`manifest.webmanifest` plus icons in `assets/`). Update
  the `name` in the manifest when you put in your own name.

## Running it locally

The JavaScript uses ES modules, so it needs a local server (opening the file directly won't work):

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploying

`.github/workflows/deploy.yml` publishes the site to GitHub Pages on every push to the repository's
default branch. You only need to set this up once: in the repository's **Settings → Pages**, set
**Source** to **GitHub Actions**. The site then lives at `https://<user>.github.io/<repo>/`.

## How it's built

```
index.html        page shell: HUD, Map menu, panel dialog
css/style.css     paper and crayon UI styling
js/content.js     ✏️ your content
js/main.js        game loop, controls, the bird, panels, saved progress
js/world.js       islands, buildings and scenery
js/sketch.js      crayon rendering: pastel grain, wobbly lines, loop scribbles, hatching
assets/           favicon and your images
```

- **Controls:** arrow keys or WASD to move, <kbd>E</kbd> to enter. Click or tap to walk somewhere,
  or tap a building to walk there and go in. The **Map** menu lists every place, so the whole
  portfolio is reachable without playing.
- **Progress:** "x/5 found" is saved in the visitor's browser (localStorage). Finding every place shows a small thank-you.
- **Motion:** with `prefers-reduced-motion`, the bobbing, rocking and camera easing are turned off.
