from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import logging
import traceback

app = Flask(__name__)
CORS(app)

# Lazy-loaded model and tokenizer
tokenizer = None
model = None

def load_model():
    global tokenizer, model
    if tokenizer is None or model is None:
        logging.info("Loading model...")
        tokenizer = AutoTokenizer.from_pretrained("Falconsai/text_summarization")
        model = AutoModelForSeq2SeqLM.from_pretrained("Falconsai/text_summarization")
        logging.info("Model loaded.")

@app.route('/api/summarize', methods=['POST'])
def summarize():
    try:
        load_model()
        
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({'error': 'No text provided'}), 400

        text = data['text']
        logging.info(f"Received text to summarize: {text[:100]}...")

        inputs = tokenizer([text], max_length=1024, return_tensors="pt", truncation=True)
        summary_ids = model.generate(
            inputs["input_ids"],
            max_length=60,
            min_length=10,
            length_penalty=2.0,
            num_beams=4,
            early_stopping=True
        )
        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
        logging.info(f"Generated summary: {summary}")

        return jsonify({'summary': summary})
    except Exception as e:
        logging.error("Exception occurred while summarizing")
        traceback.print_exc()
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

if __name__ == '__main__':
    logging.info("Starting server...")
    from waitress import serve
    serve(app, host='0.0.0.0', port=5005)
