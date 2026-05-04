# 🤖 Compliance Bot

AI-powered tool for extracting compliance information from PDF documents using OpenAI's GPT models.

## Features

- 📄 Drag-and-drop PDF upload
- 🤖 AI-powered compliance data extraction
- 📊 Structured table display of requirements, amounts, and deadlines
- ⚡ Fast processing with OpenAI API
- 🎨 Clean, modern UI

## Tech Stack

- **Backend**: Python Flask
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **PDF Processing**: pypdf
- **AI**: OpenAI GPT-4o-mini
- **CORS**: Flask-CORS

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**  
   ```bash
   git clone https://github.com/TheGarrettLee/compliance-bot.git
   cd compliance-bot
   ```

2. **Create a virtual environment** (recommended)  
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On Mac/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies**  
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**  
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your OpenAI API key
   # OPENAI_API_KEY=sk-your-key-here
   ```

### Running the App

1. **Start the Flask server**  
   ```bash
   python app.py
   ```

2. **Open your browser**  
   Navigate to: `http://localhost:5000`

3. **Upload a PDF**  
   - Drag and drop a PDF document
   - Click "Extract Compliance Data"
   - View the extracted information in the table

## Usage

1. **Upload PDF**: Drag a compliance-related PDF document into the upload zone
2. **Process**: Click "Extract Compliance Data" button
3. **Review**: See extracted requirements, amounts owed, deadlines, and compliance status
4. **Repeat**: Process another document as needed

## API Endpoints

### `POST /api/extract`

Extracts compliance data from uploaded PDF.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (PDF file)

**Response:**
```json
{
  "success": true,
  "data": {
    "compliance_items": [
      {
        "requirement": "Annual safety inspection",
        "amount_owed": "$500",
        "deadline": "2026-06-30",
        "status": "pending"
      }
    ],
    "total_amount": "$500",
    "summary": "Document contains 1 compliance requirement"
  }
}
```

## Project Structure

```
compliance-bot/
├── app.py                 # Flask backend server
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
├── README.md             # This file
└── static/
    ├── index.html        # Frontend UI
    ├── style.css         # Styling
    └── script.js         # Frontend JavaScript
```

## Security Notes

⚠️ **This is a prototype for demonstration purposes**

For production use, you should add:
- Authentication and authorization
- Rate limiting
- File size and type validation on server
- Encrypted storage for uploaded files
- Secure API key management
- HTTPS/SSL certificates
- Input sanitization
- Error logging and monitoring

## Cost Estimates

Using OpenAI GPT-4o-mini:
- ~$0.001-0.01 per document (depending on length)
- First $5 credit from OpenAI covers ~500-5000 documents

## Troubleshooting

**"Module not found" errors:**
```bash
pip install -r requirements.txt
```

**"OpenAI API key not found":**
- Check that `.env` file exists
- Verify `OPENAI_API_KEY` is set correctly

**"Could not extract text from PDF":**
- Some PDFs are image-based (scanned). Consider adding OCR (tesseract) for those.

**CORS errors:**
- Make sure Flask-CORS is installed
- Check that frontend is accessing `http://localhost:5000`

## Future Enhancements

- [ ] Support for image-based PDFs (OCR)
- [ ] Export results to CSV/Excel
- [ ] Document history and comparison
- [ ] Multi-file batch processing
- [ ] Custom extraction templates
- [ ] Integration with compliance management systems

## License

Copyright © 2026. All rights reserved.

This is proprietary software for demonstration purposes.

## Support

For questions or issues, contact: [Your contact info]