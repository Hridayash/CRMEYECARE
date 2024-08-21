import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Sale {
  id: number;
  employeeId: number;
  customerId: number;
  serviceId: number;
  date: string;
  serviceDuration: number;
  totalAmount: number;
}

interface Employee {
  id: number;
  name: string;
}

interface Customer {
  id: number;
  name: string;
}

interface Service {
  id: number;
  name: string;
}

const SalesManager: React.FC = () => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [formState, setFormState] = useState<Sale | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    fetchSales();
    fetchEmployees();
    fetchCustomers();
    fetchServices();
  }, []);

  const fetchSales = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get<Sale[]>('https://crmeyecare.onrender.com/sales', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSales(response.data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get<Employee[]>('https://crmeyecare.onrender.com/user/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get<Customer[]>('https://crmeyecare.onrender.com/patients', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

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

  const handleEdit = (sale: Sale) => {
    setFormState(sale);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`https://crmeyecare.onrender.com/sales/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchSales();
    } catch (error) {
      console.error('Error deleting sale:', error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = localStorage.getItem('accessToken');

    try {
      if (isEditing && formState) {
        // Update existing sale
        await axios.put(`https://crmeyecare.onrender.com/sales/${formState.id}`, formState, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else if (formState) {
        // Create new sale
        await axios.post('https://crmeyecare.onrender.com/sales', formState, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setFormState(null);
      setIsEditing(false);
      fetchSales();
    } catch (error) {
      console.error('Error saving sale:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState!,
      [name]: name === 'totalAmount' || name === 'serviceDuration' || name === 'employeeId' || name === 'customerId' || name === 'serviceId' ? parseInt(value) : value,
    }));
  };

  const handleAddNew = () => {
    setFormState({ id: 0, employeeId: 0, customerId: 0, serviceId: 0, date: '', serviceDuration: 0, totalAmount: 0 });
    setIsEditing(false);
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-center">Sales Manager</h1>
      
      {formState ? (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">{isEditing ? 'Edit Sale' : 'Add Sale'}</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="employeeId">
                Employee
              </label>
              <select
                name="employeeId"
                id="employeeId"
                value={formState.employeeId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="customerId">
                Customer
              </label>
              <select
                name="customerId"
                id="customerId"
                value={formState.customerId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="serviceId">
                Service
              </label>
              <select
                name="serviceId"
                id="serviceId"
                value={formState.serviceId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="">Select Service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="date">
                Date
              </label>
              <input
                type="date"
                name="date"
                id="date"
                value={formState.date}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="serviceDuration">
                Service Duration (minutes)
              </label>
              <input
                type="number"
                name="serviceDuration"
                id="serviceDuration"
                value={formState.serviceDuration}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2" htmlFor="totalAmount">
                Total Amount
              </label>
              <input
                type="number"
                name="totalAmount"
                id="totalAmount"
                value={formState.totalAmount}
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
                {isEditing ? 'Update Sale' : 'Add Sale'}
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
            Add New Sale
          </button>
        </div>
      )}

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Employee</th>
            <th className="py-2">Customer</th>
            <th className="py-2">Service</th>
            <th className="py-2">Date</th>
            <th className="py-2">Duration (min)</th>
            <th className="py-2">Total Amount</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id} className="border-b">
              <td className="py-2 px-4">{employees.find((emp) => emp.id === sale.employeeId)?.name}</td>
              <td className="py-2 px-4">{customers.find((cus) => cus.id === sale.customerId)?.name}</td>
              <td className="py-2 px-4">{services.find((ser) => ser.id === sale.serviceId)?.name}</td>
              <td className="py-2 px-4">{new Date(sale.date).toLocaleDateString()}</td>
              <td className="py-2 px-4">{sale.serviceDuration}</td>
              <td className="py-2 px-4">${sale.totalAmount}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleEdit(sale)}
                  className="text-blue-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(sale.id)}
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

export default SalesManager;
