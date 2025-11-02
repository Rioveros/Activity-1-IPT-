const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());

const students = [
  { id: 1, name: "Juan", course: "BSIT" },
  { id: 2, name: "Maria", course: "BSCpE" },
  { id: 3, name: "Liza", course: "BSCS" }
];

// Get all students
app.get("/students", (req, res) => {
  res.json(students);
});

// Get a single student by ID
app.get("/students/:id", (req, res) => {
  const student = students.find(s => s.id === parseInt(req.params.id));
  student
    ? res.json(student)
    : res.status(404).json({ error: "Student not found" });
});

// Filter students by course
app.get("/students/filter", (req, res) => {
  const { course } = req.query;
  if (course) {
    const filtered = students.filter(
      s => s.course.toLowerCase() === course.toLowerCase()
    );
    if (filtered.length > 0) {
      return res.json(filtered);
    } else {
      return res.status(404).json({ error: "Student not found" });
    }
  }
  res.json(students);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
