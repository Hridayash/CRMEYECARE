import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface ProfileData {
  id: string;
  groupName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  demographics: string;
  groupSize: string;
  specificRequirements: string;
}

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    id: '',
    groupName: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    demographics: '',
    groupSize: '',
    specificRequirements: ''
  });
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Function to fetch profile data from API
  const fetchProfileData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get<ProfileData>('https://crmeyecare.onrender.com/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      const profileFromApi = response.data;
  
      // Set default values to empty strings if any field is null or undefined
      const defaultProfile: ProfileData = {
        id: profileFromApi.id || '',
        groupName: profileFromApi.groupName || '',
        contactName: profileFromApi.contactName || '',
        contactEmail: profileFromApi.contactEmail || '',
        contactPhone: profileFromApi.contactPhone || '',
        demographics: profileFromApi.demographics || '',
        groupSize: profileFromApi.groupSize || '',
        specificRequirements: profileFromApi.specificRequirements || ''
      };
  
      console.log('Fetched Profile Data:', defaultProfile); // Debug: Log fetched data
      setProfileData(defaultProfile);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
      // Handle error gracefully, e.g., show error message to user
    }
  };

  // Fetch profile data when component mounts
  useEffect(() => {
    fetchProfileData();
  }, []);

  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to ${value}`); // Debug: Log changes
    setProfileData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      const token = localStorage.getItem('accessToken');
      let response;
  
      if (profileData.id) {
        // Update existing profile
        response = await axios.put<ProfileData>(`https://crmeyecare.onrender.com/profile/${profileData.id}`, profileData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Profile updated successfully:', response.data);
        alert('Profile updated successfully!');
      } else {
        // Create new profile
        response = await axios.post<ProfileData>('https://crmeyecare.onrender.com/profile', profileData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log('Profile created successfully:', response.data);
        alert('Profile created successfully!');
        setProfileData(response.data); // Update local state with new profile data, including ID
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      // Handle error gracefully, e.g., show error message to user
    }
  };

  // Logout function
  const logout = () => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      console.error('Access token not found in localStorage');
      return;
    }

    axios.post('https://crmeyecare.onrender.com/login/logout', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      localStorage.removeItem('accessToken');
      navigate('/login');
    })
    .catch(err => {
      console.error('Error logging out:', err);
    });
  };

  // Render loading indicator or form based on loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className='flex justify-between'>
        <h1 className="text-3xl font-semibold mb-6">Profile</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 ml-200 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Logout
        </button>
      </div> 

      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Group Name */}
          <div>
            <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              id="groupName"
              type="text"
              name="groupName"
              value={profileData.groupName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Contact Name */}
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="contactName"
              type="text"
              name="contactName"
              value={profileData.contactName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Contact Email */}
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="contactEmail"
              type="email"
              name="contactEmail"
              value={profileData.contactEmail}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              id="contactPhone"
              type="tel"
              name="contactPhone"
              value={profileData.contactPhone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Demographics */}
          <div>
            <label htmlFor="demographics" className="block text-sm font-medium text-gray-700 mb-1">
              Member Information
            </label>
            <textarea
              id="demographics"
              name="demographics"
              value={profileData.demographics}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            ></textarea>
          </div>

          {/* Group Size */}
          <div>
            <label htmlFor="groupSize" className="block text-sm font-medium text-gray-700 mb-1">
              Group Size
            </label>
            <input
              id="groupSize"
              type="text"
              name="groupSize"
              value={profileData.groupSize}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Specific Requirements */}
          <div>
            <label htmlFor="specificRequirements" className="block text-sm font-medium text-gray-700 mb-1">
              Specific Requirements
            </label>
            <textarea
              id="specificRequirements"
              name="specificRequirements"
              value={profileData.specificRequirements}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className='flex justify-between'>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
