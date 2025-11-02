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
    fetchAllStudents();
  }, []);

  const fetchAllStudents = () => {
    setLoading(true);
    fetch("http://localhost:5000/students")
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        setStudents(data || []);
        setError("");
      })
      .catch(() => setError("❌ Failed to fetch students. Please try again."))
      .finally(() => setLoading(false));
  };

  // ✅ Fetch student by ID
  const getStudentById = (id) => {
    setLoading(true);
    fetch(`http://localhost:5000/students/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        setStudent(data);
        setError("");
      })
      .catch(() => setError("❌ Unable to fetch student details."))
      .finally(() => setLoading(false));
  };

  // ✅ Filter by course with crash protection
  const filterByCourse = () => {
    if (!course.trim()) {
      setCourseStudents([]);
      return;
    }
    setLoading(true);
    fetch(`http://localhost:5000/students/filter?course=${encodeURIComponent(course)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        setCourseStudents(Array.isArray(data) ? data : []);
        setError("");
      })
      .catch(() => setError("❌ Error filtering students by course."))
      .finally(() => setLoading(false));
  };

  return (
    <div className="app-background">
      <div className="app-wrapper">
        <div className="card">
          <h1 className="title">🎓 Student Management Portal</h1>

          {loading && <p className="loading">⏳ Loading...</p>}
          {error && <p className="error">{error}</p>}

          {/* All Students */}
          <section>
            <h2>All Students</h2>
            {students.length === 0 ? (
              <p>No students found.</p>
            ) : (
              <ul className="student-list">
                {students.map((s) => (
                  <li key={s.id}>
                    <div>
                      <b>{s.name}</b>
                      <p className="muted">{s.course}</p>
                    </div>
                    <button onClick={() => getStudentById(s.id)}>View</button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Student Details */}
          {student && (
            <section className="student-details">
              <h2>Student Details</h2>
              <p><b>ID:</b> {student.id}</p>
              <p><b>Name:</b> {student.name}</p>
              <p><b>Course:</b> {student.course}</p>
            </section>
          )}

          {/* Filter Section */}
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
              <button className="secondary-btn" onClick={fetchAllStudents}>Reset</button>
            </div>

            <ul className="student-list">
              {courseStudents.length === 0 ? (
                <p className="muted">No filtered results yet.</p>
              ) : (
                courseStudents.map((s) => (
                  <li key={s.id}>
                    <div>
                      <b>{s.name}</b>
                      <p className="muted">{s.course}</p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
