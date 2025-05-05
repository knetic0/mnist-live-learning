const path    = require('path');
const express = require('express');
const multer  = require('multer');
const { initializeModel, train, predict, save } = require('./train');

const app    = express();
const upload = multer({ storage: multer.memoryStorage() });

const MODEL_SAVE_INTERVAL = 1000 * 60 * 60; // 1 saat

app.use(
  '/', 
  express.static(path.join(__dirname, 'public'))
);

app.post('/train', upload.single('blob'), async (req, res) => {
  await train(req.file.buffer, parseInt(req.body.label, 10));
  res.sendStatus(200);
});

app.post('/predict', upload.single('blob'), async (req, res) => {
  const classId = await predict(req.file.buffer);
  res.json({ prediction: classId });
});

(async () => {
  await initializeModel();
  setInterval(() => save(), MODEL_SAVE_INTERVAL);
})();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});