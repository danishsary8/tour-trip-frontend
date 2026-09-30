import React, {useState} from 'react'
import HeroBanner from './HeroBanner'
import FilterTabs from './FilterTabs'
import {FILTERS ,HERO_IMAGE} from '../../constants/heroData';
import SearchPanel from './SearchPanel';



const TourTripHero = () => {
  const [activeFilter, setActiveFilter] = useState("All Tours");
  return (
    <div
      className="w-full bg-stone-50 px-4 py-7 sm:px-6 md:px-10"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
      />

      <div className="relative mb-24">
        <HeroBanner image={HERO_IMAGE} />

        <div className="absolute left-1/2 bottom-0 w-full max-w-4xl -translate-x-1/2 translate-y-1/2 px-4">
          <SearchPanel />
        </div>
      </div>

      <FilterTabs
        filters={FILTERS}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
    </div>
  );
}

export default TourTripHero
