# VisitJhar — Smart Digital Platform for Eco & Cultural Tourism in Jharkhand

VisitJhar is a modern, responsive web application designed to showcase, preserve, and promote the rich natural, cultural, and spiritual heritage of Jharkhand, India. Built with React, TypeScript, Vite, and Tailwind CSS, the platform provides travelers, researchers, and local communities with authentic tourism intelligence across all 24 districts of the state.

---

## 1. Problem Statement

Jharkhand is endowed with diverse ecological landscapes—dense forests, waterfalls, wildlife sanctuaries, and sacred hill ranges—as well as ancient architectural heritage, megalithic sites, and vibrant tribal arts. However, digital representation of these destinations has traditionally suffered from:

- **Fragmented and Inaccurate Information:** Travelers struggle to find reliable travel details, authentic imagery, and regional guidance.
- **Image Misrepresentation:** Generic or mismatched stock imagery frequently misidentifies sacred and scenic locations.
- **Under-Representation of Emerging Sites:** Mainstream tourism platforms often focus narrowly on a handful of urban spots, leaving rural, tribal, and eco-tourism circuits underexplored.

---

## 2. Project Objectives

- **Authentic Tourism Intelligence:** Curate verifiable data, coordinates, travel timings, budgets, and cultural context for 118 destinations spanning all 24 districts.
- **Visual Authenticity & Diversity:** Ensure every single destination displays authentic, location-specific photography with proper licensing and attribution.
- **Smart Itinerary & Circuit Planning:** Assist visitors in discovering multi-day travel circuits aligned with official Jharkhand Tourism policy pillars.
- **Responsible Travel Advocacy:** Promote ecological stewardship, tribal artisan empowerment, and cultural preservation.

---

## 3. Implemented Features

- **Interactive Destination Discovery (Explore Page):**
  - Search, filter by tourism pillar (Nature & Waterfalls, Spiritual & Religious, Heritage & Archaeology, Wildlife & Protected Areas, etc.), and filter by district.
  - Category badges, difficulty tags, duration categories, and budget indicators.
- **Destination Detail Pages:**
  - High-resolution hero imagery with photographer attribution and license tags.
  - Key travel facts: Best time to visit, recommended duration, difficulty, budget tier.
  - Historical and cultural significance narratives.
  - Activities, nearby attractions, and responsible tourism guidelines.
  - In-memory community reviews and user ratings.
- **Interactive Tourism Map:**
  - Dynamic Leaflet-based interactive map plotting coordinates across Jharkhand's districts with customized pillar-themed markers and destination popups.
- **Smart Itinerary Planner:**
  - Custom multi-day trip generator based on starting location, travel duration, group type, budget preference, and selected interests.
- **Living Culture & Heritage Exploration:**
  - Curated showcases of traditional arts (Sohrai, Khovar, Pyatkar), tribal crafts, performing arts (Chhau dance), and cultural heritage.
- **Annual Festivals & Tourism Events:**
  - Calendar of cultural celebrations (Sarhul, Karma, Tusu Parab, Sohrai, Basukinath Shravani Mela).
- **Personalized Travel Hub:**
  - Favorites/saved places saved to local browser storage (`localStorage`).
  - Interactive traveler profile and preferences dashboard.
- **Verified Destination Image Manifest:**
  - Comprehensive metadata registry (`src/data/imageManifest.ts`) auditing 100% of destination assets, licenses, sources, and verification statuses.

---

## 4. Technology Stack

- **Framework:** React 18 (Functional Components, Hooks)
- **Language:** TypeScript 5
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3 with PostCSS and Autoprefixer
- **Routing:** React Router DOM 6 (Client-side SPA)
- **Mapping:** Leaflet & React-Leaflet
- **Icons:** Lucide React
- **Hosting / Deployment:** Vercel (configured with `vercel.json` SPA rewrite rules)

---

## 5. Project Structure

