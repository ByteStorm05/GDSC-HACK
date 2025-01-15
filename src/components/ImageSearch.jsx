import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getBase64 } from '../helpers/imageHelper';
import { BarLoader } from 'react-spinners';

// Initialize the Generative AI instance
const genAI = new GoogleGenerativeAI(`${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const AIwithImage = ({ setAmenitiesList }) => {
    const [image, setImage] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageInlineData, setImageInlineData] = useState(null);
    const [error, setError] = useState('');

    // Helper method to convert file to base64
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        getBase64(file)
            .then((result) => {
                setImage(result);
            })
            .catch((e) => console.log(e));

        // Convert image file to model-compatible format
        fileToGenerativePart(file).then((image) => {
            setImageInlineData(image);
        });
    };

    // Converts file to generative model format
    async function fileToGenerativePart(file) {
        const base64EncodedDataPromise = new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(file);
        });

        return {
            inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
        };
    }

    // Call Gemini model to fetch hotel features based on the image
    const handleDone = async () => {
        if (!image) return; // Prevent empty submissions

        setLoading(true);
        setAiResponse('');

        try {
            // Prompt to analyze image and return enabled features (as per your original description)
            const prompt = `Analyze the features in this hotel image and return which features should be enabled (1) from the following list. Return ONLY a comma-separated list of enabled amenities (1) from the list, strictly in the order as presented:

            "Parking", "Pool", "WiFi", "Pet_friendly", "Spa", "Hot_tub", "Air_conditioning", "Attached_kitchen", "Restaurant", "Gym", "24-hour_reception", "EV_charger", "Sauna", "Fridge", "Arcade", "Cot", "Childcare", "Organised_activities_for_kids", "Playground", "Kids'_club", "Kids'_pool", "Wheelchair_accessible", "In-room_accessibility", "Accessible_parking".

            Only include the amenities that are mentioned or implied in the image. Return them in the exact order as in the list, with no other text.`;

            // Pass the prompt and image to the model
            const result = await model.generateContent([prompt, imageInlineData]);
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

            // Process the AI response and set it
            setAiResponse(amenitiesList);

        } catch (error) {
            setAiResponse("Sorry, something went wrong. Please try again.");
            console.error(error);
        }

        setLoading(false);
    };

    return (
      
          <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }}>
              <h1 style={{ textAlign: 'center', color: '#333', fontSize: '28px', marginBottom: '20px' }}>AI-Driven Hotel Feature Analysis</h1>
      
              {/* Image Upload Section */}
              <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', marginBottom: '20px' }}>
                  <h3 style={{ textAlign: 'center', color: '#333', fontSize: '20px', marginBottom: '10px' }}>Upload Hotel Image</h3>
                  <input type="file" onChange={(e) => handleImageChange(e)} style={{ display: 'block', width: '100%', padding: '10px', margin: '10px 0', backgroundColor: '#f1f1f1', borderRadius: '8px', border: 'none', cursor: 'pointer' }} />
                  <button onClick={() => handleDone()} style={{ width: '100%', padding: '12px', backgroundColor: '#4A90E2', color: 'white', fontSize: '16px', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' }}>
                      Analyze Image
                  </button>
      
                  {/* Image Preview */}
                  {image && <img src={image} alt="Preview" style={{ width: '100%', marginTop: '20px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)' }} />}
              </div>
      
              {/* Loading and AI Response Section */}
              {loading && !aiResponse ? (
                  <div style={{ margin: '30px 0', textAlign: 'center' }}>
                      <BarLoader color="#4A90E2" width="100%" />
                  </div>
              ) : aiResponse ? (
                  <div style={{ margin: '30px 0', padding: '20px', backgroundColor: '#e9f7ff', borderRadius: '8px', border: '1px solid #4A90E2' }}>
                      <h3 style={{ textAlign: 'center', color: '#333', fontSize: '20px', marginBottom: '10px' }}>Enabled Features</h3>
                      <p style={{ textAlign: 'center', color: '#333', fontSize: '16px' }}>{aiResponse}</p>
                  </div>
              ) : null}
      
              {/* Error Display */}
              {error && <div style={{ color: 'red', marginTop: '20px', textAlign: 'center' }}>{error}</div>}
          </div>
    
      
    );
};

export default AIwithImage;
