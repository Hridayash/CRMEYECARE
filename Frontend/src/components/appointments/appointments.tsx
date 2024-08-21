import  { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

interface Appointment {
  id: number;
  date: string;
  patient: Patient;
  doctor: Doctor;
}

interface Doctor {
  id: number;
  name: string;
}

interface Patient {
  id: number;
  name: string;
}

interface FormData {
  patientId: string;
  doctorId: string;
  date: string;
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [formData, setFormData] = useState<FormData>({
    patientId: '',
    doctorId: '',
    date: '',
  });
  const [rescheduleData, setRescheduleData] = useState<{ id: number; date: string } | null>(null);

  const fetchPatientsAndDoctors = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const [patientsResponse, doctorsResponse] = await Promise.all([
        axios.get('http://localhost:3002/patients', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get('http://localhost:3002/doctors', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setPatients(patientsResponse.data);
      setDoctors(doctorsResponse.data);
    } catch (error) {
      console.error('Error fetching patients and doctors:', error);
    }
  };

  const fetchAppointmentData = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const appointmentResponse = await axios.get('http://localhost:3002/appointments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(appointmentResponse.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchPatientsAndDoctors();
      await fetchAppointmentData();
    };

    fetchData();
  }, []);  // Empty dependency array to prevent re-fetching on each render

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const formattedData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
      };
      const response = await axios.post<Appointment>(
        'http://localhost:3002/appointments',
        formattedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const newAppointment: Appointment = {
        ...response.data,
        patient: patients.find(patient => patient.id === parseInt(formData.patientId)) || { id: -1, name: 'Unknown' },
        doctor: doctors.find(doctor => doctor.id === parseInt(formData.doctorId)) || { id: -1, name: 'Unknown' },
      };

      setAppointments([...appointments, newAppointment]);
      setFormData({ patientId: '', doctorId: '', date: '' });
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };

  const handleReschedule = async () => {
    if (rescheduleData) {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.patch(
          `http://localhost:3002/appointments/${rescheduleData.id}/reschedule`,
          { date: rescheduleData.date },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const updatedAppointments = appointments.map((appointment) =>
          appointment.id === rescheduleData.id ? { ...appointment, date: response.data.date } : appointment
        );
        setAppointments(updatedAppointments);
        setRescheduleData(null);
      } catch (error) {
        console.error('Error rescheduling appointment:', error);
      }
    }
  };

  const handleRescheduleClick = (appointment: Appointment) => {
    setRescheduleData({ id: appointment.id, date: appointment.date });
  };

  const handleRescheduleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setRescheduleData((prev) => (prev ? { ...prev, date: e.target.value } : null));
  };

  const isDateInPast = (date: string) => {
    const today = new Date();
    return new Date(date) < today;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-6">Appointments</h1>

      <form className="mb-6" onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">Patient:</label>
        <select
          name="patientId"
          className="p-2 mb-2 rounded-lg w-full"
          value={formData.patientId}
          onChange={handleChange}
          required
        >
          <option value="">Select Patient</option>
          {patients.map(patient => (
            <option key={patient.id} value={patient.id.toString()}>
              {patient.name}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-semibold">Doctor:</label>
        <select
          name="doctorId"
          className="p-2 mb-2 rounded-lg w-full"
          value={formData.doctorId}
          onChange={handleChange}
          required
        >
          <option value="">Select Doctor</option>
          {doctors.map(doctor => (
            <option key={doctor.id} value={doctor.id.toString()}>
              {doctor.name}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-semibold">Date and Time:</label>
        <input
          type="datetime-local"
          name="date"
          className="p-2 mb-2 rounded-lg w-full"
          value={formData.date}
          onChange={handleChange}
          required
        />

        {isDateInPast(formData.date) && (
          <div className="text-red-500 mb-2">Cannot select a past date.</div>
        )}

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-lg w-full"
          disabled={isDateInPast(formData.date)}
        >
          Add Appointment
        </button>
      </form>

      {rescheduleData && (
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Reschedule Appointment</h2>
          <form onSubmit={(e) => { e.preventDefault(); handleReschedule(); }}>
            <label className="block mb-2 font-semibold">New Date and Time:</label>
            <input
              type="datetime-local"
              className="p-2 mb-2 rounded-lg w-full"
              value={rescheduleData.date}
              onChange={handleRescheduleChange}
              required
            />

            {isDateInPast(rescheduleData.date) && (
              <div className="text-red-500 mb-2">Cannot select a past date.</div>
            )}

            <button
              type="submit"
              className="bg-yellow-500 text-white p-2 rounded-lg w-full"
              disabled={isDateInPast(rescheduleData.date)}
            >
              Reschedule
            </button>
          </form>
        </div>
      )}

      <div>
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Patient Name</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Doctor Name</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Date and Time</th>
              <th className="border border-gray-200 px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td className="border border-gray-200 px-4 py-2">{appointment.id}</td>
                <td className="border border-gray-200 px-4 py-2">{appointment.patient?.name || 'Unknown'}</td>
                <td className="border border-gray-200 px-4 py-2">{appointment.doctor?.name || 'Unknown'}</td>
                <td className="border border-gray-200 px-4 py-2">{format(new Date(appointment.date), 'MMMM dd, yyyy, h:mm a')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;
