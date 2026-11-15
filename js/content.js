// ─────────────────────────────────────────────────────────────
//  ✏️  THIS IS THE FILE TO EDIT.
//  Everything people read on the site lives here.
//
//  Each "place" is one section of the portfolio, on its own island. Fields:
//    id       unique, short, no spaces (used to remember visits)
//    island   which island it's on (shown in the Map menu and panel)
//    kind     what gets drawn:
//               sign      wooden welcome sign
//               museum    low concrete museum in a hill
//               drop      flat white water-drop dome
//               chimney   brick smelter with chimneys
//               windmill  white olive-park windmill
//               cave      the ogre cave
//               terminal  ferry terminal with a letter-covered roof
//    x, y     where it stands (world is 2000 × 1620; y is the building's front edge).
//             Keep it on the same island if you nudge it.
//    color    accent colour for the panel
//    title    shown above the building and as the panel heading
//    body     HTML shown when you go inside. Handy building blocks:
//               <ol class="timeline"> … </ol>   CV-style timeline
//               <ul class="events"> … </ul>     talks / workshops list
//               <ol class="facts"> … </ol>      big numbered fun facts
//               <ul class="links"> … </ul>      chunky link buttons
//    projects (optional) list of project cards, see Naoshima below
//
//  The first place in the list is where the visitor starts, and the list
//  order is the order of the Map menu.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: 'Veronika Hniličková',
  shortName: 'Veronika', // shown on small phones, where the full name doesn't fit
  tagline: 'Senior Product Designer & Experience Team Lead',
};

