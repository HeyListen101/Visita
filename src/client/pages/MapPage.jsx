import React from "react";
// fixed inset-0 flex items-center justify-center bg-cover bg-center overflow-hidden
function MapPage() {
  return (
    <div className="map-holder fixed inset-0 flex items-center justify-center bg-cover bg-center overflow-hidden">
      <div className="vehicle-entrance">Entrance for Vehicles</div>
      <div className="vehicle-exit">Exit for Vehicles</div>
      <div className="search-bar">Search...</div>
      <div className="lower-campus">To VSU Lower Campus</div>
      <div className="community-chat">Community Chat</div>
      <div className="visita">Visita</div>
      <div className="account-container"></div>
      {[...Array(73)].map((_, index) => (
        <div key={index} className={`rectangle-${73 - index}`} />
      ))}

    </div>
  );
};

export default MapPage;