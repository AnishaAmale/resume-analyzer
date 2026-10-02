"""
Resume information extractor: contact details, sections, skills, and bullet points.
"""
import re
from typing import Dict, List, Optional, Any


# Extensive dictionary of recognized industry skills
SKILL_TAXONOMY = {
    "languages": [
        "python", "javascript", "typescript", "java", "c++", "c#", "c", "golang", "go",
        "rust", "ruby", "php", "swift", "kotlin", "dart", "r", "scala", "sql", "bash",
        "shell", "powershell", "html", "html5", "css", "css3", "sass", "scss"
    ],
    "frameworks": [
        "react", "react.js", "react native", "next.js", "angular", "vue", "vue.js",
        "svelte", "node.js", "nodejs", "express", "express.js", "nestjs", "fastapi",
        "flask", "django", "spring", "spring boot", "asp.net", "dotnet", ".net core",
        "laravel", "ruby on rails", "rails", "tailwind", "tailwind css", "bootstrap",
        "redux", "zustand", "graphql", "rest api", "grpc", "jquery"
    ],
    "cloud_devops": [
        "aws", "amazon web services", "azure", "microsoft azure", "gcp", "google cloud",
        "docker", "kubernetes", "k8s", "terraform", "ansible", "ci/cd", "jenkins",
        "github actions", "gitlab ci", "linux", "ubuntu", "nginx", "helm",
        "prometheus", "grafana", "datadog", "cloudformation", "serverless", "microservices"
    ],
    "databases": [
        "postgresql", "postgres", "mysql", "sqlite", "mongodb", "redis", "cassandra",
        "dynamodb", "elasticsearch", "firebase", "supabase", "oracle", "snowflake",
        "bigquery", "mariadb", "neo4j", "prisma", "hibernate", "sqlalchemy"
    ],
    "ai_data": [
        "machine learning", "deep learning", "artificial intelligence", "pytorch",
        "tensorflow", "keras", "scikit-learn", "sklearn", "pandas", "numpy", "scipy",
        "nlp", "natural language processing", "computer vision", "opencv", "llm",
        "large language models", "generative ai", "langchain", "rag", "hugging face",
        "tableau", "power bi", "apache spark", "spark", "kafka", "hadoop", "etl",
        "data modeling", "data pipelines", "matplotlib", "seaborn"
    ],
    "tools": [
        "git", "github", "gitlab", "bitbucket", "jira", "confluence", "postman",
        "swagger", "figma", "vs code", "visual studio", "docker desktop", "trello",
        "slack", "notion", "vite", "webpack"
    ],
    "soft_skills": [
        "leadership", "communication", "problem solving", "critical thinking",
        "time management", "agile", "scrum", "kanban", "collaboration", "teamwork",
        "mentorship", "adaptability", "project management", "stakeholder management",
        "cross-functional", "analytical thinking", "decision making", "presentation skills"
    ]
}

# Reverse lookup dictionary: skill token -> category
SKILL_TO_CATEGORY = {}
ALL_SKILLS_SET = set()
for cat, skills in SKILL_TAXONOMY.items():
    for s in skills:
        SKILL_TO_CATEGORY[s.lower()] = cat
        ALL_SKILLS_SET.add(s.lower())


