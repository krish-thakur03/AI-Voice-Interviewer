import uuid
from typing import Dict

from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse

from services.resume import extract_text_from_pdf, score_resume_with_ai, score_resume_locally
from services.questions import generate_questions_ai, generate_questions_fallback

router = APIRouter(prefix="/api")

# ─── In-memory resume session store ─────────────────────────────────
resume_sessions: Dict[str, dict] = {}


@router.post("/upload-resume")
async def upload_resume(
    resume: UploadFile = File(...),
    job_requirements: str = Form(""),
):
    if not resume.filename.lower().endswith(".pdf"):
        return JSONResponse({"error": "Only PDF files are supported."}, status_code=400)

    content = await resume.read()
    try:
        resume_text = extract_text_from_pdf(content)
    except Exception:
        return JSONResponse({"error": "Failed to read PDF. Make sure it is a valid file."}, status_code=400)

    if not resume_text or len(resume_text.strip()) < 50:
        return JSONResponse(
            {"error": "Could not extract enough text from the resume. Is it a scanned image?"},
            status_code=400,
        )

    # Score resume (try AI first, fallback to keyword)
    ai_score = await score_resume_with_ai(resume_text, job_requirements)
    score = ai_score or score_resume_locally(resume_text, job_requirements)

    # Generate questions (try AI first, fallback to keyword)
    ai_questions = await generate_questions_ai(resume_text, job_requirements)
    questions = ai_questions or generate_questions_fallback(resume_text, job_requirements)

    session_id = str(uuid.uuid4())
    resume_sessions[session_id] = {
        "resume_text": resume_text,
        "job_requirements": job_requirements,
        "score": score,
        "questions": questions,
    }

    return {
        "session_id": session_id,
        "resume_score": score,
        "questions_count": len(questions),
        "resume_preview": (resume_text[:500] + "...") if len(resume_text) > 500 else resume_text,
    }


@router.get("/health")
async def health():
    return {"status": "ok"}
