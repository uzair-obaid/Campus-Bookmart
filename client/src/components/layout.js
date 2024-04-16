import NN from "./Navbar";
import Foot from "./Foot";

const Layout = ({ children }) => {
    return (
      <div>
        
        <NN />
        <div className="content">{children}</div>
        <Foot />
      </div>
    );
  };

export default Layout;
  