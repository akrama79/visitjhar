import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, Sparkles, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { 
  INITIAL_DESTINATIONS, 
  INITIAL_DISTRICTS 
} from '../data/mockData';
import { DestinationCard } from '../components/DestinationCard';
import { useAuth } from '../context/AuthContext';
import { calculateDestinationScore } from '../lib/recommendations';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  // Search and filter states initialized from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedPillar, setSelectedPillar] = useState(searchParams.get('pillar') || 'all');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedDistrict, setSelectedDistrict] = useState(searchParams.get('district') || 'all');
  const [selectedBudget, setSelectedBudget] = useState(searchParams.get('budget') || 'all');
  const [selectedDifficulty, setSelectedDifficulty] = useState(searchParams.get('difficulty') || 'all');
  const [selectedDuration, setSelectedDuration] = useState(searchParams.get('duration') || 'all');
  const [onlyHiddenGems, setOnlyHiddenGems] = useState(searchParams.get('hidden') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'recommended');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(18);

  const TOURISM_PILLARS = [
    'Nature and Waterfalls',
    'Hill Stations and Plateaus',
    'Wildlife, Forests and Protected Areas',
    'Spiritual and Religious Destinations',
    'Heritage, Architecture and Archaeology',
    'Tribal Culture and Living Traditions',
    'Lakes, Dams and Scenic Landscapes',
    'Adventure and Outdoor Activities',
    'Rural and Community-Based Tourism',
    'Lesser-Known and Emerging Destinations'
  ];

  const QUICK_CHIPS = [
    { label: 'All Destinations', pillar: 'all' },
    { label: 'Waterfalls', pillar: 'Nature and Waterfalls' },
    { label: 'Hill Stations', pillar: 'Hill Stations and Plateaus' },
    { label: 'Wildlife & Sanctuaries', pillar: 'Wildlife, Forests and Protected Areas' },
    { label: 'Spiritual & Temples', pillar: 'Spiritual and Religious Destinations' },
    { label: 'Heritage & Forts', pillar: 'Heritage, Architecture and Archaeology' },
    { label: 'Lakes & Dams', pillar: 'Lakes, Dams and Scenic Landscapes' },
    { label: 'Tribal Traditions', pillar: 'Tribal Culture and Living Traditions' },
    { label: 'Adventure', pillar: 'Adventure and Outdoor Activities' },
    { label: 'Rural Tourism', pillar: 'Rural and Community-Based Tourism' },
  ];

  // Derive unique categories present in the canonical dataset
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    INITIAL_DESTINATIONS.forEach(d => {
      if (d.category) set.add(d.category);
    });
    return Array.from(set).sort();
  }, []);

  // Sync state to URL params & reset pagination on filter change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedPillar !== 'all') params.set('pillar', selectedPillar);
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (selectedDistrict !== 'all') params.set('district', selectedDistrict);
    if (selectedBudget !== 'all') params.set('budget', selectedBudget);
    if (selectedDifficulty !== 'all') params.set('difficulty', selectedDifficulty);
    if (selectedDuration !== 'all') params.set('duration', selectedDuration);
    if (onlyHiddenGems) params.set('hidden', 'true');
    if (sortBy !== 'recommended') params.set('sort', sortBy);
    setSearchParams(params, { replace: true });
    setVisibleCount(18);
  }, [
    searchQuery,
    selectedPillar,
    selectedCategory,
    selectedDistrict,
    selectedBudget,
    selectedDifficulty,
    selectedDuration,
    onlyHiddenGems,
    sortBy,
    setSearchParams
  ]);

  // Compute recommendation scores for all destinations
  const destinationScores = useMemo(() => {
    const map = new Map<string, { score: number; reason: string }>();
    INITIAL_DESTINATIONS.forEach(d => {
      const result = calculateDestinationScore(d, user);
      map.set(d.id, { score: result.score, reason: result.reasons[0] || '' });
    });
    return map;
  }, [user]);

  // Filter and sort destinations
  const filteredDestinations = useMemo(() => {
    let result = [...INITIAL_DESTINATIONS];

    // Robust case-insensitive search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(d => 
        (d.name && d.name.toLowerCase().includes(q)) ||
        (d.district && d.district.toLowerCase().includes(q)) ||
        (d.category && d.category.toLowerCase().includes(q)) ||
        (d.pillar && d.pillar.toLowerCase().includes(q)) ||
        (d.alt_names && d.alt_names.some(alt => alt.toLowerCase().includes(q))) ||
        (d.short_description && d.short_description.toLowerCase().includes(q)) ||
        (d.activities && d.activities.some(a => a.toLowerCase().includes(q))) ||
        (d.main_attractions && d.main_attractions.some(m => m.toLowerCase().includes(q)))
      );
    }

    // Tourism Pillar filter (Jharkhand Tourism Policy 2021)
    if (selectedPillar !== 'all') {
      result = result.filter(d => d.pillar === selectedPillar);
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(d => d.category && d.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // District filter
    if (selectedDistrict !== 'all') {
      result = result.filter(d => d.district && d.district.toLowerCase() === selectedDistrict.toLowerCase());
    }

    // Budget filter
    if (selectedBudget !== 'all') {
      result = result.filter(d => d.budget_level === selectedBudget);
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      result = result.filter(d => d.difficulty === selectedDifficulty);
    }

    // Duration filter
    if (selectedDuration !== 'all') {
      result = result.filter(d => d.duration_category === selectedDuration);
    }

    // Hidden gems filter
    if (onlyHiddenGems) {
      result = result.filter(d => d.hidden_gem);
    }

    // Sort dispatcher
    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => (b.rating_avg || 0) - (a.rating_avg || 0));
        break;
      case 'popular':
        result.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'alpha':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'alpha_desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'recent':
        result.sort((a, b) => new Date(b.created_date || '').getTime() - new Date(a.created_date || '').getTime());
        break;
      case 'recommended':
      default:
        result.sort((a, b) => (destinationScores.get(b.id)?.score || 0) - (destinationScores.get(a.id)?.score || 0));
        break;
    }

    return result;
  }, [
    searchQuery,
    selectedPillar,
    selectedCategory,
    selectedDistrict,
    selectedBudget,
    selectedDifficulty,
    selectedDuration,
    onlyHiddenGems,
    sortBy,
    destinationScores
  ]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedPillar('all');
    setSelectedCategory('all');
    setSelectedDistrict('all');
    setSelectedBudget('all');
    setSelectedDifficulty('all');
    setSelectedDuration('all');
    setOnlyHiddenGems(false);
    setSortBy('recommended');
  };

  const activeFilterCount = [
    selectedPillar !== 'all',
    selectedCategory !== 'all',
    selectedDistrict !== 'all',
    selectedBudget !== 'all',
    selectedDifficulty !== 'all',
    selectedDuration !== 'all',
    onlyHiddenGems
  ].filter(Boolean).length;

  const displayedDestinations = filteredDestinations.slice(0, visibleCount);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
          Explore Jharkhand Destinations
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Discover {INITIAL_DESTINATIONS.length} authentic tourism landmarks across all 24 districts of Jharkhand.
        </p>
      </div>

      {/* Main Search & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, alias, district, pillar (e.g. Parasnath, Lodh, Betla, waterfalls)..."
            className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="sm:hidden inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground outline-none focus:border-primary cursor-pointer"
          >
            <option value="recommended">Sort: Recommended</option>
            <option value="alpha">Sort: Alphabetical (A–Z)</option>
            <option value="alpha_desc">Sort: Alphabetical (Z–A)</option>
            <option value="rating">Sort: Highest Rated</option>
            <option value="popular">Sort: Most Popular</option>
          </select>
        </div>
      </div>

      {/* Quick Category & Pillar Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {QUICK_CHIPS.map(chip => {
          const isSelected = selectedPillar === chip.pillar;
          return (
            <button
              key={chip.label}
              onClick={() => {
                setSelectedPillar(chip.pillar);
                setSelectedCategory('all');
              }}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                isSelected
                  ? 'bg-primary text-white shadow-sm'
                  : 'border border-border bg-card text-foreground/80 hover:bg-secondary'
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {/* Filter Toolbar (Desktop & Collapsible Mobile) */}
      <div className={`space-y-4 rounded-2xl border border-border/80 bg-card/60 p-4 ${mobileFiltersOpen ? 'block' : 'hidden sm:block'}`}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {/* Tourism Pillar (Tourism Policy 2021) */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
              Tourism Pillar
            </label>
            <select
              value={selectedPillar}
              onChange={(e) => setSelectedPillar(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground outline-none cursor-pointer"
            >
              <option value="all">All 10 Policy Pillars</option>
              {TOURISM_PILLARS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground outline-none cursor-pointer"
            >
              <option value="all">All Categories ({availableCategories.length})</option>
              {availableCategories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">District</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground outline-none cursor-pointer"
            >
              <option value="all">All Districts (24)</option>
              {INITIAL_DISTRICTS.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Budget Tier */}
          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Budget</label>
            <select
              value={selectedBudget}
              onChange={(e) => setSelectedBudget(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground outline-none cursor-pointer"
            >
              <option value="all">Any Budget</option>
              <option value="LOW">₹ Budget Friendly</option>
              <option value="MODERATE">₹₹ Moderate</option>
              <option value="PREMIUM">₹₹₹ Premium</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground outline-none cursor-pointer"
            >
              <option value="all">Any Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Challenging">Challenging</option>
            </select>
          </div>

          {/* Visit Length */}
          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Duration</label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground outline-none cursor-pointer"
            >
              <option value="all">Any Length</option>
              <option value="SHORT">Up to 3 hours</option>
              <option value="HALF_DAY">Half day</option>
              <option value="FULL_DAY">Full day</option>
              <option value="MULTI_DAY">Multi-day</option>
            </select>
          </div>

          {/* Hidden Gem Checkbox */}
          <div className="flex items-end">
            <label className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground cursor-pointer w-full h-[34px]">
              <input
                type="checkbox"
                checked={onlyHiddenGems}
                onChange={(e) => setOnlyHiddenGems(e.target.checked)}
                className="accent-primary rounded"
              />
              <span className="truncate">Hidden Gems</span>
            </label>
          </div>
        </div>

        {/* Active Filter Indicators */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground border-t border-border/50">
            <span>{activeFilterCount} active filter{activeFilterCount > 1 ? 's' : ''}:</span>
            <button
              onClick={clearAllFilters}
              className="font-semibold text-primary hover:text-accent transition underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-border pb-3 text-xs text-muted-foreground">
        <span>
          Showing <strong className="text-foreground">{displayedDestinations.length}</strong> of <strong className="text-foreground">{filteredDestinations.length}</strong> matching destinations ({INITIAL_DESTINATIONS.length} total)
        </span>
        {sortBy === 'recommended' && (
          <span className="flex items-center gap-1 text-primary font-medium">
            <Sparkles className="h-3 w-3 text-accent" /> Personalized match ranking active
          </span>
        )}
      </div>

      {/* Destination Grid or Empty State */}
      {displayedDestinations.length > 0 ? (
        <div className="space-y-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedDestinations.map(destination => {
              const matchInfo = destinationScores.get(destination.id);
              return (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  matchScore={matchInfo?.score}
                  matchReason={matchInfo?.reason}
                />
              );
            })}
          </div>

          {/* Load More / Pagination Controls */}
          {filteredDestinations.length > visibleCount && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 pb-2">
              <button
                type="button"
                onClick={() => setVisibleCount(prev => prev + 18)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-xs font-bold text-white shadow-md hover:bg-primary-light transition"
              >
                Load More ({displayedDestinations.length} of {filteredDestinations.length})
              </button>
              <button
                type="button"
                onClick={() => setVisibleCount(filteredDestinations.length)}
                className="rounded-full border border-border bg-card px-5 py-3 text-xs font-semibold text-foreground hover:bg-secondary transition"
              >
                Show All ({filteredDestinations.length})
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center max-w-lg mx-auto">
          <Search className="mx-auto h-12 w-12 text-muted-foreground/60" />
          <h3 className="mt-4 font-heading text-xl font-bold">No destinations match your criteria</h3>
          <p className="mt-2 text-xs text-muted-foreground">
            Try adjusting your search terms or clearing some filters to explore more of Jharkhand.
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-6 rounded-full bg-primary px-6 py-2 text-xs font-semibold text-white hover:bg-primary-light transition"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
