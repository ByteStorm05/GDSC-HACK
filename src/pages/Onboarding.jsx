import React, { useState, useEffect } from "react";
import useFetch from "@/hooks/useFetch";
import { getHotels } from "@/api/apiHotels";
import PropertyCard from "@/components/Cards";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import SearchBar from "@/components/Searchbar";
import HotelSearchSuggestions from "@/components/HotelSuggestions";

const Onboarding = () => {
  const { isLoaded } = useUser();

  const {
    fn: fnHotels,
    data: dataHotels,
    loading: loadingHotels,
  } = useFetch(getHotels);

  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page
  const itemsPerPage = 20; // Number of items per page
  const [selectedCity, setSelectedCity] = useState(""); // State for selected city

  useEffect(() => {
    // Fetch hotels once the user is loaded
    if (isLoaded) {
      fnHotels();
    }
  }, [isLoaded]);

  if (!isLoaded || loadingHotels || !dataHotels) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  // Filter hotels based on the selected city
  const filteredHotels = dataHotels.filter((hotel) => {
    if (!selectedCity) return true; // If no city selected, return all hotels
    const cityLower = selectedCity.toLowerCase();
    return (
      hotel.Hotel_Name.toLowerCase().includes(cityLower) ||
      hotel.City?.toLowerCase().includes(cityLower)
    );
  });

  // Calculate the total number of pages for the filtered results
  const totalPages = Math.ceil(filteredHotels.length / itemsPerPage);

  // Calculate the hotels to display on the current page from filteredHotels
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentHotels = filteredHotels.slice(startIndex, endIndex);

  // Handle page navigation
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  // Handle search city change
  const handleCitySelect = (city) => {
    setSelectedCity(city); // Update selected city state
    setCurrentPage(1); // Reset to first page when city is changed
    // If city is blank, reset the hotels list to include all hotels
    if (!city) {
      setCurrentPage(1); // Reset to first page
    }
  };

  return (
    <>
      <SearchBar onSearch={handleCitySelect} />
      {selectedCity && (
        <div className="mt-4 p-4 bg-gray-200 rounded-lg">
          <p className="text-lg font-semibold">Selected City: {selectedCity}</p>
        </div>
      )}

      <HotelSearchSuggestions/>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {currentHotels.map((hotel,index) => (
            <PropertyCard
              key={index}
              id={hotel.id}
              hotel= {hotel}
              images={["/placeholder.png"]} // Add placeholder or actual images
              location={hotel.City || "Unknown City"}
              title={hotel.Hotel_Name || "Hotel Name Not Available"}
              rating={hotel.Hotel_Rating || "No Rating"}
              price={hotel.Hotel_Price ? `₹${hotel.Hotel_Price.toLocaleString()}` : "Price Not Available"}
              facilities={hotel.Facilities || "No Facilities Listed"}
              savedInit = {hotel?.saved?.length > 0}
            />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          >
            Previous
          </button>
          <p className="text-sm">
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white hover:bg-blue-600"}`}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default Onboarding;
