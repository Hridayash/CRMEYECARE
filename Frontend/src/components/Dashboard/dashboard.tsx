import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { format } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface ChartData {
  date: string;
  count: number;
}

interface Appointment {
  id: number;
  date: string;
  patient: {
    name: string;
  };
  doctor: {
    name: string;
  };
}

interface DashboardData {
  totalAppointment: number;
  totalPatient: number;
  revenueData: number;
  chartData: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
    }[];
  };
}

const Dashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardData>({
    totalAppointment: 0,
    totalPatient: 0,
    revenueData: 0,
    chartData: {
      labels: [],
      datasets: [
        {
          label: 'Appointments',
          data: [],
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
      ],
    },
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const topAppointments = appointments.slice(0, 5);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3002/dashboard/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { totalAppointment, totalPatient, revenueData, chartData } = response.data;
      const chartLabels = chartData.map((item: ChartData) => item.date);
      const chartValues = chartData.map((item: ChartData) => item.count);

      setDashboard({
        totalAppointment,
        totalPatient,
        revenueData,
        chartData: {
          labels: chartLabels,
          datasets: [
            {
              label: 'Appointments',
              data: chartValues,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: true,
            },
          ],
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3002/appointments', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAppointments(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchAppointments();
  }, []);

  return (
    <div className="flex flex-col h-full p-4 bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h1 className="text-3xl font-semibold mb-6 text-center">Dashboard</h1>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Total Patients</h2>
            <p className="text-2xl font-bold text-gray-800">{dashboard.totalPatient}</p>
          </div>

          {/* Card 2 */}
          <div className="bg-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Appointments</h2>
            <p className="text-2xl font-bold text-gray-800">{dashboard.totalAppointment}</p>
          </div>

          {/* Card 3 */}
          <div className="bg-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Revenue This Month</h2>
            <p className="text-2xl font-bold text-gray-800">${dashboard.revenueData}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Appointments Over Time</h2>
          <div className="bg-gray-200 p-4 rounded-lg">
            <Line
              data={dashboard.chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  tooltip: {
                    callbacks: {
                      label: function (tooltipItem) {
                        return `Appointments: ${tooltipItem.raw}`;
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Appointments</h2>
        <ul className="divide-y divide-gray-200">
          {topAppointments.map((appointment) => (
            <li key={appointment.id} className="py-4 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-lg font-semibold">{appointment.patient.name}</span>
                <span className="text-gray-500">
                  {appointment.doctor.name} - {format(new Date(appointment.date), 'h:mm a, MMMM dd')}
                </span>
              </div>
              <span className="px-4 py-2 bg-blue-500 text-white rounded-md">Confirmed</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
