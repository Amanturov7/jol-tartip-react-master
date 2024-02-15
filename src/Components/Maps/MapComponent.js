import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import Axios from 'axios';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const [applications, setApplications] = useState([]);
  const [reviews, setReviews] = useState([]);

  const fetchData = async () => {
    try {
      const applicationsResponse = await Axios.get('http://localhost:8080/rest/applications/points');
      setApplications(applicationsResponse.data);

      const reviewsResponse = await Axios.get('http://localhost:8080/rest/reviews/points');
      setReviews(reviewsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const map = L.map('map').setView([42.8746, 74.5698], 13);

    // Light Map Tile Layer
    const lightMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors',
    });

    // Dark Map Tile Layer
    const darkMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors',
    });

    const baseMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const openStreetMapHot = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    });

    const dgis = L.tileLayer('https://tile{s}.maps.2gis.com/tiles?x={x}&y={y}&z={z}', {
      subdomains: '0123',
      attribution: '© 2GIS',
    });

    lightMap.addTo(map);
    darkMap.addTo(map);
    openStreetMapHot.addTo(map);
    dgis.addTo(map);

    const blueIcon = new L.Icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const greenIcon = new L.Icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const applicationLayer = L.layerGroup().addTo(map);
    applications.forEach((app) => {
      const { lat, lon } = app;
      if (lat && lon) {
        L.marker([lat, lon], { icon: blueIcon }).addTo(applicationLayer).bindPopup(`Нарушения: ${app.id}`);
      }
    });

    const reviewLayer = L.layerGroup().addTo(map);
    reviews.forEach((review) => {
      const { lat, lon } = review;
      if (lat && lon) {
        L.marker([lat, lon], { icon: greenIcon }).addTo(reviewLayer).bindPopup(`Отзывы: ${review.id}`);
      }
    });

    const layerControl = L.control.layers(
      {
        'Light Map': lightMap,
        'Dark Map': darkMap,
        'Base Map': baseMap,
        'OpenStreetMap Hot': openStreetMapHot,
        '2GIS': dgis
      },
      {
        'Нарушения': applicationLayer,
        'Отзывы': reviewLayer
      }
    ).addTo(map);
    layerControl.setPosition('topright'); // Установите позицию слоя в правый верхний угол
    return () => {
      map.remove();
    };
  }, [applications, reviews]);

  return (
 <div style={{ position: 'relative', height: '95vh', width: '100%' }}>
      <div id="map" style={{ height: '100%', width: '100%' }}></div>
    </div> 
    
    );
};

export default MapComponent;
