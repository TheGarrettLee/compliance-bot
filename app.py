import os
import json
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pypdf import PdfReader
from openai import OpenAI
from dotenv import load_dotenv
import tempfile

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='static')
CORS(app)

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def extract_text_from_pdf(pdf_file):
    """Extract text content from PDF file"""
    try:
        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception as e:
        raise Exception(f"Error reading PDF: {str(e)}")

def extract_compliance_data(text):
    """Use OpenAI to extract compliance information from text"""
    prompt = f"""
Extract compliance information from this document and return as valid JSON.

Document text:
{text[:4000]}

Return ONLY valid JSON with this exact structure:
{{
  "compliance_items": [
    {{
      "requirement": "description of the compliance requirement",
      "amount_owed": "dollar amount or null",
      "deadline": "YYYY-MM-DD format or null",
      "status": "compliant/non-compliant/pending/unknown"
    }}
  ],
  "total_amount": "sum of all amounts as string with $ or null",
  "summary": "brief summary of compliance status"
}}

If no compliance information is found, return an empty compliance_items array.
"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a compliance data extraction assistant. Always return valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            response_format={"type": "json_object"}
        )
        
        result = response.choices[0].message.content
        return json.loads(result)
    except Exception as e:
        raise Exception(f"Error calling OpenAI API: {str(e)}")

@app.route('/')
def index():
    """Serve the frontend"""
    return send_from_directory('static', 'index.html')

@app.route('/api/extract', methods=['POST'])
def extract():
    """API endpoint to process PDF and extract compliance data"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not file.filename.endswith('.pdf'):
        return jsonify({'error': 'File must be a PDF'}), 400
    
    try:
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp_file:
            file.save(tmp_file.name)
            tmp_path = tmp_file.name
        
        # Extract text from PDF
        text = extract_text_from_pdf(tmp_path)
        
        # Clean up temp file
        os.unlink(tmp_path)
        
        if not text.strip():
            return jsonify({'error': 'Could not extract text from PDF'}), 400
        
        # Extract compliance data using LLM
        compliance_data = extract_compliance_data(text)
        
        return jsonify({
            'success': True,
            'data': compliance_data
        })
    
    except Exception as e:
        # Clean up temp file on error
        if 'tmp_path' in locals():
            try:
                os.unlink(tmp_path)
            except:
                pass
        
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)