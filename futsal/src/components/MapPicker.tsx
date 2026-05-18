import { useEffect, useRef } from 'react';
import L, { CircleMarker, LeafletMouseEvent, Map as LeafletMap } from 'leaflet';

type LatLng = { lat: number; lng: number };

interface MapPickerProps {
  value: LatLng | null;
  onChange: (value: LatLng) => void;
}

const DEFAULT_CENTER: LatLng = { lat: 27.7172, lng: 85.3240 };

const MapPicker = ({ value, onChange }: MapPickerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<CircleMarker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const center = value || DEFAULT_CENTER;
    const map = L.map(containerRef.current).setView([center.lat, center.lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    map.on('click', (event: LeafletMouseEvent) => {
      onChange({ lat: event.latlng.lat, lng: event.latlng.lng });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, [onChange, value]);

  useEffect(() => {
    if (!mapRef.current || !value) return;

    const latLng: [number, number] = [value.lat, value.lng];

    if (!markerRef.current) {
      markerRef.current = L.circleMarker(latLng, {
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.7,
        radius: 8,
      }).addTo(mapRef.current);
    } else {
      markerRef.current.setLatLng(latLng);
    }

    mapRef.current.setView(latLng);
  }, [value]);

  return (
    <div className="rounded-xl overflow-hidden border border-app-border-subtle">
      <div ref={containerRef} style={{ height: '280px', width: '100%' }} />
    </div>
  );
};

export default MapPicker;
