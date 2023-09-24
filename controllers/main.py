import sys
import requests
import numpy as np
from PIL import Image
from tensorflow import keras
from io import BytesIO

def predict(image_url):

    input_image = url_to_img(image_url)
    processed_image = process(input_image)
    crop = crop_predict(processed_image)
    disease = disease_predict(processed_image, crop)
    return (crop,disease)

    
def url_to_img(image_url):

    # Load the image from the URL
    response = requests.get(image_url)
    input_image = Image.open(BytesIO(response.content))
    return input_image


def process(input_image):

    # Preprocess the image to match model's input dimensions
    input_image = input_image.resize((224, 224))  # Adjust the dimensions
    input_image = np.array(input_image) / 255.0  # Normalize pixel values to [0, 1]
    processed_image = np.expand_dims(input_image, axis=0)  # Add batch dimension
    return processed_image


def crop_predict(processed_image):

    # Load the trained model
    model = keras.models.load_model('controllers/models/corn_model.h5')
    # Make predictions
    predictions = model.predict(processed_image)
    # Process the predictions (e.g., get class labels)
    class_labels = ["Corn", "Potato", "Rice", "Wheat"] 
    predicted_class = np.argmax(predictions, axis=1)
    predicted_label = class_labels[predicted_class[0]]
    return predicted_label


def disease_predict(processed_image, crop):

    if crop == "Potato":
        # Load the trained model
        model = keras.models.load_model('controllers/models/potato_model.h5')
        # Process the predictions (e.g., get class labels)
        class_labels = ["Potato__Early_Blight", "Potato_Healthy", "Potato__Late_Blight"] 
    
    elif crop == "Corn":
        # Load the trained model
        model = keras.models.load_model('controllers/models/corn_model.h5')
        # Process the predictions (e.g., get class labels)
        class_labels = ["Corn__Common_Rust", "Corn_Gray_Leaf_Spot", "Corn_Healthy", "Corn__Northern_Leaf_Blight"] 

    elif crop == "Rice":
        # Load the trained model
        model = keras.models.load_model('controllers/models/rice_model.h5')
        # Process the predictions (e.g., get class labels)
        class_labels = ["Rice__Brown_Spot", "Rice_Healthy", "Rice_Leaf_Blast", "Rice__Neck_Blast"] 

    elif crop == "Wheat":
        # Load the trained model
        model = keras.models.load_model('controllers/models/wheat_model.h5')
        # Process the predictions (e.g., get class labels)
        class_labels = ["Wheat__Brown_Rust", "Wheat_Healthy", "Wheat__Yellow_Rust"]

    # Make predictions
    predictions = model.predict(processed_image)
    predicted_class = np.argmax(predictions, axis=1)
    predicted_label = class_labels[predicted_class[0]]
    return predicted_label


if __name__ == "__main__":
    if len(sys.argv)>1:
        print("Call predict function with image-url as parameter")
        prediction = list(predict(sys.argv[1]))
        print(prediction[0])
        print(prediction[1])
    else:
        print("Please Give Input!!!")