# Jose Carmona Vendoiro — Cybersecurity Portfolio

> Premium personal portfolio built with React + Vite + TypeScript

[![Live Demo](https://img.shields.io/badge/Live-Portfolio-5EFFD8?style=flat&logo=github)](https://pep-vnd.github.io/portfolio/)

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── CustomCursor/       — Custom dot + halo cursor
│   ├── Footer/             — Minimal footer
│   ├── Navbar/             — Sticky navbar with scroll spy
│   ├── NetworkBackground/  — Canvas particle network
│   ├── ProjectCard/        — Premium project card (tilt, spotlight)
│   └── Terminal/           — Interactive animated terminal
├── data/
│   ├── certifications.ts   — 🔧 Edit certifications here
│   ├── htb.ts              — 🔧 Add HTB machines here
│   ├── projects.ts         — 🔧 Edit security projects here
│   └── skills.ts           — 🔧 Edit skill clusters here
├── hooks/
│   ├── useInView.ts        — Intersection Observer scroll trigger
│   ├── useMousePosition.ts — RAF-throttled mouse tracking
│   └── useScrollSpy.ts     — Active nav section tracking
├── sections/
│   ├── About/              — Bio with numbered pillars
│   ├── Certifications/     — Cert cards with logos
│   ├── Contact/            — Formspree-ready contact form
│   ├── GitHub/             — Repository showcase
│   ├── Hero/               — Full-viewport split layout + terminal
│   ├── HTB/                — Hack The Box operations panel
│   ├── Journey/            — Current timeline
│   ├── Projects/           — Featured security work
│   └── Skills/             — Visual skill clusters
└── styles/
    ├── globals.css         — Global styles and utilities
    └── tokens.css          — Design system tokens
```

---

## Editing Content

### Add a new Security Project

Open `src/data/projects.ts` and add an entry to the `projects` array:

```typescript
{
  id: 'unique-id',
  title: 'Project Title',
  category: 'Audit Type',
  description: 'Short description for the card.',
  longDescription: 'Full description.',
  tags: ['Tag1', 'Tag2'],
  highlights: [
    'Key highlight 1',
    'Key highlight 2',
  ],
  githubUrl: 'https://github.com/pep-vnd/...',
  accentColor: '#5EFFD8',  // cyan | '#3B82F6' blue | '#F97316' orange
  icon: 'shield',          // shield | network | database | lock | alert | activity
  metrics: [
    { label: 'Score', value: '8/10' },
  ],
},
```

### Add a Certification

Open `src/data/certifications.ts`:

```typescript
{
  id: 'unique-id',
  title: 'Certificate Name',
  issuer: 'Issuer',
  issuerShort: 'Short',
  issued: 'Month Year',
  credentialUrl: 'https://www.credly.com/...', // leave undefined if not available
  color: '#5EFFD8',
  icon: 'google', // 'google' | 'ibm' | 'generic'
},
```

### Add an HTB Machine

Open `src/data/htb.ts` and add to the `htbMachines` array:

```typescript
{
  id: 'machine-name',
  name: 'MachineName',
  difficulty: 'Easy', // Easy | Medium | Hard | Insane
  os: 'Linux', // Linux | Windows | Other
  category: 'Web', // Web | Linux | Windows | Active Directory | Network | ...
  skills: ['SQL Injection', 'Privilege Escalation'],
  date: '2026-09-01',
  writeupUrl: 'https://...', // optional
  status: 'Owned', // Owned | Completed | In Progress
},
```

### Set Up the Contact Form

1. Create a free account at [Formspree.io](https://formspree.io)
2. Create a new form and copy your Form ID
3. Open `src/sections/Contact/Contact.tsx`
4. Replace `'YOUR_FORM_ID'` with your actual Formspree Form ID

### Add Profile Photo

1. Name your photo `profile.jpg`
2. Copy it to `src/assets/profile.jpg`
3. Open `src/sections/Hero/Hero.tsx`
4. Find the `profilePlaceholder` div and replace it with:

```tsx
<img src={profileImg} alt="Jose Carmona Vendoiro" />
```

5. At the top of the file, add:
```tsx
import profileImg from '../../assets/profile.jpg';
```

---

## Deployment

### GitHub Pages

1. In `vite.config.ts`, set `base` to your repository path:
   ```typescript
   base: '/your-repo-name/',
   ```

2. Build the project:
   ```bash
   npm run build
   ```

3. Push the `dist/` folder to your `gh-pages` branch, or use the [gh-pages](https://www.npmjs.com/package/gh-pages) package:
   ```bash
   npx gh-pages -d dist
   ```

4. Enable GitHub Pages in repository Settings → Pages → Source: `gh-pages` branch

### Vercel

1. Connect your repository to [Vercel](https://vercel.com)
2. Set framework to **Vite**
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy!

---

## Design System

| Token | Value |
|---|---|
| Background primary | `#050c1a` |
| Background card | `rgba(8, 18, 40, 0.80)` |
| Accent cyan | `#5EFFD8` |
| Font sans | Inter |
| Font mono | JetBrains Mono |

---

## License

All rights reserved © Jose Carmona Vendoiro
