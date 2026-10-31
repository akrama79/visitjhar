import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { INITIAL_CATEGORIES, INITIAL_DISTRICTS } from '../data/mockData';
import { Sparkles, Check, Save, User, ShieldCheck } from 'lucide-react';
import { BudgetTier } from '../types';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [homeLocation, setHomeLocation] = useState(user?.home_location || 'Ranchi');
  const [travelStyle, setTravelStyle] = useState(user?.travel_style || 'Balanced');
  const [preferredDuration, setPreferredDuration] = useState(user?.preferred_duration || '2 Days');
  const [preferredBudget, setPreferredBudget] = useState<BudgetTier>(user?.preferred_budget || 'LOW');
  const [travelGroup, setTravelGroup] = useState(user?.travel_group || 'Friends');
  const [age, setAge] = useState(user?.age || 26);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(user?.interests || []);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(user?.preferred_categories || []);
  const [savedNotice, setSavedNotice] = useState(false);

  const availableInterests = [
    'Nature', 'Waterfalls', 'Wildlife', 'Adventure', 
    'Culture', 'Tribal Heritage', 'History', 'Religious Tourism', 
    'Food', 'Photography', 'Rural Experiences', 'Handicrafts'
  ];

  // Completeness score formula (iA fields from reference app)
  const profileFields = [
    selectedInterests.length > 0,
    selectedCategories.length > 0,
    !!travelStyle,
    !!preferredDuration,
    !!preferredBudget,
    !!travelGroup,
    !!homeLocation,
    !!age
  ];
  const completeness = Math.round((profileFields.filter(Boolean).length / profileFields.length) * 100);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      full_name: fullName,
      home_location: homeLocation,
      travel_style: travelStyle,
      preferred_duration: preferredDuration,
      preferred_budget: preferredBudget,
      travel_group: travelGroup,
      age: Number(age),
      interests: selectedInterests,
      preferred_categories: selectedCategories
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 4000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header & Completeness */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
            alt={user?.full_name}
            className="h-16 w-16 rounded-full object-cover ring-2 ring-primary/20"
          />
          <div>
            <h1 className="font-heading text-2xl font-bold text-foreground">
              {user?.full_name}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Account role: <strong>{user?.role === 'admin' ? 'Administrator' : 'Visitor / Explorer'}</strong>
            </p>
          </div>
        </div>

        {/* Profile Completeness Bar */}
        <div className="w-full sm:w-56 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-muted-foreground">Profile Match Quality</span>
            <span className="text-primary">{completeness}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-500 rounded-full"
              style={{ width: `${completeness}%` }}
            ></div>
          </div>
        </div>
      </div>

      {savedNotice && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
          <Check className="h-4 w-4 text-emerald-600" /> Travel preferences updated! Recommendations recalculate dynamically.
        </div>
      )}

      {/* Preferences Form */}
      <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-8">
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">Travel Style & Preferences</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            These settings power your personalized destination ranking and trip planning recommendations.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
              required
            />
          </div>

          {/* Home Location */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Home District in Jharkhand</label>
            <select
              value={homeLocation}
              onChange={(e) => setHomeLocation(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary cursor-pointer"
            >
              {INITIAL_DISTRICTS.map(d => (
                <option key={d.id} value={d.name}>{d.name} District</option>
              ))}
            </select>
          </div>

          {/* Travel Style */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Travel Pace & Style</label>
            <select
              value={travelStyle}
              onChange={(e) => setTravelStyle(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary cursor-pointer"
            >
              <option value="Relaxed">Relaxed (Slow travel & leisure)</option>
              <option value="Balanced">Balanced (Comfortable mix of sights & rest)</option>
              <option value="Adventurous">Adventurous (Active trekking & outdoors)</option>
              <option value="Cultural">Cultural (Tribal heritage & local crafts)</option>
            </select>
          </div>

          {/* Preferred Trip Length */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Typical Trip Length</label>
            <select
              value={preferredDuration}
              onChange={(e) => setPreferredDuration(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary cursor-pointer"
            >
              <option value="1 Day">1 Day Trip</option>
              <option value="2 Days">2 Days Weekend</option>
              <option value="3 Days">3 Days</option>
              <option value="4 Days">4+ Days Multi-district</option>
            </select>
          </div>

          {/* Preferred Budget */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Preferred Budget Tier</label>
            <select
              value={preferredBudget}
              onChange={(e) => setPreferredBudget(e.target.value as BudgetTier)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary cursor-pointer"
            >
              <option value="LOW">₹ Budget Friendly</option>
              <option value="MODERATE">₹₹ Moderate Comfort</option>
              <option value="PREMIUM">₹₹₹ Premium Experiential</option>
            </select>
          </div>

          {/* Travel Group */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">Primary Travel Group</label>
            <select
              value={travelGroup}
              onChange={(e) => setTravelGroup(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary cursor-pointer"
            >
              <option value="Solo">Solo</option>
              <option value="Couple">Couple</option>
              <option value="Family">Family</option>
              <option value="Friends">Friends</option>
              <option value="Group">Tour Group</option>
            </select>
          </div>
        </div>

        {/* Interests Selection */}
        <div>
          <label className="block text-xs font-bold text-foreground mb-2">Interests (Select all that apply)</label>
          <div className="flex flex-wrap gap-2">
            {availableInterests.map(interest => {
              const active = selectedInterests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    active ? 'bg-primary text-white shadow' : 'border border-border bg-background text-foreground hover:bg-secondary'
                  }`}
                >
                  {active && <Check className="inline-block h-3 w-3 mr-1" />}
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred Categories */}
        <div>
          <label className="block text-xs font-bold text-foreground mb-2">Favorite Tourism Categories</label>
          <div className="flex flex-wrap gap-2">
            {INITIAL_CATEGORIES.slice(0, 10).map(cat => {
              const active = selectedCategories.includes(cat.name);
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => toggleCategory(cat.name)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    active ? 'bg-accent text-white shadow' : 'border border-border bg-background text-foreground hover:bg-secondary'
                  }`}
                >
                  {active && <Check className="inline-block h-3 w-3 mr-1" />}
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-2.5 text-xs font-bold text-white shadow hover:bg-primary-light transition"
          >
            <Save className="h-4 w-4" /> Save Travel Profile
          </button>
        </div>
      </form>
    </div>
  );
};
