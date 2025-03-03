import { Link } from "react-router-dom";

function MapPage() {
    return (
        <div className="h-screen w-screen bg-[#0D1224] flex flex-col justify-center items-center">
          <h1 className="h1">This is where the map will be!</h1>
          <p className="p">Alongside the real time chat</p>
          <Link to="/">
            <button className="button">
                Open Map
            </button>
          </Link>
        </div>
      );
}

export default MapPage;