import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import Axios from 'axios';
import 'leaflet/dist/leaflet.css';

import { useNavigate } from 'react-router-dom';

const MapComponent = () => {
  const [applications, setApplications] = useState([]);
  const [events, setEvents] = useState([]);

  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const applicationsResponse = await Axios.get('http://localhost:8080/rest/applications/points');
        setApplications(applicationsResponse.data);

        const reviewsResponse = await Axios.get('http://localhost:8080/rest/reviews/points');
        setReviews(reviewsResponse.data);
        const eventsResponse = await Axios.get('http://localhost:8080/rest/events/points');
        setEvents(eventsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const kyrgyzstanBounds = [
      [39.19, 69.25], // Юго-запад
      [43.5, 80.26]   // Северо-восток
    ];

    const map = L.map('map', {
      center: [42.8746, 74.5698], // Координаты Бишкека
      zoom: 13,
      maxBounds: kyrgyzstanBounds, 
      minZoom: 8,
      maxZoom: 15,
      bounceAtZoomLimits: false 
    });

    const baseMaps = {
      'Local map': L.tileLayer('http://localhost:8080/rest/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map),
      'Light Map': L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors',
      }),
      'Dark Map': L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors',
      }),
      'Base Map': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }),
      'OpenStreetMap Hot': L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }),
      '2GIS': L.tileLayer('https://tile{s}.maps.2gis.com/tiles?x={x}&y={y}&z={z}', {
        subdomains: '0123',
        attribution: '© 2GIS',
      })
    };

    const overlayMaps = {
      'Нарушения': L.layerGroup(),
      'Отзывы': L.layerGroup()
    };

    L.control.layers(baseMaps, overlayMaps).addTo(map);
    // eslint-disable-next-line
    const blueIcon = new L.Icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    const redIcon = new L.Icon({
      iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
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
        const popupContent = `
          Описание: ${app.description}<br>
          Дата: ${app.createdDate}<br>
          Статус: ${app.statusName}<br>
          <br>
          нажмите чтобы перейти к нарушению
          `;

        const marker = L.marker([lat, lon], { icon: redIcon }).addTo(applicationLayer).bindPopup(`Нарушение №  ${app.id} <br>${popupContent}`);

        marker.on('click', () => {
          navigate(`/applications/${app.id}`);
        });

        marker.on('mouseover', function () {
          this.openPopup();
        });

        marker.on('mouseout', function () {
          this.closePopup();
        });
      }
    });

    const reviewLayer = L.layerGroup().addTo(map);
    reviews.forEach((review) => {
      const { lat, lon } = review;
      if (lat && lon) {
        const popupContent = `
          Описание: ${review.description}<br>
          Дата: ${review.createdDate}<br>
          Статус: ${review.statusName}<br>
          <br>
          нажмите чтобы перейти к отзыву
          `;

        const marker = L.marker([lat, lon], { icon: greenIcon })
          .addTo(reviewLayer)
          .bindPopup(`Отзыв №  ${review.id} <br>${popupContent}`);

        marker.on('click', () => {
          navigate(`/reviews/${review.id}`);
        });

        marker.on('mouseover', function () {
          this.openPopup();
        });

        marker.on('mouseout', function () {
          this.closePopup();
        });
      }
    });

  



  const eventLayer = L.layerGroup().addTo(map);
  events.forEach((event) => {
    const { lat, lon } = event;
    if (lat && lon) {
      const popupContent = `
        Описание: ${event.description}<br>
        Дата: ${event.createdDate}<br>
        Статус: ${event.statusName}<br>
        <br>
        нажмите чтобы перейти к событию
      `;
      const marker = L.marker([lat, lon], { icon: blueIcon })
        .addTo(eventLayer)
        .bindPopup(`Событие № ${event.id} <br>${popupContent}`);

      marker.on('click', () => {
        navigate(`/events/${event.id}`);
      });

      marker.on('mouseover', function () {
        this.openPopup();
      });

      marker.on('mouseout', function () {
        this.closePopup();
      });
    }
  });

    return () => {
      map.remove();
    };
    // eslint-disable-next-line
  }, [applications, reviews, events]);


  return (
    <div style={{ position: 'relative', height: '95vh', width: '100%' }}>
      <div id="map" style={{ height: '100%', width: '100%' }}></div>
    </div>
  );
};

export default MapComponent;
