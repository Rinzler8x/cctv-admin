import React, { useState, useEffect, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { Button } from "@/components/ui/button";
import { Navigation2 } from 'lucide-react';
import ApiKeys from "../../env";

const ZoomControl = () => {
  const map = useMap();
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    if (!map) return;

    const listener = map.addListener('zoom_changed', () => {
      setZoom(map.getZoom());
    });

    return () => {
      if (listener) google.maps.event.removeListener(listener);
    };
  }, [map]);

  return (
    <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow">
      Zoom: {zoom}
    </div>
  );
};

const MapsGoogle = () => {
  // Initialize with a default position (will be updated with actual location)
  const [position, setPosition] = useState(null);
  const [pinPosition, setPinPosition] = useState(null);
  const [openInfoWindowIndex, setOpenInfoWindowIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cameraData, setCameraData] = useState([]);
  const [radius, setRadius] = useState(1000);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState(null);
  
  const apiKey = ApiKeys.find(api => api.key === "API_KEY")?.value;
  const mapIdR = ApiKeys.find(api => api.key === "MAP_ID_R")?.value;

  const fetchCameraData = async (lat, lng, radiusMeters) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/nearby_cameras', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          radius_meters: radiusMeters,
          status_filter: '',
          ownership_filter: '',
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setCameraData(data);
    } catch (error) {
      console.error('Error fetching camera data:', error);
      setError('Failed to fetch camera data');
    }
  };

  const getCurrentLocation = useCallback(() => {
    setIsLocating(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLocating(false);
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        console.log('Current position:', newPosition); // Debug log
        
        setPosition(newPosition);
        setPinPosition(null); // Clear any dropped pins
        setOpenInfoWindowIndex('user');
        
        // Fetch cameras for the new position
        fetchCameraData(newPosition.lat, newPosition.lng, radius);
        
        setIsLocating(false);
        setLoading(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setError('Failed to get your location. Please make sure location services are enabled.');
        setIsLocating(false);
        setLoading(false);
        
        // Set a default position if geolocation fails
        const defaultPosition = { lat: 53.54, lng: 10 };
        setPosition(defaultPosition);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, [radius]);

  // Initialize location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleRadiusChange = (newRadius) => {
    setRadius(newRadius);
    const searchPosition = pinPosition || position;
    if (searchPosition) {
      fetchCameraData(searchPosition.lat, searchPosition.lng, newRadius);
    }
  };

  const handleMapClick = (e) => {
    const newPosition = {
      lat: e.detail.latLng.lat,
      lng: e.detail.latLng.lng
    };
    console.log('Clicked position:', newPosition); // Debug log
    setPinPosition(newPosition);
    fetchCameraData(newPosition.lat, newPosition.lng, radius);
    setOpenInfoWindowIndex('dropped-pin');
  };

  if (loading || !position) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p>{isLocating ? 'Getting your location...' : 'Loading map...'}</p>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col items-center gap-4 pb-4 pt-4">
        <p className="text-sm text-gray-600">
          Click anywhere on the map to drop a pin and find nearby cameras
        </p>
        <div className="flex justify-center gap-4 items-center flex-wrap">
          <Button
            className={`px-4 py-2 ${radius === 500 ? ' text-white' : ''}`}
            variant={radius === 500 ? 'default' : 'outline'}
            onClick={() => handleRadiusChange(500)}
          >
            500m
          </Button>
          <Button
            className={`px-4 py-2 ${radius === 1000 ? ' text-white' : ''}`}
            variant={radius === 1000 ? 'default' : 'outline'}
            onClick={() => handleRadiusChange(1000)}
          >
            1000m
          </Button>
          <Button
            className={`px-4 py-2 ${radius === 2000 ? ' text-white' : ''}`}
            variant={radius === 2000 ? 'default' : 'outline'}
            onClick={() => handleRadiusChange(2000)}
          >
            2000m
          </Button>
          <Button
            className={`px-4 py-2 ${radius === 5000 ? ' text-white' : ''}`}
            variant={radius === 5000 ? 'default' : 'outline'}
            onClick={() => handleRadiusChange(5000)}
          >
            5000m
          </Button>
          <Button
            variant="outline"
            onClick={getCurrentLocation}
            disabled={isLocating}
            className="flex items-center gap-2"
          >
            <Navigation2 className={`h-4 w-4 ${isLocating ? 'animate-spin' : ''}`} />
            {isLocating ? 'Locating...' : 'Current Location'}
          </Button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
      
      <APIProvider apiKey={apiKey}>
        <div className="h-[50vh] lg:h-[70vh] relative">
          <Map
            defaultZoom={15}
            defaultCenter={position}
            mapId={mapIdR}
            onClick={handleMapClick}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
          >
            {/* Current location marker */}
            <AdvancedMarker position={position} onClick={() => setOpenInfoWindowIndex('user')}>
              <Pin background={'#22C55E'} borderColor={'#065F46'} glyphColor={'#FFFFFF'} />
            </AdvancedMarker>

            {/* Dropped pin marker */}
            {pinPosition && (
              <AdvancedMarker position={pinPosition} onClick={() => setOpenInfoWindowIndex('dropped-pin')}>
                <Pin background={'#FFCC00'} borderColor={'#BF8F00'} glyphColor={'#FFFFFF'} />
              </AdvancedMarker>
            )}

            {/* Current location info window */}
            {openInfoWindowIndex === 'user' && (
              <InfoWindow position={position} onCloseClick={() => setOpenInfoWindowIndex(null)}>
                <div>
                  <p>Your current location</p>
                  <p className="text-sm text-gray-600">
                    Lat: {position.lat.toFixed(6)}<br />
                    Lng: {position.lng.toFixed(6)}
                  </p>
                </div>
              </InfoWindow>
            )}

            {/* Dropped pin info window */}
            {openInfoWindowIndex === 'dropped-pin' && pinPosition && (
              <InfoWindow
                position={pinPosition}
                onCloseClick={() => setOpenInfoWindowIndex(null)}
              >
                <div>
                  <p>Dropped Pin Location</p>
                  <p className="text-sm text-gray-600">
                    Lat: {pinPosition.lat.toFixed(6)}<br />
                    Lng: {pinPosition.lng.toFixed(6)}
                  </p>
                </div>
              </InfoWindow>
            )}

            {/* Camera markers */}
            {cameraData.map((camera, index) => (
              <AdvancedMarker
                key={index}
                position={{ lat: Number(camera.latitude), lng: Number(camera.longitude) }}
                onClick={() => setOpenInfoWindowIndex(index)}
              >
                <Pin background={'#FF5722'} borderColor={'#BF360C'} glyphColor={'#FFFFFF'} />
              </AdvancedMarker>
            ))}

            {/* Camera info windows */}
            {cameraData.map((camera, index) => (
              openInfoWindowIndex === index && (
                <InfoWindow
                  key={index}
                  position={{ lat: Number(camera.latitude), lng: Number(camera.longitude) }}
                  onCloseClick={() => setOpenInfoWindowIndex(null)}
                >
                  <div>
                    <p className='text-[16px]'><strong>Location:</strong> {camera.location || 'No location available'}</p>
                    <p className='text-[16px]'><strong>Owner:</strong> {camera.owner_name || 'No owner available'}</p>
                    <p className='text-[16px]'><strong>Type:</strong> {camera.private_govt || 'No type available'}</p>
                    <p className='text-[16px]'><strong>Contact No:</strong> {camera.contact_no || 'No contact no. available'}</p>
                    <p className='text-[16px]'><strong>Coverage:</strong> {camera.coverage || 'No coverage available'}</p>
                    <p className='text-[16px]'><strong>Backup:</strong> {camera.backup || 'No backup available'}</p>
                    <p className='text-[16px]'><strong>Status:</strong> {camera.status || 'Unknown'}</p>
                    <p className='text-[16px]'><strong>Ownership:</strong> {camera.ownership || 'Unknown'}</p>
                  </div>
                </InfoWindow>
              )
            ))}

            <ZoomControl />
          </Map>
        </div>
      </APIProvider>
    </>
  );
};

export default MapsGoogle;