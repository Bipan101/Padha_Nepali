from fastapi import FastAPI, File, HTTPException, UploadFile
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
from typing import Tuple
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model
model_path = "model.h5"
ALPHABET_MODEL = tf.keras.models.load_model(model_path)
# Updated to match the actual model output - it has 3 classes, not 2
ALPHABET_CLASS_NAMES = ['Ka', 'Kha', 'Class2']  # You need to identify what the 3rd class is

def read_file_as_image(data: bytes, size: Tuple[int, int]) -> np.ndarray:
    image = Image.open(BytesIO(data))
    
    # Convert to grayscale if the model expects single channel
    # You might need to adjust this based on your model's input requirements
    if image.mode == 'RGBA':
        # Create a white background
        background = Image.new('RGB', image.size, (255, 255, 255))
        background.paste(image, mask=image.split()[-1])  # Use alpha channel as mask
        image = background
    
    # Convert to RGB if not already
    image = image.convert("RGB")
    
    # Resize to the required size - FIXED: Model expects 256x256, not 28x28
    image = image.resize(size, Image.Resampling.LANCZOS)
    
    # Convert to numpy array
    image = np.array(image)
    
    return image

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Read the image
        image_data = await file.read()
        
        # FIXED: Use correct input size that matches the model (256x256, not 28x28)
        image = read_file_as_image(image_data, size=(256, 256))
        original_image = image.copy()
        image = np.expand_dims(image, axis=0)  # Add batch dimension
        
        # Normalize the image if required by your model
        image = image / 255.0  # Assuming your model expects normalized images

        # Predict the class
        prediction = ALPHABET_MODEL.predict(image)
        predicted_class = ALPHABET_CLASS_NAMES[np.argmax(prediction[0])]
        confidence = int(np.max(prediction[0]) * 100)
        
        # Debug information
        print(f"Prediction probabilities: {prediction[0]}")
        print(f"Predicted class index: {np.argmax(prediction[0])}")
        print(f"Predicted class: {predicted_class}")
        print(f"Confidence: {confidence}%")
        print(f"Image shape after preprocessing: {image.shape}")
        print(f"Image min/max values: {np.min(image):.3f}/{np.max(image):.3f}")
        
        # Return more detailed information - FIXED: Handle 3 classes
        probabilities = {}
        for i, class_name in enumerate(ALPHABET_CLASS_NAMES):
            if i < len(prediction[0]):
                probabilities[class_name] = float(prediction[0][i])
        
        return {
            "predicted_class": predicted_class,
            "confidence": confidence,
            "probabilities": probabilities,
            "debug_info": {
                "image_shape": list(image.shape),
                "prediction_raw": prediction[0].tolist(),
                "model_expects": "256x256 RGB images with 3 output classes"
            }
        }
    except Exception as e:
        print(f"Error in prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5001)
