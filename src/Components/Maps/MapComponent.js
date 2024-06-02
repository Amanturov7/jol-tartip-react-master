import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import Axios from 'axios';
import 'leaflet/dist/leaflet.css';
import config from '../Config'
import sosIcocs from '../../images/sos.png'
import { useNavigate } from 'react-router-dom';

const MapComponent = () => {
  const [applications, setApplications] = useState([]);
  const [events, setEvents] = useState([]);
  const [sos, setSos] = useState([]);

  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const applicationLayer = L.layerGroup();
  const reviewLayer = L.layerGroup();
  const eventLayer = L.layerGroup();
  const sosLayer = L.layerGroup();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const applicationsResponse = await Axios.get(`${config.BASE_URL}/rest/applications/points`);
        setApplications(applicationsResponse.data);
    
        const eventsResponse = await Axios.get(`${config.BASE_URL}/rest/events/points`);
        setEvents(eventsResponse.data);

        const sosResponse = await Axios.get(`${config.BASE_URL}/rest/sos/points`);
        setSos(sosResponse.data);

        const reviewsResponse = await Axios.get(`${config.BASE_URL}/rest/reviews/points`);
        setReviews(reviewsResponse.data);

    
      } catch (error) {
        console.error('Error fetching  data:', error.message);
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
      maxZoom: 18,
      bounceAtZoomLimits: false
    });

    const baseMaps = {
      'Base Map': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }),
      'Light Map': L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors',
      }),
      'Dark Map': L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors',
      }),
      'Local map': L.tileLayer(`${config.BASE_URL}/rest/{z}/{x}/{y}.png`, {
        attribution: '© OpenStreetMap contributors',
      }),
      'OpenStreetMap Hot': L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(map),
      '2GIS': L.tileLayer('https://tile{s}.maps.2gis.com/tiles?x={x}&y={y}&z={z}', {
        subdomains: '0123',
        attribution: '© 2GIS',
      })
    };

    const overlayMaps = {
      'Нарушения': applicationLayer,
      'Отзывы': reviewLayer,
      'События': eventLayer,
      'SOS': sosLayer

    };

    L.control.layers(baseMaps, overlayMaps).addTo(map);

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


    const sosIcon = new L.Icon({
      iconUrl: sosIcocs,
      iconSize: [45, 36],
      // iconAnchor: [12, 41],
      // popupAnchor: [1, -34],
      // shadowSize: [41, 41],
    });
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



    sos.forEach((sos) => {
      const { lat, lon } = sos;
      if (lat && lon) {
        const popupContent = `
          Описание: ${sos.description}<br>
          Дата: ${sos.created}<br>
          Тип сигнала: ${sos.typeSosName}<br>
          Номер телефона: ${sos.phone}<br>
          <br>
          нажмите чтобы перейти к событию
        `;
        const marker = L.marker([lat, lon], { icon: sosIcon })
          .addTo(sosLayer)
          .bindPopup(`!!!SOS!!! № ${sos.id} <br>${popupContent}`);

  
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

  }, [applications, reviews, events,sos, navigate, applicationLayer, reviewLayer, eventLayer,sosLayer]);

  return (
    <div style={{ position: 'relative', height: '95vh', width: '100%' }}>
      <div id="map" style={{ height: '100%', width: '100%' }}></div>
      <div style={{ position: 'absolute', bottom: '40px', right: '10px', backgroundColor: 'white', padding: '5px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', zIndex: '999', fontSize: '0.8rem' }}>
        <div style={{ marginBottom: '5px' }}>
          <img src="https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png" alt="Red Marker" style={{ verticalAlign: 'middle', marginRight: '5px', width: '16px', height: 'auto' }} />
          Нарушения
        </div>
        <div style={{ marginBottom: '5px' }}>
          <img src="https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png" alt="Green Marker" style={{ verticalAlign: 'middle', marginRight: '5px', width: '16px', height: 'auto' }} />
          Отзывы
        </div>
        <div>
          <img src="https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png" alt="Blue Marker" style={{ verticalAlign: 'middle', marginRight: '5px', width: '16px', height: 'auto' }} />
          События
        </div>
        <div>
          <img src={sosIcocs} alt="SOS" style={{ verticalAlign: 'middle', marginRight: '5px', width: '16px', height: 'auto' }} />
          SOS
        </div>
      </div>
    </div>
  );
  

};

export default MapComponent;
