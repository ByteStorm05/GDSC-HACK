import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BarLoader } from 'react-spinners';

const genAI = new GoogleGenerativeAI(`${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const AmenityPreferences = ({ setAmenitiesList }) => {
  const [searchText, setSearchText] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to handle when user is done and send the prompt to the AI
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
      setAmenitiesList(amenitiesList);

      // Set the AI response as the output
      setAiResponse(amenitiesList);
    } catch (error) {
      console.error("Error while fetching AI response:", error);
      setAiResponse("Sorry, something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
        <h1 style={{ textAlign: 'center', color: '#333', fontSize: '28px', marginBottom: '20px' }}>Hotel Amenity Preferences</h1>

        {/* User Input for Amenity Preferences */}
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
            <textarea
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="What kind of amenities do you prefer?"
                rows="4"
                style={{
                    width: '100%',
                    padding: '15px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    backgroundColor: '#f1f1f1',
                    fontSize: '16px',
                    color: '#333',
                    resize: 'none',
                    boxSizing: 'border-box'
                }}
            />
        </div>

        {/* Done Button */}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
                onClick={handleDone}
                disabled={loading || !searchText.trim()}
                style={{
                    padding: '12px 20px',
                    backgroundColor: '#4A90E2',
                    color: 'white',
                    fontSize: '16px',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    width: '100%',
                    transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#357ABD'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#4A90E2'}
            >
                Done
            </button>
        </div>

        {/* AI Response */}
        {aiResponse && !loading && (
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#e9f7ff', borderRadius: '8px', border: '1px solid #4A90E2' }}>
                <strong style={{ fontSize: '18px', color: '#333' }}>Enabled Amenities:</strong>
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', color: '#333', fontSize: '16px', marginTop: '10px' }}>
                    {aiResponse}
                </pre>
            </div>
        )}

        {/* Loading Spinner */}
        {loading && (
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <BarLoader color="#4A90E2" width="100%" />
            </div>
        )}
    </div>
);

};

export default AmenityPreferences;
