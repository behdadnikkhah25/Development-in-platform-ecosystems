import {MapContainer, Marker, TileLayer, useMap, useMapEvents} from "react-leaflet";
import React, {useEffect} from "react";
import './MapInput.css';

// Custom icon for the marker
const markerIcon = L && new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

function LocationMarker({ position, onLocationSelect }) {
    useMapEvents({
        click(event) {
            const { lat, lng } = event.latlng;
            onLocationSelect([lat, lng]);
        }
    });

    return position === null ? null : (
        <Marker position={position} icon={markerIcon}></Marker>
    );
}

    function DynamicMapCenter({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
}

    export function MapInput({ coordinates, setCoordinates }) {
    const handleLocationSelect = (location) => {
        setCoordinates(location);
    };

    return (
                <div className="mapContainer">
                    <MapContainer
                        center={coordinates}
                        zoom={12}
                        style={{height: '100%', width: '100%'}}
                        scrollWheelZoom={false}
                        dragging={true}
                    >
                        <DynamicMapCenter center={coordinates} />
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <LocationMarker position={coordinates} onLocationSelect={handleLocationSelect}/>
                    </MapContainer>
                </div>

    );
}