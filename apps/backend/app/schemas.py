from pydantic import BaseModel, Field, EmailStr
from typing import List, Dict, Optional, Any
from datetime import datetime

class TechnologyBadge(BaseModel):
    name: str
    category: str  # e.g., Language, Library, Tool, Cloud

class MetricItem(BaseModel):
    label: str
    value: str
    description: Optional[str] = None

class MilestoneItem(BaseModel):
    title: str
    date: str
    description: str

class ChallengeItem(BaseModel):
    challenge: str
    solution: str

class ProjectSchema(BaseModel):
    id: str
    title: str
    slug: str
    description: str
    category: str
    status: str
    difficulty: str
    build_time: str
    tech_stack: List[str]
    overview: str
    problem: str
    objectives: List[str]
    solution: str
    architecture_description: str
    metrics: List[MetricItem]
    journey: List[MilestoneItem]
    challenges: List[ChallengeItem]
    code_repo_url: Optional[str] = None
    demo_url: Optional[str] = None
    related_project_ids: List[str] = Field(default_factory=list)

class BlogSchema(BaseModel):
    id: str
    title: str
    slug: str
    summary: str
    content: str
    category: str
    tags: List[str]
    reading_time: str
    published_date: str
    last_updated: Optional[str] = None
    references: List[str] = Field(default_factory=list)

class ContactMessageSchema(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    subject: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1, max_length=5000)
    company: Optional[str] = Field(None, max_length=100)

class ChatRequest(BaseModel):
    message: str
    history: List[Dict[str, str]] = Field(default_factory=list)  # list of {"role": "user"/"model", "text": "..."}
    current_page: Optional[str] = None  # e.g., "projects/astraeus-ai" or "blog/mlops-with-docker"
    api_key: Optional[str] = None      # Option to supply custom Gemini API Key

class ChatResponse(BaseModel):
    response: str
    suggested_questions: List[str] = Field(default_factory=list)
    actions: List[Dict[str, Any]] = Field(default_factory=list)  # e.g., [{"type": "navigate", "target": "projects"}]