```
VisitJhar/
├── public/                     # Static assets served at root
│   ├── destinations/           # 118 verified destination photographs
│   ├── placeholders/           # Category SVG fallback placeholders
│   ├── hero-poster.jpg         # Hero video fallback poster
│   └── jharkhand-hero.mp4      # Cinematic Jharkhand hero video
├── src/
│   ├── components/             # Reusable UI components (Navbar, Footer, DestinationCard, DestinationImage)
│   ├── context/                # React Contexts (AuthContext, FavoritesContext)
│   ├── data/                   # Data sources & registries
│   │   ├── destinationsData.ts # 118 destination records with full tourism metadata
│   │   ├── imageManifest.ts    # Central verified image audit manifest
│   │   ├── mockData.ts         # Districts, circuits, categories, events, and reviews
│   │   └── sampleData.ts       # Sample reference data
│   ├── lib/                    # Utilities (imageUtils, itineraryPlanner, utils)
│   ├── pages/                  # Route page components (HomePage, ExplorePage, DestinationDetailPage, MapPage, etc.)
│   ├── types/                  # TypeScript interface definitions (Destination, District, Circuit, etc.)
│   ├── App.tsx                 # Application root & router configuration
│   ├── index.css               # Global styles & Tailwind directives
│   └── main.tsx                # React DOM entry point
├── docs/                       # Project research, parity matrices, and migration plans
├── .gitignore                  # Git exclusion rules
├── index.html                  # HTML entry point with Google Fonts & Leaflet CSS
├── package.json                # Project dependencies and npm scripts
├── tailwind.config.js          # Tailwind design tokens & font configuration
├── tsconfig.json               # TypeScript compiler configuration
├── vercel.json                 # Vercel SPA routing fallback configuration
└── vite.config.ts              # Vite bundler configuration
```

---

## 6. Prerequisites

- **Node.js:** v18.0.0 or higher (Node.js 20+ recommended)
- **Package Manager:** npm (v9 or higher)
- Modern web browser (Chrome, Firefox, Safari, Edge)

---

## 7. Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/akrama79/visitjhar.git
   cd visitjhar
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup (Optional):**
   ```bash
   cp .env.example .env.local
   ```
   *Note: VisitJhar runs out-of-the-box using bundled local datasets; no external API keys are required for core functionality.*

---

## 8. Development & Build Commands

- **Start Local Development Server:**
  ```bash
  npm run dev
  ```
  Starts Vite dev server at `http://localhost:5173`.

- **Type-Check and Production Build:**
  ```bash
  npm run build
  ```
  Runs `tsc -b` followed by `vite build`. Output is generated in the `dist/` directory.

- **Preview Production Build Locally:**
  ```bash
  npm run preview
  ```
  Serves the built `dist/` bundle locally for verification.

---

## 9. Deployment Instructions (Vercel)

VisitJhar is pre-configured for automated deployment on Vercel:

1. Import the repository into your Vercel account: `https://github.com/akrama79/visitjhar`.
2. Confirm the project settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
3. Click **Deploy**.
4. The included `vercel.json` ensures all client-side routes (e.g. `/explore`, `/destination/:slug`, `/map`) resolve to `/index.html` without 404 errors on page refresh.

---

## 10. Current Architectural Scope & Transparency

- **Data Persistence:** User reviews and favorites are currently stored in browser `localStorage`. No external database or backend server is required for client exploration.
- **Authentication:** Includes an in-memory client-side authentication session context for demonstration and reviewer feedback.
- **Imagery:** 100% of destination photographs are locally hosted within `public/destinations/`, ensuring high-speed delivery, zero external hotlinking failures, and verifiable open licensing (Creative Commons / Public Domain / Government Open Data).

---

## 11. License & Attribution

- **Source Code:** MIT License
- **Content & Imagery:** Sourced from Wikimedia Commons, OpenStreetMap contributors, and official state documentation under Creative Commons (CC BY, CC BY-SA, CC0) and Government Open Data License (GODL) terms. Detailed attribution for each photograph is documented in `src/data/imageManifest.ts`.
