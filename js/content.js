// ─────────────────────────────────────────────────────────────
//  ✏️  THIS IS THE FILE TO EDIT.
//  Everything people read on the site lives here.
//
//  Each "place" is a spot in the world. Fields:
//    id       unique, short, no spaces (used to remember visits)
//    island   which island it's on (shown in the Map menu)
//    kind     what gets drawn:
//               sign      wooden welcome sign
//               museum    low concrete museum in a hill
//               drop      flat white water-drop dome
//               chimney   brick smelter with chimneys
//               terminal  ferry terminal with a letter-covered roof
//    x, y     where it stands (world is 2000 × 1620; y is the building's front edge).
//             Keep it on the same island if you nudge it.
//    color    accent colour for the panel
//    title    shown above the building and as the panel heading
//    body     HTML shown when you go inside
//    projects (optional) list of project cards, see Naoshima below
//
//  The first place in the list is where the visitor starts.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: 'Your Name',
  tagline: 'Designer & maker of small, bright things',
};

export const places = [
  {
    id: 'welcome',
    island: 'Takamatsu Port',
    kind: 'sign',
    x: 1000,
    y: 1385,
    color: '#f5a623',
    title: 'Welcome!',
    body: `
      <p>Hi, I'm <strong>Your Name</strong>. Welcome to my little archipelago.</p>
      <p>This portfolio is a trip around the art islands of the Seto Inland Sea. Hop between
         islands to see my work, get to know me, or send a hello from the ferry terminal.</p>
      <ul class="controls for-touch">
        <li><strong>Tap</strong> or <strong>hold</strong> anywhere to walk (and row!)</li>
        <li><strong>Tap</strong> buildings to go in, and curious things to poke them</li>
      </ul>
      <ul class="controls for-keys">
        <li><kbd>←</kbd><kbd>↑</kbd><kbd>↓</kbd><kbd>→</kbd> or <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> to walk (and row!)</li>
        <li><kbd>E</kbd> to go inside or poke things, or just click</li>
      </ul>
      <p>Keep an eye out for little curiosities along the way. Poke them to fill your
         <strong>stamp book</strong>. And if your wings get tired, there's a bike rental on Naoshima.</p>
      <p>In a hurry? The <strong>Map</strong> button up top takes you anywhere.</p>`,
  },
  {
    id: 'projects',
    island: 'Naoshima',
    kind: 'museum',
    x: 470,
    y: 900,
    color: '#f7d046',
    title: 'Projects',
    body: `<p>The museum. Some things I've made; click through for the full stories.</p>`,
    projects: [
      {
        title: 'Project one',
        year: 2026,
        tags: ['Product design', 'Research'],
        description: 'One or two lines on the problem and what you did about it.',
        link: '#',
        color: '#ef5a98',
        // image: 'assets/project-one.jpg',
        // imageAlt: 'Describe the image',
      },
      {
        title: 'Project two',
        year: 2025,
        tags: ['Branding'],
        description: 'One or two lines on the problem and what you did about it.',
        link: '#',
        color: '#a5a0f2',
      },
      {
        title: 'Project three',
        year: 2024,
        tags: ['Illustration', 'Motion'],
        description: 'One or two lines on the problem and what you did about it.',
        link: '#',
        color: '#86c9ee',
      },
    ],
  },
  {
    id: 'about',
    island: 'Teshima',
    kind: 'drop',
    x: 1030,
    y: 520,
    color: '#86c9ee',
    title: 'About me',
    body: `
      <p>A few sentences about who you are, what you love making, and what you're looking for next.</p>
      <p>Maybe a fun fact. Maybe your favourite island.</p>
      <h3>Things I'm good at</h3>
      <ul>
        <li>Skill one</li>
        <li>Skill two</li>
        <li>Skill three</li>
      </ul>`,
  },
  {
    id: 'lab',
    island: 'Inujima',
    kind: 'chimney',
    x: 1585,
    y: 275,
    color: '#f2552c',
    title: 'The Lab',
    body: `
      <p>An old smelter turned workshop. This is where experiments live: side projects, sketches,
         half-finished ideas and things I'm learning.</p>
      <ul>
        <li><strong>Experiment</strong>: a sentence about it</li>
        <li><strong>Another one</strong>: a sentence about it</li>
      </ul>`,
  },
  {
    id: 'contact',
    island: 'Ogijima',
    kind: 'terminal',
    x: 1200,
    y: 1065,
    color: '#ef5a98',
    title: 'Say hello',
    body: `
      <p>Ferries leave every hour, and so do my replies. Want to work together, or just say hi?</p>
      <ul class="links">
        <li><a href="mailto:you@example.com">Email</a></li>
        <li><a href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn</a></li>
        <li><a href="https://dribbble.com/" target="_blank" rel="noopener">Dribbble</a></li>
        <li><a href="https://github.com/" target="_blank" rel="noopener">GitHub</a></li>
      </ul>`,
  },
];

