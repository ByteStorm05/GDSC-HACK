import React from "react";
import { Link } from "react-router-dom"; // For React Router

const cardData = [
  {
    title: "Chat-based AI Feature",
    description: "Engage with our intelligent AI for personalized responses to your hotel search queries.",
    image: "/chat-test.jpg",
    buttonText: "Try AI Chat",
    link: "/chat" // Link to the AI Chat feature page
  },
  {
    title: "Voice Search Feature",
    description: "Use your voice to search for hotels of your choice!",
    image: "/voice-test.jpg",
    buttonText: "Try Voice Search",
    link: "/voice" // Link to the Voice Search feature page
  },
  {
    title: "Image Search Feature",
    description: "Upload images to identify favourable hotels to your needs",
    image: "/image-test.jpg",
    buttonText: "Try Image Search",
    link: "/image" // Link to the Image Search feature page
  },
];

const Work = () => {
  return (
    <section className="py-8">
      {/* Heading */}
      <h2 className="text-center text-5xl text-gray-800 font-bold mb-20">How Our App Works!</h2>
      
      {/* Cards Container */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-8 px-4">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="flex flex-col items-center max-w-sm md:max-w-md lg:max-w-lg h-auto bg-white shadow-md rounded-lg overflow-hidden transition-transform transform hover:scale-105"
          >
            {/* Card Image */}
            <img
              src={card.image}
              alt={card.title}
              className="w-full h-[500px] object-cover object-top" // Ensuring consistent height and focusing on the upper part
            />

            {/* Card Content */}
            <div className="flex-grow p-6 text-center">
              <h3 className="text-2xl font-semibold mb-4">{card.title}</h3>
              <p className="text-gray-600 mb-6">{card.description}</p>

              {/* Test Feature Button as Link */}
              <Link to={card.link} className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                {card.buttonText}
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Work;
