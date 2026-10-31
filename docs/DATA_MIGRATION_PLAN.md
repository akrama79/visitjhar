# Data Migration & Content Validation Plan: VisitJhar

**Project**: VisitJhar Rebuild  
**Scope**: Migration of observable tourism records from reference platform (Base44) to Supabase PostgreSQL, media asset preservation, content verification workflows, and gap-filling research requirements.

---

## 1. Migration Strategy Principles

In strict adherence to project constraints:
1. **Zero Synthetic Tourism Data**: Never invent fake ratings, fake user reviews, artificial event dates, or false historical facts.
2. **Preserve Recovered Authenticity**: All 139 records recovered directly from the public live Base44 endpoint are preserved with their verified attributes, slugs, and original metadata.
3. **Explicit Verification Tagging**: Records retain their `verification_status` flag (`VERIFIED`, `PARTIALLY_VERIFIED`, `UNVERIFIED`) and `source_urls` so users and administrators can distinguish verified government-sourced data from unreviewed drafts.
4. **Independent Asset Decoupling**: Download all 116 images currently on `media.base44.com` and ingest them into Supabase Storage to eliminate dependency on Base44 infrastructure.

---

## 2. Inventory & Classification of Records

```
Total Tourism Content Records: 139
├── Destination: 40 records (All 24 districts represented)
├── District: 24 records (Complete geographic coverage)
├── Category: 19 records (Full taxonomic categorization)
├── CulturalContent: 28 records (Tribal heritage, arts, crafts, dances)
├── Event: 12 records (Statewide festivals & cultural events)
├── LocalExperience: 20 records (Homestays, trails, guided experiences)
└── Artisan: 16 records (Documented master craftspersons)
```

### 2.1. Category 1: Recovered Records (Ready for Ingestion)

The following tables have been fetched directly from the live public Base44 entity endpoint and saved as structured JSON in `scratch/raw_data/`:

| Entity | Count | Key Fields Recovered | Verification Status | Source Link |
| :--- | :---: | :--- | :--- | :--- |
| `Destination` | 40 | Name, slug, district, category, subcategory, latitude, longitude, short description, full description, best time, recommended duration, duration category, budget level, difficulty, attractions, activities, cultural significance, safety notes, responsible tourism rules, how to reach | `PARTIALLY_VERIFIED` | `https://tourism.jharkhand.gov.in/` |
| `District` | 24 | District name, slug, central latitude, central longitude, active flag | `VERIFIED` | Official Survey of India / Jharkhand Govt |
| `Category` | 19 | Name, slug, description, Lucide icon reference, active flag | `VERIFIED` | VisitJhar Taxonomy |
| `CulturalContent` | 28 | Title, type/category, district, region, cultural significance, description, related destinations | `PARTIALLY_VERIFIED` | Jharkhand Tribal Research Institute / Culture Dept |
| `Event` | 12 | Name, date, end date, location, district, category, recurrence note, cultural significance, source URLs | `PARTIALLY_VERIFIED` | Jharkhand Tourism Calendar |
| `LocalExperience` | 20 | Name, type, district, location, duration, price range, estimated cost, description, contact note | `PARTIALLY_VERIFIED` | Community eco-tourism initiatives |
| `Artisan` | 16 | Name, craft type, district, location, cultural significance, description | `PARTIALLY_VERIFIED` | Jharcraft / State Artisan Directory |

### 2.2. Category 2: Records Requiring Official Research & Verification

The following content requires validation or expansion against official sources before being marked `VERIFIED`:

1. **Tourism Circuits (`Circuit`)**:
   - *Status in Base44*: Schema exists, but 0 records populated.
   - *Required Official Research*:
     - **Waterfall Circuit**: Hundru, Jonha, Dassam, Sita, Hirni, Panchghagh.
     - **Spiritual / Pilgrimage Circuit**: Baidyanath Dham (Deoghar), Basukinath (Dumka), Rajrappa Chhinnamastika (Ramgarh), Parasnath / Shikharji (Giridih), Jagannath Temple (Ranchi), Sun Temple (Bundu).
     - **Eco & Wildlife Circuit**: Betla National Park (Latehar), Palamu Tiger Reserve, Dalma Wildlife Sanctuary (East Singhbhum), Hazaribagh Wildlife Sanctuary, Topchanchi Lake (Dhanbad).
     - **Tribal Heritage & Craft Circuit**: Maluti Terracotta Temples (Dumka), Amadubi Panikar Village (East Singhbhum), Khunti Tribal Craft Hub, Netarhat Plateau.
   - *Authoritative Reference*: Jharkhand Tourism Development Corporation (JTDC) official brochures and Department of Tourism, Art, Culture, Sports & Youth Affairs.

