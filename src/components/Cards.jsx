import React from 'react';
import { Heart, Star } from 'lucide-react';
import { savehotel } from '@/api/apiHotels';
import useFetch from '@/hooks/useFetch';
import { useState,useEffect} from 'react';
import { Button } from './ui/button';
import { useUser } from '@clerk/clerk-react';
import { Link } from "react-router-dom";

const PropertyCard = ({ 
  key,
  id,
  hotel,
  images,
  location,
  title,
  rating,
  dates,
  price,
  savedInit=true,
  onhotelAction = () => {},
}) => {

  const { user } = useUser();

// Temp solution type shi
  const [saved, setSaved] = useState(savedInit);

  const {
    loading: loadingSavedhotel,
    data: savedHotel,
    fn: fnSavedhotel,
  } = useFetch(savehotel, {
    alreadySaved:saved,
  });

  const handleSavehotel = async () => {
    await fnSavedhotel({
      user_id: user.id,
      hotel_id: hotel.id,
    });
    onhotelAction();
  };




  useEffect(() => {
    if (savedHotel !== undefined) setSaved(savedHotel?.length > 0);
  }, [savedHotel]);




  return (
    <>
    <Link to = {`/hotel/${id}`}> 
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
          aria-label={saved ? "Remove from favorites" : "Add to favorites"}
        >
          {/* <Heart 
            className={`h-6 w-6 ${saved ? 'fill-red-500 stroke-red-500' : 'stroke-white'}`} 
          /> */}
          <Button
            variant="outline"
            className="w-15"
            onClick={handleSavehotel}
            disabled={loadingSavedhotel}
          >
            {saved ? (
              <Heart size={20} fill="red" stroke="red" />
            ) : (
              <Heart size={20} />
            )}
          </Button>
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
    </Link>
    </>
  );
};

export default PropertyCard;