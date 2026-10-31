import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Compass, Shield, Trees, MapPin, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand & Mission */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-2xl font-bold tracking-tight text-white">
                Visit<span className="text-accent">Jhar</span>
              </span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-300">
              A smart, independent digital platform promoting eco-tourism, living tribal traditions, and responsible travel across all 24 districts of Jharkhand.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <Trees className="h-4 w-4 text-emerald-400" />
              <span>Forests, Waterfalls, Heritage & Living Culture</span>
            </div>
          </div>

          {/* Quick Discover */}
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-accent">
              Explore Jharkhand
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li>
                <Link to="/explore?category=Waterfalls" className="hover:text-white transition">
                  Waterfalls & Cascades
                </Link>
              </li>
              <li>
                <Link to="/explore?category=Wildlife" className="hover:text-white transition">
                  Betla & Dalma Wildlife
                </Link>
              </li>
              <li>
                <Link to="/culture" className="hover:text-white transition">
                  Tribal Arts & Dokra Crafts
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition">
                  Sarhul & Tribal Festivals
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-white transition">
                  Interactive State Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Responsible Travel */}
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-accent">
              Responsible Tourism
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-300">
              <li>
                <Link to="/responsible-tourism" className="hover:text-white transition">
                  Leave No Trace Guidelines
                </Link>
              </li>
              <li>
                <Link to="/experiences" className="hover:text-white transition">
                  Homestays & Village Tourism
                </Link>
              </li>
              <li>
                <Link to="/plan-trip" className="hover:text-white transition">
                  Smart Day-Wise Planner
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  About VisitJhar Initiative
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Verification Notice */}
          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-accent">
              Official Data Source
            </h4>
            <p className="mt-3 text-xs leading-relaxed text-slate-300">
              Tourism destination data referenced from official portals of Jharkhand Tourism Development Corporation (JTDC) and Dept. of Tourism.
            </p>
            <a
              href="https://tourism.jharkhand.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 transition"
            >
              <span>tourism.jharkhand.gov.in</span>
              <ExternalLink className="h-3 w-3 text-accent" />
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} VisitJhar. Independent Rebuild for Jharkhand Tourism.</p>
          <div className="flex items-center gap-1">
            <span>Built with care for Jharkhand's heritage & communities</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
