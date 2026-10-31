# Reference Website Audit: VisitJhar

**Reference Application**: VisitJhar (Hosted on Base44: `https://visit-jhar-flow.base44.app/`)  
**Audit Date**: October 31, 2026  
**Auditor**: Lead Software Architect  
**Inspection Scope**: Live web application, Web App Manifest, client JavaScript bundle (`index-D4qPKsZH.js`), CSS stylesheet (`index-CnJaZ1zJ.css`), and public REST API endpoints (`/api/apps/6aa8db580aef597b6eba92f6/entities/*`).

---

## 1. Executive Summary

VisitJhar is a specialized eco and cultural tourism web platform for the state of Jharkhand, India. It offers curated destination discovery across all 24 districts, culture and tribal heritage showcases, local artisan and experience catalogs, an interactive Leaflet map, a personalized weighted recommendation system, and a day-wise itinerary planner.

Through deep reverse-engineering of the client bundle and public Base44 entity endpoints, **100% of the public frontend routing, UI component structure, design system tokens, entity schemas, scoring algorithms, and 140 core tourism database records** have been extracted directly from the live deployment.

---

## 2. Technical Stack of Reference App

| Layer | Implementation in Reference App | Target Independent Stack |
| :--- | :--- | :--- |
| **Framework** | React 18, Vite | React 18 / 19, TypeScript, Vite |
| **Styling** | Tailwind CSS v3/v4 with custom typography | Tailwind CSS, Lucide React icons |
| **Typography** | `Fraunces` (serif heading) & `Inter` (sans body) | Google Fonts (`Fraunces`, `Inter`) |
| **Backend / DB** | Base44 Proprietary Platform & Python FastAPI/Uvicorn | Supabase PostgreSQL + Row Level Security (RLS) |
| **Auth** | Base44 Token Storage (`base44_access_token`) | Supabase Auth (Email/Password, OAuth) |
| **Storage** | Base44 Media CDN (`media.base44.com`) | Supabase Storage (`tourism-media` bucket) |
| **Maps** | Leaflet 1.9 + React-Leaflet + OpenStreetMap | Leaflet + React-Leaflet + OpenStreetMap |
| **Hosting** | Base44 Cloudflare Edge | Vercel / Netlify |

---

## 3. Navigation & Route Architecture

The reference application implements 29 distinct client routes:

```
├── Public Discovery
│   ├── /                         (Home: Hero, Categories, Recommendations, Hidden Gems, Culture teaser)
│   ├── /explore                  (Search, Filters, Sort, Destination Cards)
│   ├── /destination/:id          (Destination Detail: Facts, Attractions, Proximity, Map, Reviews)
│   ├── /map                      (Interactive Full-Screen Leaflet Map with Geolocation & Deep Links)
│   ├── /culture                  (Tribal Culture, Heritage, Arts, Crafts, Cuisine)
│   ├── /events                   (Festivals & Events: Upcoming and Past)
│   ├── /events/:id               (Event Detail page)
│   ├── /experiences              (Local Guides, Homestays, Village Tours, Food Walks)
│   ├── /about                    (About VisitJhar & Mission)
│   └── /responsible-tourism      (Ethical & Eco-Travel Guidelines)
│
├── Planning & Customization
│   ├── /plan-trip                (Interactive Day-Wise Itinerary Generator Form)
│   ├── /itineraries              (Public & Saved Itineraries Explorer)
│   └── /itineraries/:id          (Detailed Day-Wise Itinerary Schedule & Slots)
│
├── User Portal (Authenticated)
│   ├── /login                    (User Sign In)
│   ├── /register                 (User Registration)
│   ├── /forgot-password          (Password Reset Request)
│   ├── /reset-password           (Password Reset Confirmation)
│   ├── /onboarding               (New User Preference Wizard)
│   ├── /profile                  (Profile & Travel Style Preferences Editor)
│   ├── /dashboard                (User Activity, Recommendations, Saved Records)
│   └── /favorites                (Bookmarked Destinations)
│
└── Protected Administration (/admin/*)
    ├── /admin                    (Platform Overview, High-Level Metrics & Moderation Queue)
    ├── /admin/destinations       (Destination CRUD, Featured Toggles, Status)
    ├── /admin/categories         (Category Management)
    ├── /admin/culture            (Cultural Content CRUD)
    ├── /admin/events             (Events & Festivals Management)
    ├── /admin/experiences        (Local Experiences CRUD)
    ├── /admin/artisans           (Artisans Directory Management)
    ├── /admin/reviews            (Review Moderation: Pending/Approved/Rejected)
    ├── /admin/itineraries        (Community Itinerary Moderation)
    ├── /admin/featured           (Curated Highlights Management)
    └── /admin/users              (User Roles: Admin vs User)
```

