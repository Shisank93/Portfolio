import logging
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any, Optional
from app.schemas import ProjectSchema, BlogSchema, ContactMessageSchema, ChatRequest, ChatResponse
from app.api.mock_data import PROJECTS, BLOGS, RESUME
from app.services.ai_service import AIService

logger = logging.getLogger("project-aether-backend.endpoints")
router = APIRouter()

# Instantiate AI Service
ai_service = AIService()

def get_knowledge_base_md() -> str:
    """
    Serializes the entire mock_data portfolio into a unified Markdown string
    to feed directly into the Gemini model context window.
    """
    md = []
    
    # 1. Biography / About
    md.append("# SHISANK PROFILE & IDENTITY")
    md.append(f"Title: {RESUME['about']['title']}")
    md.append(f"Summary: {RESUME['summary']}")
    md.append(f"Vision: {RESUME['about']['vision']}")
    md.append("\n## Education")
    md.append(f"- Institution: {RESUME['education']['institution']}")
    md.append(f"- Degree: {RESUME['education']['degree']}")
    md.append(f"- Specialization: {RESUME['education']['specialization']}")
    md.append(f"- Graduation: {RESUME['education']['graduation']}")
    md.append(f"- Location: {RESUME['education']['location']}")
    md.append("- Core Coursework: " + ", ".join(RESUME["education"]["coursework"]))
    
    # 2. Skills
    md.append("\n# TECHNICAL SKILLS")
    for category, skills in RESUME["skills"].items():
        md.append(f"## {category}")
        md.append(", ".join(skills))
        
    # 3. Engineering Philosophy
    md.append("\n# ENGINEERING PHILOSOPHY")
    for phil in RESUME["about"]["philosophy"]:
        md.append(f"- {phil}")
        
    # 4. Learning Journey / Timeline
    md.append("\n# LEARNING TIMELINE")
    for milestone in RESUME["timeline"]:
        md.append(f"- {milestone['year']}: {milestone['event']}")
        
    # 5. Projects
    md.append("\n# PROJECTS & ENGINEERING LAB")
    for p in PROJECTS:
        md.append(f"## Project: {p['title']}")
        md.append(f"- Slug: {p['slug']}")
        md.append(f"- Category: {p['category']}")
        md.append(f"- Status: {p['status']}")
        md.append(f"- Difficulty: {p['difficulty']}")
        md.append(f"- Build Time: {p['build_time']}")
        md.append(f"- Tech Stack: {', '.join(p['tech_stack'])}")
        md.append(f"- Description: {p['description']}")
        md.append(f"- Overview: {p['overview']}")
        md.append(f"- Problem Statement: {p['problem']}")
        md.append(f"- Solution: {p['solution']}")
        md.append(f"- Architecture: {p['architecture_description']}")
        
        md.append("\n### Project Metrics:")
        for m in p["metrics"]:
            md.append(f"  - {m['label']}: {m['value']} ({m.get('description', '')})")
            
        md.append("\n### Project Challenges & Solutions:")
        for c in p["challenges"]:
            md.append(f"  - Challenge: {c['challenge']}")
            md.append(f"    Solution: {c['solution']}")
            
    # 6. Blogs
    md.append("\n# BLOG ARTICLES & TECHNICAL WRITING")
    for b in BLOGS:
        md.append(f"## Article: {b['title']}")
        md.append(f"- Slug: {b['slug']}")
        md.append(f"- Summary: {b['summary']}")
        md.append(f"- Category: {b['category']}")
        md.append(f"- Reading Time: {b['reading_time']}")
        md.append(f"- Date: {b['published_date']}")
        md.append(f"- Content:\n{b['content']}")
        
    # 7. FAQs
    md.append("\n# FREQUENTLY ASKED QUESTIONS")
    for faq in RESUME["about"]["faqs"]:
        md.append(f"## Q: {faq['question']}")
        md.append(f"A: {faq['answer']}")
        
    return "\n".join(md)


@router.get("/projects", response_model=List[Dict[str, Any]])
def get_projects(category: Optional[str] = None):
    if category:
        filtered = [p for p in PROJECTS if p["category"].lower() == category.lower()]
        return filtered
    return PROJECTS

@router.get("/projects/{slug}", response_model=Dict[str, Any])
def get_project_by_slug(slug: str):
    for p in PROJECTS:
        if p["slug"] == slug:
            return p
    raise HTTPException(status_code=404, detail=f"Project with slug '{slug}' not found.")

@router.get("/blogs", response_model=List[Dict[str, Any]])
def get_blogs(category: Optional[str] = None):
    if category:
        filtered = [b for b in BLOGS if b["category"].lower() == category.lower()]
        return filtered
    return BLOGS

@router.get("/blogs/{slug}", response_model=Dict[str, Any])
def get_blog_by_slug(slug: str):
    for b in BLOGS:
        if b["slug"] == slug:
            return b
    raise HTTPException(status_code=404, detail=f"Blog article with slug '{slug}' not found.")

@router.get("/skills")
def get_skills():
    return RESUME["skills"]

@router.get("/timeline")
def get_timeline():
    return RESUME["timeline"]

@router.get("/resume")
def get_resume():
    return RESUME

@router.post("/contact")
def create_contact_message(message: ContactMessageSchema):
    # Logs message for backend observation
    logger.info(f"New contact message from {message.name} ({message.email}) on subject: '{message.subject}'")
    logger.info(f"Message Content: {message.message}")
    
    # Return success confirmation
    return {
        "status": "success",
        "message": "Thank you for getting in touch. Shisank will review your inquiry and respond within 24-48 hours.",
        "details": {
            "name": message.name,
            "email": message.email,
            "subject": message.subject
        }
    }

@router.post("/search")
def search_portfolio(payload: Dict[str, str]):
    query = payload.get("query", "").lower().strip()
    if not query:
        return {"projects": [], "blogs": [], "skills": []}
        
    matched_projects = []
    for p in PROJECTS:
        if (query in p["title"].lower() or 
            query in p["description"].lower() or 
            query in p["category"].lower() or 
            any(query in t.lower() for t in p["tech_stack"])):
            matched_projects.append({
                "title": p["title"],
                "slug": p["slug"],
                "category": p["category"],
                "description": p["description"]
            })
            
    matched_blogs = []
    for b in BLOGS:
        if (query in b["title"].lower() or 
            query in b["summary"].lower() or 
            query in b["category"].lower() or 
            any(query in t.lower() for t in b["tags"])):
            matched_blogs.append({
                "title": b["title"],
                "slug": b["slug"],
                "category": b["category"],
                "summary": b["summary"]
            })
            
    matched_skills = []
    for category, skills in RESUME["skills"].items():
        for skill in skills:
            if query in skill.lower() or query in category.lower():
                matched_skills.append({"name": skill, "category": category})
                
    return {
        "projects": matched_projects,
        "blogs": matched_blogs,
        "skills": matched_skills
    }

@router.post("/ai/chat", response_model=ChatResponse)
def chat_with_aether_ai(request: ChatRequest):
    logger.info(f"Received chat message: '{request.message}'")
    
    # 1. Compile full portfolio knowledge base markdown representation
    knowledge_base_md = get_knowledge_base_md()
    
    # 2. Invoke AI Service
    response_data = ai_service.generate_response(
        message=request.message,
        history=request.history,
        knowledge_base_md=knowledge_base_md,
        current_page=request.current_page,
        user_api_key=request.api_key
    )
    
    return ChatResponse(
        response=response_data["response"],
        suggested_questions=response_data["suggested_questions"],
        actions=response_data["actions"]
    )
