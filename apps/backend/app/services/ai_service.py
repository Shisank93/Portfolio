import os
import json
import logging
import google.generativeai as genai
from google.generativeai.types import GenerateContentResponse
from typing import List, Dict, Any, Optional

logger = logging.getLogger("project-aether-backend.ai_service")

# Default prompt templates and system instructions
SYSTEM_INSTRUCTION = """
You are Shisank AI (internal name: Aether AI), an intelligent technical colleague and AI assistant for Shisank's personal portfolio, Project Aether.

Your core responsibility is to help visitors (recruiters, founders, engineers) understand Shisank's capabilities, projects, skills, education, and engineering philosophy.

COMMUNICATION PRINCIPLES:
- Act like a helpful engineering teammate who has complete knowledge of the projects and resume.
- Be professional, accurate, technical, honest, and confident.
- Do NOT use marketing buzzwords, exaggerated enthusiasm, or jokes that interrupt the flow.
- Keep answers concise, clear, and structured. Use bullet points and code snippets where appropriate.
- Provide direct citations and links to relevant sections (e.g., [Projects Section](#/projects), [Resume Page](#/resume), or [Helios Raft Core Details](#/projects/helios-raft)).
- Ground your responses strictly in the provided Knowledge Base. If information is unavailable, say: "I don't have enough information to answer that." Never make up achievements, credentials, or statistics.

AVAILABLE INTERACTIVE NAVIGATION ACTIONS:
You are equipped with client-side actions. When appropriate (e.g. when the user asks to see projects, contact, resume, or change theme), you can suggest executing these actions. Specify them by asking the frontend to navigate or scroll.
Valid actions you can trigger are:
- `scrollToSection(id)`: section ids are: 'hero', 'projects', 'skills', 'lab-preview', 'philosophy', 'timeline', 'ai-preview', 'blogs', 'contact'
- `navigateTo(path)`: paths are: '#/', '#/projects', '#/ai-lab', '#/blog', '#/about', '#/contact', '#/resume'
- `toggleTheme(theme)`: themes are: 'light', 'dark'
- `openTerminal()`: opens the Command Terminal overlay
- `runSortingSimulation()`: triggers the sorting algorithm simulator on the AI Lab page

If the user says "show me your projects", respond indicating you are taking them to the projects section, and trigger the action.

KNOWLEDGE BASE:
{knowledge_base}
"""

class AIService:
    def __init__(self, default_api_key: Optional[str] = None):
        self.default_api_key = default_api_key or os.environ.get("GEMINI_API_KEY")
        if not self.default_api_key:
            logger.warning("No default GEMINI_API_KEY found in environment variables. Gemini calls will require user-provided keys.")

    def _get_model(self, api_key: Optional[str] = None):
        key = api_key or self.default_api_key
        if not key:
            raise ValueError("Gemini API key is required. Please set GEMINI_API_KEY or supply one in settings.")
        genai.configure(api_key=key)
        
        # We use gemini-1.5-flash as default for lightning-fast streaming and cost efficiency
        return genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            generation_config={"temperature": 0.2, "top_p": 0.95}
        )

    def generate_response(
        self,
        message: str,
        history: List[Dict[str, str]],
        knowledge_base_md: str,
        current_page: Optional[str] = None,
        user_api_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generates grounded responses using Gemini 1.5 Flash.
        """
        try:
            model = self._get_model(user_api_key)
            
            # Format system instruction with knowledge base
            current_context = f"\n\nVisitor is currently viewing page: {current_page}" if current_page else ""
            formatted_instruction = SYSTEM_INSTRUCTION.format(knowledge_base=knowledge_base_md) + current_context
            
            # Convert history to Gemini format
            contents = []
            for h in history:
                role = "user" if h.get("role") == "user" else "model"
                contents.append({"role": role, "parts": [h.get("text", "")]})
                
            contents.append({"role": "user", "parts": [message]})
            
            # Generate content
            # Set system instruction as instruction parameter
            response = model.generate_content(
                contents=contents,
                generation_config={"response_mime_type": "application/json"} if False else None,
                system_instruction=formatted_instruction
            )
            
            # Simple heuristic post-processing to extract actions from response text
            # E.g., if model says: [[ACTION: navigateTo("#/projects")]]
            # We will parse this out and attach as formal action payloads.
            response_text = response.text
            actions = []
            
            # Clean actions parsing from standard text format
            # We tell the model to use a standard format for actions if needed, or we scan
            # E.g., looking for scrollToSection('contact') etc.
            import re
            
            # Match actions like [[action: scrollToSection("contact")]]
            action_matches = re.findall(r'\[\[action:\s*(\w+)\(([^)]*)\)\s*\]\]', response_text)
            for action_name, action_arg in action_matches:
                clean_arg = action_arg.strip().strip('"').strip("'")
                if action_name == "scrollToSection":
                    actions.append({"type": "scroll", "target": clean_arg})
                elif action_name == "navigateTo":
                    actions.append({"type": "navigate", "target": clean_arg})
                elif action_name == "toggleTheme":
                    actions.append({"type": "theme", "target": clean_arg})
                elif action_name == "openTerminal":
                    actions.append({"type": "terminal"})
                elif action_name == "runSortingSimulation":
                    actions.append({"type": "sorting_simulation"})
                    
            # Remove clean actions brackets from text to present polished markdown to visitor
            clean_text = re.sub(r'\[\[action:\s*\w+\([^)]*\)\s*\]\]', '', response_text).strip()
            
            # Generate context-aware suggestions
            suggested_questions = self._generate_suggestions(clean_text, current_page)
            
            return {
                "response": clean_text,
                "suggested_questions": suggested_questions,
                "actions": actions
            }
            
        except Exception as e:
            logger.error(f"Failed to generate response: {e}")
            # Fallback message
            return {
                "response": f"I encountered an error connecting to the generative service: {str(e)}. Please check your API key connection or try again shortly.",
                "suggested_questions": [
                    "Tell me about Shisank.",
                    "Go to Projects",
                    "Download Resume"
                ],
                "actions": []
            }

    def _generate_suggestions(self, response_text: str, current_page: Optional[str] = None) -> List[str]:
        """
        Dynamically generates 3 recommended follow-up questions.
        """
        # Default suggestions based on page
        if current_page:
            if "projects/astraeus-ai" in current_page:
                return ["Explain Astraeus architecture", "What were the challenges?", "What metrics did it hit?"]
            elif "projects/helios-raft" in current_page:
                return ["How does Helios Raft achieve consensus?", "Show code sample", "Can this run in production?"]
            elif "blog" in current_page:
                return ["Summarize this article", "What are key takeaways?", "Navigate to projects"]
                
        # Basic context-based suggestions
        lower_text = response_text.lower()
        if "project" in lower_text:
            return ["Explain his MLOps project", "Which is the best project?", "Go to Projects page"]
        if "skill" in lower_text or "languag" in lower_text:
            return ["Does he know Python?", "What databases has he used?", "Show MLOps experience"]
        if "educat" in lower_text or "colleg" in lower_text:
            return ["Where does Shisank study?", "What is his specialization?", "Download Resume"]
            
        return [
            "What projects use TensorFlow?",
            "Explain his engineering philosophy.",
            "Download Shisank's Resume"
        ]
