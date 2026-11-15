# Design Matters 2026: an island portfolio

A portfolio you can walk around in. Visitors play a little bird in a pink beanie hopping
between the art islands of the Seto Inland Sea, drawn in an oil-pastel and gouache style.
Each island holds one part of the portfolio. Visitors walk on land and row a boat on the water.

| Island | Building | Section |
| --- | --- | --- |
| Takamatsu Port | wooden sign | Welcome (where you start) |
| Naoshima | concrete museum in a hill, plus the dotted pumpkin | Projects |
| Teshima | white water-drop dome | About me |
| Inujima | old brick smelter | The Lab (experiments) |
| Ogijima | ferry terminal with a letter-covered roof | Say hello (contact) |

Shodoshima (olive groves and a torii) and Megijima are scenery for now.

It's plain HTML, CSS and JavaScript, with no build step and no dependencies.

## Editing the content

Almost everything lives in **`js/content.js`**: your name, tagline, and each place's
title, text and project cards. The `body` of each place is plain HTML.

To add a project image, put the file in `assets/` and uncomment the `image` and `imageAlt`
lines on a project card.

## Running it locally

The JavaScript uses ES modules, so it needs a local server (opening the file directly won't work):

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploying

`.github/workflows/deploy.yml` publishes the site to GitHub Pages on every push to `main`.
You only need to set this up once: in the repository's **Settings → Pages**, set **Source** to **GitHub Actions**.

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
