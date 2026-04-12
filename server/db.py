import ssl
import certifi
from pymongo import MongoClient
from config import MONGO_URI

# ─── MongoDB Connection ─────────────────────────────────────────────
mongo_client = MongoClient(
    MONGO_URI,
    serverSelectionTimeoutMS=5000,
    tls=True,
    tlsCAFile=certifi.where(),
    tlsAllowInvalidCertificates=True,
)
db = mongo_client["ai_voice_interviewer"]

# Verify connection
try:
    mongo_client.admin.command("ping")
    print("✅ MongoDB connected successfully!")
except Exception as e:
    print(f"❌ MongoDB connection failed: {e}")

# ─── Collections ─────────────────────────────────────────────────────
users_col            = db["users"]
job_requirements_col = db["job_requirements"]
resume_text_col      = db["resume_text"]
scores_col           = db["scores"]
interview_answers_col = db["interview_answers"]


# ─── Generic CRUD helpers ────────────────────────────────────────────
def insert(collection, data: dict):
    return collection.insert_one(data)

def find_one(collection, query: dict):
    return collection.find_one(query)

def find_many(collection, query: dict = None, limit: int = 0):
    return list(collection.find(query or {}).limit(limit))

def update(collection, query: dict, data: dict):
    return collection.update_one(query, {"$set": data})

def delete(collection, query: dict):
    return collection.delete_one(query)


# ─── Convenience wrappers per collection ─────────────────────────────
# Users
def create_user(data: dict):       return insert(users_col, data)
def get_user(query: dict):         return find_one(users_col, query)
def update_user(q, data):          return update(users_col, q, data)
def delete_user(q):                return delete(users_col, q)

# Job requirements
def create_job_requirement(data):  return insert(job_requirements_col, data)
def get_job_requirement(q):        return find_one(job_requirements_col, q)
def update_job_requirement(q, d):  return update(job_requirements_col, q, d)
def delete_job_requirement(q):     return delete(job_requirements_col, q)

# Resume text
def create_resume_text(data):      return insert(resume_text_col, data)
def get_resume_text(q):            return find_one(resume_text_col, q)
def update_resume_text(q, d):      return update(resume_text_col, q, d)
def delete_resume_text(q):         return delete(resume_text_col, q)

# Scores
def create_score(data):            return insert(scores_col, data)
def get_score(q):                  return find_one(scores_col, q)
def update_score(q, d):            return update(scores_col, q, d)
def delete_score(q):               return delete(scores_col, q)

# Interview answers
def create_interview_answer(data): return insert(interview_answers_col, data)
def get_interview_answer(q):       return find_one(interview_answers_col, q)
def update_interview_answer(q, d): return update(interview_answers_col, q, d)
def delete_interview_answer(q):    return delete(interview_answers_col, q)