def extract_contact_info(text: str) -> Dict[str, Optional[str]]:
    """Extract contact information: email, phone, links, and candidate name."""
    info: Dict[str, Optional[str]] = {
        "name": None,
        "email": None,
        "phone": None,
        "linkedin": None,
        "github": None,
        "portfolio": None
    }
    
    # Email regex
    email_pattern = r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+"
    emails = re.findall(email_pattern, text)
    if emails:
        info["email"] = emails[0]
        
    # Phone regex (international & US formats)
    phone_pattern = r"(?:(?:\+?\d{1,3}[\s-]?)?\(?\d{2,4}\)?[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}(?:[\s.-]?\d{1,4})?"
    lines = text.split("\n")[:10]  # Search top lines first
    header_block = " ".join(lines)
    
    # More strict phone matching
    phones = re.findall(r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", header_block)
    if not phones:
        # Fallback to broader 10-12 digit sequence
        phones = re.findall(r"(?:\+91[-.\s]?)?[6-9]\d{9}", header_block)
    if phones:
        info["phone"] = phones[0]
        
    # LinkedIn
    linkedin_match = re.search(r"(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|profile)\/([a-zA-Z0-9_-]+)", text, re.IGNORECASE)
    if linkedin_match:
        info["linkedin"] = f"https://linkedin.com/in/{linkedin_match.group(1)}"
        
    # GitHub
    github_match = re.search(r"(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)", text, re.IGNORECASE)
    if github_match:
        info["github"] = f"https://github.com/{github_match.group(1)}"
        
    # Portfolio / personal website
    portfolio_match = re.search(r"(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:dev|io|me|tech|app|com|org))", text, re.IGNORECASE)
    if portfolio_match:
        url_domain = portfolio_match.group(0).lower()
        if "linkedin" not in url_domain and "github" not in url_domain and "google" not in url_domain:
            info["portfolio"] = portfolio_match.group(0)

    # Name heuristic: inspect first 3 non-empty lines
    for line in lines:
        cleaned = line.strip()
        if not cleaned:
            continue
        # Skip if contains common resume headings
        lower_line = cleaned.lower()
        if any(h in lower_line for h in ["resume", "curriculum vitae", "cv", "page", "phone", "email", "summary"]):
            continue
        # Check if line looks like a person's name (2-4 words, alphabet only, no email/phone)
        words = cleaned.split()
        if 1 <= len(words) <= 4 and all(re.match(r"^[a-zA-Z.'-]+$", w) for w in words):
            if "@" not in cleaned and not any(char.isdigit() for char in cleaned):
                info["name"] = cleaned
                break

    return info


def extract_sections(text: str) -> Dict[str, str]:
    """Segment resume text into standard ATS sections."""
    section_patterns = {
        "summary": r"(?:summary|professional summary|objective|career objective|about me|profile)",
        "experience": r"(?:work experience|professional experience|experience|employment history|work history)",
        "education": r"(?:education|academic background|academics|qualifications)",
        "skills": r"(?:skills|technical skills|core competencies|technologies|tools & technologies|expertise)",
        "projects": r"(?:projects|key projects|personal projects|academic projects)",
        "certifications": r"(?:certifications|certificates|licenses|awards|achievements)"
    }
    
    # Find positions of all detected headers
    found_headers = []
    lines = text.split("\n")
    
    for i, line in enumerate(lines):
        line_clean = line.strip().lower()
        # Header is usually short (under 40 chars)
        if len(line_clean) > 45 or not line_clean:
            continue
            
        for sec_name, pattern in section_patterns.items():
            if re.fullmatch(pattern, line_clean) or re.fullmatch(rf"{pattern}\s*:", line_clean):
                found_headers.append((i, sec_name, line))
                break
                
    # Sort by line index
    found_headers.sort(key=lambda x: x[0])
    
    sections: Dict[str, str] = {
        "summary": "",
        "experience": "",
        "education": "",
        "skills": "",
        "projects": "",
        "certifications": "",
        "other": ""
    }
    
    if not found_headers:
        # If no explicit headings found, treat whole text as experience / unsegmented
        sections["other"] = text
        return sections
        
    for idx, (line_num, sec_name, _) in enumerate(found_headers):
        start_line = line_num + 1
        end_line = found_headers[idx + 1][0] if idx + 1 < len(found_headers) else len(lines)
        section_content = "\n".join(lines[start_line:end_line]).strip()
        sections[sec_name] = section_content
        
    return sections


def extract_skills(text: str) -> Dict[str, List[str]]:
    """Extract and categorize skills found within the provided text."""
    text_lower = " " + text.lower() + " "
    
    found_by_category: Dict[str, List[str]] = {
        "languages": [],
        "frameworks": [],
        "cloud_devops": [],
        "databases": [],
        "ai_data": [],
        "tools": [],
        "soft_skills": []
    }
    
    found_all_lower = set()
    
    # Sort skills by length descending to match multi-word skills first (e.g. 'react native' before 'react')
    sorted_skills = sorted(ALL_SKILLS_SET, key=len, reverse=True)
    
    for skill in sorted_skills:
        # Handle special characters in skill names like c++, c#, .net
        escaped_skill = re.escape(skill)
        
        # Word boundary matching (with special consideration for c++, .net, c#)
        if skill in ["c++", "c#", ".net", "react.js", "node.js", "vue.js", "next.js"]:
            pattern = rf"(?:^|[\s,;/|•\(\)])({escaped_skill})(?:$|[\s,;/|•\(\)])"
        else:
            pattern = rf"\b{escaped_skill}\b"
            
        if re.search(pattern, text_lower):
            category = SKILL_TO_CATEGORY.get(skill, "tools")
            
            # Format display name
            display_name = skill.title()
            # Canonical casing exceptions
            casing_map = {
                "typescript": "TypeScript", "javascript": "JavaScript",
                "c++": "C++", "c#": "C#", "sql": "SQL", "aws": "AWS", "gcp": "GCP",
                "ci/cd": "CI/CD", "k8s": "Kubernetes", "nlp": "NLP", "llm": "LLM",
                "rag": "RAG", "html": "HTML", "html5": "HTML5", "css": "CSS",
                "css3": "CSS3", "rest api": "REST API", "graphql": "GraphQL",
                "node.js": "Node.js", "nodejs": "Node.js", "react.js": "React",
                "react": "React", "next.js": "Next.js", "vue.js": "Vue.js",
                "fastapi": "FastAPI", "mongodb": "MongoDB", "postgresql": "PostgreSQL",
                "mysql": "MySQL", "sqlite": "SQLite", "redis": "Redis", "git": "Git",
                "github": "GitHub", "gitlab": "GitLab", "jira": "Jira", "figma": "Figma",
                "pytorch": "PyTorch", "tensorflow": "TensorFlow", "scikit-learn": "Scikit-Learn",
                "power bi": "Power BI", "docker": "Docker", "tailwind": "Tailwind CSS",
                "tailwind css": "Tailwind CSS", "github actions": "GitHub Actions",
                "gitlab ci": "GitLab CI"
            }
            display_name = casing_map.get(skill, display_name)
            
            # Prevent duplicate variations (e.g. nodejs and node.js)
            if display_name.lower() not in found_all_lower:
                found_all_lower.add(display_name.lower())
                found_by_category[category].append(display_name)
                
    return found_by_category


def extract_bullet_points(text: str) -> List[str]:
    """Extract individual bullet points or discrete achievement statements."""
    bullets = []
    lines = text.split("\n")
    
    current_bullet = []
    for line in lines:
        stripped = line.strip()
        if not stripped:
            if current_bullet:
                bullets.append(" ".join(current_bullet))
                current_bullet = []
            continue
            
        # Check if line starts with bullet marker
        is_bullet_start = bool(re.match(r"^(?:•|-|\*|\d+\.|\u2022|\u25CF|\u2013)\s+", stripped))
        
        if is_bullet_start:
            if current_bullet:
                bullets.append(" ".join(current_bullet))
            clean_line = re.sub(r"^(?:•|-|\*|\d+\.|\u2022|\u25CF|\u2013)\s*", "", stripped)
            current_bullet = [clean_line]
        elif current_bullet:
            # Continuation of previous bullet
            current_bullet.append(stripped)
        elif len(stripped) > 40 and not stripped.endswith(":"):
            # Substantial line that could be a standalone bullet statement
            bullets.append(stripped)
            
    if current_bullet:
        bullets.append(" ".join(current_bullet))
        
    # Filter out empty or trivially short lines (headers, dates)
    valid_bullets = [b for b in bullets if len(b.split()) >= 4 and len(b) >= 20]
    return valid_bullets
