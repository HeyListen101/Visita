import backgroundImage from "../assets/background-images/MapPage.png";
import React from "react";

function MapPage() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "100% 100%",
        width: "100vw",
        height: "100vh",
      }}
    >
      {/* <div className="rectangle-73"></div> */}




    </div>
  );
}

export default MapPage;