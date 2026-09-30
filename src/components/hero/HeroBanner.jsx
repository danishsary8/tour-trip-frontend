import React from 'react'

import { ChevronDown } from 'lucide-react'

const HeroBanner = ({ image }) => {
     return (
    <div
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-cover bg-center"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/70 via-gray-900/35 to-gray-900/45" />

      {/* Content */}
      <div className="relative flex min-h-[320px] flex-col justify-center px-5 py-10 sm:min-h-[420px] sm:px-10 sm:py-16 md:min-h-[500px]">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-white/80 sm:text-sm">
          <span>Home</span>
          <ChevronDown className="h-3 w-3 -rotate-90" />
          <span className="text-white">Tour</span>
        </div>

        {/* Heading */}
        <div className="mt-6 max-w-xl">
          <h1
            className="text-3xl italic leading-tight text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "'Cormorant Garamond'" }}
          >
            Explore the world,
            <span className="block not-italic">
              one trip at a time.
            </span>
          </h1>

          <p className="mt-4 max-w-md text-sm leading-7 text-white/90 sm:text-lg">
            Find beautiful places, unforgettable experiences, and tours made
            for your next adventure.
          </p>
        </div>

      </div>
    </div>
  );
}

export default HeroBanner
