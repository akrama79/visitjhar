import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, Trees, Sparkles } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('explorer@visitjhar.in');
  const [password, setPassword] = useState('password123');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, email.includes('admin'));
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[85vh] grid lg:grid-cols-2">
      {/* Left Artwork */}
      <div className="relative hidden lg:block overflow-hidden bg-slate-900">
        <img
          src="https://media.base44.com/images/public/6aa8db580aef597b6eba92f6/5a6983c3b_generated_image.png"
          alt="Hundru Falls"
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
              <Sparkles className="h-3.5 w-3.5 text-accent" /> Eco & Cultural Tourism
            </span>
            <h2 className="font-heading text-4xl font-extrabold leading-tight">
              Explore the Heart of Jharkhand
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed">
              Sign in to receive transparent weighted destination recommendations, save day-wise itineraries, and contribute authentic travel experiences.
            </p>
          </div>

          <p className="text-xs text-slate-400">
            A Smart Digital Platform for Eco & Cultural Tourism
          </p>
        </div>
      </div>

      {/* Right Sign In Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="font-heading text-3xl font-extrabold text-foreground">
              Welcome back
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Sign in to your VisitJhar travel account.
            </p>
          </div>

          {/* Demo Credentials Helper Pill */}
          <div className="rounded-xl border border-border bg-secondary/50 p-3.5 text-xs space-y-1">
            <span className="font-semibold text-primary block">Demo Credentials Active:</span>
            <div className="flex items-center justify-between text-muted-foreground">
              <span>Visitor: <code>explorer@visitjhar.in</code></span>
              <span>Admin: <code>admin@visitjhar.in</code></span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Email address</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-3 text-xs text-foreground outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-light transition flex items-center justify-center gap-1.5"
            >
              Sign In <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:text-accent">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
