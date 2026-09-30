import React from "react";
import { DestinationData } from "../data/DestinationData";
import DestinationCard from "./DestinationCard";

function DestinationList() {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

      {DestinationData.map((destination) => (
        <DestinationCard
          key={destination.id}
          destination={destination}
        />
      ))}

    </div>
  );
}

export default DestinationList;