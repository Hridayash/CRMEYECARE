import { Link } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaUserCircle } from 'react-icons/fa';

// Define the type for props
interface NavbarProps {
  name: string;
}

const Navbar: React.FC<NavbarProps> = (props) => {
  return (
    <nav className="bg-gray-900 text-white h-16 px-6 flex items-center justify-between">
      {/* Logo or brand */}
      <Link to="/" className="text-xl font-bold ml-6">
        OptiCare
      </Link>

      {/* Search Bar */}
      <div className="flex items-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-800 text-white px-4 py-2 rounded-l-xl focus:outline-none"
          />
          <button className="bg-gray-800 text-white px-4 py-2 rounded-r-xl hover:bg-gray-700 focus:outline-none">
            <AiOutlineSearch />
          </button>
        </div>
      </div>

      {/* User Profile and MyAccount section */}
      <div className="flex items-center space-x-2">
        <FaUserCircle className="text-2xl" />
        <Link to="/profile" className="hover:underline">
          {props.name}
        </Link>
        {/* <Link to="/signup" className="hover:underline">
          MyAccount
        </Link> */}
      </div>
    </nav>
  );
};

export default Navbar;
