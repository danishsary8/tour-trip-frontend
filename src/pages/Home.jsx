import React from "react";
import DestinationList from "../components/DestinationList";
import SocialMedia from "../components/SocialMedia";

function Home() {
  return (
    <div>

      

      <main className="px-6 py-8 mx-auto max-w-4xl">

        <div className="mb-5">
          <p className="text-xs font-semibold text-red-400">
            TOP DESTINATION
          </p>

          <h2 className="text-2xl font-bold text-gray-800">
            Place worth discovering
          </h2>

          <p className="text-sm text-gray-500">
            Start with our most-loved destinations across Southeast Asia.
          </p>
        </div>

        <DestinationList />

        <SocialMedia />

      </main>


    </div>
  );
}

export default Home;