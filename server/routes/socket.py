from typing import Dict

import socketio

from services.questions import generate_questions_fallback
from services.evaluation import evaluate_answer_ai, evaluate_answer_fallback, generate_final_feedback
from services.ai_response import get_ai_response
from routes.http import resume_sessions


# ─── In-memory session state store ───────────────────────────────────
session_state: Dict[str, dict] = {}


def register_socket_events(sio: socketio.AsyncServer):
    """Attach all Socket.IO event handlers to the given server."""

    @sio.event
    async def connect(sid, environ):
        print(f"User connected: {sid}")
        session_state[sid] = {
            "conversation_history": [],
            "current_questions": [],
            "question_index": 0,
            "resume_text": "",
            "job_requirements": "",
            "resume_score": {},
            "answer_evaluations": [],
        }

    @sio.event
    async def disconnect(sid):
        print(f"User disconnected: {sid}")
        session_state.pop(sid, None)

    @sio.on("start_interview")
    async def start_interview(sid, data):
        state = session_state.get(sid)
        if state is None:
            return

        resume_session_id = (data or {}).get("session_id")
        resume_data = resume_sessions.get(resume_session_id) if resume_session_id else None

        if resume_data:
            state["current_questions"] = resume_data["questions"]
            state["resume_text"] = resume_data["resume_text"]
            state["job_requirements"] = resume_data["job_requirements"]
            state["resume_score"] = resume_data["score"]
        else:
            state["current_questions"] = generate_questions_fallback("", "", 8)
            state["resume_text"] = ""
            state["job_requirements"] = ""
            state["resume_score"] = {}

        state["conversation_history"] = []
        state["question_index"] = 0
        state["answer_evaluations"] = []

        questions = state["current_questions"]
        first_q = questions[0] if questions else "Tell me about yourself."
        greeting = (
            "Hello! I'm your AI interviewer today. I've reviewed your resume and "
            "prepared questions specifically for you. Let's begin! " + first_q
        )

        state["question_index"] = 1
        state["conversation_history"].append({"role": "interviewer", "content": greeting})

        await sio.emit("interview_started", {"totalQuestions": len(questions)}, to=sid)
        await sio.emit(
            "ai_response",
            {"message": greeting, "questionNumber": 1, "totalQuestions": len(questions)},
            to=sid,
        )

    @sio.on("user_message")
    async def user_message(sid, data):
        state = session_state.get(sid)
        if state is None:
            return

        message = (data or {}).get("message", "").strip()
        if not message:
            return

        state["conversation_history"].append({"role": "candidate", "content": message})

        # Evaluate the previous answer
        prev_idx = state["question_index"] - 1
        if 0 <= prev_idx < len(state["current_questions"]):
            prev_question = state["current_questions"][prev_idx]
            evaluation = await evaluate_answer_ai(
                prev_question, message, state["resume_text"], state["job_requirements"]
            )
            if evaluation is None:
                evaluation = evaluate_answer_fallback(message)
            evaluation["question"] = prev_question
            state["answer_evaluations"].append(evaluation)

        # Get next AI response
        ai_resp = await get_ai_response(
            message,
            state["conversation_history"],
            state["current_questions"],
            state["question_index"],
            state["resume_text"],
        )
        state["conversation_history"].append({"role": "interviewer", "content": ai_resp})
        state["question_index"] += 1

        total = len(state["current_questions"])
        await sio.emit(
            "ai_response",
            {
                "message": ai_resp,
                "questionNumber": min(state["question_index"], total),
                "totalQuestions": total,
            },
            to=sid,
        )

    @sio.on("end_interview")
    async def end_interview(sid):
        state = session_state.get(sid)
        if state is None:
            return

        feedback = generate_final_feedback(
            state["conversation_history"],
            state["answer_evaluations"],
            state["resume_score"],
        )
        await sio.emit("interview_feedback", feedback, to=sid)

        state["conversation_history"] = []
        state["current_questions"] = []
        state["question_index"] = 0
        state["answer_evaluations"] = []
