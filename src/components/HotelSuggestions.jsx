import React from 'react';
import { Link } from 'react-router-dom';

const HotelSearchSuggestions = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Better Search Hotels with These Features:</h2>
        <p className="text-lg text-gray-600 mb-8">
          Discover hotels effortlessly using advanced chat, voice, and image-based searches.
        </p>

        {/* Button Container */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/chat" className="px-8 py-4 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all">
            <span className="text-lg font-semibold">Chat-based AI</span>
          </Link>
          <Link to="/voice" className="px-8 py-4 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-700 transition-all">
            <span className="text-lg font-semibold">Voice Search</span>
          </Link>
          <Link to="/image" className="px-8 py-4 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-all">
            <span className="text-lg font-semibold">Image Search</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HotelSearchSuggestions;
