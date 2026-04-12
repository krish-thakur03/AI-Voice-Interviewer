import socketio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import ALLOWED_ORIGINS, PORT
from routes.http import router as http_router
from routes.socket import register_socket_events

# ─── Import db to trigger connection log on startup ──────────────────
import db  # noqa: F401

# ─── FastAPI app ─────────────────────────────────────────────────────



app = FastAPI(title="AI Voice Interviewer API")

@app.get("/")
async def home():
    return {"message": "AI Voice Interview Backend is Running 🚀"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(http_router)

# ─── Socket.IO ───────────────────────────────────────────────────────
sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins=ALLOWED_ORIGINS,
)
register_socket_events(sio)

asgi_app = socketio.ASGIApp(sio, other_asgi_app=app)

# ─── Entry point ─────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:asgi_app", host="0.0.0.0", port=PORT, reload=True)
