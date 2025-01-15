import { getSavedHotels } from '@/api/apiHotels';
import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { useEffect } from 'react';
import useFetch from '@/hooks/useFetch';
import { BarLoader } from 'react-spinners';
import PropertyCard from '@/components/Cards';

const SavedHotelsPage = () => {

  const { isLoaded } = useUser();

  const {
    loading: loadingSavedHotels,
    data: savedHotels,
    fn: fnSavedHotels,
  } = useFetch(getSavedHotels);

  useEffect(() => {
    if (isLoaded) {
      fnSavedHotels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  if (!isLoaded || loadingSavedHotels) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8 mt-10">
        Saved Hotels
      </h1>


      {loadingSavedHotels === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedHotels?.length ? (
            savedHotels?.map((saved,index) => {

              const hotel = saved.hotel;
              return (
                <PropertyCard
                  key={index}
                  id={hotel.id}
                  hotel= {saved.hotel}
                  images={["/placeholder.png"]} // Add placeholder or actual images
                  location={hotel.City || "Unknown City"}
                  title={hotel.Hotel_Name || "Hotel Name Not Available"}
                  rating={hotel.Hotel_Rating || "No Rating"}
                  price={hotel.Hotel_Price ? `₹${hotel.Hotel_Price.toLocaleString()}` : "Price Not Available"}
                  facilities={hotel.Facilities || "No Facilities Listed"}
                  savedInit = {true}
                />
              );
            })
          ) : (
            <div>No Saved Hotels 👀</div>
          )}
        </div>
      )}
    </>
  )
}

export default SavedHotelsPage


{/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
{currentHotels.map((hotel, index) => (
 
))}
</div> */}