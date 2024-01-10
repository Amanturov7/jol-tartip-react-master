import { useEffect, useState } from 'react';
import L from 'leaflet';
import Axios from 'axios';

import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const [applications, setApplications] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const applicationsResponse = await Axios.get('http://localhost:8080/rest/applications/all');
        setApplications(applicationsResponse.data);

        const reviewsResponse = await Axios.get('http://localhost:8080/rest/reviews/all');
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      const newMapContainer = document.createElement('div');
      newMapContainer.id = 'map';
      newMapContainer.style.height = '500px';
      document.body.appendChild(newMapContainer);
    }

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
    if (applications.length > 0) {
      applications.forEach((app) => {
        const { lat, lon } = app;
        if (lat && lon) {
          L.marker([lat, lon], { icon: blueIcon })
            .addTo(applicationLayer)
            .bindPopup(`Нарушения: ${app.id}`);
        }
      });
    }

    const reviewLayer = L.layerGroup().addTo(map);
    if (reviews.length > 0) {
      reviews.forEach((review) => {
        const { lat, lon } = review;
        if (lat && lon) {
          L.marker([lat, lon], { icon: greenIcon })
            .addTo(reviewLayer)
            .bindPopup(`Отзывы: ${review.id}`);
        }
      });
    }

    // eslint-disable-next-line
    const layerControl = L.control.layers(
      { 'Light Map': lightMap, 'Dark Map': darkMap, 'Base map': baseMap, 'OpenStreetMapHot Map': openStreetMapHot, '2ГИС': dgis },
      { 'Нарушения': applicationLayer, 'Отзывы': reviewLayer },
    ).addTo(map);

    return () => {
      map.remove();
    };
  }, [applications, reviews]);

  return null;
};

export default MapComponent;
