import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Heart, 
  Calendar, 
  Clock, 
  IndianRupee, 
  Mountain, 
  ShieldAlert, 
  Check, 
  Route, 
  Star, 
  ArrowLeft,
  Navigation,
  ExternalLink,
  Sparkles,
  Share2,
  ShieldCheck,
  Copy
} from 'lucide-react';
import { 
  INITIAL_DESTINATIONS, 
  INITIAL_REVIEWS, 
  INITIAL_EXPERIENCES 
} from '../data/mockData';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { getNearbyDestinations, formatDistance } from '../lib/geo';
import { DestinationCard } from '../components/DestinationCard';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Custom Pin Icon
const pinIcon = L.divIcon({
  className: 'visitjhar-pin',
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#1e3d30" stroke="white" stroke-width="2"><path d="M12 21s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5" fill="white"/></svg>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

export const DestinationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const destination = INITIAL_DESTINATIONS.find(d => d.id === id);

  // Local reviews state (combines INITIAL_REVIEWS + user submitted reviews in demo session)
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem(`visitjhar_reviews_${id}`);
    const local = saved ? JSON.parse(saved) : [];
    const base = INITIAL_REVIEWS.filter(r => r.destination_id === id);
    return [...base, ...local];
  });

  const [ratingInput, setRatingInput] = useState(5);
  const [reviewInput, setReviewInput] = useState('');
  const [reviewSubmittedNotice, setReviewSubmittedNotice] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: destination?.name || 'VisitJhar Destination',
        text: destination?.short_description || '',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    }
  };

  if (!destination) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h2 className="font-heading text-2xl font-bold">Destination not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The destination may have been moved or the link is invalid.</p>
        <Link to="/explore" className="mt-6 inline-flex rounded-full bg-primary px-6 py-2 text-xs font-semibold text-white">
          Back to Explore
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(destination.id);
  const nearbyDestinations = getNearbyDestinations(destination, INITIAL_DESTINATIONS, 5);
  const districtExperiences = INITIAL_EXPERIENCES.filter(e => e.district.toLowerCase() === destination.district.toLowerCase());

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!reviewInput.trim()) return;

    const newReview = {
      id: `rev-${Date.now()}`,
      destination_id: destination.id,
      destination_name: destination.name,
      user_id: user?.id || 'demo-usr',
      user_name: user?.full_name || 'Traveler',
      rating: ratingInput,
      review_text: reviewInput.trim(),
      status: 'APPROVED', // For demo responsiveness, publish immediately or mark pending
      hidden: false,
      created_date: new Date().toISOString()
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(`visitjhar_reviews_${id}`, JSON.stringify([newReview]));
    setReviewInput('');
    setReviewSubmittedNotice(true);
    setTimeout(() => setReviewSubmittedNotice(false), 5000);
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Back & Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Explore
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition shadow-sm"
          >
            {shareCopied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 text-primary" />
                <span>Share</span>
              </>
            )}
          </button>

          <button
            onClick={() => toggleFavorite(destination.id)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold shadow-sm transition ${
              favorited 
                ? 'border-red-200 bg-red-50 text-red-600' 
                : 'border-border bg-card text-foreground hover:bg-secondary'
            }`}
          >
            <Heart className={`h-4 w-4 ${favorited ? 'fill-red-500 text-red-500' : ''}`} />
            {favorited ? 'Saved in Favourites' : 'Save to Favourites'}
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid gap-8 lg:grid-cols-2 items-center">
        {/* Left: Destination Info */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {destination.pillar && (
              <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
                {destination.pillar}
              </span>
            )}
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              {destination.category}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 text-accent" /> {destination.district} District
            </span>
            {destination.hidden_gem && (
              <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
                Hidden Gem
              </span>
            )}
            {avgRating && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {avgRating} ({reviews.length} reviews)
              </span>
            )}
          </div>

          <div>
            <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl text-foreground">
              {destination.name}
            </h1>
            {destination.alt_names && destination.alt_names.length > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                <strong className="text-foreground/80">Also known as:</strong> {destination.alt_names.join(', ')}
              </p>
            )}
          </div>

          <p className="text-base text-muted-foreground leading-relaxed">
            {destination.short_description}
          </p>

          {/* Key Facts Pill Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            <div className="rounded-xl border border-border bg-card p-3">
              <Calendar className="h-4 w-4 text-primary mb-1" />
              <span className="block text-[10px] uppercase font-semibold text-muted-foreground">Best Time</span>
              <span className="font-medium text-xs text-foreground">{destination.best_time_to_visit || 'Oct to Mar'}</span>
            </div>
            <div className="rounded-xl border border-border bg-card p-3">
              <Clock className="h-4 w-4 text-primary mb-1" />
              <span className="block text-[10px] uppercase font-semibold text-muted-foreground">Duration</span>
              <span className="font-medium text-xs text-foreground">{destination.recommended_duration || '2–3 hours'}</span>
            </div>
            <div className="rounded-xl border border-border bg-card p-3">
              <IndianRupee className="h-4 w-4 text-primary mb-1" />
              <span className="block text-[10px] uppercase font-semibold text-muted-foreground">Budget</span>
              <span className="font-medium text-xs text-foreground">{destination.estimated_budget || '₹ Budget'}</span>
            </div>
            <div className="rounded-xl border border-border bg-card p-3">
              <Mountain className="h-4 w-4 text-primary mb-1" />
              <span className="block text-[10px] uppercase font-semibold text-muted-foreground">Difficulty</span>
              <span className="font-medium text-xs text-foreground">{destination.difficulty || 'Easy'}</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to={`/plan-trip?startingLocation=${encodeURIComponent(destination.district)}`}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-primary-light transition"
            >
              <Route className="h-4 w-4" /> Add to Trip Planner
            </Link>
            <Link
              to={`/map?focus=${destination.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary transition"
            >
              <MapPin className="h-4 w-4 text-accent" /> View on Map
            </Link>
          </div>
        </div>

        {/* Right: Primary Hero Image */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-muted shadow-md">
          <img
            src={destination.image || 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=1000'}
            alt={destination.name}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Main Details & Secondary Info */}
      <div className="grid gap-10 lg:grid-cols-3">
        {/* Left 2 Cols: Description, Attractions, Safety, Reach */}
        <div className="lg:col-span-2 space-y-8">
          {/* Full Narrative */}
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4">
            <h2 className="font-heading text-2xl font-bold">About {destination.name}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {destination.description || destination.short_description}
            </p>

            {/* Cultural & Historical Significance */}
            {destination.cultural_significance && (
              <div className="mt-4 border-t border-border pt-4">
                <h3 className="font-heading text-lg font-bold text-foreground">Cultural Significance</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {destination.cultural_significance}
                </p>
              </div>
            )}

            {destination.historical_significance && (
              <div className="mt-4 border-t border-border pt-4">
                <h3 className="font-heading text-lg font-bold text-foreground">Historical Significance</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {destination.historical_significance}
                </p>
              </div>
            )}
          </section>

          {/* Attractions & Activities */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Main Attractions */}
            {destination.main_attractions && destination.main_attractions.length > 0 && (
              <section className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-heading text-lg font-bold mb-3">Key Highlights</h3>
                <ul className="space-y-2">
                  {destination.main_attractions.map((att, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <span>{att}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Activities */}
            {destination.activities && destination.activities.length > 0 && (
              <section className="rounded-2xl border border-border bg-card p-6">
                <h3 className="font-heading text-lg font-bold mb-3">Suggested Activities</h3>
                <div className="flex flex-wrap gap-2">
                  {destination.activities.map((act, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-foreground"
                    >
                      {act}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Safety Information Alert */}
          {destination.safety_information && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:p-6 text-amber-900">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0" />
                <h3 className="font-heading text-base font-bold">Important Safety Notice</h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-amber-800">
                {destination.safety_information}
              </p>
            </div>
          )}

          {/* How to Reach & Responsible Tourism */}
          <div className="grid gap-6 sm:grid-cols-2">
            {destination.how_to_reach && (
              <section className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="h-4 w-4 text-primary" />
                  <h3 className="font-heading text-base font-bold">How to Reach</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {destination.how_to_reach}
                </p>
              </section>
            )}

            {destination.responsible_tourism && (
              <section className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <h3 className="font-heading text-base font-bold">Responsible Travel</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {destination.responsible_tourism}
                </p>
              </section>
            )}
          </div>

          {/* Official Source & Verification Metadata Box */}
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 text-emerald-950">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-200/80 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0" />
                <h3 className="font-heading text-base font-bold">Official Tourism Source & Verification</h3>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-200/80 px-2.5 py-0.5 text-[11px] font-bold text-emerald-900 w-fit">
                <Check className="h-3 w-3" /> Status: {destination.verification_status || 'VERIFIED'}
              </span>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 pt-3 text-xs">
              <div>
                <span className="text-emerald-800 font-semibold block">Primary Authority:</span>
                <span className="text-emerald-950">{destination.source_title || 'Jharkhand Tourism Development Corporation (JTDC)'}</span>
              </div>
              <div>
                <span className="text-emerald-800 font-semibold block">Information Status:</span>
                <span className="text-emerald-950">{destination.information_status || 'Verified State Tourism Landmark'}</span>
              </div>
              <div>
                <span className="text-emerald-800 font-semibold block">Official Source:</span>
                <a
                  href={destination.source_urls?.[0] || 'https://tourism.jharkhand.gov.in/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-bold text-emerald-900 underline hover:text-emerald-700"
                >
                  tourism.jharkhand.gov.in <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </section>

          {/* Reviews & Ratings Section */}
          <section className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="font-heading text-2xl font-bold">Visitor Reviews</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Verified travelers sharing authentic Jharkhand travel experiences.
                </p>
              </div>
              {avgRating && (
                <div className="text-right">
                  <span className="font-heading text-3xl font-bold text-foreground">{avgRating}</span>
                  <span className="text-xs text-muted-foreground block">out of 5 stars</span>
                </div>
              )}
            </div>

            {/* Review Form */}
            <form onSubmit={handleReviewSubmit} className="rounded-xl border border-border bg-secondary/30 p-4 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">Write a Review</h3>

              {reviewSubmittedNotice && (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" /> Review submitted and published to your session!
                </div>
              )}

              <div className="flex items-center gap-3">
                <label className="text-xs text-muted-foreground">Rating:</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRatingInput(star)}
                      className="p-1 hover:scale-110 transition"
                    >
                      <Star className={`h-4 w-4 ${star <= ratingInput ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                value={reviewInput}
                onChange={(e) => setReviewInput(e.target.value)}
                placeholder="Share your travel tips, best time to arrive, guides or safety advice..."
                rows={3}
                className="w-full rounded-lg border border-border bg-card p-3 text-xs text-foreground outline-none focus:border-primary"
                required
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">
                  {isAuthenticated ? `Posting as ${user?.full_name}` : 'Sign in to submit your review'}
                </span>
                <button
                  type="submit"
                  className="rounded-full bg-primary px-5 py-1.5 text-xs font-semibold text-white hover:bg-primary-light transition"
                >
                  Submit Review
                </button>
              </div>
            </form>

            {/* Review List */}
            <div className="space-y-4">
              {reviews.map(r => (
                <div key={r.id} className="rounded-xl border border-border bg-card p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-sm font-bold text-foreground">{r.user_name}</span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`h-3 w-3 ${s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{r.review_text}</p>
                  <span className="text-[10px] text-slate-400 block">
                    {new Date(r.created_date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Col: Map & Proximity */}
        <div className="space-y-6">
          {/* Mini Leaflet Map */}
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm space-y-3">
            <h3 className="font-heading text-base font-bold flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-accent" /> Location & Coordinates
            </h3>
            <div className="aspect-[4/3] w-full overflow-hidden rounded-xl border border-border">
              <MapContainer
                center={[destination.latitude, destination.longitude]}
                zoom={11}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[destination.latitude, destination.longitude]} icon={pinIcon}>
                  <Popup>
                    <div className="p-2 text-center">
                      <strong className="block text-xs font-bold text-primary">{destination.name}</strong>
                      <span className="text-[10px] text-muted-foreground">{destination.district} District</span>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <span>{destination.latitude.toFixed(4)}° N, {destination.longitude.toFixed(4)}° E</span>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${destination.latitude},${destination.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-primary hover:text-accent font-semibold"
              >
                Directions <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Geographic Proximity (Haversine LO formula) */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4">
            <div>
              <h3 className="font-heading text-base font-bold text-foreground">
                Nearby Places to Explore
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Calculated by geographic proximity from {destination.name}.
              </p>
            </div>

            <div className="space-y-3">
              {nearbyDestinations.map(nearby => (
                <Link
                  key={nearby.id}
                  to={`/destination/${nearby.id}`}
                  className="flex items-center justify-between rounded-xl border border-border p-2.5 hover:bg-secondary transition group"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={nearby.image || 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=100'}
                      alt={nearby.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition">
                        {nearby.name}
                      </h4>
                      <span className="text-[10px] text-muted-foreground">{nearby.category}</span>
                    </div>
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {formatDistance(nearby.distance_km)}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* District Local Experiences */}
          {districtExperiences.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3">
              <h3 className="font-heading text-base font-bold text-foreground">
                Local Experiences in {destination.district}
              </h3>
              <div className="space-y-2.5">
                {districtExperiences.slice(0, 3).map(exp => (
                  <div key={exp.id} className="rounded-xl border border-border p-3 space-y-1">
                    <span className="text-[10px] font-semibold text-accent uppercase tracking-wider">{exp.type}</span>
                    <h4 className="text-xs font-bold text-foreground">{exp.name}</h4>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{exp.description}</p>
                    <span className="text-[10px] font-medium text-primary block mt-1">{exp.price_range || exp.estimated_cost}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