export const places = [
  {
    id: 'welcome',
    island: 'Takamatsu Port',
    kind: 'sign',
    x: 1000,
    y: 1385,
    color: '#f5a623',
    title: 'Hello!',
    body: `
      <p>Hi, I'm <strong>Veronika</strong>, a senior product designer and experience team lead.
         Welcome to my little archipelago.</p>
      <p>This portfolio is a trip around the art islands of the Seto Inland Sea.
         Every island holds a different part of my story:</p>
      <ul class="guide">
        <li><strong>Naoshima</strong> · latest projects</li>
        <li><strong>Teshima</strong> · CV</li>
        <li><strong>Inujima</strong> · talks &amp; workshops</li>
        <li><strong>Shodoshima</strong> · leading teams</li>
        <li><strong>Megijima</strong> · weird &amp; wonderful</li>
        <li><strong>Ogijima</strong> · say hello</li>
      </ul>
      <ul class="controls for-touch">
        <li><strong>Tap</strong> or <strong>hold</strong> anywhere to walk (and row!)</li>
        <li><strong>Tap</strong> buildings to go in, and curious things to poke them</li>
      </ul>
      <ul class="controls for-keys">
        <li><kbd>←</kbd><kbd>↑</kbd><kbd>↓</kbd><kbd>→</kbd> or <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> to walk (and row!)</li>
        <li><kbd>E</kbd> to go inside or poke things, or just click</li>
      </ul>
      <p>Keep an eye out for little curiosities along the way: poke them to fill your
         <strong>stamp book</strong>. And if your wings get tired, there's a bike rental on Naoshima.</p>
      <p>In a hurry? The <strong>Map</strong> button up top takes you straight to any island.</p>`,
  },
  {
    id: 'projects',
    island: 'Naoshima',
    kind: 'museum',
    x: 470,
    y: 900,
    color: '#f7d046',
    title: 'Latest projects',
    body: `<p>The museum. A few recent things I've designed and led. Click through for the full stories.</p>`,
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
        tags: ['Design system'],
        description: 'One or two lines on the problem and what you did about it.',
        link: '#',
        color: '#a5a0f2',
      },
      {
        title: 'Project three',
        year: 2024,
        tags: ['Service design', 'Workshops'],
        description: 'One or two lines on the problem and what you did about it.',
        link: '#',
        color: '#86c9ee',
      },
    ],
  },
  {
    id: 'cv',
    island: 'Teshima',
    kind: 'drop',
    x: 1030,
    y: 520,
    color: '#86c9ee',
    title: 'CV',
    body: `
      <p>Like Teshima's rice terraces: one step at a time, each a little higher than the last.</p>
      <h3>Experience</h3>
      <ol class="timeline">
        <li><span class="when">20XX – now</span><strong>Senior Product Designer &amp; Experience Team Lead</strong>Company · a line on what you lead and own</li>
        <li><span class="when">20XX – 20XX</span><strong>Product Designer</strong>Company · a line on what you did</li>
        <li><span class="when">20XX – 20XX</span><strong>Role</strong>Company · a line on what you did</li>
      </ol>
      <h3>Education</h3>
      <ol class="timeline">
        <li><span class="when">20XX – 20XX</span><strong>Degree</strong>University</li>
      </ol>
      <h3>Toolbox</h3>
      <ul class="pills">
        <li>Product strategy</li><li>UX research</li><li>Design systems</li><li>Facilitation</li><li>Prototyping</li><li>Team leadership</li>
      </ul>
      <ul class="links">
        <li><a href="#" target="_blank" rel="noopener">Download CV (PDF)</a></li>
      </ul>`,
  },
  {
    id: 'talks',
    island: 'Inujima',
    kind: 'chimney',
    x: 1585,
    y: 275,
    color: '#f2552c',
    title: 'Talks & workshops',
    body: `
      <p>An old copper smelter turned art space, and the place where I share what I've learned:
         university lectures, workshops and talks.</p>
      <ul class="events">
        <li><span class="tag">Lecture</span><strong>Lecture title</strong><small>University · 2026</small></li>
        <li><span class="tag">Workshop</span><strong>Workshop title</strong><small>Event or company · 2025</small></li>
        <li><span class="tag">Talk</span><strong>Talk title</strong><small>Conference · 2025</small></li>
      </ul>
      <p>Want me to speak or run a workshop with your team? Sail over to <strong>Ogijima</strong> and say hello.</p>`,
  },
  {
    id: 'teams',
    island: 'Shodoshima',
    kind: 'windmill',
    x: 1620,
    y: 820,
    color: '#62b86e',
    title: 'Leading teams',
    body: `
      <p>Shodoshima's olive groves take patience, good soil and plenty of sun. Teams do too.</p>
      <h3>How I lead</h3>
      <ul>
        <li><strong>A principle</strong>: a sentence on what it looks like in practice</li>
        <li><strong>Another principle</strong>: a sentence on what it looks like in practice</li>
        <li><strong>One more</strong>: a sentence on what it looks like in practice</li>
      </ul>
      <h3>What my team says</h3>
      <blockquote>“A short quote from someone you've worked with.”<cite>Name, role</cite></blockquote>`,
  },
  {
    id: 'quirky',
    island: 'Megijima',
    kind: 'cave',
    x: 870,
    y: 1088,
    color: '#a5a0f2',
    title: 'Weird & wonderful',
    body: `
      <p>Megijima is said to be the island of ogres from the tale of Momotarō. Its cave is where
         the oddities live. Things you didn't ask to know about me:</p>
      <ol class="facts">
        <li>Something delightfully strange about you.</li>
        <li>A hobby nobody expects.</li>
        <li>An unpopular opinion you'll defend forever.</li>
      </ol>`,
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
      <p>Ferries leave every hour, and so do my replies. Want to work together, invite me to give a talk,
         or just say hi?</p>
      <ul class="links">
        <li><a href="mailto:you@example.com">Email</a></li>
        <li><a href="https://www.linkedin.com/" target="_blank" rel="noopener">LinkedIn</a></li>
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
    x: 962,
    y: 1098,
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
    x: 1810,
    y: 880,
    name: 'Old olive tree',
    lines: ['Shodoshima is famous for its olives. This tree must be ancient.', 'You find a heart-shaped leaf. Lucky!'],
  },
];
