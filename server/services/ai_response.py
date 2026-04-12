import random
from typing import List

import httpx

from config import GEMINI_API_KEY, GEMINI_URL


# ─── AI interviewer response ─────────────────────────────────────────
async def get_ai_response(
    user_message: str,
    conversation_history: List[dict],
    current_questions: List[str],
    question_index: int,
    resume_text: str = "",
) -> str:
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
        return get_fallback_response(user_message, current_questions, question_index)

    next_question = current_questions[question_index] if question_index < len(current_questions) else None
    is_last = question_index >= len(current_questions)

    if is_last:
        prompt = (
            "You are an AI interviewer. The candidate answered the final question.\n"
            f'Their answer: "{user_message}"\n\n'
            "Thank them warmly and give a brief encouraging closing remark (2 sentences max)."
        )
    else:
        recent = "\n".join(f"{m['role']}: {m['content']}" for m in conversation_history[-4:])
        prompt = (
            "You are an AI technical interviewer conducting a resume-based interview.\n"
            "Be friendly but professional. Keep responses concise (2-3 sentences max).\n\n"
            f"Resume context: {resume_text[:600]}\n\n"
            f"Recent conversation:\n{recent}\n\n"
            f'Candidate just said: "{user_message}"\n\n'
            f'Next question you MUST ask: "{next_question}"\n\n'
            "Briefly acknowledge their answer (1 sentence), then ask the next question naturally."
        )

    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.post(
                GEMINI_URL,
                params={"key": GEMINI_API_KEY},
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"temperature": 0.7, "maxOutputTokens": 250},
                },
            )
        data = resp.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        print(f"Gemini API error: {e}")
        return get_fallback_response(user_message, current_questions, question_index)


# ─── Fallback response ───────────────────────────────────────────────
def get_fallback_response(
    user_message: str, current_questions: List[str], question_index: int
) -> str:
    acks = [
        "That's a great answer! ",
        "Interesting perspective. ",
        "Thank you for sharing that. ",
        "Good point! ",
        "I appreciate your response. ",
        "Nice explanation! ",
        "That shows good understanding. ",
    ]
    ack = random.choice(acks)
    if question_index < len(current_questions):
        return ack + current_questions[question_index]
    return (
        "Thank you for your time! That concludes our interview. "
        "You did great! We covered a lot of important topics today."
    )
