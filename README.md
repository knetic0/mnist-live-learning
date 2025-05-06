# LIVE-LEARNING: MNIST Trainer & Predictor


## 📄 Overview

**LIVE-LEARNING** is a real-time, browser-based MNIST digit trainer and predictor built with TensorFlow\.js and Express.js. Users can draw handwritten digits on a canvas, train a convolutional neural network (CNN) model with their own samples, and perform live predictions—all in a seamless web interface.

<img style="width:30rem" alt="image" src="https://github.com/user-attachments/assets/9eb5d799-caae-4011-8e77-6a4c6be04f06" />
<img style="width:30rem" alt="image" src="https://github.com/user-attachments/assets/0c2b598a-0849-4a20-a84c-40e48ccc0301" />

## ✨ Features

* **Interactive Canvas UI**: Draw digits (0–9) directly in the browser.
* **On-Demand Training**: Submit drawn digits with labels to train the model incrementally.
* **Live Prediction**: Switch to prediction mode to classify new drawings in real time.
* **Model Persistence**: Automatically save and load the trained model to disk every hour.
* **Lightweight Backend**: Server built on Express.js and TensorFlow\.js (Node.js).

## 🚀 Prerequisites

* **Node.js** v14 or higher
* **npm** (comes with Node.js)

Optional:

* A modern browser (Chrome, Firefox, Safari) for the front-end.

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/live-learning.git
   cd live-learning
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   * Copy `.env.example` to `.env` and set any custom variables (e.g., `PORT`).
   * Defaults:

     ```dotenv
     PORT=3000
     ```

4. **Run the server**

   ```bash
   npm start
   ```

Open your browser and navigate to `http://localhost:3000`.

## 🎨 Front-End Usage

The front-end lives in the `public` folder:

* **index.html**: Main UI with canvas and control buttons.
* **app.js**: Canvas drawing logic, mode toggling (Train/Predict), and API calls.
* **styles.css**: Basic styling and layout.

### Training Mode

1. Select **Train**.
2. Use the number input to choose the current label (0–9).
3. Draw the digit on the canvas.
4. Click **Train** to send a POST request to `/train` with the image blob and label.

### Prediction Mode

1. Select **Predict**.
2. Draw a digit on the canvas.
3. Click **Predict** to send a POST request to `/predict` with the image blob.
4. View the predicted digit on-screen.

## 🔌 Back-End API

The Express server (`index.js`) exposes two endpoints:

### POST `/train`

* **Description**: Train the model on a single sample.
* **Request**: `multipart/form-data`

  * `blob` (File): PNG image buffer of the 28×28 pixel drawing.
  * `label` (Number): Digit label (0–9).
* **Response**: HTTP 200 on success.

### POST `/predict`

* **Description**: Predict the class of a single drawing.
* **Request**: `multipart/form-data`

  * `blob` (File): PNG image buffer.
* **Response**: JSON object:

  ```json
  { "prediction": <digit> }
  ```

## 📂 Project Structure

```
LIVE-LEARNING
├── public/           # Front-end (HTML, JS, CSS, assets)
├── node_modules/     # npm dependencies
├── model/            # Saved TensorFlow.js model files (auto-created)
├── .env              # Environment variables
├── .gitignore        # Ignored files and folders
├── index.js          # Express server setup and routes
├── train.js          # TensorFlow.js model definition, train & predict logic
├── package.json      # Project metadata and scripts
├── README.md         # Project documentation (you are here)
└── package-lock.json # Exact dependency versions
```

## ⚙️ Configuration

* **PORT**: Port on which the Express server runs (default: 3000).
* **MODEL\_DIR**: Directory for saving/loading the trained model (default: `./model`).

Adjust these in the `.env` file or environment before starting the server.

## 📝 Scripts

* `npm start`: Start the server in production mode.
* `npm run dev`: Start the server with `nodemon` for development (auto-reload on changes).

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/my-new-feature`.
3. Make your changes and commit: `git commit -am 'Add feature'`.
4. Push to the branch: `git push origin feature/my-new-feature`.
5. Open a Pull Request.

Ensure your code adheres to existing style and includes relevant tests or manual checks.

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

* [TensorFlow.js](https://www.tensorflow.org/js) for client and server-side ML in JavaScript.
* The MNIST dataset and community contributions.
