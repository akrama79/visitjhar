import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Compass, Filter, ExternalLink } from 'lucide-react';
import { INITIAL_DESTINATIONS, INITIAL_CATEGORIES, INITIAL_DISTRICTS } from '../data/mockData';
import { Destination } from '../types';

// Custom Pin Marker
const createCustomPin = (category: string) => {
  let color = '#1e3d30';
  if (category === 'Waterfalls') color = '#0284c7';
  if (category === 'Wildlife') color = '#059669';
  if (category === 'Religious') color = '#d97706';
  if (category === 'Adventure') color = '#dc2626';

  return L.divIcon({
    className: 'visitjhar-pin',
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2"><path d="M12 21s-7-7.5-7-12a7 7 0 0 1 14 0c0 4.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5" fill="white"/></svg>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

// User Location Pin
const userLocationPin = L.divIcon({
  className: 'visitjhar-user-pin',
  html: `<div style="position:relative;width:24px;height:24px;"><div style="position:absolute;inset:0;border-radius:50%;background:#2563eb;opacity:0.25;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div><div style="position:absolute;inset:4px;border-radius:50%;background:#2563eb;border:2px solid white;"></div></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

// Map controller component for centering/focus
const MapController: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
};

export const MapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const focusId = searchParams.get('focus');

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [mapCenter, setMapCenter] = useState<[number, number]>([23.6, 85.5]); // Central Jharkhand
  const [mapZoom, setMapZoom] = useState(8);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Focus destination if URL param provided
  useEffect(() => {
    if (focusId) {
      const target = INITIAL_DESTINATIONS.find(d => d.id === focusId);
      if (target && target.latitude && target.longitude) {
        setMapCenter([target.latitude, target.longitude]);
        setMapZoom(12);
      }
    }
  }, [focusId]);

  // Request browser geolocation
  const handleFindLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser');
      return;
    }
    setLocationStatus('Locating...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserLocation(coords);
        setMapCenter(coords);
        setMapZoom(11);
        setLocationStatus(null);
      },
      () => {
        setLocationStatus('Could not access your location. Permission denied.');
      }
    );
  };

  const filteredDestinations = INITIAL_DESTINATIONS.filter(d => {
    if (d.latitude == null || d.longitude == null) return false;
    if (selectedCategory !== 'all' && d.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    if (selectedDistrict !== 'all' && d.district.toLowerCase() !== selectedDistrict.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="relative h-[calc(100vh-100px)] w-full flex flex-col">
      {/* Top Filter Bar Overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-white/90 p-3 shadow-lg backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground outline-none cursor-pointer"
          >
            <option value="all">All Categories ({INITIAL_CATEGORIES.length})</option>
            {INITIAL_CATEGORIES.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          {/* District Filter */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground outline-none cursor-pointer"
          >
            <option value="all">All Districts (24)</option>
            {INITIAL_DISTRICTS.map(d => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>

          <span className="text-xs text-muted-foreground hidden sm:inline">
            Showing <strong className="text-foreground">{filteredDestinations.length}</strong> markers
          </span>
        </div>

        {/* Geolocation Button */}
        <div className="flex items-center gap-2">
          {locationStatus && <span className="text-xs text-amber-600">{locationStatus}</span>}
          <button
            onClick={handleFindLocation}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-primary-light transition"
          >
            <Navigation className="h-3.5 w-3.5" />
            My Location
          </button>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="h-full w-full">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          <MapController center={mapCenter} zoom={mapZoom} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User Location Marker */}
          {userLocation && (
            <Marker position={userLocation} icon={userLocationPin}>
              <Popup>
                <div className="p-2 text-center">
                  <span className="text-xs font-bold text-blue-600">You are here</span>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Destination Markers */}
          {filteredDestinations.map(d => (
            <Marker
              key={d.id}
              position={[d.latitude, d.longitude]}
              icon={createCustomPin(d.category)}
            >
              <Popup>
                <div className="w-56 p-2 space-y-2">
                  <img
                    src={d.image || 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=300'}
                    alt={d.name}
                    className="h-24 w-full rounded-lg object-cover"
                  />
                  <div>
                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                      {d.category}
                    </span>
                    <h4 className="mt-1 font-heading text-sm font-bold text-foreground">
                      {d.name}
                    </h4>
                    <span className="text-[10px] text-muted-foreground block">
                      {d.district} District • {d.estimated_budget || '₹ Budget'}
                    </span>
                  </div>
                  <Link
                    to={`/destination/${d.id}`}
                    className="mt-2 block w-full rounded-md bg-primary py-1.5 text-center text-xs font-semibold text-white hover:bg-primary-light transition"
                  >
                    View Destination Details →
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};
