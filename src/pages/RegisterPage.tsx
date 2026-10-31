import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, User, ArrowRight, Sparkles } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, false);
    navigate('/profile');
  };

  return (
    <div className="min-h-[85vh] grid lg:grid-cols-2">
      {/* Left Artwork */}
      <div className="relative hidden lg:block overflow-hidden bg-slate-900">
        <img
          src="https://media.base44.com/images/public/6aa8db580aef597b6eba92f6/b885c1db1_generated_image.png"
          alt="Sarhul Celebration"
          className="absolute inset-0 h-full w-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-accent/60"></div>
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-2">
            <span className="font-heading text-2xl font-bold tracking-tight">
              Visit<span className="text-accent">Jhar</span>
            </span>
          </div>

          <div className="space-y-4 max-w-md">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> Join the Community
            </span>
            <h2 className="font-heading text-4xl font-extrabold leading-tight">
              Unlock Tailored Tourism in Jharkhand
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed">
              Create your traveler profile, bookmark secret waterfalls, generate smart itineraries, and travel ethically across indigenous homelands.
            </p>
          </div>

          <p className="text-xs text-slate-400">
            A Smart Digital Platform for Eco & Cultural Tourism
          </p>
        </div>
      </div>

      {/* Right Register Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="font-heading text-3xl font-extrabold text-foreground">
              Create your account
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Begin discovering hidden Jharkhand with personalized picks.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Full Name</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Oraon"
                  className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3 text-xs text-foreground outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Email address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3 text-xs text-foreground outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Password</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3 text-xs text-foreground outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-light transition flex items-center justify-center gap-1.5"
            >
              Register & Setup Profile <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:text-accent">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
