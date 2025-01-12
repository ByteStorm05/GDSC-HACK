import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Search } from 'lucide-react';
import axios from 'axios';

const VoiceSearch2 = ({ onSearch }) => {
  const [isListening, setIsListening] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [error, setError] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hotelFeatures, setHotelFeatures] = useState(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser');
      setIsSupported(false);
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onstart = () => {
        console.log('Voice recognition started');
        setError('');
      };

      recognitionInstance.onend = () => {
        console.log('Voice recognition ended');
        setIsListening(false);
      };
      
      recognitionInstance.onresult = (event) => {
        console.log('Got result:', event.results);
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        console.log('Transcript:', transcript);
        setSearchText(transcript);
      };
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setError(`Error: ${event.error}`);
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
      setIsSupported(true);
    } catch (err) {
      console.error('Error initializing speech recognition:', err);
      setError(`Failed to initialize speech recognition: ${err.message}`);
      setIsSupported(false);
    }
  }, []);

  const toggleListening = async () => {
    if (!recognition) {
      setError('Speech recognition not initialized');
      return;
    }

    try {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        
        recognition.start();
        setIsListening(true);
        setError('');
      }
    } catch (err) {
      console.error('Error toggling voice recognition:', err);
      setError(`Microphone error: ${err.message}`);
      setIsListening(false);
    }
  };

  const handleSearch = async () => {
    if (!searchText.trim()) return;

    setIsProcessing(true);
    try {
      // Create the prompt for Gemini
      const prompt = `Based on this hotel search request: "${searchText}", analyze which features should be enabled (1) or disabled (0). Return ONLY a JSON object with these exact keys and binary values (0 or 1):
      {
        "Parking": 0,
        "Pool": 0,
        "WiFi": 0,
        "Pet_friendly": 0,
        "Spa": 0,
        "Hot_tub": 0,
        "Air_conditioning": 0,
        "Attached_kitchen": 0,
        "Restaurant": 0,
        "Gym": 0,
        "24_hour_reception": 0,
        "EV_charger": 0,
        "Sauna": 0,
        "Fridge": 0,
        "Arcade": 0,
        "Cot": 0,
        "Childcare": 0,
        "Organised_activities_for_kids": 0,
        "Playground": 0,
        "Kids_club": 0,
        "Kids_pool": 0,
        "Wheelchair_accessible": 0,
        "In_room_accessibility": 0,
        "Accessible_parking": 0
      }
      Set 1 for features mentioned or implied in the request, 0 for others. Return ONLY the JSON object, no other text.`;

      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
          import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT
        }`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: prompt }] }],
        },
      });

      const aiResponse = response.data.candidates[0].content.parts[0].text;
      console.log('AI Response:', aiResponse); // Debugging: Log the response

      // Sanitize the response to remove unwanted characters
      const sanitizedResponse = aiResponse.replace(/```(?:json)?|```/g, '').trim();

      // Parse the cleaned JSON
      const features = JSON.parse(sanitizedResponse);
      setHotelFeatures(features);
      onSearch(features); // Pass features to parent component
    } catch (error) {
      console.error('Error processing with Gemini:', error);
      setError('Failed to process search request. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="relative flex">
        <div className="flex items-center border-2 border-blue-500 rounded-lg bg-white overflow-hidden w-3/4">
          <Search className="w-5 h-5 ml-3 text-blue-500" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={isSupported ? "Describe hotel features you want..." : "Speech recognition not supported"}
            className="w-full px-4 py-2 text-black outline-none"
            disabled={!isSupported}
          />
          <button
            onClick={toggleListening}
            className={`p-2 mx-2 rounded-full transition-colors ${
              !isSupported 
                ? 'bg-gray-400 cursor-not-allowed'
                : isListening 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-blue-500 hover:bg-blue-600'
            }`}
            disabled={!isSupported}
          >
            {isListening ? (
              <MicOff className="w-5 h-5 text-white" />
            ) : (
              <Mic className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
        <button
          onClick={handleSearch}
          disabled={isProcessing}
          className={`p-2 mx-2 rounded-sm transition-colors ${
            isProcessing ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } text-white px-4`}
        >
          {isProcessing ? 'Processing...' : 'Search'}
        </button>
      </div>
        
      {error && (
        <div className="absolute -bottom-6 left-0 w-full text-center text-sm text-red-500">
          {error}
        </div>
      )}
        
      {isListening && !error && (
        <div className="absolute -bottom-6 left-0 w-full text-center text-sm text-blue-500">
          Listening...
        </div>
      )}

      {/* Results Display */}
      {hotelFeatures && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-bold mb-4">Requested Hotel Features:</h3>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(hotelFeatures).map(([feature, value]) => (
              <div 
                key={feature} 
                className={`flex items-center p-2 rounded ${
                  value === 1 ? 'bg-blue-100' : 'bg-gray-50'
                }`}
              >
                <span className="font-medium">{feature.replace(/_/g, ' ')}:</span>
                <span className={`ml-2 ${value === 1 ? 'text-blue-600' : 'text-gray-500'}`}>
                  {value === 1 ? 'Yes' : 'No'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceSearch2;
