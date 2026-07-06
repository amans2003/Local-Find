import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({ iconRetinaUrl: markerIcon2x, iconUrl: markerIcon, shadowUrl: markerShadow });

export default function MapView({ listing }) {
  const [lng, lat] = listing.coordinates?.coordinates || [77.2090, 28.6139];

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ height: '300px', width: '100%' }}
      className="rounded-xl z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        <Popup>
          <div className="text-sm">
            <p className="font-semibold">{listing.name}</p>
            <p className="text-gray-600 text-xs mt-1">{listing.address}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
