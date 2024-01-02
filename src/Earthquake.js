// import React, { useRef, useEffect, useState } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// const MapComponent = () => {
//   const mapRef = useRef(null);
//   const markerRef = useRef(null);
//   const [coordinates, setCoordinates] = useState(null);

//   useEffect(() => {
//     // Инициализация карты
//     mapRef.current = L.map('map').setView([51.505, -0.09], 13);
//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapRef.current);

//     // Обработчик клика на карте
//     mapRef.current.on('click', handleMapClick);

//     // Инициализация маркера
//     markerRef.current = L.marker([0, 0], { draggable: true }).addTo(mapRef.current);
//     markerRef.current.on('dragend', handleMarkerDragEnd);

//     // Очистка ресурсов при размонтировании компонента
//     return () => {
//       mapRef.current.off('click', handleMapClick);
//       markerRef.current.off('dragend', handleMarkerDragEnd);
//       mapRef.current.remove();
//     };
//   }, []);

//   const handleMapClick = (e) => {
//     const { lat, lng } = e.latlng;
//     setCoordinates({ lat, lng });
//     markerRef.current.setLatLng(e.latlng);
//   };

//   const handleMarkerDragEnd = (e) => {
//     const { lat, lng } = e.target.getLatLng();
//     setCoordinates({ lat, lng });
//   };

//   return (
//     <div className='container'>
//       <div id="map" style={{ height: '400px' }} />
//       {coordinates && (
//         <div>
//           <strong>Координаты маркера:</strong>
//           <p>Широта: {coordinates.lat}</p>
//           <p>Долгота: {coordinates.lng}</p>
//         </div>
//       )}
//             <iframe src="https://geonode.gispro.kg/datasets/geonode:seleotvod/embed" width="800" height="600" frameborder="0" allowfullscreen></iframe>

//     </div>

    
//   );
// };

// export default MapComponent;
