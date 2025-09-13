import React from 'react'
import Banner from './Banner'
import BestSellers from './BestSeller'
import Recommened from './Recommanded'
import News from './News'

const Home = () => {
  return (
    <div className="px-4 py-6 md:px-8 lg:px-12">
      <Banner/>
      <div className="mt-8">
        <BestSellers/>
      </div>
      <div className="mt-12">
        <Recommened/>
      </div>
      <div className="mt-12">
        <News/>
      </div>
    </div>
  )
}

export default Home
