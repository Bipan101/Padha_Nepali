
# Padha Nepali


## Overview
This project is an interactive app designed to help users learn and practice the Nepali alphabet by drawing characters on a digital canvas. The app utilizes a trained AI model that identifies the character drawn and provides immediate feedback to the user. It’s a fun and educational way for learners to improve their understanding of the Nepali script.

## Features
Interactive Drawing Canvas: Users can draw Nepali letters using their mouse or touchscreen on a digital canvas.
AI-powered Character Recognition: The app uses a trained AI model to recognize the drawn character and gives instant feedback.
Immediate Feedback: Users can immediately know whether they have drawn the correct character, aiding in the learning process.
Comprehensive Dataset: The AI model has been trained using a dataset from Kaggle, ensuring robust character recognition.

## Current Progress
At this stage, the AI model can recognize only one Nepali letter: "Ka" (क). However, the model can be further trained to recognize other letters of the Nepali alphabet. The dataset used for training is publicly available, and developers are encouraged to extend the model for additional alphabets.

## AI Model
This project employs a Convolutional Neural Network (CNN) built using the Keras model, integrated with TensorFlow, a powerful library for machine learning. TensorFlow's high-level neural networks API (Keras) simplifies the process of building, training, and deploying machine learning models.

Model Type: Convolutional Neural Network (CNN) <br>
Framework: Keras with TensorFlow backend <br>
Dataset Source: [Kaggle - Devanagari Character Dataset](https://www.kaggle.com/datasets/ashokpant/devanagari-character-dataset/data) <br>
Dataset<br>
The dataset used to train the AI model was sourced from Kaggle, a reliable platform for data science and machine learning projects. The dataset contains images of Devanagari characters, including those from the Nepali alphabet.

Dataset Link: [Kaggle Devanagari Character Dataset](https://www.kaggle.com/datasets/ashokpant/devanagari-character-dataset/data)

## Future Enhancements
Expand Character Recognition: Train the AI model to recognize additional Nepali letters beyond "Ka" (क). <br>
Improve UI/UX: Make the drawing canvas more user-friendly and responsive.<br>
Enhance Accuracy: Further fine-tune the AI model for improved character recognition accuracy.
