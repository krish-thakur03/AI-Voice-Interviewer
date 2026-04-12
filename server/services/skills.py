# ─── Skill catalogue for keyword matching ────────────────────────────
from typing import List

COMMON_SKILLS = [
    "python", "javascript", "typescript", "java", "c++", "c#", "c",
    "ruby", "go", "rust", "swift", "kotlin", "php", "scala",
    "react", "angular", "vue", "next.js", "nuxt", "svelte",
    "node.js", "express", "django", "flask", "fastapi", "spring boot", "spring",
    "laravel", ".net", "rails",
    "html", "css", "tailwind", "bootstrap", "sass", "less",
    "mongodb", "postgresql", "mysql", "sqlite", "redis",
    "elasticsearch", "firebase", "dynamodb", "cassandra",
    "aws", "azure", "gcp", "heroku", "vercel", "netlify",
    "docker", "kubernetes", "terraform", "ansible",
    "git", "github", "gitlab", "bitbucket",
    "ci/cd", "jenkins", "github actions", "gitlab ci",
    "rest api", "graphql", "websocket", "grpc", "microservices",
    "machine learning", "deep learning", "nlp", "computer vision",
    "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy",
    "sql", "nosql", "data structures", "algorithms",
    "agile", "scrum", "jira", "linux", "nginx", "apache",
    "figma", "ui/ux", "responsive design",
    "testing", "jest", "pytest", "selenium", "cypress",
    "oauth", "jwt", "authentication", "authorization",
    "data analysis", "data science", "big data", "spark", "hadoop",
]


def extract_skills(text: str) -> List[str]:
    text_lower = text.lower()
    return sorted(set(skill for skill in COMMON_SKILLS if skill in text_lower))
