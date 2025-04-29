const PDFDocument = require('pdfkit');

const generatePDF = (req, res) => {
  const data = req.body;
  const doc = new PDFDocument();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
  doc.pipe(res);

  const primaryColor = '#1E88E5';

  doc.fontSize(22).fillColor(primaryColor).text(data.name, { underline: true });
  doc.fontSize(12).fillColor('black').text(`📧 ${data.email}`);
  doc.text(`📞 ${data.phone}`);
  doc.moveDown();

  doc.fontSize(16).fillColor(primaryColor).text('🎓 Education');
  doc.fontSize(12).fillColor('black').text(data.education);
  doc.moveDown();

  doc.fontSize(16).fillColor(primaryColor).text('💼 Experience');
  doc.fontSize(12).fillColor('black').text(data.experience);
  doc.moveDown();

  doc.fontSize(16).fillColor(primaryColor).text('🛠️ Skills');
  doc.fontSize(12).fillColor('black').list(data.skills);
  doc.moveDown();

  doc.end();
};

module.exports = { generatePDF };
