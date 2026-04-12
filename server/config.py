import os
from dotenv import load_dotenv

load_dotenv()

# ─── Server ──────────────────────────────────────────────────────────
PORT = int(os.getenv("PORT", "5000"))

# ─── CORS ────────────────────────────────────────────────────────────
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:5000",
    os.getenv("CLIENT_URL"),
]
ALLOWED_ORIGINS = [origin for origin in ALLOWED_ORIGINS if origin]

# ─── MongoDB ─────────────────────────────────────────────────────────
MONGO_URI = os.getenv("MONGO_URI")

# ─── Gemini AI ───────────────────────────────────────────────────────
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent"
