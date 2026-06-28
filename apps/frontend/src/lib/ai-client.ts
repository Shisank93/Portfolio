// Client-side simulation matching configurations

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export interface ChatAction {
  type: "scroll" | "navigate" | "theme" | "terminal" | "sorting_simulation";
  target?: string;
}

export interface AIResponse {
  response: string;
  suggested_questions: string[];
  actions: ChatAction[];
}

const BACKEND_URL = "http://localhost:8000/api";

/**
 * Handles communication with the AI Assistant.
 * Seamlessly switches to local browser intent-matching if the FastAPI server is down.
 */
export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
  currentPage: string,
  userApiKey?: string
): Promise<AIResponse> {
  const query = message.trim();
  if (!query) {
    return {
      response: "Please enter a valid message.",
      suggested_questions: [],
      actions: []
    };
  }

  // Attempt FastAPI Backend API call first
  try {
    const res = await fetch(`${BACKEND_URL}/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: query,
        history: history.map(h => ({ role: h.role, text: h.text })),
        current_page: currentPage,
        api_key: userApiKey || null
      }),
      // Short timeout to fallback quickly if backend is down
      signal: AbortSignal.timeout(2000)
    });

    if (res.ok) {
      const data = await res.json();
      return {
        response: data.response,
        suggested_questions: data.suggested_questions || [],
        actions: data.actions || []
      };
    }
  } catch (err) {
    console.warn("FastAPI backend is offline. Switching to local-first client-side AI engine.", err);
  }

  // FastAPI is offline or failed -> Run Local Core Intent Matching
  return runLocalAIEngine(query, history, currentPage);
}

/**
 * High-fidelity client-side RAG & intent matcher.
 * Mimics a streaming LLM response using markdown templates.
 */
function runLocalAIEngine(query: string, history: ChatMessage[], currentPage: string): AIResponse {
  const q = query.toLowerCase();
  
  let response = "";
  const actions: ChatAction[] = [];
  let suggested_questions: string[] = [];

  // Navigation Intents
  if (q.includes("go to projects") || q.includes("show projects") || q.includes("show me your projects") || q.includes("view projects")) {
    response = "Navigating you to the Engineering Lab and Project Showcase. Here you can search and filter my projects.";
    actions.push({ type: "navigate", target: "#/projects" });
    suggested_questions = ["Explain Astraeus AI", "What tools are used?", "Show me your resume"];
  } 
  else if (q.includes("contact") || q.includes("hire") || q.includes("message") || q.includes("email")) {
    response = "Sure, taking you to my Contact details. You can send a secure message or link directly to my professional profiles.";
    actions.push({ type: "navigate", target: "#/contact" });
    suggested_questions = ["What is Shisank's email?", "Where is he located?", "Go to Home page"];
  } 
  else if (q.includes("resume") || q.includes("cv") || q.includes("education") || q.includes("college")) {
    response = "Opening the Resume section. You can preview my academic milestones at **Ajay Kumar Garg Engineering College** (specialization in Computer Science AI & ML, graduation expected 2028) and download the print-friendly PDF.";
    actions.push({ type: "navigate", target: "#/resume" });
    suggested_questions = ["What programming languages does he know?", "Explain his engineering philosophy", "Go to AI Lab"];
  } 
  else if (q.includes("ai lab") || q.includes("playground") || q.includes("simulation") || q.includes("demonstration")) {
    response = "Let's open the AI Lab page where you can run client-side machine learning simulations, including a Sentiment Analyzer and a Neural Network Node Visualizer.";
    actions.push({ type: "navigate", target: "#/ai-lab" });
    suggested_questions = ["Run a sorting simulation", "Show MLOps experience", "Go to Blog"];
  }
  else if (q.includes("theme") || q.includes("dark") || q.includes("light")) {
    const targetTheme = q.includes("light") ? "light" : "dark";
    response = `Toggling the platform styling theme to **${targetTheme} mode** to suit your viewing preference.`;
    actions.push({ type: "theme", target: targetTheme });
    suggested_questions = ["Explain your engineering values", "How is this website architected?", "Open terminal"];
  }
  else if (q.includes("terminal") || q.includes("command palette") || q.includes("cmd+k") || q.includes("ctrl+k")) {
    response = "Launching the floating Command Palette overlay. You can type CLI commands like `/projects` or `/sysinfo` for quick navigation.";
    actions.push({ type: "terminal" });
    suggested_questions = ["Explain Raft consensus", "What is Astraeus AI?", "Tell me about Shisank"];
  }
  else if (q.includes("sort") && q.includes("simulat")) {
    response = "Initializing the interactive sorting algorithm playground inside the AI Lab.";
    actions.push({ type: "navigate", target: "#/ai-lab" });
    actions.push({ type: "sorting_simulation" });
    suggested_questions = ["Tell me about Helios Raft", "Go to Projects", "Open Resume"];
  }

  // Page Context Injects
  else if (currentPage.includes("astraeus-ai") && (q.includes("architecture") || q.includes("explain") || q.includes("this project") || q.includes("model"))) {
    response = "### Astraeus AI Architecture\n\n" +
      "The system utilizes a **Hierarchical Supervisor-Worker** layout:\n\n" +
      "- **Manager Agent (Supervisor)**: Orchestrates LangChain plans, maps out sub-goals, and delegates to workers.\n" +
      "- **Specialist Workers**: Individual isolated runtimes (Coder, Reviewer, Tester) run code execution loops inside sandboxed Docker containers to prevent environment corruption.\n" +
      "- **Memory Layer**: Uses ChromaDB to recall past file layouts and API tokens semantically.";
    suggested_questions = ["What challenges did Shisank face here?", "What are the key metrics?", "View code files"];
  }
  else if (currentPage.includes("helios-raft") && (q.includes("consensus") || q.includes("explain") || q.includes("this project") || q.includes("raft"))) {
    response = "### Helios Raft Replication Protocol\n\n" +
      "Helios Raft implements consensus safety from scratch in Go:\n\n" +
      "- **Leader Election**: Follower nodes monitor election timeouts (randomized 150ms-300ms) and trigger votes if heartbeats fail.\n" +
      "- **Log Replication**: Leaders propagate states to followers via Protobuf-encoded gRPC channels.\n" +
      "- **Partition Guard**: Strict quorum logic (majority check) blocks commits during symmetric network separations, healing terms smoothly once connected.";
    suggested_questions = ["What databases are linked?", "Show Raft code files", "Go to Projects"];
  }

  // General Biography and Q&A
  else if (q.includes("who is") || q.includes("about shisank") || q.includes("tell me about") || q.includes("biography")) {
    response = `### About Shisank
    
Shisank is an **AI Engineer and Machine Learning Developer** studying Computer Science Engineering with a specialization in AI & ML at **Ajay Kumar Garg Engineering College** (expected graduation 2028).

He is focused on bridging the gap between machine learning models and high-performance backend systems, demonstrating software craftsmanship through clean architectures.

**Core Technical Areas:**
- **AI/ML**: TensorFlow, PyTorch, LangChain, RAG Pipelines, Vector Memory.
- **Systems Engineering**: Go concurrency pipelines, Raft consensus protocol.
- **Cloud & DevOps**: AWS, Docker containers, GitHub Actions.

Would you like to explore [Shisank's Projects](#/projects) or view the print-friendly [Resume](#/resume)?`;
    suggested_questions = ["What projects has he built?", "Explain his engineering philosophy", "Contact Shisank"];
  } 
  else if (q.includes("skills") || q.includes("languages") || q.includes("technolog")) {
    response = "### Technical Skill Inventory\n\n" +
      "Shisank's capabilities are divided into dedicated engineering cards:\n\n" +
      "- **Languages**: Python, Go, TypeScript, C++.\n" +
      "- **AI/ML**: TensorFlow, PyTorch, LangChain, ChromaDB, Gemini APIs.\n" +
      "- **Cloud & Storage**: AWS, Google Cloud, PostgreSQL, MongoDB, RocksDB.\n" +
      "- **Tools & DevOps**: Docker, Git, CI/CD, Next.js, FastAPI.";
    suggested_questions = ["Show Go consensus project", "Show LangChain agent project", "Download Resume"];
  }
  else if (q.includes("philosophy") || q.includes("values") || q.includes("principles")) {
    response = "### Engineering Philosophy\n\n" +
      "Shisank builds products guided by five core principles:\n\n" +
      "1. **Usability before complexity**: Code should serve the user first, avoiding unnecessary dependencies.\n" +
      "2. **Fundamentals before optimization**: Understand system layers (compilers, networks) to build performant bases.\n" +
      "3. **Maintainable craftsmanship**: Enforce strong typing, semantic schemas, and descriptive documentation.\n" +
      "4. **Continuous Learning**: Active exploration of emerging research, particularly in autonomous agent architectures.\n" +
      "5. **Data-Driven Metrics**: Always measure inference speeds, latency, and success rates before declaring completion.";
    suggested_questions = ["Tell me about Ajay Kumar Garg College", "How does Astraeus AI work?", "Open Contact page"];
  }
  else if (q.includes("blog") || q.includes("articles") || q.includes("technical writing")) {
    response = "### Blog & Technical Notes\n\n" +
      "Shisank writes about actual implementation experiences rather than generic guides. Recent articles include:\n\n" +
      "- **MLOps Pipelines with Secure Docker Sandbox Isolation** (Focuses on securing LLM dynamic code generation runtimes)\n" +
      "- **Engineering a Distributed Consensus Engine in Go** (Deep dive into election states and network splits)\n\n" +
      "Would you like me to take you to the [Technical Blog](#/blog)?";
    suggested_questions = ["Go to Blog page", "Show MLOps article summary", "Explain Raft consensus"];
  }
  else {
    // Default fallback statement matching the CDD requirement: "confident, calm, respectful, will say 'I don't have enough information' instead of hallucinating"
    response = "I don't have enough information in Shisank's portfolio context to answer that specific query. I can, however, answer detailed questions regarding his projects (Astraeus AI, Helios Raft), his CSE AI/ML coursework at Ajay Kumar Garg Engineering College, or take you through his skills and navigation paths.\n\nWhat would you like to explore next?";
    suggested_questions = [
      "Tell me about Shisank's projects.",
      "What programming languages does he know?",
      "Download Shisank's Resume"
    ];
  }

  return {
    response,
    suggested_questions,
    actions
  };
}
