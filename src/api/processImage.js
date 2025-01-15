import formidable from 'formidable';
import fs from 'fs/promises';
import axios from 'axios';

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to handle file uploads
  },
};

const processImage = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm();
  form.uploadDir = './uploads'; // Temporary folder for uploads
  form.keepExtensions = true;

  try {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form:', err);
        return res.status(500).json({ error: 'Failed to process image' });
      }

      const file = files.image;
      const prompt = fields.prompt;

      if (!file) {
        return res.status(400).json({ error: 'No image uploaded' });
      }

      try {
        const imageBuffer = await fs.readFile(file.filepath);

        // Send image and prompt to Gemini API
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.NEXT_PUBLIC_API_KEY}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
            image: imageBuffer.toString('base64'), // Assuming API accepts base64-encoded images
          }
        );

        const features = response.data.candidates[0].content.parts[0].text;
        const sanitizedFeatures = features.replace(/```(?:json)?|```/g, '').trim();
        const parsedFeatures = JSON.parse(sanitizedFeatures);

        return res.status(200).json(parsedFeatures);
      } catch (apiError) {
        console.error('Error with AI API:', apiError);
        return res.status(500).json({ error: 'Failed to process image with AI' });
      } finally {
        // Clean up uploaded file
        await fs.unlink(file.filepath);
      }
    });
  } catch (error) {
    console.error('Error handling image upload:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default processImage;
