import io
import re
import json
from typing import List, Optional

import httpx
import pdfplumber

from config import GEMINI_API_KEY, GEMINI_URL
from services.skills import COMMON_SKILLS, extract_skills


# ─── PDF parsing ─────────────────────────────────────────────────────
def extract_text_from_pdf(content: bytes) -> str:
    text = ""
    with pdfplumber.open(io.BytesIO(content)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text.strip()


# ─── Resume scoring (keyword) ───────────────────────────────────────
def score_resume_locally(resume_text: str, job_requirements: str) -> dict:
    resume_skills = extract_skills(resume_text)
    job_skills = extract_skills(job_requirements)

    if not job_skills:
        job_words = set(re.findall(r"\b[a-z]{3,}\b", job_requirements.lower()))
        resume_words = set(re.findall(r"\b[a-z]{3,}\b", resume_text.lower()))
        overlap = job_words & resume_words
        score = int(len(overlap) / max(len(job_words), 1) * 100)
        return {
            "overall_score": min(score, 100),
            "matched_skills": sorted(overlap)[:20],
            "missing_skills": [],
            "additional_skills": resume_skills,
            "summary": "Basic matching was used. Add more specific skills in job requirements for better analysis.",
        }

    matched = [s for s in job_skills if s in resume_skills]
    missing = [s for s in job_skills if s not in resume_skills]
    extra   = [s for s in resume_skills if s not in job_skills]
    score   = int(len(matched) / len(job_skills) * 100)

    return {
        "overall_score": min(score, 100),
        "matched_skills": matched,
        "missing_skills": missing,
        "additional_skills": extra,
        "summary": f"Your resume matches {len(matched)} of {len(job_skills)} required skills.",
    }


# ─── Resume scoring (AI / Gemini) ───────────────────────────────────
async def score_resume_with_ai(resume_text: str, job_requirements: str) -> Optional[dict]:
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
        return None

    prompt = (
        "Analyse this resume against the job requirements. "
        "Return ONLY valid JSON (no markdown fences) with these keys:\n"
        '  "overall_score": number 0-100,\n'
        '  "matched_skills": [array of matched skill strings],\n'
        '  "missing_skills": [array of missing skill strings],\n'
        '  "additional_skills": [array of bonus skill strings],\n'
        '  "summary": "2-3 sentence analysis"\n\n'
        f"RESUME:\n{resume_text[:3000]}\n\n"
        f"JOB REQUIREMENTS:\n{job_requirements[:1500]}"
    )

    try:
        async with httpx.AsyncClient(timeout=25) as client:
            resp = await client.post(
                GEMINI_URL,
                params={"key": GEMINI_API_KEY},
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"temperature": 0.3, "maxOutputTokens": 800},
                },
            )
        text = resp.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
        text = re.sub(r"```\w*\n?", "", text).strip()
        return json.loads(text)
    except Exception as e:
        print(f"AI resume scoring error: {e}")
        return None
