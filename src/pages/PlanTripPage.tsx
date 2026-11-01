import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Route, Calendar, Users, IndianRupee, MapPin, Sparkles, Clock, Check, Save, Printer, Share2 } from 'lucide-react';
import { INITIAL_DESTINATIONS, INITIAL_DISTRICTS } from '../data/mockData';
import { generateSmartItinerary } from '../lib/itineraryPlanner';
import { useAuth } from '../context/AuthContext';
import { ItineraryDay, Itinerary } from '../types';
import { DestinationImage } from '../components/DestinationImage';

export const PlanTripPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [startingLocation, setStartingLocation] = useState(
    searchParams.get('startingLocation') || user?.home_location || 'Ranchi'
  );
  const [numDays, setNumDays] = useState(2);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [budget, setBudget] = useState(user?.preferred_budget || 'LOW');
  const [travelGroup, setTravelGroup] = useState(user?.travel_group || 'Friends');
  const [numTravelers, setNumTravelers] = useState(2);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user?.interests || ['Waterfalls', 'Nature']
  );

  const [generatedPlan, setGeneratedPlan] = useState<ItineraryDay[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const availableInterests = [
    'Nature', 'Waterfalls', 'Wildlife', 'Adventure', 
    'Culture', 'Tribal Heritage', 'History', 'Religious Tourism', 
    'Food', 'Photography', 'Rural Experiences', 'Handicrafts'
  ];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setTimeout(() => {
      const plan = generateSmartItinerary(INITIAL_DESTINATIONS, {
        startingLocation,
        numDays,
        startDate,
        budget,
        travelGroup,
        numTravelers,
        interests: selectedInterests
      });
      setGeneratedPlan(plan);
      setIsGenerating(false);
      // Smooth scroll to generated plan
      setTimeout(() => {
        document.getElementById('plan-results')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 400);
  };

  const handleSaveItinerary = () => {
    if (!generatedPlan) return;
    const newItinerary: Itinerary = {
      id: `itin-${Date.now()}`,
      user_id: user?.id || 'demo-usr',
      name: `${startingLocation} ${numDays}-Day Jharkhand Tour`,
      num_days: numDays,
      start_date: startDate,
      budget,
      travel_group: travelGroup,
      num_travelers: numTravelers,
      starting_location: startingLocation,
      interests: selectedInterests,
      days: generatedPlan,
      created_date: new Date().toISOString()
    };

    const saved = localStorage.getItem('visitjhar_user_itineraries');
    const existing: Itinerary[] = saved ? JSON.parse(saved) : [];
    localStorage.setItem('visitjhar_user_itineraries', JSON.stringify([newItinerary, ...existing]));

    setSaveNotice('Itinerary saved to your dashboard & saved itineraries!');
    setTimeout(() => setSaveNotice(null), 5000);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 px-3 py-1 text-xs font-bold text-accent">
          <Route className="h-3.5 w-3.5" /> Smart Trip Planner
        </span>
        <h1 className="mt-3 font-heading text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
          Plan Your Jharkhand Journey
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Create an optimized day-wise itinerary with morning, afternoon, and evening slots based on geographic proximity, your budget, and travel preferences.
        </p>
      </div>

      {/* Generator Form */}
      <form onSubmit={handleGenerate} className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Starting Location */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-accent" /> Starting Hub / District
            </label>
            <select
              value={startingLocation}
              onChange={(e) => setStartingLocation(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-primary cursor-pointer"
            >
              {INITIAL_DISTRICTS.map(d => (
                <option key={d.id} value={d.name}>{d.name} District</option>
              ))}
            </select>
          </div>

          {/* Number of Days */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-accent" /> Trip Duration
            </label>
            <select
              value={numDays}
              onChange={(e) => setNumDays(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-primary cursor-pointer"
            >
              <option value={1}>1 Day (Express Day Trip)</option>
              <option value={2}>2 Days (Weekend Circuit)</option>
              <option value={3}>3 Days (Heritage & Nature)</option>
              <option value={4}>4 Days (Deep Discovery)</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-accent" /> Travel Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-primary"
            />
          </div>

          {/* Budget Tier */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1">
              <IndianRupee className="h-3.5 w-3.5 text-accent" /> Budget Tier
            </label>
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value as any)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-primary cursor-pointer"
            >
              <option value="LOW">₹ Budget Friendly</option>
              <option value="MODERATE">₹₹ Moderate Comfort</option>
              <option value="PREMIUM">₹₹₹ Premium Experience</option>
            </select>
          </div>

          {/* Travel Group */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-accent" /> Traveling With
            </label>
            <select
              value={travelGroup}
              onChange={(e) => setTravelGroup(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-primary cursor-pointer"
            >
              <option value="Solo">Solo Traveler</option>
              <option value="Couple">Couple</option>
              <option value="Family">Family with Children</option>
              <option value="Friends">Friends Group</option>
              <option value="Group">Tour Group</option>
            </select>
          </div>

          {/* Number of Travelers */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-accent" /> Number of Travelers
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={numTravelers}
              onChange={(e) => setNumTravelers(Number(e.target.value))}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium text-foreground outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Interests Multi-Select */}
        <div>
          <label className="block text-xs font-bold text-foreground mb-2">
            Select Your Travel Interests
          </label>
          <div className="flex flex-wrap gap-2">
            {availableInterests.map(interest => {
              const selected = selectedInterests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    selected
                      ? 'bg-primary text-white shadow-sm'
                      : 'border border-border bg-background text-foreground/80 hover:bg-secondary'
                  }`}
                >
                  {selected && <Check className="inline-block h-3 w-3 mr-1" />}
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2 text-center">
          <button
            type="submit"
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-accent-light transition disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            {isGenerating ? 'Generating Proximity-Optimized Route...' : 'Generate Smart Itinerary'}
          </button>
        </div>
      </form>

      {/* Generated Itinerary Output */}
      {generatedPlan && (
        <div id="plan-results" className="space-y-8 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-accent">Personalized Plan</span>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Your {startingLocation} {numDays}-Day Itinerary
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Clustered geographically to minimize transit time and maximize scenic exploration.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary transition shadow-sm"
              >
                <Printer className="h-3.5 w-3.5 text-muted-foreground" /> Print / PDF
              </button>
              <button
                type="button"
                onClick={handleSaveItinerary}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-white shadow hover:bg-primary-light transition"
              >
                <Save className="h-4 w-4" /> Save This Itinerary
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm text-xs">
            <div>
              <span className="text-muted-foreground block text-[11px]">Departure Hub</span>
              <strong className="text-foreground block mt-0.5">{startingLocation} District</strong>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Duration</span>
              <strong className="text-foreground block mt-0.5">{numDays} Days / {numDays * 3} Stops</strong>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Travel Party</span>
              <strong className="text-foreground block mt-0.5">{numTravelers} Traveler{numTravelers > 1 ? 's' : ''} ({travelGroup})</strong>
            </div>
            <div>
              <span className="text-muted-foreground block text-[11px]">Budget Strategy</span>
              <strong className="text-foreground block mt-0.5">{budget === 'LOW' ? '₹ Budget' : budget === 'MODERATE' ? '₹₹ Moderate' : '₹₹₹ Premium'}</strong>
            </div>
          </div>

          {saveNotice && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
              <Check className="h-4 w-4 text-emerald-600" /> {saveNotice}
            </div>
          )}

          {/* Days Loop */}
          <div className="space-y-8">
            {generatedPlan.map(dayPlan => (
              <div key={dayPlan.day} className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {dayPlan.day}
                    </span>
                    Day {dayPlan.day}
                  </h3>
                  <span className="text-xs font-medium text-muted-foreground">3 Slots Scheduled</span>
                </div>

                {/* Slots: Morning, Afternoon, Evening */}
                <div className="grid gap-6 md:grid-cols-3">
                  {(['Morning', 'Afternoon', 'Evening'] as const).map(slotName => {
                    const slot = dayPlan.slots[slotName];
                    if (!slot) return null;

                    return (
                      <div key={slotName} className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="rounded-md bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent">
                              {slotName}
                            </span>
                            {slot.matchScore && (
                              <span className="text-[10px] font-semibold text-emerald-700">
                                {slot.matchScore}% Match
                              </span>
                            )}
                          </div>

                          <DestinationImage
                            src={slot.image}
                            alt={slot.destination_name}
                            category={slot.category}
                            targetSize={500}
                            className="h-32 w-full rounded-xl object-cover mb-2"
                          />

                          <h4 className="font-heading text-base font-bold text-foreground">
                            {slot.destination_name}
                          </h4>
                          <span className="text-xs text-muted-foreground block">
                            {slot.district} District • {slot.category}
                          </span>

                          <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                            <p><strong>Duration:</strong> {slot.visit_duration}</p>
                            <p><strong>Activities:</strong> {(slot.activities || []).slice(0, 3).join(', ')}</p>
                          </div>
                        </div>

                        <Link
                          to={`/destination/${slot.destination_id}`}
                          className="mt-3 block w-full rounded-lg bg-card border border-border py-1.5 text-center text-xs font-semibold text-primary hover:bg-primary hover:text-white transition"
                        >
                          View Details →
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
