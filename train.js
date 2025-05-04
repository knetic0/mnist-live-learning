const fs = require('fs');
const path = require('path');
const tf = require('@tensorflow/tfjs-node');

let model;

/**
 * Creates a new model with the specified architecture.
 * @returns {tf.LayersModel} - The created model.
 * */
function createNewModel() {
    const model = tf.sequential();

    model.add(tf.layers.conv2d({
        inputShape: [28, 28, 1],
        filters: 32,
        kernelSize: 3,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
    }));
    
    model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));
    
    model.add(tf.layers.conv2d({
        filters: 64,
        kernelSize: 3,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
    }));
    
    model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));
    
    model.add(tf.layers.flatten());
    
    model.add(tf.layers.dense({
        units: 128,
        activation: 'relu',
        kernelInitializer: 'varianceScaling'
    }));
    
    model.add(tf.layers.dropout({ rate: 0.5 }));
    
    model.add(tf.layers.dense({
        units: 10,
        activation: 'softmax',
        kernelInitializer: 'varianceScaling'
    }));
    
    const optimizer = tf.train.adam(0.001);
    
    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
    });

    return model;
}

/**
 * @param {Buffer} buffer
 * @returns {tf.Tensor} - The preprocessed image tensor.
 */
function preprocess(buffer) {
    return tf.tidy(() => {
        const img = tf.node.decodeImage(buffer, 1);
        const resized = tf.image.resizeNearestNeighbor(img, [28, 28]);
        const norm = resized.toFloat().div(255.0);
        return norm.expandDims(0);
    })
}

/**
 * @param {number} label
 * @returns {tf.Tensor} - The one-hot encoded label tensor.
 */
function toOneHot(label) {
    return tf.tidy(() => {
        return tf.oneHot(tf.tensor1d([label], 'int32'), 10)
    })
}

/**
 * @param {Buffer} buffer - The input data for training.
 * @param {number} label - The labels for the input data.
 * @returns {Promise<tf.History>} - A promise that resolves when the training is complete.
 */
async function train(buffer, label) {
    const xs = preprocess(buffer);
    const ys = toOneHot(label);
    const history = await model.fit(xs, ys, {
        epochs: 1,
        batchSize: 1,
        shuffle: false,
        callbacks: [ tf.callbacks.earlyStopping({ monitor: 'loss', patience: 2 }) ]
    });
    xs.dispose();
    ys.dispose();
    return history;
}

/**
 * @param {Buffer} buffer - The input data for prediction.
 * @returns {Promise<number>} - A promise that resolves to the predicted class ID.
 */
async function predict(buffer) {
    const xs = preprocess(buffer);
    const preds = model.predict(xs);
    const classId = (await preds.argMax(-1).data())[0];
    xs.dispose();
    preds.dispose();
    return classId;
}

/**
 * @param {string} path - The file path to save the model.
 * @returns {Promise<void>} - A promise that resolves when the model is saved.
 */
async function save() {
    const path = path.join(__dirname, 'model.json');
    await model.save(`file://${path}`);
}

/**
 * @param {string} path - The file path to load the model from.
 * @returns {Promise<tf.LayersModel>} - A promise that resolves when the model is loaded.
 */
async function load(path) {
    return await tf.loadLayersModel(`file://${path}/model.json`);
}

/** 
 * Initializes the model by loading it from a file or creating a new one.
 * @return {void} - A void function.
*/
function initializeModel() {
    const modelPath = path.join(__dirname, 'model.json');
    if (fs.existsSync(modelPath)) {
        model = load(modelPath);
    } else {
        model = createNewModel();
    }
}

module.exports = {
    train,
    predict,
    save,
    initializeModel
}