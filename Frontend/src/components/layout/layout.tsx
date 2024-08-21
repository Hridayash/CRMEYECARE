import { ReactNode, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../Nav/nav';
import Sidebar from '../sidebar/sidebar';
import axios from 'axios';

interface LayoutProps {
  children?: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<string>(''); // Initialize user state with an empty string

  useEffect(() => {
    console.log('Fetching user data...');

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          navigate('/login');
          throw new Error('No access token found');
        }
        const response = await axios.get<{ username: string }>('http://localhost:3002/user/userInfo', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data.username); // Update user state with the username string
      } catch (err) {
        console.error('Error fetching user data:', err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          console.log('Unauthorized');
          navigate('/login');
        } else {
          console.log('Cannot fetch data');
        }
      }
    };

    fetchUserData();
  }, [navigate]); // Include navigate in the dependency array

  return (
    <div className="flex flex-col h-screen">
      <Navbar name={user} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
