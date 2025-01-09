import React, { useState, useEffect } from 'react';
import { Search, Calendar, Users } from 'lucide-react';
import cityList from '../assets/indianCities.json'; // Import the Indian cities list

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestCount, setGuestCount] = useState(1);

  // Flatten the list of cities from the JSON file
  const cities = Object.values(cityList).flat();

  useEffect(() => {
    if (searchTerm) {
      const filtered = cities.filter((city) =>
        city.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [searchTerm, cities]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowCityDropdown(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSearchTerm(city);
    setShowCityDropdown(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      city: selectedCity,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guestCount,
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* City Search */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowCityDropdown(true);
              }}
              onFocus={() => setShowCityDropdown(true)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search cities..."
            />
            {showCityDropdown && filteredCities.length > 0 && (
              <div
                className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto"
                onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
              >
                {filteredCities.map((city, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCitySelect(city)}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Check-in Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-in Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Check-out Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-out Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="date"
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Guest Count */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Guests
            </label>
            <div className="relative">
              
              <div className="flex">
                {/* Decrement Button */}
                <button
                  type="button"
                  onClick={() => setGuestCount(Math.max(1, guestCount - 1))} // Ensure guests cannot go below 1
                  className="px-3 py-2 border rounded-l-lg hover:bg-gray-100"
                >
                  -
                </button>

                {/* Guest Count Input */}
                <input
                  type="number"
                  value={guestCount}
                  onChange={(e) =>
                    setGuestCount(Math.max(1, parseInt(e.target.value) || 1)) // Ensure valid input
                  }
                  min="1"
                  className="w-full p-2 border-t border-b text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                {/* Increment Button */}
                <button
                  type="button"
                  onClick={() => setGuestCount(guestCount + 1)}
                  className="px-3 py-2 border rounded-r-lg hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <Search className="h-5 w-5" />
            Search Hotels
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;







// import React, { useState, useEffect } from 'react';
// import { Search, Calendar, Users } from 'lucide-react';
// import cityList from '../assets/indianCities.json'; // Import the Indian cities list

// const SearchBar = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showCityDropdown, setShowCityDropdown] = useState(false);
//   const [filteredCities, setFilteredCities] = useState([]);
//   const [selectedCity, setSelectedCity] = useState('');
//   const [checkInDate, setCheckInDate] = useState('');
//   const [checkOutDate, setCheckOutDate] = useState('');
//   const [guestCount, setGuestCount] = useState(1);

//   // Flatten the list of cities from the JSON file
//   const cities = Object.values(cityList).flat();

//   useEffect(() => {
//     if (searchTerm) {
//       const filtered = cities.filter((city) =>
//         city.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredCities(filtered);
//     } else {
//       setFilteredCities([]);
//     }
//   }, [searchTerm, cities]);

//   const handleCitySelect = (city) => {
//     setSelectedCity(city);
//     setSearchTerm(city);
//     setShowCityDropdown(false);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log({
//       city: selectedCity,
//       checkIn: checkInDate,
//       checkOut: checkOutDate,
//       guests: guestCount,
//     });
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {/* City Search */}
//           <div className="relative">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               City
//             </label>
//             <input
//               type="text"
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setShowCityDropdown(true);
//               }}
//               onFocus={() => setShowCityDropdown(true)}
//               className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Search cities..."
//             />
//             {showCityDropdown && filteredCities.length > 0 && (
//               <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
//                 {filteredCities.map((city, index) => (
//                   <div
//                     key={index}
//                     className="p-2 hover:bg-gray-100 cursor-pointer"
//                     onClick={() => handleCitySelect(city)}
//                   >
//                     {city}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Check-in Date */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Check-in Date
//             </label>
//             <div className="relative">
//               <Calendar className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
//               <input
//                 type="date"
//                 value={checkInDate}
//                 onChange={(e) => setCheckInDate(e.target.value)}
//                 className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//           </div>

//           {/* Check-out Date */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Check-out Date
//             </label>
//             <div className="relative">
//               <Calendar className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
//               <input
//                 type="date"
//                 value={checkOutDate}
//                 onChange={(e) => setCheckOutDate(e.target.value)}
//                 className="w-full p-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//           </div>

//           {/* Guest Count */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Guests
//             </label>
//             <div className="relative">
//               <Users className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
//               <div className="flex">
//                 <button
//                   type="button"
//                   onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
//                   className="px-3 py-2 border rounded-l-lg hover:bg-gray-100"
//                 >
//                   -
//                 </button>
//                 <input
//                   type="number"
//                   value={guestCount}
//                   onChange={(e) =>
//                     setGuestCount(Math.max(1, parseInt(e.target.value) || 1))
//                   }
//                   min="1"
//                   className="w-full p-2 border-t border-b text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setGuestCount(guestCount + 1)}
//                   className="px-3 py-2 border rounded-r-lg hover:bg-gray-100"
//                 >
//                   +
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search Button */}
//         <div className="mt-6">
//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
//           >
//             <Search className="h-5 w-5" />
//             Search Hotels
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default SearchBar;
