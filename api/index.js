import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// In serverless environment, write to /tmp or use local submissions.json (fallback)
const SUBMISSIONS_FILE = process.env.VERCEL
  ? path.join("/tmp", "submissions.json")
  : path.join(__dirname, "submissions.json");

// Ensure submissions file exists
try {
  await fs.access(SUBMISSIONS_FILE);
} catch {
  await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify([], null, 2));
}

// Routes
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, role, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    const newSubmission = {
      id: Date.now().toString(),
      name,
      email,
      role: role || "N/A",
      message,
      timestamp: new Date().toISOString(),
    };

    // Read existing
    let submissions = [];
    try {
      const fileData = await fs.readFile(SUBMISSIONS_FILE, "utf-8");
      submissions = JSON.parse(fileData);
    } catch {}

    // Save new
    submissions.push(newSubmission);
    await fs.writeFile(SUBMISSIONS_FILE, JSON.stringify(submissions, null, 2));

    console.log("New contact submission received:", newSubmission);

    return res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error saving submission:", error);
    return res.status(500).json({ error: "Failed to save submission." });
  }
});

// Resume Download Endpoint
app.get("/api/resume", async (req, res) => {
  const resumePath = path.join(__dirname, "resume.pdf");
  try {
    await fs.access(resumePath);
    res.download(resumePath, "Aman_Sharma_Resume.pdf");
  } catch {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Disposition", 'attachment; filename="Aman_Sharma_Resume_Placeholder.txt"');
    res.send("This is a placeholder for Aman Sharma's Resume. Please place your real resume.pdf in the 'api' folder to serve it.");
  }
});

// Serve locally if not running on Vercel
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Express server running locally on http://localhost:${PORT}`);
  });
}

export default app;
