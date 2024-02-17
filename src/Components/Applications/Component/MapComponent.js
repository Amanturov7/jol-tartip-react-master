import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Axios from 'axios';

const MapComponent = ({ onCoordinateSelect, setPlace }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const leafletMap = L.map('map').setView([42.8731, 74.5945], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap);

    leafletMap.on('click', handleMapClick);

    mapRef.current = leafletMap;

    return () => {
      leafletMap.off();
      leafletMap.remove();
    };
    // eslint-disable-next-line
  }, []);

  const handleMapClick = async (e) => {
    const { lat, lng } = e.latlng;
    
    let addressDetails;

    try {
      const response = await Axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=ru`
      );
      addressDetails = response.data.address;

      // Извлекаем необходимые компоненты адреса
      const street = addressDetails.road || addressDetails.pedestrian || addressDetails.footway || '';
      const houseNumber = addressDetails.house_number || '';
      const crossroads = addressDetails.crossroads || '';

      // Формируем окончательный адрес
      const finalAddress = `${street} ${houseNumber}, ${crossroads}`;

      setPlace(finalAddress.trim()); // Устанавливаем адрес в поле place
    } catch (error) {
      console.error('Error fetching address:', error.message);
    }

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      const blueIcon = new L.Icon({
        iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      const newMarker = L.marker([lat, lng], { icon: blueIcon, draggable: true }).addTo(mapRef.current);
      newMarker.bindPopup(addressDetails.display_name).openPopup();
      newMarker.on('dragend', handleMarkerDragEnd);

      markerRef.current = newMarker;
    }

    onCoordinateSelect({ lat, lon: lng });
  };

  const handleMarkerDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    onCoordinateSelect({ lat, lon: lng });
  };

  return (
    <div>
      <div id="map" style={{ height: '600px', width: '600px' }}></div>
      <p>Укажите адрес на карте</p>
    </div>
  );
};

export default MapComponent;
