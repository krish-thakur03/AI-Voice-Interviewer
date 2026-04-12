import re
import json
from typing import Optional

import httpx

from config import GEMINI_API_KEY, GEMINI_URL


# ─── AI answer evaluation ────────────────────────────────────────────
async def evaluate_answer_ai(
    question: str, answer: str, resume_text: str, job_requirements: str
) -> Optional[dict]:
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
        return None

    prompt = (
        "You are evaluating a job interview answer. Score it 1-10 and give brief feedback.\n"
        "Consider: relevance, depth, accuracy, alignment with resume claims.\n"
        "Return ONLY valid JSON (no markdown):\n"
        '{"score": 7, "feedback": "Brief feedback here"}\n\n'
        f"Question: {question}\n"
        f"Answer: {answer}\n"
        f"Resume excerpt: {resume_text[:800]}\n"
        f"Job requirements: {job_requirements[:400]}"
    )

    try:
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(
                GEMINI_URL,
                params={"key": GEMINI_API_KEY},
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"temperature": 0.3, "maxOutputTokens": 200},
                },
            )
        text = resp.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
        text = re.sub(r"```\w*\n?", "", text).strip()
        return json.loads(text)
    except Exception as e:
        print(f"Answer evaluation error: {e}")
        return None


# ─── Fallback answer evaluation ──────────────────────────────────────
def evaluate_answer_fallback(answer: str) -> dict:
    words = len(answer.split())
    if words > 50:
        return {"score": 8, "feedback": "Detailed and comprehensive answer."}
    if words > 25:
        return {"score": 6, "feedback": "Decent answer. Adding more detail would strengthen it."}
    if words > 10:
        return {"score": 4, "feedback": "Try to elaborate more with specific examples."}
    return {"score": 2, "feedback": "Answer was too brief. Provide more detail."}


# ─── Final feedback ──────────────────────────────────────────────────
def generate_final_feedback(
    history: list,
    evaluations: list,
    resume_score: dict,
) -> dict:
    candidate_answers = [m for m in history if m["role"] == "candidate"]
    questions_asked = len([m for m in history if m["role"] == "interviewer"])
    avg_words = 0
    if candidate_answers:
        avg_words = sum(len(m["content"].split()) for m in candidate_answers) / len(candidate_answers)

    if evaluations:
        interview_score = round(sum(e.get("score", 5) for e in evaluations) / len(evaluations) * 10)
    else:
        if avg_words > 50:
            interview_score = 80
        elif avg_words > 25:
            interview_score = 60
        else:
            interview_score = 40

    resume_match = resume_score.get("overall_score", 50)
    final_score = round(resume_match * 0.3 + interview_score * 0.7)

    if final_score >= 80:
        verdict = "Excellent! Strong resume match and impressive interview performance."
    elif final_score >= 60:
        verdict = "Good performance. Some areas to strengthen, but a solid showing overall."
    elif final_score >= 40:
        verdict = "Fair performance. Focus on the missing skills and practice elaborating your answers."
    else:
        verdict = "Needs improvement. Work on bridging skill gaps and practice giving detailed, structured answers."

    return {
        "resumeScore": resume_match,
        "interviewScore": interview_score,
        "finalScore": final_score,
        "totalQuestions": questions_asked,
        "responsesGiven": len(candidate_answers),
        "averageResponseLength": round(avg_words),
        "answerEvaluations": evaluations,
        "verdict": verdict,
        "resumeAnalysis": resume_score,
    }
