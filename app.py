from flask import Flask, render_template, request, jsonify
from keras.utils import load_img, img_to_array
from keras.models import load_model
import numpy as np
import os

# Load trained model
model = load_model('generalModel.h5')
benign = load_model('benignModel.h5')
cancerous = load_model('cancerousModel.h5')
vascular = load_model('vascModel.h5')

def preprocess_image(img_path):
    img = load_img(img_path, target_size=(224, 224))
    img_array = img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0
    return img_array


app = Flask(__name__)

app.config['UPLOAD_FOLDER'] = 'uploads'
disease_types = ['Benign (noncancerous) lesion', 'Precancerous or cancerous lesion', 'Vascular lesion']
benign_types = ['atypical nevi', 'becker nevus', 'unclassified benign skin lesion', 'blue nevus', 'congenital nevus', 'dermatofibroma', 'halo-nevus', 'melanocytic nevi']
cancerous_types = ['basal cell carcinoma', 'Bowen\'s disease', 'melanoma']
vascular_types = ['angiokeratomas', 'angiomas', 'kaposi sarcoma', 'pyogenic granulomas', 'telangiectasias', 'unclassified vascular lesion', 'venous malformation']

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    # Get the uploaded image file
    image = request.files['image']
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
    print(image_path)
    image.save(image_path)

    # preprocess the image and make a prediction
    genPrediction = model.predict(preprocess_image(image_path))

    # Get the predicted disease type and probability
    disease_type = np.argmax(genPrediction)
    genProbability = float(genPrediction[0][disease_type])

    # Get the predicted disease type as a string
    category = disease_types[disease_type]
    if(category == 'Benign (noncancerous) lesion'):
        #run benign model
        benignPrediction = benign.predict(preprocess_image(image_path))
        specific_disease_type = np.argmax(benignPrediction)
        probability = float(benignPrediction[0][specific_disease_type])
        specific_predicted_disease = benign_types[specific_disease_type]
    elif(category == 'Precancerous or cancerous lesion'):
        #run cancerous model
        cancerousPrediction = cancerous.predict(preprocess_image(image_path))
        specific_disease_type = np.argmax(cancerousPrediction)
        probability = float(cancerousPrediction[0][specific_disease_type])
        specific_predicted_disease = cancerous_types[specific_disease_type]
    else:
        #run vascular model
        vascularPrediction = vascular.predict(preprocess_image(image_path))
        specific_disease_type = np.argmax(vascularPrediction)
        probability = float(vascularPrediction[0][specific_disease_type])
        specific_predicted_disease = vascular_types[specific_disease_type]
    
    if(genProbability < 0.6):
    #run the model for the next highest category if the probability is less than 60%
        if(category == 'Benign (noncancerous) lesion'):
            #run next highest category from genPrediction
            if(genPrediction[0][1] > genPrediction[0][2]):
                #run cancerous model
                category2 = 'Precancerous or cancerous lesion'
                c2_prob = float(genPrediction[0][1])
                cancerousPrediction = cancerous.predict(preprocess_image(image_path))
                specific_disease_type = np.argmax(cancerousPrediction)
                d2_prob = float(cancerousPrediction[0][specific_disease_type])
                disease2 = cancerous_types[specific_disease_type]
            else:
                #run vascular model
                category2 = 'Vascular lesion'
                c2_prob = float(genPrediction[0][2])
                vascularPrediction = vascular.predict(preprocess_image(image_path))
                specific_disease_type = np.argmax(vascularPrediction)
                d2_prob = float(vascularPrediction[0][specific_disease_type])
                disease2 = vascular_types[specific_disease_type]
        elif(category == 'Precancerous or cancerous lesion'):
            #run next highest category from genPrediction
            if(genPrediction[0][0] > genPrediction[0][2]):
                #run benign model
                category2 = 'Benign (noncancerous) lesion'
                c2_prob = float(genPrediction[0][0])
                benignPrediction = benign.predict(preprocess_image(image_path))
                specific_disease_type = np.argmax(benignPrediction)
                d2_prob = float(benignPrediction[0][specific_disease_type])
                disease2 = benign_types[specific_disease_type]
            else:
                #run vascular model
                category2 = 'Vascular lesion'
                c2_prob = float(genPrediction[0][2])
                vascularPrediction = vascular.predict(preprocess_image(image_path))
                specific_disease_type = np.argmax(vascularPrediction)
                d2_prob = float(vascularPrediction[0][specific_disease_type])
                disease2 = vascular_types[specific_disease_type]
        else:
            #run next highest category from genPrediction
            if(genPrediction[0][0] > genPrediction[0][1]):
                #run benign model
                category2 = 'Benign (noncancerous) lesion'
                c2_prob = float(genPrediction[0][0])
                benignPrediction = benign.predict(preprocess_image(image_path))
                specific_disease_type = np.argmax(benignPrediction)
                d2_prob = float(benignPrediction[0][specific_disease_type])
                disease2 = benign_types[specific_disease_type]
            else:
                #run cancerous model
                category2 = 'Precancerous or cancerous lesion'
                c2_prob = float(genPrediction[0][1])
                cancerousPrediction = cancerous.predict(preprocess_image(image_path))
                specific_disease_type = np.argmax(cancerousPrediction)
                d2_prob = float(cancerousPrediction[0][specific_disease_type])
                disease2 = cancerous_types[specific_disease_type]
    else:
        #if the probability is greater than 60%, set the second category to the same as the first and choose the next highest disease type
        category2 = category
        c2_prob = genProbability
        #find the next highest disease in the array of the original prediciton
        if(category == 'Benign (noncancerous) lesion'):
            #find second highest max in benignPrediction
            secondHighestType = np.argpartition(benignPrediction[0], -2)[-2]
            disease2 = benign_types[secondHighestType]
            d2_prob = float(benignPrediction[0][secondHighestType])
        elif(category == 'Precancerous or cancerous lesion'):
            #find second highest max in cancerousPrediction
            secondHighestType = np.argpartition(cancerousPrediction[0], -2)[-2]
            disease2 = cancerous_types[secondHighestType]
            d2_prob = float(cancerousPrediction[0][secondHighestType])
        else:
            #find second highest max in vascularPrediction
            secondHighestType = np.argpartition(vascularPrediction[0], -2)[-2]
            disease2 = vascular_types[secondHighestType]
            d2_prob = float(vascularPrediction[0][secondHighestType])



    # Render the result template with the predicted disease type and probability
    return jsonify({
        'category': category,
        'probability': genProbability,
        'disease': specific_predicted_disease,
        'disease_prob': probability,
        'category2': category2,
        'c2_prob': c2_prob,
        'disease2': disease2,
        'd2_prob': d2_prob
    })
if __name__ == '__main__':
    app.run()
