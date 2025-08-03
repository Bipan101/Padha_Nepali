# 🇳🇵 Nepali Alphabet AI - Learn Nepali Letters the Smart Way

> A modern, AI-powered interactive web application for learning and practicing the beautiful Nepali alphabet with real-time feedback.

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=flat-square&logo=github)](https://github.com/Bipan101/Padha_Nepali)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-AI%20Model-orange?style=flat-square&logo=tensorflow)](https://tensorflow.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)

## ✨ Features

### 🎨 **Modern UI/UX Design**
- **Responsive Design**: Mobile-first approach with full tablet and desktop support
- **Modern Styling**: Clean interface with Google Fonts (Poppins), gradients, and smooth animations
- **Interactive Canvas**: Touch-friendly drawing with real-time stroke feedback
- **Professional Navigation**: Fixed navbar with smooth scrolling and blur effects

### 🧠 **AI-Powered Recognition**
- **CNN Model**: Convolutional Neural Network built with TensorFlow/Keras
- **Real-time Processing**: Instant character recognition and feedback
- **Detailed Analytics**: Confidence scores and probability distributions
- **Multi-class Support**: Architecture supports multiple Nepali characters

### 🚀 **Technical Features**
- **FastAPI Backend**: Modern Python web framework with automatic API documentation
- **RESTful API**: Clean endpoint structure for image upload and prediction
- **CORS Support**: Cross-origin resource sharing for web deployment
- **Error Handling**: Comprehensive error management and user feedback

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Model      │
│   (HTML/CSS/JS) │────│   (FastAPI)     │────│   (TensorFlow)  │
│                 │    │                 │    │                 │
│ • Canvas API    │    │ • Image Upload  │    │ • CNN Model     │
│ • Responsive    │    │ • CORS Enabled  │    │ • 256x256 RGB   │
│ • Modern UI     │    │ • Error Handling│    │ • 3 Classes     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 **Quick Start**

### Prerequisites
```bash
pip install fastapi uvicorn tensorflow pillow python-multipart
```

### Running the Application

1. **Start the Backend**
   ```bash
   cd Padha_Nepali
   python api.py
   ```
   Server runs on: `http://localhost:5001`

2. **Open the Frontend**
   Open `index.html` in your browser or serve it locally.

3. **Start Drawing!**
   - Draw Nepali characters on the canvas
   - Click "Submit" for AI recognition
   - Get instant feedback with confidence scores

## 📁 **Project Structure**

```
Padha_Nepali/
├── 📄 index.html          # Modern responsive frontend
├── 🐍 api.py              # FastAPI backend server
├── 🤖 model.h5            # Trained CNN model
├── 📁 script/
│   └── script.js          # Enhanced JavaScript with modern features
├── 📁 style/
│   └── style.css          # Modern CSS with animations
├── 📁 train/              # Training dataset
│   ├── ka/                # Ka (क) character images
│   └── kha/               # Kha (ख) character images
└── 📁 video/              # Learning resources
    └── nepali-alphabets.mp4
```

## 🎯 **Current Status**

### ✅ **Completed**
- [x] Modern responsive UI design
- [x] Interactive drawing canvas
- [x] FastAPI backend with proper image handling
- [x] TensorFlow model integration
- [x] Real-time feedback system
- [x] Touch device support
- [x] Error handling and user feedback

### ⚠️ **Known Issues**
- **Model Training Issue**: Current model predominantly predicts "Ka" due to training data imbalance
- **Limited Character Set**: Only trained on Ka (क) and Kha (ख)
- **Model Architecture Mismatch**: Model expects 256x256 RGB input, has 3 output classes

### 🔧 **In Progress**
- [ ] Model retraining with balanced dataset
- [ ] Extended character recognition (full Nepali alphabet)
- [ ] Improved training data augmentation
- [ ] Model accuracy optimization

## 🤖 **AI Model Details**

### **Architecture**
- **Type**: Convolutional Neural Network (CNN)
- **Framework**: TensorFlow 2.x with Keras
- **Input**: 256×256 RGB images
- **Output**: 3-class classification
- **Total Parameters**: 183,749 (717.77 KB)

### **Model Layers**
```
Input (256×256×3) → Conv2D → MaxPool → Conv2D → MaxPool → 
Conv2D → MaxPool → Conv2D → MaxPool → Conv2D → MaxPool → 
Conv2D → MaxPool → Flatten → Dense(64) → Dense(3)
```

### **Dataset**
- **Source**: [Kaggle Devanagari Character Dataset](https://www.kaggle.com/datasets/ashokpant/devanagari-character-dataset/data)
- **Training Images**: 205 Ka + 205 Kha (balanced dataset)
- **Format**: 28×28 grayscale (upscaled to 256×256 RGB for model)

## 🚀 **Future Enhancements**

### **Short Term**
- [ ] Fix model training pipeline for proper Ka/Kha distinction
- [ ] Add more Nepali characters (ग, घ, ङ, च, छ...)
- [ ] Implement data augmentation for better generalization
- [ ] Add progress tracking and user analytics

### **Long Term**
- [ ] Full Devanagari script support
- [ ] Stroke order guidance and animation
- [ ] Handwriting style adaptation
- [ ] Mobile app development
- [ ] Multi-language support (Hindi, Sanskrit)
- [ ] Community features and leaderboards

## 🛠️ **Development**

### **API Endpoints**
- `POST /predict` - Upload image for character recognition
- `GET /docs` - FastAPI automatic documentation

### **Frontend Technologies**
- **HTML5 Canvas** for drawing
- **CSS Grid & Flexbox** for responsive layout
- **Intersection Observer** for scroll animations
- **Fetch API** for backend communication

### **Backend Technologies**
- **FastAPI** for REST API
- **PIL/Pillow** for image processing
- **TensorFlow** for model inference
- **CORS middleware** for cross-origin requests

## 📊 **Performance Metrics**

| Metric | Current | Target |
|--------|---------|--------|
| Model Accuracy | ~50% (biased) | >95% |
| Response Time | <500ms | <200ms |
| Mobile Support | ✅ Full | ✅ Optimized |
| Character Support | 2 characters | 36+ characters |

## 🤝 **Contributing**

Contributions are welcome! Here's how you can help:

1. **Model Training**: Help improve the CNN model accuracy
2. **UI/UX**: Enhance the user interface and experience
3. **Character Expansion**: Add support for more Nepali characters
4. **Documentation**: Improve project documentation
5. **Testing**: Test on different devices and browsers

### **Development Setup**
```bash
git clone https://github.com/Bipan101/Padha_Nepali.git
cd Padha_Nepali
pip install -r requirements.txt  # Create this file
python api.py
```

## 📄 **License**

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 **Author**

**Bipan101** - [GitHub Profile](https://github.com/Bipan101)

---

<div align="center">


[🌟 Star this repo](https://github.com/Bipan101/Padha_Nepali) | [🐛 Report Bug](https://github.com/Bipan101/Padha_Nepali/issues) | [💡 Request Feature](https://github.com/Bipan101/Padha_Nepali/issues)

</div>
