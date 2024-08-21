import React from 'react';
import { Link } from 'react-router-dom';
import { AiFillHome, AiOutlineUser, AiOutlineCalendar, AiOutlineBarChart } from 'react-icons/ai';
import { FaShoppingBag } from 'react-icons/fa';
import { MdMedicalServices, MdOutlinePayment } from 'react-icons/md';
import { FaUserDoctor } from 'react-icons/fa6';

// Type for NavLink props
interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const Sidebar: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white w-60 flex-shrink-0">
      <div className="flex flex-col h-screen">
        {/* Sidebar header */}
       

        {/* Sidebar links */}
        <div className="flex-1 overflow-y-auto">
          <nav className="mt-6">
            <NavLink to="/dashboard" icon={<AiFillHome />}>
              Dashboard
            </NavLink>
            <NavLink to="/patients" icon={<AiOutlineUser />}>
              Patients
            </NavLink>
            <NavLink to="/appointments" icon={<AiOutlineCalendar />}>
              Appointments
            </NavLink>
            <NavLink to="/reports" icon={<AiOutlineBarChart />}>
              Reports
            </NavLink>
            <NavLink to="/payment" icon={<MdOutlinePayment />}>
              Payment
            </NavLink>
            <NavLink to="/doctor" icon={<FaUserDoctor />}>
              Doctor
            </NavLink>
            <NavLink to="/service" icon={<MdMedicalServices />}>
              Service
            </NavLink>
            <NavLink to="/sales" icon={<FaShoppingBag />}>
              Sales
            </NavLink>
          </nav>
        </div>
        
        {/* Sidebar footer */}
        <div className="p-4 text-sm text-gray-400 border-t border-gray-800">
          <p>&copy; 2024 EyeCare CRM. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

const NavLink: React.FC<NavLinkProps> = ({ to, icon, children }) => (
  <Link
    to={to}
    className="flex items-center px-4 py-2 text-sm hover:bg-gray-800 transition duration-200"
  >
    <div className="w-6 h-6 mr-3">{icon}</div>
    {children}
  </Link>
);

export default Sidebar;