// ─────────────────────────────────────────────────────────────
//  Curiosities: little things hidden around the islands.
//  Walking up to one and pressing E (or tapping it) shows a line of text
//  and adds its stamp to the visitor's stamp book.
//
//    kind   pumpkin | redPumpkin | bikes | vending | cat | heartHut | oni |
//           bigOlive | torii | lighthouse
//    lines  what it says; each poke shows the next line
//    burst  'hearts' or 'sparkles' when poked
//    color  (cats only) fur colour
//
//  The bike kiosk is special: poking it rents or returns a bike.
// ─────────────────────────────────────────────────────────────

export const curiosities = [
  {
    id: 'bikes',
    kind: 'bikes',
    island: 'Naoshima',
    x: 690,
    y: 960,
    name: 'Bike rental',
    action: 'bike',
    rentText: 'Here you go! Ride anywhere, even onto the ferry. Bring it back when you’re done.',
    returnText: 'Thanks for bringing it back! Come ride again soon.',
  },
  {
    id: 'yellow-pumpkin',
    kind: 'pumpkin',
    island: 'Naoshima',
    x: 575,
    y: 1040,
    name: 'Yellow pumpkin',
    lines: ['A giant dotted pumpkin, sunbathing at the end of the pier.', 'You try to count the dots. You lose count at 43.'],
  },
  {
    id: 'red-pumpkin',
    kind: 'redPumpkin',
    island: 'Naoshima',
    x: 290,
    y: 965,
    name: 'Red pumpkin',
    lines: ['A red pumpkin full of holes. You peek inside and it echoes: hellooo!', 'Still echoing. Hellooo...'],
  },
  {
    id: 'heart-hut',
    kind: 'heartHut',
    island: 'Teshima',
    x: 1240,
    y: 570,
    name: 'Heartbeat hut',
    burst: 'hearts',
    lines: ['Ba-dum. Ba-dum. Thousands of recorded heartbeats echo inside.', 'You could leave yours here too, someday.'],
  },
  {
    id: 'oni',
    kind: 'oni',
    island: 'Megijima',
    x: 885,
    y: 1105,
    name: 'Friendly oni',
    lines: ['Megijima is said to be the ogre island from the tale of Momotarō.', 'This ogre just waves. You wave back.'],
  },
  {
    id: 'ogi-cat',
    kind: 'cat',
    island: 'Ogijima',
    x: 1300,
    y: 1080,
    color: '#f5a623',
    name: 'Island cat',
    burst: 'hearts',
    lines: ['Mrrp. The cat allows exactly one pat.', 'The cat is asleep now. Shh.'],
  },
  {
    id: 'port-cat',
    kind: 'cat',
    island: 'Takamatsu Port',
    x: 770,
    y: 1430,
    color: '#8b8f99',
    name: 'Port cat',
    burst: 'hearts',
    lines: ['A grey cat waiting for the fishing boats. Mrow.', 'It blinks at you slowly. That means you’re friends now.'],
  },
  {
    id: 'vending',
    kind: 'vending',
    island: 'Takamatsu Port',
    x: 880,
    y: 1395,
    name: 'Vending machine',
    lines: [
      'Ka-chunk! A cold can of peach soda.',
      'Ka-chunk! Hot milk tea, in a can, somehow.',
      'Ka-chunk! Mugicha. Very refreshing.',
    ],
  },
  {
    id: 'lighthouse',
    kind: 'lighthouse',
    island: 'Takamatsu Port',
    x: 1130,
    y: 1352,
    name: 'Red lighthouse',
    lines: ['The little red lighthouse. Its glass glows like a lantern at dusk.'],
  },
  {
    id: 'torii',
    kind: 'torii',
    island: 'Shodoshima',
    x: 1530,
    y: 990,
    name: 'Seaside torii',
    lines: ['You bow at the torii. A breeze rustles the olive groves.'],
  },
  {
    id: 'old-olive',
    kind: 'bigOlive',
    island: 'Shodoshima',
    x: 1720,
    y: 760,
    name: 'Old olive tree',
    lines: ['Shodoshima is famous for its olives. This tree must be ancient.', 'You find a heart-shaped leaf. Lucky!'],
  },
];
