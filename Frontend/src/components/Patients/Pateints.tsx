import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  email?: string;
  phone?: string;
  address?: string;
}

const Patients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [formData, setFormData] = useState<Partial<Patient>>({
    id: undefined, // Use undefined for better type consistency
    name: '',
    age: 0,
    gender: '',
    email: '',
    phone: '',
    address: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  // Function to fetch patients data
  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get<Patient[]>('http://localhost:3002/patients', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  // Fetch patients data on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  // Function to handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === 'age' ? parseInt(value, 10) : value,
    }));
  };

  // Function to handle form submission for adding or updating a patient
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');

    try {
      if (isEditing && formData.id !== undefined) {
        // Edit existing patient
        await axios.put<Patient>(`http://localhost:3002/patients/${formData.id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient.id === formData.id ? { ...patient, ...formData } : patient
          )
        );
      } else {
        // Add new patient
        const response = await axios.post<Patient>('http://localhost:3002/patients', formData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatients([...patients, response.data]);
      }
      // Reset form and exit edit mode
      setFormData({
        id: undefined,
        name: '',
        age: 0,
        gender: '',
        email: '',
        phone: '',
        address: '',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Function to handle patient deletion
  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`http://localhost:3002/patients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatients((prevPatients) => prevPatients.filter((patient) => patient.id !== id));
    } catch (error) {
      console.error('Error deleting patient:', error);
    }
  };

  // Function to handle editing a patient
  const handleEdit = (patient: Patient) => {
    setFormData(patient);
    setIsEditing(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Patients</h1>

      {/* Add/Edit Patient Form */}
      <form className="mb-6" onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">Name:</label>
        <input
          type="text"
          name="name"
          className="p-2 mb-2 rounded-lg w-full"
          value={formData.name || ''}
          onChange={handleChange}
          required
        />

        <label className="block mb-2 font-semibold">Age:</label>
        <input
          type="number"
          name="age"
          className="p-2 mb-2 rounded-lg w-full"
          value={formData.age || 0}
          onChange={handleChange}
          required
        />

        <label className="block mb-2 font-semibold">Gender:</label>
        <select
          name="gender"
          className="p-2 mb-2 rounded-lg w-full"
          value={formData.gender || ''}
          onChange={handleChange}
          required
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label className="block mb-2 font-semibold">Email:</label>
        <input
          type="email"
          name="email"
          className="p-2 mb-2 rounded-lg w-full"
          value={formData.email || ''}
          onChange={handleChange}
        />

        <label className="block mb-2 font-semibold">Phone:</label>
        <input
          type="text"
          name="phone"
          className="p-2 mb-2 rounded-lg w-full"
          value={formData.phone || ''}
          onChange={handleChange}
        />

        <label className="block mb-2 font-semibold">Address:</label>
        <input
          type="text"
          name="address"
          className="p-2 mb-2 rounded-lg w-full"
          value={formData.address || ''}
          onChange={handleChange}
        />

        <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg w-full">
          {isEditing ? 'Update Patient' : 'Add Patient'}
        </button>
      </form>

      {/* Display Patients Table */}
      <div>
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Age</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Gender</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Email</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Phone</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Address</th>
              <th className="border border-gray-200 px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td className="border border-gray-200 px-4 py-2">{patient.id}</td>
                <td className="border border-gray-200 px-4 py-2">{patient.name}</td>
                <td className="border border-gray-200 px-4 py-2">{patient.age}</td>
                <td className="border border-gray-200 px-4 py-2">{patient.gender}</td>
                <td className="border border-gray-200 px-4 py-2">{patient.email || 'N/A'}</td>
                <td className="border border-gray-200 px-4 py-2">{patient.phone || 'N/A'}</td>
                <td className="border border-gray-200 px-4 py-2">{patient.address || 'N/A'}</td>
                <td className="border border-gray-200 px-4 py-2 text-center">
                  <button
                    onClick={() => handleEdit(patient)}
                    className="bg-yellow-500 text-white p-2 rounded-lg mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(patient.id)}
                    className="bg-red-500 text-white p-2 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Patients;
