import Navbar from "./Navbar";
import Foot from "./Foot";

const Layout = ({ children }) => {
    return (
      <div>
        
        <Navbar />
        <div className="content">{children}</div>
        <Foot />
      </div>
    );
  };

export default Layout;
  