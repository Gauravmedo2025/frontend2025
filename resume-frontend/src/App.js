import { useState, useEffect } from "react";
import axios from "axios";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Button,
  Box,
  Grid,
  Paper,
  Divider
} from "@mui/material";

function App() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    education: "",
    experience: "",
    skills: "",
  });

  const [resumeList, setResumeList] = useState([]);

  // Fetch resumes on page load
  useEffect(() => {
    fetchResumes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const skillsArray = form.skills.split(",").map((s) => s.trim());

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API}/resume/generate`,
        { ...form, skills: skillsArray },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url);

      alert("✅ Resume generated and saved!");
    } catch (err) {
      alert("❌ Error generating resume.");
      console.error("Resume generation error:", err.response?.data || err.message);
    }
  };

  const fetchResumes = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/resume/list`);
      if (res.data.length === 0) {
        alert("❌ No resumes found.");
      }
      setResumeList(res.data);
    } catch (err) {
      alert("❌ Failed to fetch resumes.");
      console.error("Resume list error:", err.response?.data || err.message);
    }
  };

  const downloadResume = async (id) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/resume/download/${id}`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    } catch (err) {
      alert("❌ Failed to download resume.");
      console.error("Download error:", err.response?.data || err.message);
    }
  };

  const deleteResume = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API}/resume/delete/${id}`);
      setResumeList((prevList) => prevList.filter((resume) => resume._id !== id));
      alert("✅ Resume deleted!");
    } catch (err) {
      alert("❌ Failed to delete resume.");
      console.error("Delete error:", err.response?.data || err.message);
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" component="div">
            Resume Generator
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Paper sx={{ padding: 4, boxShadow: 3 }}>
            <Typography variant="h4" align="center" gutterBottom color="primary">
              Resume Generator
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Full Name"
                    variant="outlined"
                    name="name"
                    fullWidth
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    variant="outlined"
                    name="email"
                    fullWidth
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Phone"
                    variant="outlined"
                    name="phone"
                    fullWidth
                    value={form.phone}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Education"
                    variant="outlined"
                    name="education"
                    fullWidth
                    value={form.education}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Experience"
                    variant="outlined"
                    name="experience"
                    fullWidth
                    multiline
                    rows={4}
                    value={form.experience}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Skills (comma separated)"
                    variant="outlined"
                    name="skills"
                    fullWidth
                    value={form.skills}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" color="primary" type="submit" fullWidth>
                    Generate Resume
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>

          {resumeList.length > 0 && (
            <>
              <Divider sx={{ my: 4, width: "100%" }} />
              <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                Available Resumes
              </Typography>
              {resumeList.map((resume) => (
                <Paper key={resume._id} sx={{ p: 2, my: 1, width: "100%" }}>
                  <Typography variant="subtitle1">{resume.name}</Typography>
                  <Typography variant="body2">{resume.email}</Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => downloadResume(resume._id)}
                    sx={{ mt: 1 }}
                  >
                    ⬇️ Download
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => deleteResume(resume._id)}
                    sx={{ mt: 1, ml: 2 }}
                  >
                    🗑️ Delete
                  </Button>
                </Paper>
              ))}
            </>
          )}
        </Box>
      </Container>
    </>
  );
}

export default App;
