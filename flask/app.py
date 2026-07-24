# app.py
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Get API key from environment
api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    raise ValueError("No GEMINI_API_KEY found in environment variables")

# Gemini API endpoint
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    try:
        user_message = request.json.get('message')
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Prepare the request payload for Gemini API
        payload = {
            "contents": [
                {
                    "parts": [
                        {
                            "text": user_message
                        }
                    ]
                }
            ]
        }
        
        # Add system instruction for disaster management context
        payload["systemInstruction"] = {
            "parts": [
                {
                    "text": "You are a helpful assistant specialized in disaster management education. Provide clear, accurate information about disaster preparedness, response, recovery, and mitigation. Focus on safety guidelines, best practices, and educational content suitable for students learning about disaster management."
                }
            ]
        }
        
        # Make request to Gemini API
        headers = {
            'Content-Type': 'application/json'
        }
        
        response = requests.post(GEMINI_API_URL, json=payload, headers=headers)
        response_data = response.json()
        
        # Extract the response text from the API response
        if 'candidates' in response_data and len(response_data['candidates']) > 0:
            if 'content' in response_data['candidates'][0]:
                bot_response = response_data['candidates'][0]['content']['parts'][0]['text']
                return jsonify({'response': bot_response})
        
        # If we couldn't extract a response, check for errors
        if 'promptFeedback' in response_data and 'blockReason' in response_data['promptFeedback']:
            return jsonify({'error': f"Message blocked: {response_data['promptFeedback']['blockReason']}"}), 400
        
        return jsonify({'error': 'Unable to get response from AI service'}), 500
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True,port = 5001)