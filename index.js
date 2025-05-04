const path = require('path');
const express = require('express');
const multer = require('multer');
const { initializeModel, train, predict } = require('./train');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

(async () => {
    await initializeModel();

    app.use("/", express.static(path.join(__dirname, 'public')));

    app.post('/train', upload.single('blob'), async (req, res) => {
        const buffer = req.file.buffer;
        const label = parseInt(req.body.label, 10);
        await train(buffer, label);
        return res.sendStatus(200);
    })

    app.post('/predict', upload.single('blob'), async (req, res) => {
        const buffer = req.file.buffer;
        const classId = await predict(buffer);
        return res.json({ prediction: classId });
    })

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})()