import React from "react";

const InteractiveMap = () => {
  return (
    <div className="relative w-[1440px] h-[1024px] bg-white">
      {/* Top Bar */}
      <div className="absolute w-full h-[90px] bg-gray-200" />

      {/* Search Bar */}
      <div className="absolute w-[500px] h-[50px] bg-white shadow-md rounded-lg left-1/2 transform -translate-x-1/2 top-[20px]" />

      {/* Search Icon */}
      <div className="absolute w-[20px] h-[20px] left-[495px] top-[35px]" />

      {/* Profile Icon */}
      <div className="absolute w-[50px] h-[50px] bg-white shadow-md left-[1365px] top-[20px]" />

      {/* Chat Community */}
      <div className="absolute w-[200px] h-[50px] bg-white shadow-md rounded-lg left-[25px] top-[949px] flex items-center justify-center">
        <span className="text-[16px] font-semibold text-black">Chat Community</span>
      </div>

      {/* Buttons */}
      {[622, 664, 706, 580, 538, 455, 420, 385, 350, 315, 280, 245, 210].map((top, index) => (
        <div
          key={index}
          className="absolute w-[64px] h-[42px] left-[1351px] border border-white rounded-md"
          style={{ top: `${top}px`, backgroundColor: index % 2 === 0 ? "#8AD70E" : "#F07474" }}
        />
      ))}
      {/* Rectangle 252 */}
      <div className="absolute w-[683.48px] h-[35px] left-[638.08px] top-[232.83px] bg-gray-400/40 rounded-tr-xl"></div>

      {/* Rectangle 253-256 */}
      <div className="absolute w-[344.3px] h-[14px] left-[798.08px] top-[710.27px] bg-gray-400/40"></div>
      <div className="absolute w-[111.35px] h-[14px] left-[1155.17px] top-[710.27px] bg-gray-400/40"></div>
      <div className="absolute w-[344.3px] h-[14px] left-[798.08px] top-[839.08px] bg-gray-400/40"></div>

      {/* Rectangle 257 */}
      <div className="absolute w-[32.16px] h-[673.99px] left-[1289.49px] top-[267.23px] bg-gradient-to-b from-gray-300 to-white"></div>

      {/* Buttons */}
      {[
        { left: 813, top: 733, bg: "bg-green-700" },
        { left: 813.43, top: 781.67, bg: "bg-lime-500" },
        { left: 858, top: 782, bg: "bg-lime-400" },
        { left: 903, top: 782, bg: "bg-green-300" },
        { left: 948, top: 782, bg: "bg-green-900" },
        { left: 993, top: 782, bg: "bg-green-700" },
        { left: 1037, top: 782, bg: "bg-red-400" },
        { left: 1082, top: 782, bg: "bg-red-400" },
        { left: 858.23, top: 732.67, bg: "bg-lime-500" },
        { left: 903, top: 733, bg: "bg-lime-400" },
        { left: 992.62, top: 732.67, bg: "bg-red-400" },
        { left: 1037, top: 733, bg: "bg-green-700 w-[89.59px]" },
        { left: 948, top: 733, bg: "bg-green-300" },
        { left: 424.34, top: 129.22, bg: "bg-green-700 w-[104.31px] h-[70.01px]" },
        { left: 380, top: 129, bg: "bg-green-900 h-[70.01px]" },
        { left: 335, top: 129, bg: "bg-green-300 h-[70.01px]" },
        { left: 271, top: 129, bg: "bg-lime-400 w-[64px] h-[70.01px]" },
        { left: 206.31, top: 129.22, bg: "bg-red-400 w-[64px] h-[70.01px]" },
      ].map((btn, idx) => (
        <div
          key={idx}
          className={`absolute ${btn.bg} border border-white rounded-md w-[44.8px] h-[49px]`}
          style={{ left: `${btn.left}px`, top: `${btn.top}px` }}
        ></div>
      ))}

      {/* Rectangle 315 */}
      <div className="absolute w-16 h-[70px] left-[141px] top-[129px] bg-green-700 border border-white rounded-md" />
      
      {/* Rectangle 316 */}
      <div className="absolute w-16 h-[35px] left-[76px] top-[129px] bg-green-900 border border-white rounded-md" />

      {/* Rectangle 317 */}
      <div className="absolute w-8 h-[105px] left-[25px] top-[164px] bg-green-300 border border-white rounded-md" />
      
      {/* Rectangle 318 - 321 */}
      <div className="absolute w-8 h-[70px] left-[1005px] top-[129px] bg-green-700 border border-white rounded-md" />
      <div className="absolute w-8 h-[70px] left-[973px] top-[129px] bg-green-900 border border-white rounded-md" />
      <div className="absolute w-8 h-[70px] left-[941px] top-[129px] bg-green-300 border border-white rounded-md" />
      <div className="absolute w-8 h-[70px] left-[909px] top-[129px] bg-lime-500 border border-white rounded-md" />
      
      {/* Rectangle 322 */}
      <div className="absolute w-[141px] h-[70px] left-[1231px] top-[129px] bg-lime-600 rounded-md" />
      
      {/* Labels */}
      <div className="absolute w-[199px] text-center text-black font-medium text-lg left-[calc(50%-198px/2-97px)] top-[99px]">
        To VSU Lower Campus
      </div>
      
      <div className="absolute w-[154px] text-center text-black font-medium text-lg left-[calc(50%-154px/2-98px)] top-[939px]">
        Entrance/Exit (Exit for Vehicles)
      </div>
      
      <div className="absolute w-[201px] text-center text-black font-medium text-lg left-[calc(50%-201px/2+586px)] top-[941px]">
        Entrance/Exit (Entrance for Vehicles)
      </div>
      
      {/* Road */}
      <div className="absolute w-[525px] h-[11px] left-[82px] top-[209px] bg-gradient-to-r from-white/40 to-gray-400/40" />
      
      {/* Icons */}
      <div className="absolute w-[15px] h-[17px] left-[1375px] top-[219px] bg-white" />
      <div className="absolute w-[15px] h-[17px] left-[1376px] top-[254px] bg-white" />
      <div className="absolute w-[15px] h-[17px] left-[1376px] top-[289px] bg-white" />
      
    </div>
  );
};

export default InteractiveMap;