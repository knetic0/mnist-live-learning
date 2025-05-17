const path = require('path');
const express = require('express');
const multer = require('multer');
const { initializeModel, train, predict, save } = require('./train');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const PORT = process.env.PORT || 3000;
const MODEL_SAVE_INTERVAL = 1000 * 60 * 60; // 1 hour

(async () => {
  await initializeModel();
  setInterval(() => save(), MODEL_SAVE_INTERVAL);
})();

const staticPath = path.join(__dirname, 'public');

app.use('/', express.static(staticPath));

app.post('/api/train', upload.single('blob'), async (req, res) => {
  try {
    await train(req.file.buffer, parseInt(req.body.label, 10));
    res.sendStatus(200);
  } catch (error) {
    console.error('Training error:', error);
    res.status(500).send('Training failed');
  }
});

app.post('/api/predict', upload.single('blob'), async (req, res) => {
  try {
    const classId = await predict(req.file.buffer);
    res.json({ prediction: classId });
  } catch (error) {
    console.error('Prediction error:', error);
    res.status(500).send('Prediction failed');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});