import backgroundImage from "../assets/background-images/LandingPage.png";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: "url('https://www.eduopinions.com/wp-content/uploads/2017/09/Visayas-State-University-VSU-campus.jpg')" }}
    >
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4 text-black">Log In</h2>

        {/* Styled Inputs */}
        <input
          type="email"
          placeholder="Email address"
          className="w-full p-2 mb-3 border border-gray-400 rounded-md focus:border-blue-600 focus:outline-blue-600"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-3 border border-gray-400 rounded-md focus:border-blue-600 focus:outline-blue-600"
        />

        {/* Sign-up and Forgot Password Links */}
        <div className="flex justify-between w-full text-sm mb-4">
          <a href="#" className="text-[#696047] hover:text-[#57503A]">
            Sign-up or Register
          </a>
          <a href="#" className="text-[#696047] hover:text-[#57503A]">
            Forgot Password?
          </a>
        </div>

        {/* Continue Button */}
        <Link to="/map" className="block w-full">
          <button className="w-full text-white p-2 rounded-md">
            Continue
          </button>
        </Link>

        {/* OR Divider with Color Matching */}
        <div className="flex items-center w-full my-3">
          <hr className="flex-grow border-t border-[#696047] mx-2" />
          <span className="text-[#696047] font-medium text-m relative bottom-[3px]">or</span>
          <hr className="flex-grow border-t border-[#696047] mx-2" />
        </div>

        {/* Google Sign-In Button */}
        <Link to="/map" className="block w-full">
        <button className="w-full flex items-center justify-center text-white">
            <img src="/path-to-google-logo.png" alt="Google" className="w-5 h-5 mr-2" />
            Continue with Google
          </button>
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
