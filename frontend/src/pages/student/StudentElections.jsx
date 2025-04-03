import { useState, useEffect } from "react";
import { Vote, Users, Award } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

const API_BASE_URL = "http://localhost:8080";

function StudentElections() {
  const [activeElections, setActiveElections] = useState([]);
  const [showResults, setShowResults] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuthStore();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        setLoading(true);
        console.log("Current user state:", {
          id: user?.id,
          department: user?.department,
          class: user?.class,
          name: user?.full_name,
        });

        if (!user) {
          console.log("No user data found");
          setError("Please log in to view elections");
          return;
        }

        if (!user.id) {
          console.log("User data missing ID:", user);
          setError("Invalid user data. Please log in again.");
          return;
        }

        if (!user.department) {
          console.log("User data missing department:", user);
          setError("Invalid user data. Department information is missing.");
          return;
        }

        if (!user.class) {
          console.log("User data missing class:", user);
          setError("Invalid user data. Class information is missing.");
          return;
        }

        if (!token) {
          console.log("No token found");
          setError("Authentication token is missing");
          return;
        }

        console.log("Fetching elections for student:", {
          id: user.id,
          department: user.department,
          class: user.class,
          name: user.full_name,
        });

        const url = `${API_BASE_URL}/api/v1/elections/student/${user.id}`;
        console.log("Request URL:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        console.log("Response status:", response.status);
        console.log(
          "Response headers:",
          Object.fromEntries(response.headers.entries())
        );

        if (response.status === 401) {
          console.log("Unauthorized access");
          setError("Please log in to view elections");
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error response:", errorData);
          throw new Error(errorData.message || "Failed to fetch elections");
        }

        const data = await response.json();
        console.log(
          "Fetched elections:",
          data.map((e) => ({
            title: e.title,
            level: e.level,
            department: e.department,
            year: e.year,
            deadline: e.deadline,
            isEligible: e.isEligible,
            eligibilityMessage: e.eligibilityMessage,
            studentDepartment: e.studentDepartment,
            studentYear: e.studentYear,
            _id: e._id,
          }))
        );

        if (!Array.isArray(data)) {
          console.error("Invalid response format:", data);
          throw new Error("Invalid response format from server");
        }

        // Sort elections by level (College -> Department -> Class)
        const sortedElections = data.sort((a, b) => {
          const levelOrder = {
            "College Level": 1,
            "Departmental Level": 2,
            "Class Level": 3,
          };
          return levelOrder[a.level] - levelOrder[b.level];
        });

        console.log(
          "Sorted elections:",
          sortedElections.map((e) => ({
            title: e.title,
            level: e.level,
            department: e.department,
            year: e.year,
            deadline: e.deadline,
            isEligible: e.isEligible,
            eligibilityMessage: e.eligibilityMessage,
            studentDepartment: e.studentDepartment,
            studentYear: e.studentYear,
            _id: e._id,
          }))
        );

        setActiveElections(sortedElections);
        setError("");
      } catch (error) {
        console.error("Error fetching elections:", error);
        setError(error.message || "Failed to fetch elections");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && token) {
      console.log("Starting election fetch...");
      fetchElections();
    } else {
      console.log("Missing user ID or token:", {
        userId: user?.id,
        hasToken: !!token,
        userData: user,
      });
    }
  }, [user, token]);

  const handleVote = async (electionId, candidateId) => {
    try {
      if (!user?.id) {
        setError("Please log in to vote");
        return;
      }

      const election = activeElections.find((e) => e._id === electionId);
      if (!election) throw new Error("Election not found");

      if (!election.isEligible) {
        setError("You are not eligible to vote in this election");
        return;
      }

      const deadlinePassed = new Date(election.deadline) < new Date();
      if (deadlinePassed) {
        setError(
          "Voting is closed for this election as the deadline has passed."
        );
        return;
      }

      if (election.votedStudents.includes(user.id)) {
        setError("You have already voted in this election.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/api/v1/elections/${electionId}/vote/${candidateId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ studentId: user.id }),
          credentials: "include",
        }
      );

      if (response.status === 401) {
        setError("Please log in to vote");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to record vote");
      }

      const updatedElection = await response.json();
      setActiveElections((prevElections) =>
        prevElections.map((election) =>
          election._id === updatedElection.election._id
            ? { ...updatedElection.election, isEligible: true }
            : election
        )
      );
      setError("");
    } catch (error) {
      console.error("Error recording vote:", error);
      setError(error.message);
    }
  };

  const handleViewResults = (electionId) => {
    setShowResults((prev) => ({
      ...prev,
      [electionId]: true,
    }));
  };

  const totalCandidates = activeElections.reduce(
    (sum, election) => sum + election.candidates.length,
    0
  );
  const totalPositions = activeElections.reduce(
    (sum, election) =>
      sum + new Set(election.candidates.map((c) => c.position)).size,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900">Student Elections</h1>
        <p className="mt-2 text-gray-600">
          Cast your vote for student leadership positions
        </p>
      </div>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-indigo-600">
            <Vote className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Active Elections</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {activeElections.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-indigo-600">
            <Users className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Total Candidates</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {totalCandidates}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-2 text-indigo-600">
            <Award className="h-6 w-6" />
            <h2 className="text-lg font-semibold">Positions</h2>
          </div>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {totalPositions}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {activeElections.length === 0 ? (
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <p className="text-gray-600">
              No active elections available for your eligibility.
            </p>
          </div>
        ) : (
          activeElections.map((election) => {
            const deadlinePassed = new Date(election.deadline) < new Date();
            const electionShowResults = showResults[election._id] || false;
            const hasVoted = election.votedStudents.includes(user?.id);

            return (
              <div
                key={election._id}
                className={`bg-white rounded-lg shadow-md overflow-hidden p-6 ${
                  !election.isEligible ? "opacity-75" : ""
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {election.title}
                    </h2>
                    <p className="mt-1 text-gray-600">{election.description}</p>
                  </div>
                  <div className="ml-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        election.level === "College Level"
                          ? "bg-purple-100 text-purple-800"
                          : election.level === "Departmental Level"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {election.level}
                    </span>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {election.department && (
                    <span className="text-sm text-indigo-600">
                      Department: {election.department}
                    </span>
                  )}
                  {election.year && (
                    <span className="text-sm text-indigo-600">
                      Year: {election.year}
                    </span>
                  )}
                  <span className="text-sm text-indigo-600">
                    Deadline: {new Date(election.deadline).toLocaleDateString()}
                  </span>
                </div>
                <div
                  className={`mt-2 text-sm ${
                    election.isEligible ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {election.eligibilityMessage}
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => handleViewResults(election._id)}
                    disabled={!deadlinePassed}
                    className={`inline-flex items-center px-4 py-2 rounded-md text-white ${
                      deadlinePassed
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    View Results
                  </button>
                </div>

                <div className="mt-4">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Candidate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Position
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          {electionShowResults && deadlinePassed
                            ? "Votes"
                            : "Action"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {election.candidates.map((candidate) => (
                        <tr key={candidate._id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {candidate.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {candidate.position}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {electionShowResults && deadlinePassed ? (
                              candidate.votes || 0
                            ) : (
                              <button
                                onClick={() =>
                                  handleVote(election._id, candidate._id)
                                }
                                disabled={
                                  deadlinePassed ||
                                  hasVoted ||
                                  !election.isEligible
                                }
                                className={`inline-flex items-center px-3 py-1 rounded-md text-white ${
                                  deadlinePassed ||
                                  hasVoted ||
                                  !election.isEligible
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-indigo-600 hover:bg-indigo-700"
                                }`}
                              >
                                {hasVoted ? "Voted" : "Vote"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default StudentElections;
