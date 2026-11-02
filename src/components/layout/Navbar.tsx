import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Sparkles, 
  Heart, 
  User, 
  Menu, 
  X, 
  ShieldAlert, 
  Route, 
  LogOut,
  LayoutDashboard
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { favorites } = useFavorites();
  const location = useLocation();

  const navLinks = [
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Map', path: '/map', icon: MapPin },
    { label: 'Plan Trip', path: '/plan-trip', icon: Route },
    { label: 'Culture', path: '/culture', icon: Sparkles },
    { label: 'Events', path: '/events', icon: Calendar },
    { label: 'Experiences', path: '/experiences', icon: Compass },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img 
            src="https://media.base44.com/images/public/6aa8db580aef597b6eba92f6/078ad6592_logo.png/v1/fit/w_180,h_180/078ad6592_logo.png" 
            alt="VisitJhar Logo" 
            className="h-10 w-10 rounded-full object-cover shadow-sm ring-1 ring-primary/20"
          />
          <div>
            <span className="font-heading text-2xl font-bold tracking-tight text-primary">
              Visit<span className="text-accent">Jhar</span>
            </span>
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground -mt-1">
              Heart of Jharkhand
            </p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map(link => {
            const Icon = link.icon;
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active 
                    ? 'bg-secondary text-primary font-semibold' 
                    : 'text-foreground/80 hover:bg-secondary/70 hover:text-foreground'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-accent' : 'text-muted-foreground'}`} />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Action Icons & Auth */}
        <div className="flex items-center gap-3">
          {/* Favorites Button */}
          <Link
            to="/favorites"
            className="relative rounded-lg p-2 text-foreground/80 hover:bg-secondary transition"
            title="Saved Destinations"
          >
            <Heart className="h-5 w-5 text-red-500" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {favorites.length}
              </span>
            )}
          </Link>

          {/* User Profile / Admin Link */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground/80 hover:bg-secondary transition"
              >
                <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
                Dashboard
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 text-xs font-semibold hover:bg-primary/20 transition"
                >
                  <ShieldAlert className="h-3.5 w-3.5 text-primary" />
                  Admin
                </Link>
              )}

              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-full p-1 hover:ring-2 hover:ring-primary/20 transition"
                title={user?.full_name}
              >
                <img
                  src={user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={user?.full_name}
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-border"
                />
              </Link>

              <button
                onClick={logout}
                className="text-muted-foreground hover:text-red-500 p-1.5 rounded-lg hover:bg-secondary transition"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-foreground/80 hover:bg-secondary transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-light transition"
              >
                Join
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-foreground/80 lg:hidden hover:bg-secondary transition"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-white px-4 py-4 lg:hidden space-y-1">
          {navLinks.map(link => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive(link.path) ? 'bg-secondary text-primary font-semibold' : 'text-foreground/80 hover:bg-secondary'
                }`}
              >
                <Icon className="h-4 w-4 text-accent" />
                {link.label}
              </Link>
            );
          })}
          <hr className="my-2 border-border" />
          <Link
            to="/itineraries"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary"
          >
            <Route className="h-4 w-4 text-primary" />
            Community Itineraries
          </Link>
          <Link
            to="/responsible-tourism"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 hover:bg-secondary"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            Responsible Tourism Guide
          </Link>
        </div>
      )}
    </header>
  );
};