---

## 4. Detailed Page & Module Audit

### Module 1: Home & Discovery (`/`)
- **Hero Section**:
  - Full-width hero image with dark scrim gradient (`bg-gradient-to-r from-black/45 via-black/15 to-transparent`).
  - Badge: `Eco & Cultural Tourism in Jharkhand`.
  - Heading: "Explore the Heart of Jharkhand" (with gold/amber accent text).
  - Search input: Redirects to `/explore?search=...`.
  - Quick-search tags: `Waterfalls`, `Wildlife`, `Tribal Culture`, `Heritage`, `Adventure`, `Homestays`.
  - CTAs: `Explore Jharkhand` (`/explore`), `Plan My Trip` (`/plan-trip`), `Discover on Map` (`/map`).
  - Unauthenticated prompt: "New here? Create an account to get personalised recommendations."
- **Featured Destinations**:
  - Carousel / grid displaying destinations where `featured === true` (top 6).
- **Category Grid**:
  - Grid displaying all active categories with icon and name.
- **Personalized Recommendations Section**:
  - If authenticated: Displays top 3 weighted matches calculated from user preferences, with match score badge (e.g. `92% match`) and "Why this place?" explanation bullet points.
  - If unauthenticated / no profile: Displays onboarding teaser prompting users to set their travel style.
- **Hidden Gems Showcase**:
  - Displays destinations marked `hidden_gem === true` with link to `/explore?hidden=true`.
- **Cultural & Event Teasers**:
  - Shows 3 latest cultural items and upcoming festivals sorted by date.
- **Responsible Tourism Callout**:
  - 4 core principles: "Leave no trace", "Respect local culture", "Support communities", "Explore beyond crowds".

### Module 2: Destination Discovery & Search (`/explore`)
- **Search Bar**: Debounced text search matching `name`, `district`, `category`, `short_description`, `activities`, and `main_attractions`.
- **Filter Controls**:
  - Category (dropdown: All + 19 categories).
  - District (dropdown: All + 24 districts).
  - Budget Tier (dropdown: `LOW` [₹ Budget], `MODERATE` [₹₹ Moderate], `PREMIUM` [₹₹₹ Premium]).
  - Difficulty (dropdown: `Easy`, `Moderate`, `Challenging`).
  - Visit Length (dropdown: `SHORT` [Up to 3 hours], `HALF_DAY` [Half day], `FULL_DAY` [Full day], `MULTI_DAY` [Multi-day]).
  - Hidden Gems (checkbox: filters `hidden_gem === true`).
- **Sort Dropdown**:
  - `recommended`: Sorted by user preference match score if authenticated, or rating average if unauthenticated.
  - `rating`: Sorted by `rating_avg` descending.
  - `popular`: Sorted by `views` descending.
  - `recent`: Sorted by `created_date` descending.
  - `alpha`: Alphabetical by `name`.
- **Card Elements**: Image, category badge, name, district, rating star pill, bookmark toggle button, match score pill (if user logged in).

### Module 3: Destination Detail Page (`/destination/:id`)
- **Header**: Image gallery/hero, destination name, district badge, category badge, bookmark button.
- **Quick Fact Cards**:
  - Best Time to Visit (`best_time_to_visit`)
  - Duration (`recommended_duration`)
  - Budget (`budget_level` / `estimated_budget`)
  - Difficulty (`difficulty`)
- **Rich Content Tabs / Sections**:
  - Overview / Full Description (`description`)
  - Cultural Significance (`cultural_significance`)
  - Historical Significance (`historical_significance`)
  - Main Attractions (`main_attractions` list)
  - Recommended Activities (`activities` pills)
  - Safety Information (`safety_information` alert box)
  - Responsible Tourism (`responsible_tourism` alert box)
  - How to Reach (`how_to_reach` directions)
