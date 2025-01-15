import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import useFetch from "@/hooks/useFetch";
import { getSingleHotel } from "@/api/apiHotels";

const HotelPage = () => {
  const { id } = useParams();
  const { isLoaded, user } = useUser();

  // Fetch the hotel details using the useFetch hook
  const { loading: loadingHotel, data: hotel, fn: fetchHotel } = useFetch(
    getSingleHotel,
    { hotel_id: id }
  );

  // Fetch the hotel details when the user is loaded
  useEffect(() => {
    if (isLoaded) {
      fetchHotel();
    }
  }, [isLoaded]);

  // Show a loading spinner while the hotel data is being fetched
  if (!isLoaded || loadingHotel || !hotel) {
    return (
      
        <BarLoader width={"100%"} color="#36d7b7" />
    
    );
  }

  // Destructure hotel details (with fallback values in case of missing data)
  const {
    Hotel_Name = "N/A",
    Hotel_Price = "N/A",
    Hotel_Rating = 0,
    Facilities = "",
    City = "Unknown",
  } = hotel;

  return (
    <div className="w-full min-h-screen bg-gray-100">
      {/* Hotel Details Section */}
      <div className="max-w-screen-lg mx-auto p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-2">{Hotel_Name}</h2>
            <p className="text-lg text-gray-600">Price per Night: ₹{Hotel_Price}</p>
            <p className="text-gray-600">Rating: {Hotel_Rating} / 5</p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Displaying rating stars */}
            {[...Array(Math.floor(Hotel_Rating))].map((_, i) => (
              <span key={i} className="text-yellow-500">★</span>
            ))}
            {[...Array(5 - Math.floor(Hotel_Rating))].map((_, i) => (
              <span key={i} className="text-gray-300">★</span>
            ))}
          </div>
        </div>

        {/* Hotel Facilities */}
        <div className="mt-6">
          <h3 className="text-2xl font-semibold">Facilities</h3>
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {Facilities.split(", ").map((facility, index) => (
              <li key={index} className="bg-gray-200 p-4 rounded-lg text-center">
                <p className="text-lg">{facility}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Price and Book Button */}
        <div className="mt-8 flex justify-between items-center">
          <div className="text-2xl font-semibold">
            ₹{Hotel_Price} / night
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all">
            Book Now
          </button>
        </div>
      </div>

      
    </div>
  );
};

export default HotelPage;
