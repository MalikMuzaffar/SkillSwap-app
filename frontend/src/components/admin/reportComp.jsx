import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckIcon, Eye, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ReportComp = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data } = await axios.get("/report/get-all", {
          withCredentials: true,
        });
        setReports(data.data || []);
      } catch (error) {
        console.error("Failed to fetch reports", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleReject = async (reportId) => {
    try {
      await axios.patch(
        `/admin/reports/${reportId}/reject`,
        {},
        { withCredentials: true }
      );
      setReports((prev) => prev.filter((r) => r._id !== reportId));
    } catch (error) {
      console.error("Failed to reject report", error);
    }
  };

const handleRead = async(report)=>{    
const response = await axios.post(
  '/admin/read-report',
  { reportId: report._id },
  {
    withCredentials: true,
  }
);

    if(response.data.success){
      toast.success(response.data.message)
    }else{
        toast.error(response.data.message)
    }

}

  const handleView = async(report) => {
  navigate(`/admin/skill/${report.skillId._id}`)
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">🚨 Reported Skills</h1>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading reports...</p>
      ) : reports.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">No reports found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {reports.map((report) => (
            <div
              key={report._id}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300"
            >
              <div className="mb-4">
                <p className="text-lg font-semibold text-red-600">{report.reason}</p>
                <p className="text-sm text-gray-700 mt-1">{report.description}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>📌 Skill: <strong className="text-indigo-600">{report.skillId?.title}</strong></span>
                <span>👤 By: {report.userId?.fullName || "Unknown"}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">Reported at: {new Date(report.createdAt).toLocaleString()}</p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => handleRead(report)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded hover:bg-green-600 hover:text-white transition"
                >
                    <CheckIcon className="w-4 h-4"/>
                  <Eye className="w-4 h-4" /> Read
                </button>
                <button
                  onClick={() => handleView(report)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
                >
                  <Eye className="w-4 h-4" /> View
                </button>
                <button
                  onClick={() => handleReject(report._id)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white transition"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportComp;