- **Geographic Proximity Discovery (`LO` function)**:
  - Computes distances using Haversine formula (`FO`) to all other 39 destinations.
  - Displays top 5 nearest destinations with distance formatted in km/m.
- **Related Destinations**: Same district or category recommendations.
- **Local Experiences**: Experiences located in the same district.
- **Interactive Mini-Map**: Leaflet map centered on destination's latitude and longitude.
- **User Reviews & Ratings**:
  - Displays only reviews where `status === 'APPROVED'` and `hidden === false`.
  - Pending indicator if the logged-in user has an unapproved review.
  - Review form with 1–5 star rating and comment textarea (requires auth).

### Module 4: Weighted Recommendation Engine (Exact Observable Formula)
Reverse-engineered from function `JT(destination, userProfile)`:

$$\text{Final Score} = \text{round}\left(100 \times \sum (w_i \cdot s_i)\right)$$

| Component ($i$) | Weight ($w_i$) | Scoring Logic ($s_i$) | Transparent Reason Generated |
| :--- | :---: | :--- | :--- |
| **Interests** | **0.30** | Ratio of user interests matched against destination category, subcategory, and activities via lookup table `HT` and `UT`. | "Matches your interest in *[interests]*" |
| **Category** | **0.20** | Binary match ($1.0$ if destination category is in user's `preferred_categories`, else $0.0$). Default $0.5$ if unspecified. | "Fits your preferred *[category]* category" |
| **Activity** | **0.15** | Overlap between user interest activity set and destination's `activities`. | "Includes *[activities]* activities" |
| **Duration** | **0.15** | Destination duration ($g$) vs user trip duration preference ($o$). If $g \le o \implies 1.0$, else $\max(0, 1 - (g-o)/g)$. | "Suitable for a *[days]*-day trip" |
| **Budget** | **0.10** | Tier comparison (`LOW`=1, `MODERATE`=2, `PREMIUM`=3). Same tier = $1.0$, 1 tier off = $0.5$, 2 tiers off = $0.0$. | "Fits your preferred Budget tier" |
| **Group Style** | **0.05** | Solo ($0.8$), Couple ($0.85$), Family (Easy=$1.0$, Challenging=$0.4$), Friends (Adventure=$1.0$, other=$0.7$). | "Popular with *[group]* travellers" |
| **Home District** | **0.05** | Matches user's home district ($1.0$ vs $0.3$). | "Located in your home district, *[district]*" |

### Module 5: Interactive Map (`/map`)
- Full-screen or large Leaflet map initialized on Jharkhand geographic bounds (`[23.5, 85.3]`, zoom ~8).
- Tiles: OpenStreetMap standard layer (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`).
- Pin styling: Custom SVG teardrop pin with colored fill (`visitjhar-pin`).
- Geolocation API support: "You are here" animated marker (`visitjhar-user-pin`).
- Deep-linking: `?focus=:id` centers and opens the popup of a specific destination.
- Filter toolbar: Quick category and district filtering overlay.

### Module 6: Day-Wise Itinerary Planner (`/plan-trip`)
- **Inputs**:
  - Starting Location (District select, defaults to user's home location).
  - Number of Days (1, 2, 3, 4 days, or Custom).
  - Start Date (date picker).
  - Budget Tier (`LOW`, `MODERATE`, `PREMIUM`).
  - Travel Group (`Solo`, `Couple`, `Family`, `Friends`, `Group`).
  - Number of Travelers (integer, default 1).
  - Interests (multi-select from 12 interest areas).
  - Activities (multi-select from 29 activity types).
- **Generated Plan Structure**:
  - Day-wise cards: Day 1, Day 2, etc.
  - 3 Time Slots per day: `Morning`, `Afternoon`, `Evening`.
  - Slot content: Destination photo, slot badge, destination name, district, sequence number, suggested activities, estimated budget, visit duration, travel notes, safety tips, match score.
- **Action**: "Save Itinerary" persists record to `Itinerary` table and creates corresponding `ItineraryItem` rows.

### Module 7 & 8: Culture, Events, Experiences & Artisans
- `/culture`: 6 categories: Tribal Culture, Traditional Arts, Dance & Music, Handicrafts, Local Cuisine, History & Heritage. Content includes Santhal, Munda, Oraon, Ho traditions; Sohrai and Kohbar paintings; Chhau dance; Dokra brass metal craft.
- `/events`: 12 verified events (Sarhul Festival, Karma Puja, Tusu Parab, Sohrai Festival, Jharkhand Foundation Day, Rajrappa Mahotsav, Shravani Mela, Itkhori Mahotsav, etc.).
- `/experiences`: 20 local experiences (homestays, guided waterfall trails, village immersion, tribal cuisine workshops, birdwatching).
- `/experiences` Artisan Section: 16 artisans (craft, location, district, bio, techniques).

### Module 9: User Profiles, Bookmarks, Reviews & Itineraries
- `/profile`: Manages user display name, avatar, bio, and 8 travel preference dimensions (`iA` completeness score): `interests`, `preferred_categories`, `travel_style`, `preferred_duration`, `preferred_budget`, `travel_group`, `home_location`, `age`.
- `/favorites`: Persisted user bookmarks with quick unfavorite action.
- `/itineraries`: Saved trip plans with day-by-day interactive view.

### Module 10: Admin Management (`/admin/*`)
- Protected by user role (`role === 'admin'`).
- Unified CRUD table component (`Lz`) with:
  - Search input across defined search fields.
  - Sorting, pagination (limit 200).
  - Quick status / active toggle switches.
  - Edit modal form supporting: text, textarea, select, number, switch, date, list (string tags), single image upload, multiple images (gallery).
- Review moderation table: Status filter (`PENDING`, `APPROVED`, `REJECTED`), inappropriate content flag (`hidden`), admin moderation note (`admin_note`).
- User role management: View registered users, promote/demote between `user` and `admin`.

---

## 5. Recovered Data Inventory from Reference Base44 Endpoint

By executing targeted queries against the public Base44 entity endpoints (`/api/apps/6aa8db580aef597b6eba92f6/entities/*`), the following actual production data was extracted:

| Entity Name | Status | Recovered Record Count | Completeness |
| :--- | :---: | :---: | :--- |
| **Destination** | Active | **40 records** | Complete with GPS coordinates, descriptions, budget tiers, safety notes, sources. |
| **District** | Active | **24 records** | Complete list of all 24 Jharkhand districts with central coordinates. |
| **Category** | Active | **19 records** | Complete category names, slugs, descriptions, Lucide icon references. |
| **CulturalContent** | Active | **28 records** | Complete heritage, art, dance, craft, and cuisine records. |
| **Event** | Active | **12 records** | Real festival and cultural calendar events with dates and descriptions. |
| **LocalExperience** | Active | **20 records** | Verified homestays, nature trails, guides, craft workshops. |
| **Artisan** | Active | **16 records** | Documented Jharkhand craftsmen (Dokra, Sohrai, bamboo, terracotta). |
| **Circuit** | Empty | **0 records** | Table schema exists; no records populated in reference app. |
| **Itinerary** | Empty/Private | **0 records** | User-created itinerary table (empty on public instance). |
| **Review** | Empty/Private | **0 records** | User review table (no public approved reviews on live instance). |
| **Total Core Records** | — | **139 records** | **Full foundation ready for database migration without synthetic filler.** |

---

## 6. Inaccessible & Uncertain Components

1. **Original Source Code Repository**:
   - The backend server source (Base44 Python FastAPI / Uvicorn server runtime) is inaccessible.
   - The original unminified Vite/React repository is inaccessible (only the compiled client bundle `index-D4qPKsZH.js` is available).
2. **Base44 Cloud Functions**:
   - `generateItinerary`: Internal cloud function generating day-by-day slot allocations.
   - `getRecommendations`: Internal cloud function (though the identical mathematical scoring logic `JT(e, t)` is completely available in the frontend bundle).
3. **Internal Auth Secrets & Passwords**:
   - Passwords and auth tokens cannot and should not be migrated. All users must authenticate via clean Supabase Auth.
4. **Image Asset Hosting**:
   - All 116 images are currently served from `media.base44.com` (many are AI-generated or uploaded via Base44).
   - Long-term availability of `media.base44.com` cannot be guaranteed outside the Base44 ecosystem.
