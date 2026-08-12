import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AlertCircle, RefreshCw, ShieldCheck, Activity } from 'lucide-react';


// Custom Dark Medical Cyberpunk Map Styling for Google Maps
const DARK_MEDICAL_MAP_STYLE = [
  { elementType: 'geometry', stylers: [{ color: '#0b101d' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0b101d' }, { weight: 2 }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#64748b' }]
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#00f2fe' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#0f172a' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#475569' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#0f172a' }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#94a3b8' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#334155' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1e293b' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#00f2fe' }]
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#070b14' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }]
  }
];

export const GoogleHospitalMap = ({
  hospitals = [],
  winningHospitalId = null,
  onSelectHospital = null,
  height = '460px',
  showTitle = true
}) => {
  const mapRef = useRef(null);
  const googleMapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const infoWindowRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Helper to create custom SVG marker icon
  const createMarkerIcon = (hospital, isWinning) => {
    const isOnline = hospital.status === 'ONLINE';
    const primaryColor = isWinning ? '#00f2fe' : (isOnline ? '#00e676' : '#ffb300');
    const strokeColor = isWinning ? '#ffffff' : '#0b101d';
    const scale = isWinning ? 1.3 : 1.0;

    const svgIcon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${36 * scale}" height="${44 * scale}" viewBox="0 0 36 44" fill="none">
        <filter id="shadow" x="0" y="0" width="36" height="44" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="${primaryColor}" flood-opacity="0.5"/>
        </filter>
        <g filter="url(#shadow)">
          <path d="M18 2C10.268 2 4 8.268 4 16C4 25.5 18 40 18 40C18 40 32 25.5 32 16C32 8.268 25.732 2 18 2Z" fill="${primaryColor}" stroke="${strokeColor}" stroke-width="2"/>
          <circle cx="18" cy="16" r="8" fill="#0b101d"/>
          <path d="M18 11V21M13 16H23" stroke="${primaryColor}" stroke-width="2.5" stroke-linecap="round"/>
        </g>
      </svg>
    `;

    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgIcon)}`,
      scaledSize: new window.google.maps.Size(36 * scale, 44 * scale),
      anchor: new window.google.maps.Point(18 * scale, 40 * scale)
    };
  };

  // Build InfoWindow HTML Content
  const createInfoWindowContent = useCallback((hosp) => {
    const isWinning = hosp.id === winningHospitalId;
    const isOnline = hosp.status === 'ONLINE';
    const statusColor = isOnline ? '#00e676' : '#ffb300';

    return `
      <div style="
        background: #0d1322;
        color: #f8fafc;
        padding: 14px 16px;
        border-radius: 12px;
        border: 1px solid rgba(255,255,255,0.15);
        font-family: 'Plus Jakarta Sans', sans-serif;
        min-width: 250px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.6);
      ">
        <div style="display: flex; align-items: center; justify-space-between; margin-bottom: 8px;">
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="
              display: inline-block;
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background-color: ${statusColor};
              box-shadow: 0 0 8px ${statusColor};
            "></span>
            <strong style="font-size: 14px; color: #ffffff; font-weight: 700;">${hosp.name}</strong>
          </div>
          ${isWinning ? `
            <span style="
              background: rgba(0,242,254,0.15);
              color: #00f2fe;
              font-size: 10px;
              font-weight: 800;
              padding: 2px 6px;
              border-radius: 999px;
              border: 1px solid rgba(0,242,254,0.3);
            ">OPTIMAL ROUTE</span>
          ` : ''}
        </div>

        <div style="font-size: 11px; color: #94a3b8; margin-bottom: 10px; font-family: monospace;">
          📍 ${hosp.distanceKm} km &bull; ~${hosp.baseEtaMins} min ETA
        </div>

        <div style="background: rgba(255,255,255,0.04); padding: 8px; border-radius: 8px; margin-bottom: 10px;">
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
            <span style="color: #cbd5e1;">ICU Capacity:</span>
            <strong style="color: ${hosp.icuAvailable > 0 ? '#00e676' : '#ff3b5c'};">${hosp.icuAvailable}/${hosp.icuTotal} Free</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
            <span style="color: #cbd5e1;">General Beds:</span>
            <strong style="color: ${hosp.generalAvailable > 0 ? '#00e676' : '#ff3b5c'};">${hosp.generalAvailable}/${hosp.generalTotal} Free</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 11px;">
            <span style="color: #cbd5e1;">Doctors Available:</span>
            <strong style="color: #00f2fe;">${hosp.doctorsAvailable}/${hosp.doctorsTotal}</strong>
          </div>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
          ${(hosp.specializations || []).slice(0, 3).map(s => `
            <span style="
              background: rgba(255,255,255,0.06);
              color: #cbd5e1;
              font-size: 10px;
              padding: 2px 6px;
              border-radius: 4px;
            ">${s}</span>
          `).join('')}
        </div>

        <div style="text-align: right; font-size: 10px; color: #64748b;">
          Status: <strong style="color: ${statusColor};">${hosp.status}</strong>
        </div>
      </div>
    `;
  }, [winningHospitalId]);

  // Dynamic Google Maps JS API script loader
  useEffect(() => {
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
      setApiKeyMissing(true);
      setIsLoading(false);
      return;
    }

    // Check if script is already present or window.google exists
    if (window.google && window.google.maps) {
      setIsLoading(false);
      return;
    }

    const scriptId = 'google-maps-js-sdk';
    let script = document.getElementById(scriptId);

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        setIsLoading(false);
      };

      script.onerror = (err) => {
        console.error('Failed to load Google Maps SDK', err);
        setLoadError('Failed to connect to Google Maps service. Please check network connectivity or API key permissions.');
        setIsLoading(false);
      };

      document.head.appendChild(script);
    } else {
      script.addEventListener('load', () => setIsLoading(false));
    }
  }, [apiKey]);

  // Initialize Map Instance
  useEffect(() => {
    if (isLoading || loadError || apiKeyMissing || !mapRef.current || !window.google || !window.google.maps) {
      return;
    }

    if (!googleMapInstanceRef.current) {
      // Calculate center from hospital coordinates or default Bangalore center
      const centerLat = hospitals.length > 0 ? hospitals[0].lat : 12.9716;
      const centerLng = hospitals.length > 0 ? hospitals[0].lng : 77.5946;

      const mapOptions = {
        center: { lat: centerLat, lng: centerLng },
        zoom: 12,
        styles: DARK_MEDICAL_MAP_STYLE,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        backgroundColor: '#0a0d14'
      };

      googleMapInstanceRef.current = new window.google.maps.Map(mapRef.current, mapOptions);
      infoWindowRef.current = new window.google.maps.InfoWindow();
    }
  }, [isLoading, loadError, apiKeyMissing, hospitals]);

  // Render & Update Markers on Map
  useEffect(() => {
    if (!googleMapInstanceRef.current || !window.google || !window.google.maps) return;

    const map = googleMapInstanceRef.current;
    const bounds = new window.google.maps.LatLngBounds();

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.setMap(null));
    markersRef.current = {};

    hospitals.forEach((hosp) => {
      if (hosp.lat && hosp.lng) {
        const position = { lat: hosp.lat, lng: hosp.lng };
        bounds.extend(position);

        const isWinning = hosp.id === winningHospitalId;

        const marker = new window.google.maps.Marker({
          position,
          map,
          title: hosp.name,
          icon: createMarkerIcon(hosp, isWinning),
          zIndex: isWinning ? 999 : 100
        });

        marker.addListener('click', () => {
          setSelectedHospital(hosp);
          if (onSelectHospital) onSelectHospital(hosp);

          if (infoWindowRef.current) {
            infoWindowRef.current.setContent(createInfoWindowContent(hosp));
            infoWindowRef.current.open(map, marker);
          }
        });

        markersRef.current[hosp.id] = marker;
      }
    });

    // Auto fit bounds to show all hospital pins cleanly
    if (hospitals.length > 0) {
      map.fitBounds(bounds);
      // Optional: Prevent zooming in too close
      const listener = window.google.maps.event.addListener(map, 'idle', () => {
        if (map.getZoom() > 14) map.setZoom(14);
        window.google.maps.event.removeListener(listener);
      });
    }
  }, [hospitals, winningHospitalId, createInfoWindowContent, onSelectHospital]);

  // Fit bounds manually on button click
  const handleResetBounds = () => {
    if (!googleMapInstanceRef.current || !window.google || !window.google.maps) return;
    const map = googleMapInstanceRef.current;
    const bounds = new window.google.maps.LatLngBounds();
    hospitals.forEach(h => {
      if (h.lat && h.lng) bounds.extend({ lat: h.lat, lng: h.lng });
    });
    map.fitBounds(bounds);
  };

  return (
    <div className="glass-panel overflow-hidden relative border border-[var(--border-glass)] flex flex-col" style={{ height }}>
      
      {/* Header bar */}
      {showTitle && (
        <div className="px-5 py-3 bg-slate-900/80 border-b border-[var(--border-glass)] flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--color-primary)] animate-pulse" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Google Maps Live Regional Dispatcher
            </h3>
            <span className="glass-pill text-[10px] text-[var(--color-success)] border-[var(--color-success)]/30">
              <ShieldCheck className="w-3 h-3" /> Live Capacity Sync
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetBounds}
              title="Reset Map Bounds"
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] hover:text-white transition-colors text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fit Bounds</span>
            </button>
          </div>
        </div>
      )}

      {/* Map Content Body */}
      <div className="relative flex-1 w-full bg-[#0a0d14] flex items-center justify-center">
        
        {/* Missing API Key Fallback */}
        {apiKeyMissing && (
          <div className="p-6 text-center max-w-md space-y-3 z-20">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-warning)]/10 text-[var(--color-warning)] flex items-center justify-center mx-auto border border-[var(--color-warning)]/30">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Google Maps API Key Missing</h4>
            <p className="text-xs text-[var(--text-secondary)]">
              Please configure <code className="px-1.5 py-0.5 rounded bg-white/10 text-[var(--color-primary)] font-mono">VITE_GOOGLE_MAPS_API_KEY</code> in your project's <code className="px-1 py-0.5 rounded bg-white/10 font-mono">.env</code> file.
            </p>
          </div>
        )}

        {/* Load Error State */}
        {loadError && !apiKeyMissing && (
          <div className="p-6 text-center max-w-md space-y-3 z-20">
            <div className="w-12 h-12 rounded-2xl bg-[var(--color-emergency)]/10 text-[var(--color-emergency)] flex items-center justify-center mx-auto border border-[var(--color-emergency)]/30">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Map Failed to Load</h4>
            <p className="text-xs text-[var(--text-secondary)]">{loadError}</p>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && !apiKeyMissing && !loadError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0d14]/90 z-20 space-y-3">
            <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-[var(--text-secondary)] font-mono">Loading Google Maps JavaScript API...</span>
          </div>
        )}

        {/* Map DOM Container */}
        <div ref={mapRef} className="w-full h-full min-h-[300px]" />

        {/* Bottom Legend Overlay */}
        {!isLoading && !apiKeyMissing && !loadError && (
          <div className="absolute bottom-3 left-3 z-10 glass-panel px-3 py-2 bg-slate-900/90 text-[11px] flex items-center gap-4 text-[var(--text-secondary)] border border-[var(--border-glass)]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00e676] shadow-[0_0_6px_#00e676]" />
              <span>Online Hospital</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ffb300] shadow-[0_0_6px_#ffb300]" />
              <span>Busy / Restricted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00f2fe] shadow-[0_0_8px_#00f2fe]" />
              <span>Selected Route</span>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
