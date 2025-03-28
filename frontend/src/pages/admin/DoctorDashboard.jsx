import React, { useEffect, useState } from "react";
import { Search, Mail } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

export default function DoctorDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [studentsData, setstudentsData] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const response = await fetch(
        "http://localhost:8080/api/v1/student/students",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setstudentsData(data);
      if (!response.ok) {
        throw new Error("Failed to submit health checkup");
      }
    };
    fetchStudents();
  });
  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    const filteredStudents = studentsData.filter((student) =>
      student.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(filteredStudents);
    setLoading(false);
  };

  const handleHealthCheckup = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const healthData = {
      studentId: selectedStudent._id,
      symptoms: formData.get("symptoms"),
      diagnosis: formData.get("diagnosis"),
      recommendations: formData.get("recommendations"),
      bedRest: formData.get("bedRest") === "on",
      leaveRequired: formData.get("leaveRequired") === "on",
    };

    try {
      try {
        const response = await axios.post(
          `http://localhost:8080/api/v1/notification/send-email-notification`,
          {
            className: selectedStudent.class,
            department: selectedStudent.department,
            healthData,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.data?.success) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message || "Failed to send reset link");
        }
      } catch (error) {
        toast.error("error");
      }
      setSelectedStudent(null);
      e.target.reset();
    } catch (error) {
      alert(
        "An error occurred while submitting the health checkup. Please try again."
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">Student Health Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Search Student by ID or Name
          </h2>
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter Student ID or Name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  const filtered = studentsData.filter((student) =>
                    student.full_name
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase())
                  );
                  setSearchResults(filtered);
                }}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center space-x-2 disabled:bg-gray-400"
              disabled={loading}
            >
              <Search className="h-5 w-5" />
              <span>{loading ? "Searching..." : "Search"}</span>
            </button>
          </form>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Search Results</h3>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : searchResults.length === 0 && searchTerm ? (
              <p className="text-gray-500">No students found.</p>
            ) : (
              <div className="max-h-96 overflow-y-auto border rounded-lg">
                {searchResults.map((student) => (
                  <div
                    key={student._id}
                    className="p-4 border-b last:border-b-0 cursor-pointer hover:bg-gray-50"
                    onClick={() => {
                      setSelectedStudent(student);
                    }}
                  >
                    <p className="font-medium">{student.full_name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedStudent && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Health Checkup</h2>
            <form onSubmit={handleHealthCheckup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Student
                </label>
                <p className="mt-1">{selectedStudent.full_name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Symptoms
                </label>
                <textarea
                  name="symptoms"
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Diagnosis
                </label>
                <textarea
                  name="diagnosis"
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Recommendations
                </label>
                <textarea
                  name="recommendations"
                  className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                />
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="bedRest"
                    name="bedRest"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="bedRest"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Bed Rest Required
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="leaveRequired"
                    name="leaveRequired"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="leaveRequired"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Leave Required
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center justify-center space-x-2"
              >
                <Mail className="h-5 w-5" />
                <span>Submit and Send Notifications</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
