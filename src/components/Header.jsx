import React, { useState,useEffect} from 'react';
import { SignedIn, SignedOut, UserButton,SignIn } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button"
import {  Heart } from "lucide-react";
import { useSearchParams } from 'react-router-dom';



const Header = () => {
  // State to track if the menu is open
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // State for the toggle button
  const [isToggled, setIsToggled] = useState(false);

  const [showSignIn, setShowSignIn] = useState(false);
  const [search, setSearch] = useSearchParams();


  useEffect(() => {
    if (search.get("sign-in")) {
      setShowSignIn(true);
    }
  }, [search]);
  // Function to toggle the menu
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Function to handle the toggle button
  const handleToggle = () => {
    setIsToggled((prev) => !prev);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowSignIn(false);
      setSearch({});
    }
  };


  return (
    <>
    <nav className="bg-white fixed w-full z-20 top-0 start-0 border-b border-gray-200">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
            alt="GenAi Logo"
            className="h-8 w-8"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">GDSC Project</span>
        </a>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-2">
          {/* <button
            onClick={handleToggle}
            className={`text-white font-medium rounded-lg text-sm px-4 py-2 text-center ${
              isToggled ? 'bg-green-600 hover:bg-green-700 focus:ring-green-300' : 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300'
            }`}
          >
            {isToggled ? 'Toggled ON' : 'Toggle'}
          </button> */}
          <SignedOut>
            <Button variant="outline" onClick={() => setShowSignIn(true)}>
            Sign In
            </Button>
            
           </SignedOut>
          <SignedIn>
          <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="Saved Hotels"
                  labelIcon={<Heart size={15} />}
                  href="/saved-hotels"
                />
                <UserButton.Action label="manageAccount" />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-sticky"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>
        <div className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${isMenuOpen ? '' : 'hidden'}`} id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white">
            <li>
              <a href="/onboarding" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0" aria-current="page">Hotels</a>
            </li>
            <li>
              <a href="/dashboard" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">Chat</a>
            </li>
            <li>
              <a href="/buystocks" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">Voice-Search</a>
            </li>
            <li>
              <a href="/profile" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">Image Search</a>
            </li>
            <li>
              <a href="/saved-hotels" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0">Saved-Hotels</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
        {showSignIn && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10"
            onClick={handleOverlayClick}
          >
            <SignIn
              signUpForceRedirectUrl="/onboarding"
              fallbackRedirectUrl="/onboarding"
            />
          </div>
        )}
  </>
    
  );
};

export default Header;
