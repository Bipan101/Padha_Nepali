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
ALPHABET_CLASS_NAMES = ['Ka', 'Kha']

def read_file_as_image(data: bytes, size: Tuple[int, int]) -> np.ndarray:
    image = Image.open(BytesIO(data))
    image = image.convert("RGB")
    image = image.resize(size)
    image = np.array(image)
    return image

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        # Read the image
        image_data = await file.read()
        
        # Read and preprocess the image
        image = read_file_as_image(image_data, size=(28, 28))
        image = np.expand_dims(image, axis=0)  # Add batch dimension
        
        # Normalize the image if required by your model
        image = image / 255.0  # Assuming your model expects normalized images

        # Predict the class
        prediction = ALPHABET_MODEL.predict(image)
        predicted_class = ALPHABET_CLASS_NAMES[np.argmax(prediction[0])]
        confidence = int(np.max(prediction[0]) * 100)

        return {
            "predicted_class": predicted_class,
            "confidence": confidence
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
