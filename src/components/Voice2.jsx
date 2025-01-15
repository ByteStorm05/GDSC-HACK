import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Search } from 'lucide-react';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(`${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const AmenityVoiceInput = ({ setAmenitiesList }) => {
  const [isListening, setIsListening] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [error, setError] = useState('');
  const [isSupported, setIsSupported] = useState(false);

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

  const handleDone = async () => {
    if (!searchText.trim()) return; // Prevent empty submissions

    setLoading(true);
    setAiResponse('');

    try {
      // const prompt = `Based on this hotel search request: "${searchText}", analyze which features should be enabled (1) or disabled (0). Return ONLY a comma-separated list of enabled amenities (1) from the following list in STRICTLY the exact order as presented:

      // "Parking", "Pool", "WiFi", "Pet_friendly", "Spa", "Hot_tub", "Air_conditioning", "Attached_kitchen", "Restaurant", "Gym", "24-hour_reception", "EV_charger", "Sauna", "Fridge", "Arcade", "Cot", "Childcare", "Organised_activities_for_kids", "Playground", "Kid's_club", "Kid's_pool", "Wheelchair_accessible", "In-room_accessibility", "Accessible_parking".
      
      // Replace "_" with space. Example: "Parking, Pool, WiFi" (only the enabled features) and preserve the order without skipping any amenities.`;
      const prompt = `Based on this hotel search request: "${searchText}", analyze which features should be enabled (1) from the following list. Return ONLY a comma-separated list of enabled amenities (1) from the list, strictly in the order as presented. 

"Parking", "Pool", "WiFi", "Pet_friendly", "Spa", "Hot_tub", "Air_conditioning", "Attached_kitchen", "Restaurant", "Gym", "24-hour_reception", "EV_charger", "Sauna", "Fridge", "Arcade", "Cot", "Childcare", "Organised_activities_for_kids", "Playground", "Kids'_club", "Kids'_pool", "Wheelchair_accessible", "In-room_accessibility", "Accessible_parking".

Only include the amenities that are mentioned or implied in the request. Return them in the exact order as in the list, with no other text.`;


      // Pass the custom prompt to the Gemini model
      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const text = await response.text();

      // Process the AI response
      const amenitiesOrder = [
        "Parking", "Pool", "WiFi", "Pet_friendly", "Spa", "Hot_tub", "Air_conditioning", "Attached_kitchen",
        "Restaurant", "Gym", "24-hour_reception", "EV_charger", "Sauna", "Fridge", "Arcade", "Cot", 
        "Childcare", "Organised_activities_for_kids", "Playground", "Kids'_club", "Kids'_pool", "Wheelchair_accessible",
        "In-room_accessibility", "Accessible_parking"
      ];

      const filteredResponse = text
        .split(",")
        .map(item => item.trim().replace(/\s+/g, "_")) // Replace spaces with underscores
        .filter(item => amenitiesOrder.includes(item)) // Ensure the items exist in the predefined order
        .sort((a, b) => amenitiesOrder.indexOf(a) - amenitiesOrder.indexOf(b)); // Sort according to the predefined order

      const amenitiesList = filteredResponse
        .map(item => item.replace(/_/g, " ")) // Replace underscores with spaces
        .join(", "); // Join the array into a comma-separated string

      // Pass the amenities list back to ChatPage

      setAmenitiesList(amenitiesList)
      // Set the AI response as the output
      setAiResponse(amenitiesList);
    } catch (error) {
      console.error("Error while fetching AI response:", error);
      setAiResponse("Sorry, something went wrong. Please try again.");
    }

    setLoading(false);
  };


  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
    <div className="relative flex flex-col items-center">
      <div className="flex items-center border-2 border-blue-500 rounded-lg bg-white overflow-hidden w-full md:w-3/4 mb-4 shadow-md">
        <Search className="w-5 h-5 ml-3 text-blue-500" />
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder={isSupported ? "Describe hotel features you want..." : "Speech recognition not supported"}
          className="w-full px-4 py-3 text-black outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
          disabled={!isSupported}
        />
        <button
          onClick={toggleListening}
          className={`p-2 mx-2 rounded-full transition-colors duration-200 ${
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
  
      {/* Done Button */}
      <button
        onClick={handleDone}
        disabled={loading || !searchText.trim()}
        className={`w-full p-3 rounded-md transition-colors duration-200 ${
          loading || !searchText.trim() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'
        } text-white font-semibold`}
      >
        {loading ? 'Processing...' : 'Done'}
      </button>
  
      {/* Error or Listening Status */}
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
    </div>
  </div>
  
  );
};

export default AmenityVoiceInput;
