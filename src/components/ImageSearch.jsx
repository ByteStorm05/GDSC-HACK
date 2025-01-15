import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getBase64 } from '../helpers/imageHelper';

// Initialize the Generative AI instance
const genAI = new GoogleGenerativeAI(`${import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT}`);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const AIwithImage = () => {
    const [image, setImage] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageInlineData, setImageInlineData] = useState(null);
    const [searchText, setSearchText] = useState('');

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

    // Call Gemini model to fetch hotel features based on the image and search text
    async function aiImageRun() {
        setLoading(true);
        setAiResponse('');

        try {
            // The custom prompt based on hotel search request
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

            // Pass the prompt and image to the model
            const result = await model.generateContent([
                prompt, imageInlineData
            ]);
            const response = await result.response;
            const text = await response.text();
            setAiResponse(text);
            const cleanText = text.replace(/```json|```/g, '').trim();
            const objectify = JSON.parse(cleanText)
            console.log(objectify)


        } catch (error) {
            setAiResponse('Error processing image');
            console.error(error);
        }
        setLoading(false);
    }

    return (
        <div>
            <h1>Welcome to AI with Image!</h1>

            {/* Image Input Section */}
            <div>
                <div style={{ display: 'flex' }}>
                    <input type='file' onChange={(e) => handleImageChange(e)} />
                    <button style={{ marginLeft: '20px' }} onClick={() => aiImageRun()}>Search</button>
                </div>

                {/* Search Text Input Section */}
                <div style={{ marginTop: '20px' }}>
                    <input 
                        type="text" 
                        placeholder="Enter hotel search request" 
                        value={searchText} 
                        onChange={(e) => setSearchText(e.target.value)} 
                    />
                </div>

                {/* Image Preview */}
                {image && <img src={image} alt="Preview" style={{ width: '30%', marginTop: 30 }} />}
            </div>

            {/* Loading and AI Response Section */}
            {loading && !aiResponse ? (
                <p style={{ margin: '30px 0' }}>Loading ...</p>
            ) : (
                <div style={{ margin: '30px 0' }}>
                    <p>{aiResponse}</p>
                </div>
            )}
        </div>
    );
};

export default AIwithImage;
