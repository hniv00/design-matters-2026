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
    body: `<p>The museum. Five case studies, newest first. Each opens the full story in my portfolio.</p>`,
    // Cards link to the full case studies at https://hniv00.github.io/portfolio/
    projects: [
      {
        title: 'Advertisement data analytics platform',
        year: '2025 – 2026',
        tags: ['Design system', 'Research', 'Product strategy'],
        description:
          'Raising an enterprise ad-intelligence platform\u2019s design and strategy maturity: a product diagnostic, structured research and its first design system with DesignOps.',
        link: 'https://hniv00.github.io/portfolio/adintelligence.html',
        image: 'assets/projects/ai-hero.webp',
        imageAlt: 'A laptop in a pool of light showing the analytics platform\u2019s search screen',
        color: '#f5a623',
      },
      {
        title: 'Online eGovernmental portal',
        year: '2024 – 2025',
        tags: ['GovTech', 'Service design', 'RTL design system'],
        description:
          'Architecting the UX for a national justice system going fully digital: multi-role court workflows, service blueprints and a right-to-left design system.',
        link: 'https://hniv00.github.io/portfolio/egov-justice.html',
        image: 'assets/projects/gov-hero.webp',
        imageAlt: 'Two people in silhouette discussing a service blueprint on a large screen',
        color: '#f2552c',
      },
      {
        title: 'Nordic banking system',
        year: '2022 – 2024',
        tags: ['Fintech', 'A/B testing', 'Accessibility'],
        description:
          'Building the design function and culture for a Scandinavian challenger bank: unified banking portals, a self-service mortgage center and the bank\u2019s first A/B tests.',
        link: 'https://hniv00.github.io/portfolio/nordic-bank.html',
        image: 'assets/projects/nb-hero.webp',
        imageAlt: 'A phone showing the bank\u2019s mobile site, lying on a round peach table',
        color: '#86c9ee',
      },
      {
        title: 'Mingly: inclusive dating app',
        year: '2023',
        tags: ['Accessibility', 'Rebrand', 'Non-profit'],
        description:
          'A research-led rebrand and redesign of a dating platform built for people with disabilities and open to everyone, accessible by default.',
        link: 'https://hniv00.github.io/portfolio/mingly.html',
        image: 'assets/projects/mg-hero.webp',
        imageAlt: 'A hand holding a phone with the Mingly app against a blue perforated wall',
        color: '#a5a0f2',
      },
      {
        title: 'Booxy reading app',
        year: '2020 – 2021',
        tags: ['Mobile', 'UX research', 'Redesign'],
        description:
          'Turning a cluttered, slow book-tracking app with 10k+ users into a clean, personal experience, from multi-source research to a tested prototype.',
        link: 'https://hniv00.github.io/portfolio/booxy.html',
        image: 'assets/projects/bx-hero.webp',
        imageAlt: 'A spread of redesigned Booxy app screens in red and white',
        color: '#ef5a98',
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
      <p>I'm a senior product designer and experience team lead. I bring design foundations and
         evidence-based practice to complex products, from enterprise analytics and national eGov
         services to banking and accessible consumer apps.</p>
      <h3>Experience</h3>
      <ol class="timeline">
        <li>
          <span class="when">20XX – now</span>
          <strong>Senior Product Designer &amp; Experience Team Lead</strong>
          [Company] · leading UX on client programmes, from discovery to design systems
          <ul>
            <li><strong>Ad-intelligence analytics platform</strong> (Oct 2025 – Jul 2026): product diagnostic,
                structured research, and the platform's first design system and DesignOps practice</li>
            <li><strong>National eGov justice portal</strong> (Oct 2024 – Sep 2025): UX architecture for
                multi-role digital courts in a multi-vendor programme, with a right-to-left design system</li>
          </ul>
        </li>
        <li>
          <span class="when">2022 – 2024</span>
          <strong>Web UX Designer, Nordic challenger bank</strong>
          The bank's first dedicated web UX designer, across three Nordic markets
          <ul>
            <li>Built its first web design system, later cloned to launch an acquired brand</li>
            <li>Ran its first A/B tests and made test-before-ship the norm</li>
            <li>Unified two portals into one online bank and launched self-service mortgage onboarding</li>
            <li>Turned an accessibility audit into a standing backlog and designed a 60+ sub-brand</li>
          </ul>
        </li>
      </ol>
      <h3>Education</h3>
      <ol class="timeline">
        <li>
          <span class="when">20XX – 2023</span>
          <strong>[Degree], [University]</strong>
          Thesis projects:
          <ul>
            <li><strong>Mingly</strong> (2023): research-led rebrand and accessible redesign of a dating platform for people with disabilities</li>
            <li><strong>Booxy</strong> (2020 – 2021): research-led redesign of a Czech book-tracking app with 10k+ users</li>
          </ul>
        </li>
      </ol>
      <h3>Toolbox</h3>
      <ul class="pills">
        <li>Product strategy</li><li>UX research</li><li>Design systems</li><li>DesignOps</li>
        <li>Service design</li><li>Accessibility (WCAG 2.2)</li><li>A/B testing</li><li>Usability testing</li>
        <li>RTL design</li><li>Stakeholder alignment</li>
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
      <p>Shodoshima's olive groves take patience, good soil and plenty of sun. Teams do too.
         Here's what I bring to the people I work with, and the evidence behind it.</p>
      <h3>How I lead</h3>
      <ol class="facts">
        <li><strong>Evidence over assumptions.</strong> I replace opinion-driven decisions with research:
            interviews, surveys and analytics that feed the roadmap.</li>
        <li><strong>Test before we ship.</strong> Prototype tests, concept tests and A/B tests come before code,
            so we build the right thing first time.</li>
        <li><strong>Speak the business's language.</strong> I translate UX insight into why it matters,
            not just what the problem is, and argue from data rather than taste.</li>
        <li><strong>Make the logic visible.</strong> Shared research folders, service blueprints and
            system-and-journey maps help everyone, across teams and vendors, see the same picture.</li>
        <li><strong>Accessibility from day one.</strong> It isn't a layer added at the end; it's a mindset
            that makes the product better for everyone.</li>
        <li><strong>Foundations that outlast me.</strong> Design systems and DesignOps workflows that
            engineering keeps using long after handover.</li>
      </ol>
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
