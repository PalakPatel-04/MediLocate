import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Toaster, toast } from "react-hot-toast";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";
import "tailwindcss";

// Leaflet marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Hospital icon
const hospitalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Default user location icon
L.Marker.prototype.options.icon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const containerStyle = { width: "100%", height: "100vh" };


export function Home() {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [Distance, setDistance] = useState(null);

  // Fetch nearby hospitals from OpenStreetMap
  const fetchNearbyHospitals = async (lat, lng) => {
    const radius = 10000; // 10km radius
    const query = `[out:json];
      node(around:${radius},${lat},${lng})["amenity"="hospital"];
      out;`;
    
    try {
      const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await response.json();
      const hospitals = data.elements.map((element) => ({
        id: element.id,
        lat: element.lat,
        lng: element.lon,
        name: element.tags?.name || 'Unnamed Hospital'
      }));
      setHospitals(hospitals);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      toast.error('Failed to fetch nearby hospitals');
    }
  };

  // Fetch road distance using OpenRouteService
  const fetchDistance = async (start, end) => {
    try {
      const response = await fetch(
        'https://api.openrouteservice.org/v2/directions/driving-car/json',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
            'Authorization': '5b3ce3597851110001cf62481fb50f9a1f4a41b280f326754cb60cb7',
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify({
            coordinates: [
              [start[1], start[0]], // Note the order: [longitude, latitude]
              [end[1], end[0]]
            ]
          })
        }
      );
      
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        const distance = (data.routes[0].summary.distance / 1000).toFixed(2); // Convert meters to kilometers
        setDistance(distance);
      } else {
        toast.error("Unable to calculate road distance");
      }
    } catch (error) {
      console.error("Error fetching road distance:", error);
      toast.error("Failed to calculate road distance");
    }
  };

  // Handle hospital marker click
  const handleHospitalClick = (hospital) => {
    setSelectedHospital(hospital);
    if (userLocation) {
      fetchDistance(userLocation, [hospital.lat, hospital.lng]);
    }
  };

  // Get user location
  const getLocation = () => {
    if (!navigator.geolocation) {
      const errorMsg = "Geolocation is not supported by your browser";
      setLocationError(errorMsg);
      toast.error(errorMsg);
      setUserLocation([40.7128, -74.0060]); // Default to New York City
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = [position.coords.latitude, position.coords.longitude];
        setUserLocation(loc);
        fetchNearbyHospitals(...loc);
        setLocationError("");
      },
      (error) => {
        let errorMessage = "Error getting location: ";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += "User denied the request for Geolocation.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage += "The request to get location timed out.";
            break;
          default:
            errorMessage += "Unknown error occurred.";
        }
        
        console.error("Geolocation Error:", error);
        setLocationError(errorMessage);
        toast.error(errorMessage);
        const defaultLoc = [40.7128, -74.0060]; // Default to New York City
        setUserLocation(defaultLoc);
        fetchNearbyHospitals(...defaultLoc);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000,
        maximumAge: 60000 
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div className="h-screen">
      <Toaster position="top-right" />
      {locationError && (
        <div className="text-red-500 p-4 bg-red-100">
          {locationError} - Showing New York City as default
        </div>
      )}
      
      {userLocation ? (
        <MapContainer center={userLocation} zoom={13} style={containerStyle}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={userLocation}>
            <Popup>Your Location</Popup>
          </Marker>
          
          {hospitals.map((hospital) => (
            <Marker
              key={hospital.id}
              position={[hospital.lat, hospital.lng]}
              icon={hospitalIcon}
              eventHandlers={{
                click: () => handleHospitalClick(hospital),
              }}
            >
              <Popup className="min-w-[250px]">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-blue-600">{hospital.name}</h3>
                  <div className="space-y-1">
                    {Distance && selectedHospital?.id === hospital.id && (
                      <p className="text-sm">
                        <span className="font-semibold">Distance: </span> 
                        {Distance} km
                      </p>
                    )}
                  </div>
                  {userLocation && (
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${hospital.lat},${hospital.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      <span className="text-white">Get Directions</span>
                    </a>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        !locationError && <div className="p-4">Loading map...</div>
      )}
    </div>
  );
}