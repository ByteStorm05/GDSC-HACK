import React from 'react';
import PropertyCard from './Cards';



// Example usage component with multiple cards


const PropertyGrid = () => {
  
  const properties = [
    {
      images: ["/placeholder.png"],
      location: "Goa, India",
      title: "Beach Villa with Private Pool",
      rating: "4.92",
      dates: "Dec 1-6",
      price: "12,999",
      favorite: false
    },
    
  ];
  

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {properties.map((property, index) => (
          <PropertyCard key={index} {...property} />
        ))}
      </div>
    </div>
  );
};

export default PropertyGrid;