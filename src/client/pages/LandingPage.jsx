import backgroundImage from "../assets/background-images/LandingPage.png"
import { Link } from "react-router-dom";

function LandingPage() {
    return (
        <div 
          className="h-screen w-screen bg-cover bg-center flex flex-col justify-center items-center text-white"
          style={{
            backgroundImage:`url(${backgroundImage})`
          }}
        >
          <h1 className="h1">Welcome to ViSiTa</h1>
          <p className="p">Go to the market, without going!</p>
          <Link to="/map">
            <button className="button">
                Open Map
            </button>
          </Link>
        </div>
      );
}

export default LandingPage;
