import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Compass, 
  MapPin, 
  Route, 
  Sparkles, 
  ArrowRight, 
  Check, 
  Calendar, 
  Heart,
  Trees,
  Shield,
  Users,
  Clock
} from 'lucide-react';
import { 
  INITIAL_DESTINATIONS, 
  INITIAL_CATEGORIES, 
  INITIAL_EVENTS, 
  INITIAL_CULTURE,
  INITIAL_CIRCUITS 
} from '../data/mockData';
import { DestinationCard } from '../components/DestinationCard';
import { useAuth } from '../context/AuthContext';
import { getRecommendedDestinations } from '../lib/recommendations';

export const HomePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  const quickTags = ['Waterfalls', 'Wildlife', 'Tribal Culture', 'Heritage', 'Adventure', 'Homestays'];

  const featuredDestinations = INITIAL_DESTINATIONS.filter(d => d.featured).slice(0, 6);
  const hiddenGems = INITIAL_DESTINATIONS.filter(d => d.hidden_gem).slice(0, 3);
  const recommendations = getRecommendedDestinations(INITIAL_DESTINATIONS, user, 3);
  const upcomingEvents = INITIAL_EVENTS.slice(0, 3);
  const culturalHighlights = INITIAL_CULTURE.slice(0, 3);

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900 text-white">
        {/* Background Image with Fallback */}
        <div className="absolute inset-0">
          <img
            src="https://media.base44.com/images/public/6aa8db580aef597b6eba92f6/820e61551_generated_image.png"
            alt="Jharkhand Landscape"
            className="h-full w-full object-cover object-center brightness-75 scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80';
            }}
          />
          <div className="absolute inset-0 hero-scrim"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
        </div>

        <div className="relative mx-auto max-w-5xl px-4 py-24 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-light backdrop-blur-md">
            <Trees className="h-3.5 w-3.5 text-accent" /> Eco & Cultural Tourism in Jharkhand
          </span>

          <h1 className="mt-6 font-heading text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Explore the Heart of <span className="text-accent underline decoration-accent/40 decoration-4">Jharkhand</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-slate-200 leading-relaxed">
            Discover thundering waterfalls, ancient sal forests, living tribal traditions, and tranquil plateau landscapes across all 24 districts.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mx-auto mt-8 max-w-2xl">
            <div className="flex items-center rounded-full bg-white p-2 shadow-2xl ring-1 ring-black/10">
              <Search className="ml-4 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search waterfalls, Betla, Deoghar, tribal crafts..."
                className="w-full bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-primary-light transition"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Tags */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-300">Popular:</span>
            {quickTags.map((tag) => (
              <Link
                key={tag}
                to={`/explore?search=${encodeURIComponent(tag)}`}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-xs font-medium text-white hover:bg-white/25 transition backdrop-blur-sm"
              >
                {tag}
              </Link>
            ))}
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-accent-light transition"
            >
              <Compass className="h-4 w-4" /> Explore Destinations
            </Link>
            <Link
              to="/plan-trip"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg hover:bg-slate-100 transition"
            >
              <Route className="h-4 w-4 text-primary" /> Plan My Trip
            </Link>
            <Link
              to="/map"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-black/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/10 transition"
            >
              <MapPin className="h-4 w-4 text-accent" /> Discover on Map
            </Link>
          </div>
        </div>
      </section>

      {/* 2. PERSONALIZED RECOMMENDATIONS (WEIGHTED ENGINE) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent">
              <Sparkles className="h-3.5 w-3.5" /> Intelligent Recommendations
            </span>
            <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">
              {isAuthenticated ? `Recommended for ${user?.full_name}` : 'Recommended Destinations'}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isAuthenticated 
                ? 'Ranked transparently by your travel style, preferred categories, duration, and budget tier.'
                : 'Based on genuine visitor preferences across Jharkhand. Set your travel profile for personalized picks.'}
            </p>
          </div>
          <Link
            to="/profile"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent transition"
          >
            Adjust preferences →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map(({ destination, score, reasons }) => (
            <div key={destination.id} className="flex flex-col">
              <DestinationCard
                destination={destination}
                matchScore={score}
                matchReason={reasons[0]}
              />
              {/* "Why this place?" explanation pill box */}
              {reasons.length > 0 && (
                <div className="mt-2 rounded-xl border border-border bg-secondary/50 p-3.5 text-xs">
                  <p className="font-semibold text-foreground flex items-center gap-1">
                    <Check className="h-3.5 w-3.5 text-accent" /> Why this place matches you:
                  </p>
                  <ul className="mt-1.5 space-y-1 text-muted-foreground pl-4 list-disc">
                    {reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 3. FEATURED DESTINATIONS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Curated Highlights</span>
            <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">
              Iconic Jharkhand Destinations
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Must-visit natural wonders, spiritual sanctuaries, and wildlife sanctuaries.
            </p>
          </div>
          <Link to="/explore" className="text-sm font-semibold text-primary hover:text-accent transition">
            View all 40 →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredDestinations.map(dest => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </section>

      {/* 4. CATEGORIES EXPLORER */}
      <section className="bg-secondary/40 py-16 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Diverse Landscapes</span>
            <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">
              Discover by Tourism Theme
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              From roaring monsoon waterfalls to sacred hills and artisanal tribal villages.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {INITIAL_CATEGORIES.slice(0, 12).map(cat => (
              <Link
                key={cat.id}
                to={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center rounded-2xl border border-border bg-card p-5 text-center card-lift shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Compass className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. HIDDEN GEMS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Off the Beaten Path</span>
            <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">
              Jharkhand's Secret Corners
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Quiet sanctuaries, forest dams, and hidden waterfalls away from the crowds.
            </p>
          </div>
          <Link to="/explore?hidden=true" className="text-sm font-semibold text-primary hover:text-accent transition">
            See all hidden gems →
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hiddenGems.map(dest => (
            <DestinationCard key={dest.id} destination={dest} />
          ))}
        </div>
      </section>

      {/* 5B. OFFICIAL POLICY TOURISM CIRCUITS */}
      <section className="bg-secondary/30 py-16 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                State Policy Priority Circuits
              </span>
              <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight text-foreground">
                Curated Tourism Circuits
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Documented multi-district thematic journeys formulated under the Jharkhand Tourism Policy.
              </p>
            </div>
            <Link to="/itineraries" className="text-sm font-semibold text-primary hover:text-accent transition">
              Explore all circuits & itineraries →
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {INITIAL_CIRCUITS.map(circ => (
              <div
                key={circ.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 card-lift shadow-sm space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                      {circ.pillar}
                    </span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground font-medium">
                      <Clock className="h-3 w-3 text-accent" /> {circ.recommended_days} Days
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-foreground">
                    {circ.name}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {circ.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-700">
                    <span className="font-bold text-[11px] text-foreground block">Key Highlights:</span>
                    <ul className="space-y-1 pl-4 list-disc text-muted-foreground text-[11px]">
                      {circ.highlights.slice(0, 3).map((hl, i) => (
                        <li key={i}>{hl}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-muted-foreground">
                    Districts: <strong>{circ.districts.join(', ')}</strong>
                  </span>
                  <Link
                    to={`/plan-trip?startingLocation=${encodeURIComponent(circ.districts[0])}`}
                    className="font-bold text-primary hover:text-accent transition inline-flex items-center gap-1"
                  >
                    Open in Planner →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CULTURE & EVENTS PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Cultural Heritage */}
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-heading text-2xl font-bold text-foreground">
                Living Tribal Traditions
              </h3>
              <Link to="/culture" className="text-xs font-semibold text-primary hover:text-accent">
                View all →
              </Link>
            </div>
            <div className="mt-6 space-y-4">
              {culturalHighlights.map(item => (
                <div key={item.id} className="flex gap-4 rounded-xl border border-border bg-card p-4 card-lift">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=200'}
                    alt={item.title}
                    className="h-20 w-20 rounded-lg object-cover"
                  />
                  <div>
                    <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {item.category}
                    </span>
                    <h4 className="mt-1 font-heading text-base font-bold text-foreground">
                      {item.title}
                    </h4>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-heading text-2xl font-bold text-foreground">
                Festivals & Cultural Events
              </h3>
              <Link to="/events" className="text-xs font-semibold text-primary hover:text-accent">
                Event Calendar →
              </Link>
            </div>
            <div className="mt-6 space-y-4">
              {upcomingEvents.map(evt => (
                <div key={evt.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 card-lift">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-accent">
                      <Calendar className="h-3 w-3" /> {new Date(evt.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <h4 className="font-heading text-base font-bold text-foreground mt-0.5">
                      {evt.name}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {evt.location || evt.district}
                    </span>
                  </div>
                  <Link
                    to="/events"
                    className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition"
                  >
                    Details
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. RESPONSIBLE TOURISM PRINCIPLES */}
      <section className="bg-primary-dark text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-accent-light">Our Commitment</span>
            <h2 className="mt-1 font-heading text-3xl font-bold tracking-tight">
              Responsible Tourism Principles
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              Preserving Jharkhand's sacred groves, biodiversity, and indigenous customs for generations to come.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Trees,
                title: 'Leave No Trace',
                desc: 'Carry out all non-biodegradable waste. Avoid single-use plastics around waterfalls and forest tracks.'
              },
              {
                icon: Heart,
                title: 'Respect Living Culture',
                desc: 'Always ask permission before photographing tribal rituals, sacred Sarna groves, or village homes.'
              },
              {
                icon: Users,
                title: 'Support Local Artisans',
                desc: 'Buy directly from Dokra, Sohrai, and terracotta artisans to empower indigenous rural livelihoods.'
              },
              {
                icon: Shield,
                title: 'Travel Responsibly',
                desc: 'Follow safety barriers at high waterfalls and hire certified local guides in wildlife reserves.'
              }
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-bold">{pillar.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-300">{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
