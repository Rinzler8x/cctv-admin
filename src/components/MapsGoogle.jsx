import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px', // Adjust height as necessary
};

const MapsGoogle = () => {
  const [locationData, setLocationData] = useState([]); // Store camera data
  const [center, setCenter] = useState({ lat: 0, lng: 0 }); // Default center location
  const [watchId, setWatchId] = useState(null); // Store the watch ID for tracking

  // Function to fetch camera data based on location
  const fetchCameraData = async (lat, lng) => {
    const params = {
      latitude: lat,
      longitude: lng,
      radius_meters: 1000, // Set the desired radius
      status_filter: "working", // Can be "working", "not working" or "null"
      ownership_filter: "Govt", // Can be "Private", "Govt" or "null"
    };

    try {
      const response = await fetch('YOUR_API_ENDPOINT', { // Replace with your actual API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setLocationData(data); // Set the camera data
    } catch (error) {
      console.error('Error fetching camera data:', error);
    }
  };

  useEffect(() => {
    // Function to get the current location of the user
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        const id = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCenter({ lat: latitude, lng: longitude }); // Set center to current location
            fetchCameraData(latitude, longitude); // Fetch camera data based on current location
          },
          (error) => {
            console.error('Error getting current location:', error);
            // Optionally handle error case
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 } // High accuracy and no cache
        );
        setWatchId(id); // Save the watch ID
      } else {
        console.error('Geolocation is not supported by this browser.');
        // Optionally set default center or handle error case
      }
    };

    getCurrentLocation(); // Call the function to get current location

    // Cleanup function to stop watching position on unmount
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]); // Include watchId in dependencies to handle cleanup properly

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Dashboard content */}
      <main className="flex-1 overflow-y-auto bg-gray-100 p-0">
        <LoadScript googleMapsApiKey="AIzaSyBN7WeAsX5Ya5BvLY_4AKQFklaDSBIPylU"> {/* Replace with your actual API key */}
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={15} // Adjust zoom level as necessary
          >
            {/* Marker for the user's current location */}
            <Marker 
              position={center} 
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // Customize your current location marker icon
              }}
              title="Your Current Location" // Tooltip for the marker
            />
            {/* Markers for fetched camera data */}
            {locationData.map((camera, index) => (
              <Marker 
                key={index} 
                position={{ lat: camera.latitude, lng: camera.longitude }} 
                title={camera.description || "Camera"} // Optionally use camera description as title
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </main>
    </div>
  );
};

export default MapsGoogle;
