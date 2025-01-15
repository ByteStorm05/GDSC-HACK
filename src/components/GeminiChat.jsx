import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(`${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const AmenityPreferences = () => {
    const [searchText, setSearchText] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [loading, setLoading] = useState(false);

    // Function to handle when user is done and send the prompt to the AI
    const handleDone = async () => {
        if (!searchText.trim()) return; // Prevent empty submissions

        setLoading(true);
        setAiResponse('');

        try {
            // Custom prompt for hotel amenity analysis
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

            // Pass the custom prompt to the Gemini model
            const result = await model.generateContent([prompt]);
            const response = await result.response;
            const text = await response.text();

            // Set the AI response as the output
            setAiResponse(text);
        } catch (error) {
            console.error("Error while fetching AI response:", error);
            setAiResponse("Sorry, something went wrong. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Hotel Amenity Preferences</h1>

            {/* User Input for Amenity Preferences */}
            <div style={{ marginBottom: '20px' }}>
                <textarea
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="What kind of amenities do you prefer?"
                    rows="4"
                    style={{ width: '100%', padding: '10px' }}
                />
            </div>

            {/* Done Button */}
            <div style={{ marginTop: '20px' }}>
                <button
                    onClick={handleDone}
                    disabled={loading || !searchText.trim()}
                    style={{ padding: '10px' }}
                >
                    Done
                </button>
            </div>

            {/* AI Response */}
            {aiResponse && !loading && (
                <div style={{ marginTop: '20px' }}>
                    <strong>AI Response:</strong>
                    <pre>{aiResponse}</pre>
                </div>
            )}

            {/* Loading Spinner */}
            {loading && <p>Loading...</p>}
        </div>
    );
};

export default AmenityPreferences;
