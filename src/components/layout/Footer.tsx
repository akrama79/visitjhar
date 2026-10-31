import React from 'react';
import { Link } from 'react-router-dom';
import { Trees, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border/80 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* 1. Brand Identity */}
          <div className="space-y-3">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="font-heading text-2xl font-bold tracking-tight text-white">
                Visit<span className="text-accent">Jhar</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              An independent tourism discovery platform highlighting the natural landscapes, sacred sites, and indigenous heritage of Jharkhand.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium pt-1">
              <Trees className="h-4 w-4" />
              <span>Covering all 24 districts of Jharkhand</span>
            </div>
          </div>

          {/* 2. Explore Links */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
              Explore Destinations
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/explore?pillar=Nature and Waterfalls" className="hover:text-white transition">
                  Waterfalls & Cascades
                </Link>
              </li>
              <li>
                <Link to="/explore?pillar=Wildlife, Forests and Protected Areas" className="hover:text-white transition">
                  Wildlife & Sal Forests
                </Link>
              </li>
              <li>
                <Link to="/explore?pillar=Spiritual and Religious Destinations" className="hover:text-white transition">
                  Spiritual & Pilgrimage
                </Link>
              </li>
              <li>
                <Link to="/explore?pillar=Heritage, Architecture and Archaeology" className="hover:text-white transition">
                  Heritage Forts & Architecture
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-white transition">
                  Interactive Destination Map
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Planning & Culture */}
          <div>
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
              Planning & Culture
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/plan-trip" className="hover:text-white transition">
                  Day-Wise Trip Planner
                </Link>
              </li>
              <li>
                <Link to="/itineraries" className="hover:text-white transition">
                  Curated Tourism Circuits
                </Link>
              </li>
              <li>
                <Link to="/culture" className="hover:text-white transition">
                  Living Tribal Heritage
                </Link>
              </li>
              <li>
                <Link to="/experiences" className="hover:text-white transition">
                  Master Artisans & Guides
                </Link>
              </li>
              <li>
                <Link to="/responsible-tourism" className="hover:text-white transition">
                  Ethical Travel Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Sources & Verification */}
          <div className="space-y-3">
            <h4 className="font-heading text-xs font-bold uppercase tracking-wider text-white">
              Data & Verification
            </h4>
            <p className="text-xs leading-relaxed text-slate-400">
              Academic demonstration project. Tourism locations, coordinates, and historical context cross-referenced with JTDC gazettes and public records.
            </p>
            <a
              href="https://tourism.jharkhand.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition"
            >
              <span>tourism.jharkhand.gov.in</span>
              <ExternalLink className="h-3.5 w-3.5 text-accent" />
            </a>
          </div>
        </div>

        {/* Bottom copyright & attribution */}
        <div className="mt-10 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} VisitJhar. Independent tourism rebuild.</p>
          <div className="flex items-center gap-2">
            <span>Built for academic demonstration</span>
            <span>•</span>
            <Link to="/about" className="hover:text-white transition underline">
              About & Methodology
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
