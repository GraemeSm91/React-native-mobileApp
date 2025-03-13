import os
import tensorflow as tf
from flask import Flask, request, jsonify
from google.cloud import storage
import base64
import numpy as np
from io import BytesIO
from PIL import Image
import traceback

app = Flask(__name__)


def download_model(bucket_name, model_path, local_model_path='/tmp/augment_model.keras'):
    try:
        client = storage.Client()
        bucket = client.bucket(bucket_name)
        blob = bucket.blob(model_path)
        blob.download_to_filename(local_model_path)
        print(f"Model downloaded to {local_model_path}")
    except Exception as e:
        print(f"Error downloading model: {e}")
        raise


model = None


def load_model_from_storage():
    global model
    if model is None:
        try:
            model_bucket = 'class-model'  
            model_path = 'augment_model.keras'  

            
            print(f"Downloading model from bucket '{model_bucket}', file '{model_path}'")

            
            download_model(model_bucket, model_path)
            model = tf.keras.models.load_model('/tmp/augment_model.keras')

            print("Model loaded successfully")
        except Exception as e:
            print(f"Error loading model: {e}")
            raise

@app.route('/predict', methods=['POST'])
def predict(request):
    global model
    if model is None:
        load_model_from_storage()  

    try:
        
        data = request.get_json()

        
        if 'image' not in data:
            return jsonify({'error': 'Image data not found in request'}), 400

        image = data['image']  

        
        print(f"Received image data (truncated): {image[:50]}...")

        
        image_data = preprocess_image(image)  

        
        print(f"Processed image shape: {image_data.shape}")

        
        prediction = model.predict(image_data)

        
        print(f"Prediction result: {prediction}")

        
        return jsonify({'prediction': prediction.tolist()})
    
    except Exception as e:
        
        print(f"Error processing request: {e}")
        traceback.print_exc()

        
        return jsonify({'error': f'Failed to process image or make prediction: {str(e)}'}), 500


def preprocess_image(image):
    
    try:
        image = Image.open(BytesIO(base64.b64decode(image)))
    except Exception as e:
        print(f"Error decoding base64 image: {e}")
        raise

    
    image = image.resize((224, 224))  
    image = np.array(image)

    
    print(f"Image array after resizing: {image.shape}")

    image = image / 255.0  

   
    image = np.expand_dims(image, axis=0)

    return image


def main(request):
    return app(request)