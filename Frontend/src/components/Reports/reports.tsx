import { useState } from 'react';

const Reports = () => {
  const [reportType, setReportType] = useState('');
  const [reportData, setReportData] = useState<string[]>([]);

  const handleGenerateReport = () => {
    // Example function to generate report data (replace with actual logic)
    const generatedReport = ['Report 1', 'Report 2', 'Report 3'];
    setReportData(generatedReport);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-6">Reports</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Generate Report</h2>

        {/* Report Type Selection */}
        <div className="mb-4">
          <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">
            Report Type
          </label>
          <select
            id="reportType"
            name="reportType"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="">Select Report Type</option>
            <option value="sales">Sales Report</option>
            <option value="inventory">Inventory Report</option>
            <option value="performance">Performance Report</option>
          </select>
        </div>

        {/* Generate Button */}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={handleGenerateReport}
        >
          Generate Report
        </button>

        {/* Display Generated Reports */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Generated Reports:</h3>
          <ul>
            {reportData.map((report, index) => (
              <li key={index} className="text-gray-700">{`Report ${index + 1}: ${report}`}</li>
            ))}
            {reportData.length === 0 && <li className="text-gray-500">No reports generated yet.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reports;
