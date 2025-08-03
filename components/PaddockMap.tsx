import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import centroid from '@turf/centroid';
import type { Feature } from 'geojson';
import { useState, useEffect } from 'react';

function MapCenterUpdater({ center }: { center: [number, number] }) {
    // This component updates the map view to the given center coordinates
    // Uses useMap hook from react-leaflet to access the map instance
    const map = useMap();

    useEffect(() => {
        map.setView(center);
    }, [center, map]);

    return null;
}

export default function PaddockMap({ feature }: { feature: Feature }) {
    const [center, setCenter] = useState<[number, number]>([-35, 150]);

    useEffect(() => {
        try {
            if (feature && feature.geometry) {
                // Calculates the center from turf function
                const centroidFeature = centroid(feature);
                if (
                    centroidFeature &&
                    centroidFeature.geometry &&
                    Array.isArray(centroidFeature.geometry.coordinates)
                ) {
                    const coords = centroidFeature.geometry.coordinates as [number, number];

                    // GeoJSON coordinates are [lng, lat], but Leaflet expects [lat, lng]
                    const newCenter: [number, number] = [coords[1], coords[0]];

                    setCenter(newCenter);
                }
            }
        }
        catch (error) {
            console.error("Error calculating centroid:", error);
            // Fallback to a default center if centroid calculation fails
            setCenter([-35, 150]);
        }

    }, [feature]);

    return (
        <MapContainer
            center={center}
            zoom={12}
            style={{ height: "400px", width: "100%" }}
        >
            <MapCenterUpdater center={center} />
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON
                data={feature}
                style={{
                    color: 'red',
                    weight: 1,
                    fillColor: 'blue',
                    fillOpacity: 0.25
                }}
            />
        </MapContainer>
    );
}
