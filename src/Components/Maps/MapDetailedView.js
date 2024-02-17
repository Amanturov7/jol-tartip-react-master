import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapDetailedView = ({ lat, lon }) => {
  useEffect(() => {
    const map = L.map('map').setView([lat, lon], 13);

    // Инициализация слоев карты и маркеров
    const baseMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const blueIcon = new L.Icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const marker = L.marker([lat, lon], { icon: blueIcon }).addTo(map);

    return () => {
      map.remove();
    };
  }, [lat, lon]);

  return (
    <div style={{ position: 'relative', height: '400px', width: '100%' }}>
      <div id="map" style={{ height: '100%', width: '100%' }}></div>
    </div>
  );
};

export default MapDetailedView;
