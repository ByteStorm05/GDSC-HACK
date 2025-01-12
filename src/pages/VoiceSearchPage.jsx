import React, { useState } from 'react';
import VoiceSearch2 from '@/components/Voice2';

const SimplePage = () => {
  const [features, setFeatures] = useState(null);

  const handleHotelFeatures = (receivedFeatures) => {
    console.log('Received hotel features:', receivedFeatures);
    setFeatures(receivedFeatures); // Store the features in state
  };

  return (
    <div className="simple-page">
      <h1 className="text-center text-3xl font-bold">Hotel Features Search</h1>
      
      <div className="mt-6">
        <VoiceSearch2 onSearch={handleHotelFeatures} />
      </div>

      {/* Display the features object */}
      {features && (
        <div className="mt-4">
          <h3 className="font-semibold">Received Features:</h3>
          <pre>{JSON.stringify(features, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default SimplePage;
