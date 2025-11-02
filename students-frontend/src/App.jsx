import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState(null);
  const [courseStudents, setCourseStudents] = useState([]);
  const [course, setCourse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Fetch all students
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/students")
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setError("");
      })
      .catch(() => setError("Failed to fetch students. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Fetch student by ID
  const getStudentById = (id) => {
    setLoading(true);
    fetch(`http://localhost:5000/students/${id}`)
      .then(res => res.json())
      .then(data => {
        setStudent(data);
        setError("");
      })
      .catch(() => setError("Unable to fetch student details."))
      .finally(() => setLoading(false));
  };

  // ✅ Filter by course
  const filterByCourse = () => {
    if (!course.trim()) return;
    setLoading(true);
    fetch(`http://localhost:5000/students/filter?course=${course}`)
      .then(res => res.json())
      .then(data => {
        setCourseStudents(data);
        setError("");
      })
      .catch(() => setError("Error filtering students by course."))
      .finally(() => setLoading(false));
  };

  // ✅ UI Styles
  const container = {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f8f9fa",
    minHeight: "100vh",
    padding: "40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  };

  const card = {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    width: "600px",
  };

  const button = {
    backgroundColor: "#007bff",
    border: "none",
    color: "white",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    marginLeft: "8px",
  };

  const input = {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    width: "60%",
  };

  const heading = {
    color: "#343a40",
  };

  return (
    <div style={container}>
      <div style={card}>
        <h1 style={heading}>🎓 Students API (React + Vite)</h1>

        {loading && <p>⏳ Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* All Students */}
        <h2>All Students</h2>
        {students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <ul>
            {students.map(s => (
              <li key={s.id} style={{ marginBottom: "10px" }}>
                {s.name} ({s.course})
                <button
                  onClick={() => getStudentById(s.id)}
                  style={button}
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Student by ID */}
        {student && (
          <div style={{ marginTop: "20px" }}>
            <h2>Student Details</h2>
            <p><b>ID:</b> {student.id}</p>
            <p><b>Name:</b> {student.name}</p>
            <p><b>Course:</b> {student.course}</p>
          </div>
        )}

        {/* Filter by Course */}
        <div style={{ marginTop: "30px" }}>
          <h2>Filter Students by Course</h2>
          <input
            type="text"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="Enter course (e.g., BSIT)"
            style={input}
          />
          <button onClick={filterByCourse} style={button}>Filter</button>

          <ul style={{ marginTop: "10px" }}>
            {courseStudents.length === 0 ? (
              <p style={{ color: "#6c757d" }}>No filtered results yet.</p>
            ) : (
              courseStudents.map(s => (
                <li key={s.id}>{s.name} ({s.course})</li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
