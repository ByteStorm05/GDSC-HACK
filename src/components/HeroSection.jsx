import React from 'react';

const HeroSection = () => {
  return (
    <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-5">
      <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20 md:items-center">
        {/* Left Section: Text Content */}
        <div className="flex flex-col justify-center h-full">
          <h1 className="block text-3xl font-bold text-gray-800 sm:text-4xl lg:text-6xl lg:leading-tight">
            Welcome to my <span className="text-red-600">G</span>
            <span className="text-blue-600">D</span>
            <span className="text-yellow-500">S</span>
            <span className="text-green-600">C</span>
            <span className="block text-gray-800"> project!</span>
          </h1>
          <p className="mt-3 text-lg text-gray-600">
          We are developing a Real-Time Hotel Search application that transforms the hotel booking experience by incorporating multiple innovative search methods. Users can interact with the app via a chat-based interface, where they can easily input their desired amenities, such as free Wi-Fi, a pool, or a gym, and receive personalized hotel recommendations in real-time. Additionally, the app features voice search, enabling users to specify their preferences using natural language commands. For a more visual approach, image-based search allows users to find hotels that match their aesthetic or ambiance preferences based on uploaded images. These advanced search tools work together to create a faster, smarter, and more personalized hotel search experience, making it easier for users to discover their ideal stay.
          </p>

          <div className="mt-7 grid gap-3 w-full sm:inline-flex">
            <a 
              href="/onboarding" 
              className="py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              Dynamic Dashboard
              <svg 
                className="shrink-0 size-4" 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </a>
            
          </div>
        </div>

        {/* Right Section: Image */}
        <div className="relative flex justify-center items-center hidden md:block">
          <img 
            className="w-5/6 rounded-md" 
            src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png" 
            alt="Google Logo" 
            width={150} 
            height={150} 
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
