import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Search } from 'lucide-react';

const VoiceSearch = () => {
  const [isListening, setIsListening] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [error, setError] = useState('');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check browser support
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
      recognitionInstance.lang = 'en-US';  // Set language explicitly
      
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
        // Request microphone permission
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Stop the stream right away
        
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

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="relative">
        <div className="flex items-center border-2 border-blue-500 rounded-lg bg-white overflow-hidden">
          <Search className="w-5 h-5 ml-3 text-blue-500" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder={isSupported ? "Search or speak..." : "Speech recognition not supported"}
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
      
      {/* Debug Info */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg text-sm">
        
        <p>Browser Support: {isSupported ? '✅' : '❌'}</p>
        <p>Recognition State: {isListening ? 'Active' : 'Inactive'}</p>
       
        {error && <p className="text-red-500">Error: {error}</p>}
      </div>
    </div>
  );
};

export default VoiceSearch;