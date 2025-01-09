import React from 'react';
import { Heart, Star } from 'lucide-react';

const PropertyCard = ({ 
  images,
  location,
  title,
  rating,
  dates,
  price,
  favorite = false
}) => {
  return (
    <div className="group relative z-0">
      {/* Image Carousel */}
      <div className="aspect-square rounded-xl overflow-hidden -z-10">
        <img 
          src={images[0]} 
          alt={title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
        />
        <button 
          className="absolute top-3 right-3 p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            className={`h-6 w-6 ${favorite ? 'fill-red-500 stroke-red-500' : 'stroke-white'}`} 
          />
        </button>
      </div>

      {/* Content */}
      <div className="mt-3">
        {/* Title Row */}
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-gray-900">{location}</h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current" />
            <span>{rating}</span>
          </div>
        </div>

        {/* Details */}
        <p className="text-gray-500 mt-1">{title}</p>
        <p className="text-gray-500 mt-1">{dates}</p>
        
        {/* Price */}
        <p className="mt-2">
          <span className="font-semibold">₹{price}</span>
          <span className="text-gray-500"> night</span>
        </p>
      </div>
    </div>
  );
};

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
    {
      images: ["/placeholder.png"],
      location: "Mumbai, India",
      title: "Luxury Sea View Apartment",
      rating: "4.85",
      dates: "Dec 10-15",
      price: "15,999",
      favorite: true
    },
    {
      images: ["/placeholder.png"],
      location: "Manali, India",
      title: "Cozy Mountain Cottage",
      rating: "4.89",
      dates: "Dec 20-25",
      price: "8,999",
      favorite: false
    },
    {
      images: ["/placeholder.png"],
      location: "Manali, India",
      title: "Cozy Mountain Cottage",
      rating: "4.89",
      dates: "Dec 20-25",
      price: "8,999",
      favorite: false
    }
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