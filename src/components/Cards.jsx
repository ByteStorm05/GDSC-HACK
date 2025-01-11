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
          <h3 className="font-medium text-gray-900">{title}</h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-current" />
            <span>{rating}</span>
          </div>
        </div>

        {/* Details */}
        <p className="text-gray-500 mt-1">{location}</p>
        <p className="text-gray-500 mt-1">{dates}</p>
        
        {/* Price */}
        <p className="mt-2">
          <span className="font-semibold">{price}</span>
          <span className="text-gray-500"> night</span>
        </p>
      </div>
    </div>
  );
};

export default PropertyCard;