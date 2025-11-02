import { useEffect, useState } from "react";
import "./App.css";

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

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="title">🎓 Students API (React + Vite)</h1>

        {loading && <p className="loading">⏳ Loading...</p>}
        {error && <p className="error">{error}</p>}

        {/* All Students */}
        <section>
          <h2>All Students</h2>
          {students.length === 0 ? (
            <p>No students found.</p>
          ) : (
            <ul className="student-list">
              {students.map(s => (
                <li key={s.id}>
                  <span>{s.name} ({s.course})</span>
                  <button onClick={() => getStudentById(s.id)}>View</button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Student by ID */}
        {student && (
          <section className="student-details">
            <h2>Student Details</h2>
            <p><b>ID:</b> {student.id}</p>
            <p><b>Name:</b> {student.name}</p>
            <p><b>Course:</b> {student.course}</p>
          </section>
        )}

        {/* Filter by Course */}
        <section className="filter-section">
          <h2>Filter Students by Course</h2>
          <div className="filter-box">
            <input
              type="text"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="Enter course (e.g., BSIT)"
            />
            <button onClick={filterByCourse}>Filter</button>
          </div>

          <ul className="student-list">
            {courseStudents.length === 0 ? (
              <p className="muted">No filtered results yet.</p>
            ) : (
              courseStudents.map(s => (
                <li key={s.id}>{s.name} ({s.course})</li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default App;
