import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useMap } from '@vis.gl/react-google-maps';
import { Button } from "@/components/ui/button";
import ApiKeys from "../../env";

const ZoomControl = () => {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    const listener = map.addListener('zoom_changed', () => {
      setZoom(map.getZoom());
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map]);

  return (
    <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow">
      Zoom: {zoom}
    </div>
  );
};

const MapsGoogle = () => {
  const [position, setPosition] = useState({ lat: 53.54, lng: 10 });
  const [openInfoWindowIndex, setOpenInfoWindowIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cameraData, setCameraData] = useState([]);
  const [radius, setRadius] = useState(1000);
  const apiKey = ApiKeys.find(api => api.key === "API_KEY")?.value;
  const mapId = ApiKeys.find(api => api.key === "MAP_ID")?.value;

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
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition({ lat: latitude, lng: longitude });
          setLoading(false);
          fetchCameraData(latitude, longitude, radius);
        },
        (error) => {
          console.error('Error getting current location:', error);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setLoading(false);
    }
  }, []);

  const handleRadiusChange = (newRadius) => {
    setRadius(newRadius);
    fetchCameraData(position.lat, position.lng, newRadius);
  };

  // Ref to hold the circle
  const mapRef = React.useRef();

  // Create a circle on the map when the position or radius changes
  useEffect(() => {
    if (!mapRef.current) return; // Ensure the map is available

    const map = mapRef.current;

    // Clear existing circle
    if (map.circle) {
      map.circle.setMap(null);
    }

    // Create a new circle
    const newCircle = new google.maps.Circle({
      strokeColor: 'rgba(255, 0, 0, 0.8)',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: 'rgba(255, 0, 0, 0.2)',
      fillOpacity: 0.35,
      map,
      center: position,
      radius: radius,
    });

    // Attach the circle to the map reference for cleanup
    map.circle = newCircle;

    // Cleanup the circle when the component unmounts or when dependencies change
    return () => {
      newCircle.setMap(null);
    };
  }, [position, radius]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex justify-center gap-4 pb-4 pt-4">
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
      </div>
      <APIProvider apiKey={apiKey}>
        <div className="h-[50vh] lg:h-[70vh] relative">
          <Map
            defaultZoom={15}
            defaultCenter={position}
            mapId={mapId}
            onMapLoad={(map) => { mapRef.current = map }} // Capture the map instance
          >
            <AdvancedMarker position={position} onClick={() => setOpenInfoWindowIndex('user')}>
              <Pin background={'#22C55E'} borderColor={'#065F46'} glyphColor={'#FFFFFF'} />
            </AdvancedMarker>

            {openInfoWindowIndex === 'user' && (
              <InfoWindow position={position} onCloseClick={() => setOpenInfoWindowIndex(null)}>
                <p>Your current location</p>
              </InfoWindow>
            )}

            {cameraData.map((camera, index) => (
              <AdvancedMarker
                key={index}
                position={{ lat: Number(camera.latitude), lng: Number(camera.longitude) }}
                onClick={() => setOpenInfoWindowIndex(index)}
              >
                <Pin background={'#FF5722'} borderColor={'#BF360C'} glyphColor={'#FFFFFF'} />
              </AdvancedMarker>
            ))}

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
