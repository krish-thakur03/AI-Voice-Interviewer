import re
import json
import random
from typing import List, Optional

import httpx

from config import GEMINI_API_KEY, GEMINI_URL
from services.skills import extract_skills


# ─── AI question generation ──────────────────────────────────────────
async def generate_questions_ai(
    resume_text: str, job_requirements: str, num: int = 8
) -> Optional[List[str]]:
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_gemini_api_key_here":
        return None

    prompt = (
        f"You are a senior technical interviewer. Generate exactly {num} interview questions "
        "tailored to this candidate's resume and the job they are applying for.\n\n"
        "Rules:\n"
        "1. First question: ask them to introduce themselves and walk through their resume.\n"
        "2. Next questions: ask about specific projects, skills, and experience in the resume.\n"
        "3. Include questions matching the job requirements.\n"
        "4. Ask at least one behavioural / situational question.\n"
        "5. Last question: ask if they have any questions about the role.\n"
        "6. Return ONLY a JSON array of question strings, no markdown fences.\n\n"
        f"RESUME:\n{resume_text[:3000]}\n\n"
        f"JOB REQUIREMENTS:\n{job_requirements[:1500]}"
    )

    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                GEMINI_URL,
                params={"key": GEMINI_API_KEY},
                json={
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"temperature": 0.7, "maxOutputTokens": 1200},
                },
            )
        text = resp.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
        text = re.sub(r"```\w*\n?", "", text).strip()
        questions = json.loads(text)
        if isinstance(questions, list) and questions:
            return questions[:num]
    except Exception as e:
        print(f"AI question generation error: {e}")
    return None


# ─── Fallback question generation ────────────────────────────────────
def generate_questions_fallback(
    resume_text: str, job_requirements: str, num: int = 8
) -> List[str]:
    skills = extract_skills(resume_text) + extract_skills(job_requirements)
    unique_skills = list(dict.fromkeys(skills))

    skill_q = {
        "python": "Describe your experience with Python and the projects you've built with it.",
        "javascript": "Tell me about your JavaScript experience. What frameworks have you used?",
        "typescript": "How has TypeScript improved your development workflow?",
        "react": "Walk me through a React project you've built. What challenges did you face?",
        "angular": "Describe your experience building Angular applications.",
        "vue": "Tell me about a project you developed with Vue.js.",
        "node.js": "How have you used Node.js for backend development?",
        "express": "Describe an API you built with Express.",
        "django": "What projects have you built with Django?",
        "flask": "Tell me about your Flask development experience.",
        "fastapi": "How have you used FastAPI in your projects?",
        "mongodb": "Explain your data modelling approach with MongoDB.",
        "postgresql": "Describe your experience with PostgreSQL and complex queries.",
        "mysql": "Tell me about your MySQL experience.",
        "sql": "Walk me through a complex SQL query you've written.",
        "docker": "How do you use Docker in your development or deployment workflow?",
        "kubernetes": "Describe your experience with Kubernetes.",
        "aws": "Which AWS services have you worked with and how?",
        "azure": "Tell me about your experience with Azure cloud services.",
        "gcp": "How have you used Google Cloud Platform?",
        "machine learning": "Describe a machine learning project you've worked on.",
        "rest api": "Explain how you design and build REST APIs.",
        "graphql": "How have you used GraphQL in your projects?",
        "microservices": "Describe a microservices architecture you've worked with.",
        "git": "What's your Git branching strategy and code review process?",
        "ci/cd": "Explain your CI/CD pipeline setup.",
        "testing": "What's your approach to testing? Which frameworks do you use?",
        "data structures": "Explain a situation where your choice of data structure mattered.",
        "algorithms": "Describe an algorithmic challenge you solved.",
        "java": "Tell me about your Java experience and projects.",
        "c++": "Describe your experience with C++ development.",
        "data science": "Walk me through a data science project you've completed.",
        "deep learning": "Tell me about your deep learning experience.",
    }

    questions: List[str] = ["Tell me about yourself and walk me through your resume."]

    for skill in unique_skills:
        if len(questions) >= num - 1:
            break
        if skill in skill_q and skill_q[skill] not in questions:
            questions.append(skill_q[skill])

    generic = [
        "What's the most challenging technical problem you've solved?",
        "How do you approach debugging complex issues?",
        "Describe a project where you had to learn a new technology quickly.",
        "How do you ensure code quality in your projects?",
        "Tell me about a time you delivered a project under tight deadlines.",
        "How do you stay up to date with new technologies?",
        "Describe a situation where you had to collaborate with a difficult team member.",
        "What's your approach to system design and architecture?",
    ]
    random.shuffle(generic)
    for q in generic:
        if len(questions) >= num - 1:
            break
        questions.append(q)

    questions.append("Do you have any questions about the role or the company?")
    return questions[:num]