2. **Data Sources (`DataSource`)**:
   - Establish formal source tracking records for:
     - Department of Tourism, Govt. of Jharkhand (`tourism.jharkhand.gov.in`)
     - Jharkhand Tourism Development Corporation (`jtdc.jharkhand.gov.in`)
     - Archaeological Survey of India (ASI) - Ranchi Circle
     - Jharcraft (Jharkhand Silk Textile and Handicraft Development Corporation)
     - Forest, Environment & Climate Change Department, Govt. of Jharkhand

3. **Event Recurrence Dates for 2026/2027**:
   - Sarhul, Karma, Tusu Parab, and Bandna follow lunar tribal calendars.
   - Dates in the reference database reflect historical 2025/2026 scheduling and must be validated against the official gazetted holidays for upcoming seasons.

### 2.3. Category 3: Unavailable Content (Strictly Non-Migratable)

The following data cannot and should not be migrated:
1. **User Credentials & Private Passwords**: Base44 user credentials cannot be exported. All users must create fresh accounts via Supabase Auth.
2. **Fabricated User Reviews & Star Ratings**: No reviews existed publicly in Base44. The target platform starts with 0 reviews. Reviews must be organically submitted by authenticated users and vetted by administrators.
3. **Private Travel Itineraries**: User private itineraries in Base44 are inaccessible. Users will generate new itineraries using the Smart Planner.

---

## 3. Media Asset Migration Pipeline

### 3.1. Current Image Landscape
- Total images referenced in database: **116 files**
- Host domain: `media.base44.com/images/public/6aa8db580aef597b6eba92f6/...`
- File naming convention: e.g. `5a6983c3b_generated_image.png`, `c7e0d5643_generated_image.png`
- Nature of images: A combination of curated Jharkhand photographs and AI-generated conceptual imagery.

### 3.2. Migration Execution Steps
1. **Batch Download Script**:
   - Write a Node.js utility `scripts/migrate-media.ts` to crawl all 116 image URLs from `scratch/raw_data/*.json`.
   - Download high-resolution originals into a local staging directory `staging/media/`.
2. **Supabase Storage Ingestion**:
   - Create public storage bucket `tourism-media` in Supabase.
   - Create organized folder hierarchy:
     - `destinations/`
     - `culture/`
     - `events/`
     - `experiences/`
     - `artisans/`
   - Upload staged files with appropriate `Cache-Control: public, max-age=31536000` headers.
3. **Database URL Transformation**:
   - In the SQL seed / migration script, replace `https://media.base44.com/...` with `https://<supabase-project-id>.supabase.co/storage/v1/object/public/tourism-media/...`.
4. **Fallback & Image Rights Strategy**:
   - If an image fails to download or has copyright/licensing ambiguity, flag the record with `image_attribution: "Pending Verification"` and render an accessible SVG placeholder featuring district-level topography.

---

## 4. Supabase Database Migration Scripts Plan

```
supabase/
├── migrations/
│   ├── 20261031000001_initial_schema.sql         (Tables, enums, constraints, indexes)
│   ├── 20261031000002_row_level_security.sql     (Fine-grained RLS policies)
│   ├── 20261031000003_functions_triggers.sql     (Auto-updated timestamps, profile creation trigger)
│   └── 20261031000004_fulltext_search.sql        (tsvector search index and ranking)
└── seeds/
    ├── 01_districts.sql                          (24 verified districts)
    ├── 02_categories.sql                         (19 verified categories)
    ├── 03_destinations.sql                       (40 verified destinations)
    ├── 04_culture.sql                            (28 cultural & heritage items)
    ├── 05_events.sql                             (12 festival & cultural events)
    ├── 06_experiences.sql                        (20 local tourism experiences)
    ├── 07_artisans.sql                           (16 master artisan profiles)
    └── 08_circuits_and_sources.sql               (Researched circuits & official sources)
```

---

## 5. Review Integrity & Moderation Strategy

To prevent spam, defamation, and hallucinated visitor feedback:
1. **Mandatory Authentication**: Unauthenticated users cannot post reviews.
2. **Default `PENDING` Status**: All submitted reviews enter the moderation queue (`status = 'PENDING'`).
3. **Public Visibility Guard**: Database RLS policy guarantees that public queries return exclusively `status = 'APPROVED' AND hidden = false`.
4. **Audited Moderation**:
   - Admin panel displays moderation actions: `Approve`, `Reject`, `Flag Inappropriate`.
   - Admin notes (`admin_note`) record reasons for rejection.
   - Dynamic destination rating recalculation: Average rating is calculated via database view or trigger upon review approval, preventing client-side score manipulation.
