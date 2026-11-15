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
//    x, y     where it stands (world is 2000 × 1500; y is the building's front edge).
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
      <ul class="controls">
        <li><kbd>←</kbd><kbd>↑</kbd><kbd>↓</kbd><kbd>→</kbd> or <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> to walk (and row!)</li>
        <li><kbd>E</kbd> to go inside</li>
        <li>On a phone? Tap where you want to go.</li>
      </ul>
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
