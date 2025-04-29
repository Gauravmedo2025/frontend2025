const express = require('express');
const PDFDocument = require('pdfkit');
const Resume = require('../models/Resume');

const router = express.Router();

// POST /resume/generate — Generate and Save Resume
router.post('/generate', async (req, res) => {
  const { name, email, phone, education, experience, skills } = req.body;

  try {
    const resume = new Resume({ name, email, phone, education, experience, skills });
    await resume.save();

    const doc = new PDFDocument({ margin: 50 });
    let chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.send(pdfBuffer);
    });

    generateResumePDF(doc, resume);
  } catch (err) {
    console.error("Error generating resume:", err);
    res.status(500).send("Error generating resume");
  }
});

// GET /resume/list — Return all saved resumes
router.get('/list', async (req, res) => {
  try {
    const resumes = await Resume.find().sort({ createdAt: -1 });
    res.json(resumes);
  } catch (err) {
    console.error("Error fetching resume list:", err);
    res.status(500).json({ error: "Failed to fetch resumes" });
  }
});

// GET /resume/download/:id — Regenerate and download a saved resume
router.get('/download/:id', async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).send('Resume not found');

    const doc = new PDFDocument({ margin: 50 });
    let chunks = [];

    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(chunks);
      res.setHeader('Content-Type', 'application/pdf');
      res.send(pdfBuffer);
    });

    generateResumePDF(doc, resume);
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).send("Error downloading resume");
  }
});

// DELETE /resume/delete/:id — Delete a saved resume
router.delete('/delete/:id', async (req, res) => {
  try {
    const resume = await Resume.findByIdAndDelete(req.params.id);
    if (!resume) {
      return res.status(404).send('Resume not found');
    }
    res.send('Resume deleted successfully');
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).send("Error deleting resume");
  }
});

// Shared PDF Generator Function
function generateResumePDF(doc, { name, email, phone, education, experience, skills }) {
  doc
    .fontSize(26)
    .fillColor('#2E86C1')
    .text(name, { align: 'center' });

  doc
    .moveDown(0.3)
    .fontSize(14)
    .fillColor('#34495E')
    .text(email, { align: 'center' })
    .text(phone, { align: 'center' });

  doc
    .moveDown()
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke('#D5D8DC');

  doc
    .moveDown()
    .fontSize(18)
    .fillColor('#1F618D')
    .text('Education')
    .moveDown(0.2)
    .fontSize(14)
    .fillColor('black')
    .text(education);

  doc
    .moveDown()
    .fontSize(18)
    .fillColor('#1F618D')
    .text('Experience')
    .moveDown(0.2)
    .fontSize(14)
    .fillColor('black')
    .text(experience);

  doc
    .moveDown()
    .fontSize(18)
    .fillColor('#1F618D')
    .text('Skills')
    .moveDown(0.5);

  skills.forEach(skill => {
    doc
      .fontSize(14)
      .fillColor('black')
      .text('• ' + skill, { indent: 20 });
  });

  doc
    .moveDown(2)
    .fontSize(10)
    .fillColor('#AAB7B8')
    .text('Generated using Resume Generator App', { align: 'center' });

  doc.end();
}

module.exports = router;
