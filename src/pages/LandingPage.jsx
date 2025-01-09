import PropertyGrid from '@/components/Cards'
import SearchBar from '@/components/Searchbar'
import React from 'react'

const LandingPage = () => {
  return (
    <>
    <SearchBar />
    <div className='items-center flex justify-center'>
      
    <PropertyGrid />
    </div>
    
    </>
  )
}

export default LandingPage