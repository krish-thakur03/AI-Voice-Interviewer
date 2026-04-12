# AI Voice Interviewer 🎤🤖

A free AI-powered voice interviewer for practicing interview skills.

## Features

- 🎙️ **Voice Recognition** - Speak your answers naturally (Web Speech API)
- 🔊 **AI Voice** - Interviewer speaks questions aloud (Web Speech API)
- 📹 **Webcam Feed** - See yourself during the interview
- 🤖 **AI Responses** - Smart follow-up questions (Gemini API free tier)
- 📊 **Feedback** - Get summary after interview

## Tech Stack (100% Free)

| Component | Technology |
|-----------|------------|
| Frontend | React + Vite |
| Backend | Python (FastAPI + Socket.IO) |
| Real-time | Socket.io |
| Speech | Web Speech API (Browser) |
| AI | Google Gemini (Free) or Fallback |

## Quick Start

### 1. Get Free Gemini API Key (Optional but Recommended)

1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key

### 2. Setup Server (Python)

```bash
cd server
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Add your Gemini API key to .env (optional)

python -m uvicorn main:asgi_app --reload --port 5000
```

### 3. Setup Client

```bash
cd client
npm install
npm run dev
```

### 4. Open in Browser

Go to: http://localhost:5173

## How to Use

1. **Select Interview Type** - Technical, Behavioral, or HR
2. **Allow Permissions** - Microphone and Camera access
3. **Listen** - AI will ask questions (plays through speakers)
4. **Respond** - Click 🎤 button, speak your answer, click again to send
5. **Repeat** - Continue the conversation
6. **End** - Click "End Interview" for feedback

## Free API Alternatives

If Gemini doesn't work in your region:

1. **Groq** (Free): https://console.groq.com/keys
2. **Together AI** (Free tier): https://api.together.xyz/
3. **Ollama** (Local, Free): Run AI locally

## Browser Compatibility

- ✅ Chrome (Best)
- ✅ Edge
- ⚠️ Firefox (Limited speech recognition)
- ❌ Safari (Speech recognition issues)

## Project Structure

```
ai voice interviewer/
├── server/
│   ├── main.py         # FastAPI + Socket.IO + AI logic
│   ├── requirements.txt
│   └── .env.example
│
├── client/
│   ├── src/
│   │   ├── App.jsx     # Main interview component
│   │   ├── index.css   # Styling
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
└── README.md
```

## Tips for Demo

1. Use Chrome for best speech recognition
2. Speak clearly and pause after finishing
3. Works best in quiet environment
4. Use headphones to avoid echo

## Future Improvements

- [ ] Add more question categories
- [ ] Save interview recordings
- [ ] Better AI avatar animations
- [ ] Resume/job description analysis
- [ ] Multi-language support

---

Made with ❤️ for interview practice
