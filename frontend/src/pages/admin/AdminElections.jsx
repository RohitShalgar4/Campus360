import { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";

const API_BASE_URL = "http://localhost:8080";

function AdminElections() {
  const [elections, setElections] = useState([]);
  const [newElection, setNewElection] = useState({
    title: "",
    description: "",
    deadline: "",
    level: "College Level",
    department: "",
    year: "",
    candidates: [],
  });
  const [newCandidate, setNewCandidate] = useState({
    name: "",
    position: "",
  });
  const [error, setError] = useState("");
  const { token, logout } = useAuthStore();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/elections`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.status === 401) {
          logout();
          throw new Error("Please log in to access this page");
        }

        if (!response.ok) throw new Error("Failed to fetch elections");
        const data = await response.json();
        setElections(data);
      } catch (error) {
        console.error("Error fetching elections:", error);
        setError(error.message);
      }
    };
    fetchElections();
  }, [token, logout]);

  const validateElection = () => {
    if (!newElection.title.trim()) {
      setError("Title is required");
      return false;
    }
    if (!newElection.description.trim()) {
      setError("Description is required");
      return false;
    }
    if (!newElection.deadline) {
      setError("Deadline is required");
      return false;
    }
    if (newElection.level === "Departmental Level" && !newElection.department) {
      setError("Department is required for Departmental Level elections");
      return false;
    }
    if (
      newElection.level === "Class Level" &&
      (!newElection.department || !newElection.year)
    ) {
      setError(
        "Both department and year are required for Class Level elections"
      );
      return false;
    }
    if (newElection.candidates.length === 0) {
      setError("At least one candidate is required");
      return false;
    }
    setError("");
    return true;
  };

  const handleCreateElection = async () => {
    try {
      if (!validateElection()) {
        return;
      }

      // Prepare the election data
      const electionData = {
        title: newElection.title.trim(),
        description: newElection.description.trim(),
        deadline: newElection.deadline,
        level: newElection.level,
        department:
          newElection.level === "College Level"
            ? undefined
            : newElection.department,
        year:
          newElection.level === "Class Level" ? newElection.year : undefined,
        candidates: newElection.candidates.map((candidate) => ({
          name: candidate.name.trim(),
          position: candidate.position.trim(),
          votes: 0,
        })),
      };

      console.log("Sending new election:", electionData);
      const response = await fetch(`${API_BASE_URL}/api/v1/elections`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(electionData),
      });

      if (response.status === 401) {
        logout();
        throw new Error("Please log in to create an election");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create election");
      }

      const data = await response.json();
      setElections([...elections, data]);
      setNewElection({
        title: "",
        description: "",
        deadline: "",
        level: "College Level",
        department: "",
        year: "",
        candidates: [],
      });
      setError("");
    } catch (error) {
      console.error("Error creating election:", error);
      setError(error.message || "Failed to create election");
    }
  };

  const handleAddCandidate = () => {
    if (!newCandidate.name.trim() || !newCandidate.position.trim()) {
      setError("Both name and position are required for candidates");
      return;
    }
    setNewElection({
      ...newElection,
      candidates: [...newElection.candidates, { ...newCandidate }],
    });
    setNewCandidate({ name: "", position: "" });
    setError("");
  };

  const handleDeleteElection = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/elections/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.status === 401) {
        logout();
        throw new Error("Please log in to delete an election");
      }

      if (!response.ok) throw new Error("Failed to delete election");
      setElections(elections.filter((election) => election._id !== id));
    } catch (error) {
      console.error("Error deleting election:", error);
      setError("Failed to delete election");
    }
  };

  const handleLevelChange = (level) => {
    setNewElection({
      ...newElection,
      level,
      department: level === "College Level" ? "" : newElection.department,
      year:
        level === "College Level" || level === "Departmental Level"
          ? ""
          : newElection.year,
    });
    setError("");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">
          Election Management
        </h1>
        <p className="mt-2 text-gray-600">
          Create and manage student elections
        </p>
      </div>

      {/* Create Election Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900">
          Create New Election
        </h2>
        {error && (
          <div className="mt-2 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={newElection.title}
              onChange={(e) =>
                setNewElection({ ...newElection, title: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              value={newElection.description}
              onChange={(e) =>
                setNewElection({ ...newElection, description: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Deadline
            </label>
            <input
              type="date"
              value={newElection.deadline}
              onChange={(e) =>
                setNewElection({ ...newElection, deadline: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Level
            </label>
            <select
              value={newElection.level}
              onChange={(e) => handleLevelChange(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="College Level">College Level</option>
              <option value="Departmental Level">Departmental Level</option>
              <option value="Class Level">Class Level</option>
            </select>
          </div>

          {/* Department Field - Only show for Departmental and Class Level */}
          {(newElection.level === "Departmental Level" ||
            newElection.level === "Class Level") && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                value={newElection.department}
                onChange={(e) =>
                  setNewElection({ ...newElection, department: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="ENTC">ENTC</option>
                <option value="Electrical">Electrical</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
              </select>
            </div>
          )}

          {/* Year Field - Only show for Class Level */}
          {newElection.level === "Class Level" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Year
              </label>
              <select
                value={newElection.year}
                onChange={(e) =>
                  setNewElection({ ...newElection, year: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Year</option>
                <option value="FY">First Year (FY)</option>
                <option value="SY">Second Year (SY)</option>
                <option value="TY">Third Year (TY)</option>
                <option value="BE">Final Year (BE)</option>
              </select>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Add Candidates
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Candidate Name
              </label>
              <input
                type="text"
                value={newCandidate.name}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, name: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Position
              </label>
              <input
                type="text"
                value={newCandidate.position}
                onChange={(e) =>
                  setNewCandidate({ ...newCandidate, position: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              onClick={handleAddCandidate}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md"
            >
              Add Candidate
            </button>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Candidates</h3>
            <ul className="mt-2 space-y-2">
              {newElection.candidates.map((candidate, index) => (
                <li key={index} className="text-sm text-gray-700">
                  {candidate.name} - {candidate.position}
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={handleCreateElection}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md"
          >
            Create Election
          </button>
        </div>
      </div>

      {/* Election History */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-900">
          Election History
        </h2>
        <div className="mt-4 space-y-4">
          {elections.length === 0 ? (
            <p className="text-gray-600">No elections created yet.</p>
          ) : (
            elections.map((election) => (
              <div key={election._id} className="border p-4 rounded-md">
                <h3 className="text-lg font-semibold">{election.title}</h3>
                <p className="text-gray-600">{election.description}</p>
                <p className="text-sm text-indigo-600">
                  Level: {election.level}
                  {election.department &&
                    ` • Department: ${election.department}`}
                  {election.year && ` • Year: ${election.year}`}
                </p>
                <p className="text-sm text-indigo-600">
                  Deadline: {new Date(election.deadline).toLocaleDateString()}
                </p>
                <h4 className="mt-2 font-medium">Candidates & Votes:</h4>
                <ul className="mt-1 space-y-1">
                  {election.candidates.map((candidate) => (
                    <li key={candidate._id} className="text-sm">
                      {candidate.name} ({candidate.position}) -{" "}
                      {candidate.votes} votes
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleDeleteElection(election._id)}
                  className="mt-2 inline-flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminElections;
