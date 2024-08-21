import React, { useState, useEffect } from 'react';
import axios from 'axios';


interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
}

const ServicesManager: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [formState, setFormState] = useState<Service | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
 

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get<Service[]>('https://crmeyecare.onrender.com/services', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleEdit = (service: Service) => {
    setFormState(service);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`https://crmeyecare.onrender.com/services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');

    try {
      if (isEditing && formState) {
        // Update existing service
        await axios.put(`https://crmeyecare.onrender.com/services/${formState.id}`, formState, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Create new service
        await axios.post('https://crmeyecare.onrender.com/services', formState, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setFormState(null);
      setIsEditing(false);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }) as Service);
  };

  const handleAddNew = () => {
    setFormState({ id: 0, name: '', description: '', price: 0, duration: '' });
    setIsEditing(false);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-center">Services Manager</h1>
      
      {formState ? (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Service' : 'Add Service'}</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formState.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={formState.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="price">
                Price
              </label>
              <input
                type="number"
                name="price"
                id="price"
                value={formState.price}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="duration">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                id="duration"
                value={formState.duration}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded shadow"
              >
                {isEditing ? 'Update Service' : 'Add Service'}
              </button>
              <button
                type="button"
                onClick={() => setFormState(null)}
                className="ml-2 bg-gray-500 text-white px-4 py-2 rounded shadow"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex justify-end mb-4">
          <button
            onClick={handleAddNew}
            className="bg-green-500 text-white px-4 py-2 rounded shadow"
          >
            Add New Service
          </button>
        </div>
      )}

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Description</th>
            <th className="py-2">Price</th>
            <th className="py-2">Duration</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id} className="border-b">
              <td className="py-2 px-4">{service.name}</td>
              <td className="py-2 px-4">{service.description}</td>
              <td className="py-2 px-4">{service.price}</td>
              <td className="py-2 px-4">{service.duration}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleEdit(service)}
                  className="text-blue-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="text-red-500 ml-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServicesManager;
