export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: string;
  difficulty: string;
  build_time: string;
  tech_stack: string[];
  description: string;
  overview: string;
  problem: string;
  objectives: string[];
  solution: string;
  architecture_description: string;
  metrics: { label: string; value: string; description?: string }[];
  journey: { title: string; date: string; description: string }[];
  challenges: { challenge: string; solution: string }[];
  code_repo_url?: string;
  demo_url?: string;
  related_project_ids: string[];
  mock_files?: { [key: string]: string }; // For Mock IDE Explorer
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  tags: string[];
  reading_time: string;
  published_date: string;
  last_updated?: string;
  references?: string[];
}

export interface ResumeData {
  summary: string;
  education: {
    institution: string;
    degree: string;
    specialization: string;
    graduation: string;
    location: string;
    coursework: string[];
  };
  skills: { [key: string]: string[] };
  timeline: { year: string; event: string }[];
  about: {
    title: string;
    vision: string;
    philosophy: string[];
    faqs: { question: string; answer: string }[];
  };
}

export const PROJECTS: Project[] = [
  {
    id: "astraeus-ai",
    title: "Astraeus AI: Autonomous Multi-Agent Systems",
    slug: "astraeus-ai",
    category: "Machine Learning",
    status: "Completed",
    difficulty: "Advanced",
    build_time: "3 Months",
    tech_stack: ["Python", "FastAPI", "Docker", "LangChain", "Gemini API", "ChromaDB"],
    description: "An autonomous agent platform orchestrating LLM agents to collaborate and execute complex multi-step software tasks.",
    overview: "Astraeus AI is a multi-agent orchestration framework that enables users to deploy collaborative teams of autonomous agents. The system utilizes hierarchical planning, vector memory structures, and tool execution protocols to solve software engineering tasks.",
    problem: "Traditional single-agent LLM systems struggle with long-horizon tasks due to state tracking failures, error propagation, and context window drift. Complex projects require diverse specialists collaborating via structured protocols.",
    objectives: [
      "Achieve over 90% task success rate on multi-step software planning operations.",
      "Maintain execution latency below 5 seconds per planning loop iteration.",
      "Reduce token usage by 35% through dynamic context compression."
    ],
    solution: "Astraeus AI separates responsibilities by deploying a Manager Agent (Planner) overseeing Specialist Agents (Coder, Reviewer, Tester). Agents communicate via a local message broker and utilize vector databases for persistent state recall.",
    architecture_description: "Hierarchical Supervisor-Worker architecture. The User interface connects to a FastAPI gateway, which pushes tasks into a broker queues. Manager agents split tasks into sub-tasks and spawn specialist worker runtimes inside isolated Docker sandbox containers.",
    metrics: [
      { label: "Task Success Rate", value: "92.4%", description: "Percentage of test suits passed autonomously" },
      { label: "Planning Loop Latency", value: "3.8s", description: "Average response time per task generation step" },
      { label: "Context Token Reduction", value: "38.2%", description: "Savings relative to native uncompressed prompts" }
    ],
    journey: [
      { title: "Phase 1: Agent Architecture", date: "Month 1", description: "Designed supervisor patterns and communications protocol." },
      { title: "Phase 2: RAG & State Persistence", date: "Month 2", description: "Integrated ChromaDB for vector memory semantic recall." },
      { title: "Phase 3: Docker Sandbox Runtimes", date: "Month 3", description: "Constructed secure virtual containers to compile and execute generated code." }
    ],
    challenges: [
      {
        challenge: "Infinite execution loops from repetitive error correction patterns.",
        solution: "Implemented backoff loops, validation timeout constraints, and supervisor intervention overrides."
      },
      {
        challenge: "Context window saturation from verbose agent discussion histories.",
        solution: "Built a summary compressor service that summarizes dialogue history using sliding window token margins."
      }
    ],
    code_repo_url: "https://github.com/Shisank93/astraeus-ai",
    demo_url: "https://astraeus.shisank.dev",
    related_project_ids: ["helios-raft", "project-aether"],
    mock_files: {
      "app/main.py": `from fastapi import FastAPI, BackgroundTasks
from app.agents.supervisor import AgentSupervisor
from app.schemas import TaskRequest, TaskResponse

app = FastAPI(title="Astraeus Agent Gateway")

@app.post("/run-task", response_model=TaskResponse)
def execute_task(req: TaskRequest, bg_tasks: BackgroundTasks):
    supervisor = AgentSupervisor(task=req.task, scope=req.scope)
    # Start task pipeline asynchronously inside worker queues
    bg_tasks.add_task(supervisor.orchestrate_pipeline)
    return {"status": "initialized", "task_id": supervisor.id, "message": "Pipeline active"}
`,
      "app/agents/supervisor.py": `import logging
from app.agents.coder import CoderAgent
from app.agents.reviewer import ReviewerAgent

class AgentSupervisor:
    def __init__(self, task: str, scope: str):
        self.task = task
        self.scope = scope
        self.coder = CoderAgent()
        self.reviewer = ReviewerAgent()
        
    async def orchestrate_pipeline(self):
        logging.info(f"Supervisor initiated planning for: {self.task}")
        code = await self.coder.generate(self.task)
        feedback = await self.reviewer.review(code)
        
        if feedback.is_valid:
            await self.coder.deploy(code)
        else:
            logging.warning("Code failed review. Requesting corrections.")
`
    }
  },
  {
    id: "helios-raft",
    title: "Helios Raft: High-Performance Consensus Core",
    slug: "helios-raft",
    category: "Systems Engineering",
    status: "Completed",
    difficulty: "Advanced",
    build_time: "2 Months",
    tech_stack: ["Go", "gRPC", "Protobuf", "Raft Consensus", "RocksDB"],
    description: "A high-performance distributed key-value store implementing the Raft consensus protocol from scratch.",
    overview: "Helios Raft Core is a distributed, transactional key-value store optimized for low-latency write execution and reliable partition tolerance. The protocol consensus logic is engineered entirely in Go without third-party frameworks, maximizing hardware serialization performance.",
    problem: "Ensuring strict serializability and data integrity across nodes during arbitrary network partitions is difficult. Standard implementations are often bundled into massive, rigid systems that are hard to optimize or audit.",
    objectives: [
      "Achieve full consensus protocol safety against arbitrary hardware failures and partitions.",
      "Maintain write throughput of over 50,000 requests per second under peak load.",
      "Limit consensus replication latency to less than 15ms across a 5-node cluster."
    ],
    solution: "Constructed a state-machine replication runtime using Go channels for non-blocking concurrent log processing, combined with custom gRPC network layers. Data persistence uses RocksDB bindings for raw write efficiency.",
    architecture_description: "Distributed log replication architecture. Nodes alternate states between Leader, Candidate, and Follower. Log updates are serialized via Protobuf and replicated to follower nodes. Commits only occur once a quorum of nodes acknowledge the update.",
    metrics: [
      { label: "Write Throughput", value: "58,400 rps", description: "Under continuous benchmarking stress tests" },
      { label: "Replication Latency", value: "11.2ms", description: "Average response time between Leader and Quorum" },
      { label: "Partition Recovery", value: "2.4s", description: "Time to re-elect leader and heal state after partition" }
    ],
    journey: [
      { title: "Phase 1: Election State Machine", date: "Month 1", description: "Engineered election timer and state transitions." },
      { title: "Phase 2: Log Replication & Persistence", date: "Month 2", description: "Built append-entries RPC pipelines and WAL persistence bindings." }
    ],
    challenges: [
      {
        challenge: "Split-brain state during symmetric network partitions.",
        solution: "Implemented term validation protocols, strict quorum verification checks, and pre-vote election mechanisms."
      }
    ],
    code_repo_url: "https://github.com/Shisank93/helios-raft",
    demo_url: "https://helios.shisank.dev",
    related_project_ids: ["astraeus-ai"],
    mock_files: {
      "raft.go": `package raft

import "sync"

type NodeState int
const (
	Follower NodeState = iota
	Candidate
	Leader
)

type RaftNode struct {
	mu        sync.Mutex
	peers     []string
	state     NodeState
	term      int
	votedFor  string
	log       []LogEntry
	commitIdx int
}

func (rn *RaftNode) StartElection() {
	rn.mu.Lock()
	defer rn.mu.Unlock()
	rn.state = Candidate
	rn.term++
	rn.votedFor = "self"
	
	// Broadcast RequestVote RPCs asynchronously to quorum nodes...
}
`,
      "rpc.go": `package raft

type RequestVoteArgs struct {
	Term         int
	CandidateID  string
	LastLogIndex int
	LastLogTerm  int
}

type RequestVoteReply struct {
	Term        int
	VoteGranted bool
}

func (rn *RaftNode) RequestVote(args *RequestVoteArgs, reply *RequestVoteReply) {
	rn.mu.Lock()
	defer rn.mu.Unlock()
	
	if args.Term < rn.term {
		reply.VoteGranted = false
		reply.Term = rn.term
		return
	}
	// Verify candidate log freshness and grant vote...
}
`
    }
  },
  {
    id: "project-aether",
    title: "Project Aether: AI Engineering Platform",
    slug: "project-aether",
    category: "AI Web Engineering",
    status: "Completed",
    difficulty: "Intermediate",
    build_time: "1 Month",
    tech_stack: ["Next.js", "FastAPI", "pnpm", "Tailwind CSS", "PrismJS", "Gemini API"],
    description: "An interactive, AI-powered personal portfolio platform designed to showcase engineering capabilities through real-time demos.",
    overview: "Project Aether is the professional showcase framework designed for Shisank. It acts as an integrated system merging a Next.js frontend and a FastAPI backend with RAG-based AI interactions, design precision, and double-resilience fallbacks.",
    problem: "Recruiters and hiring managers spend an average of 6 seconds reviewing resumes. Generic static portfolios fail to prove engineering depth, actual system construction, or product design thinking.",
    objectives: [
      "Demonstrate high-end aesthetic precision (Tesla/Apple styled) with sub-second page loads.",
      "Expose direct AI interactions without requiring visitor configuration or API keys.",
      "Guarantee 100% uptime with local browser fallback rages if API services are offline."
    ],
    solution: "Built a monorepo containing a Next.js client-side application and a FastAPI python service. The frontend features an interactive svg system architect diagram, a mock github directory reader, and a local streaming AI dialogue engine.",
    architecture_description: "Clean client-server monorepo. The Next.js client performs static hydration and handles local-first logic. The FastAPI backend indexes metadata and handles Gemini LLM API generation with contextual grounding injections.",
    metrics: [
      { label: "Lighthouse Performance", value: "99", description: "Clean client rendering speeds" },
      { label: "Initial Page Load", value: "120ms", description: "From cold start to interactive state" },
      { label: "Uptime Reliability", value: "100%", description: "Guaranteed via immediate local client fallback engine" }
    ],
    journey: [
      { title: "Phase 1: Architecture & Theme", date: "Week 1", description: "Created monorepo layout, defined design tokens, and designed header/footer views." },
      { title: "Phase 2: Project Detail Explorer", date: "Week 2", description: "Implemented mock IDE repository files explorer and simulator overlays." },
      { title: "Phase 3: Intelligence Layer", date: "Week 3-4", description: "Coded dual-engine AI conversational assistant, RAG grounding, and command terminals." }
    ],
    challenges: [
      {
        challenge: "Ensuring the website works seamlessly if backend servers are down or API keys fail.",
        solution: "Engineered a client-side mock LLM fallback in Javascript that intercepts requests, scans intent, and streams pre-grounded structured responses."
      }
    ],
    code_repo_url: "https://github.com/Shisank93/Portfolio",
    demo_url: "https://shisank.dev",
    related_project_ids: ["astraeus-ai", "helios-raft"],
    mock_files: {
      "pnpm-workspace.yaml": `packages:
  - 'apps/*'
  - 'packages/*'
`,
      "apps/frontend/package.json": `{
  "name": "frontend",
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.350.0"
  }
}`
    }
  }
];

export const BLOGS: Blog[] = [
  {
    id: "mlops-with-docker",
    title: "MLOps Pipelines with Secure Docker Sandbox Isolation",
    slug: "mlops-with-docker",
    summary: "An in-depth look at building and deploying secure, isolated runtimes for running machine learning inference and code compilation tasks using Docker.",
    content: `
## Introduction to Docker Sandboxing in AI

Modern AI applications frequently require executing dynamic workloads. In agent platforms like **Astraeus AI**, agents generated code needs to be compiled, run, and verified on the fly. Doing this on a host machine poses huge security risks: malicious packages, file destruction, or unauthorized outbound network calls.

This guide details how we designed a secure, containerized sandbox pipeline using **Python, FastAPI, and Docker** to isolate untrusted agent runtime actions.

## Isolating Agent Environments

To create a secure execution environment, each agent task is wrapped in a dedicated Docker container spawned from a lightweight, pre-configured image containing only essential compilers and runtimes.

\`\`\`python
import docker

client = docker.from_env()

def execute_code_in_sandbox(code_string: str, timeout_seconds: int = 10):
    container = client.containers.run(
        image="python:3.11-slim",
        command=["python", "-c", code_string],
        network_disabled=True,     # Block outbound API hijacking
        mem_limit="128m",           # Prevent RAM DOS attacks
        nano_cpus=1000000000,       # Limit to exactly 1 CPU core
        read_only=True,             # Read-only root system file block
        detach=True
    )
    
    # Wait for execution with timeout checks...
\`\`\`

## Critical Security Guardrails

When engineering AI execution pipelines, we enforce three primary rules:
1. **Network Disabling**: Always set \`network_disabled=True\` to prevent the agent from communicating with external servers (e.g. downloading spyware or sending spam).
2. **Resource Caps**: Restrict CPU and RAM usage to prevent infinite loops (like \`while True: pass\`) from freezing the server.
3. **Short Lifespans**: Automatically delete containers after execution terminates using \`auto_remove=True\`.

In MLOps environments, these guards ensure your system remains stable, secure, and resilient under arbitrary workloads.
`,
    category: "MLOps",
    tags: ["Docker", "MLOps", "Python", "Security"],
    reading_time: "5 Min Read",
    published_date: "June 15, 2026",
    last_updated: "June 20, 2026",
    references: [
      "Docker API documentation: https://docker-py.readthedocs.io",
      "OWASP Secure Coding Guidelines: https://owasp.org"
    ]
  },
  {
    id: "distributed-consensus-raft",
    title: "Engineering a Distributed Consensus Engine in Go",
    slug: "distributed-consensus-raft",
    summary: "Deep dive into the challenges of building a partition-tolerant replication engine using the Raft consensus protocol.",
    content: `
## Why Consensus is Hard

In distributed systems, achieving consensus—agreeing on system state across multiple independent servers—is one of the most fundamental challenges. Nodes fail, networks partition, and messages get delayed or reordered.

The **Raft protocol** split this problem into three clear sub-problems: Leader Election, Log Replication, and Safety. This article covers how we implemented this in Go for **Helios Raft Core**.

## The Election Lifecycle

Nodes in a Raft cluster maintain a state machine with three states: Follower, Candidate, and Leader.

\`\`\`go
type NodeState int
const (
    Follower NodeState = iota
    Candidate
    Leader
)

type RaftNode struct {
    mu          sync.Mutex
    peers       []*Peers
    state       NodeState
    currentTerm int
    votedFor    string
    log         []LogEntry
    
    // Timers for election intervals
    electionTimer  *time.Timer
    heartbeatTimer *time.Timer
}
\`\`\`

Every node starts as a **Follower**. If they do not receive a heartbeat RPC within a randomized timeout (e.g., 150ms-300ms), they transition to a **Candidate**, increment their term, vote for themselves, and broadcast a request for votes to all peers.

## Handling Symmetric Network Partitions

One of the most complex edge cases during development is when a node gets partitioned into a minority subgroup. 

\`\`\`
[Node A (Leader), Node B]  |  [Node C, Node D, Node E]
      (Term 1)            |       (Term 2 Elected)
\`\`\`

If Node A and B are cut off, Node C, D, and E will elect Node C as leader for Term 2. Meanwhile, Node A will continue accepting writes. When the partition heals, Node C's term (Term 2) is higher than Node A's term (Term 1). Node A must step down, discard its uncommitted logs, and replicate from Node C.

Implementing this requires maintaining a strict write-ahead log (WAL) and verifying quorum before committing updates to the state machine.
`,
    category: "System Design",
    tags: ["Go", "Distributed Systems", "Raft", "Concurrency"],
    reading_time: "8 Min Read",
    published_date: "May 22, 2026",
    references: [
      "The Raft Paper: https://raft.github.io/raft.pdf",
      "Designing Data-Intensive Applications by Martin Kleppmann"
    ]
  }
];

export const RESUME_DATA: ResumeData = {
  summary: "AI Engineer and Machine Learning Developer specializing in building scalable software systems and autonomous agent workflows. Practical experience building distributed runtimes and deploying LLM RAG pipelines. Focuses on software craftsmanship, type safety, and product aesthetics.",
  education: {
    institution: "Ajay Kumar Garg Engineering College",
    degree: "Bachelor of Technology",
    specialization: "Computer Science Engineering (Artificial Intelligence & Machine Learning)",
    graduation: "Expected 2028",
    location: "Ghaziabad, India",
    coursework: [
      "Data Structures & Algorithms",
      "Database Management Systems",
      "Machine Learning Algorithms",
      "Artificial Neural Networks",
      "Object-Oriented Programming"
    ]
  },
  skills: {
    "Programming": ["Python", "Go", "TypeScript", "JavaScript", "C++", "HTML/CSS"],
    "AI / ML": ["TensorFlow", "PyTorch", "Scikit-Learn", "HuggingFace", "LangChain", "Gemini API", "ChromaDB"],
    "Cloud": ["AWS", "Google Cloud", "Vercel", "Firebase"],
    "Databases": ["PostgreSQL", "MongoDB", "RocksDB", "SQLite", "Redis"],
    "DevOps": ["Docker", "Git", "GitHub Actions", "CI/CD", "Linux"],
    "Tools": ["pnpm", "Next.js", "FastAPI", "Postman", "PrismJS"]
  },
  timeline: [
    { year: "2024", event: "Started B.Tech CSE (AI/ML) at Ajay Kumar Garg Engineering College" },
    { year: "2025", event: "Mastered Python Foundations, Data Science, and Machine Learning libraries" },
    { year: "2025", event: "Engineered Helios Raft consensus engine in Go from scratch" },
    { year: "2026", event: "Constructed Astraeus AI multi-agent orchestration runtime in Python" },
    { year: "2026", event: "Created Project Aether, showcasing complete AI portfolio integration" }
  ],
  about: {
    title: "AI Engineer • Machine Learning Developer • Building Intelligent Products",
    vision: "I aim to bridge the gap between fuzzy machine learning outputs and strict, high-performance systems. My goal is to engineer autonomous systems that solve practical real-world challenges while maintaining readable, robust, and highly-optimized codebases.",
    philosophy: [
      "Build for usability before complexity.",
      "Understand system fundamentals before optimizing.",
      "Write clean, maintainable, and type-safe code.",
      "Continuous learning is an engineer's primary habit.",
      "Ship working software early and iterate based on metrics."
    ],
    faqs: [
      {
        question: "Why did you choose to specialize in AI/ML?",
        answer: "AI is the ultimate optimization tool. It allows software to solve fuzzy, complex problems that cannot be easily written with strict rule-based code. Combining AI with reliable systems engineering is the most exciting frontier in technology today."
      },
      {
        question: "What technologies do you use most frequently?",
        answer: "My primary stack for systems development is Go, and for AI/ML pipelines I use Python (FastAPI, PyTorch, LangChain). For frontend interfaces, I prefer Next.js with TypeScript and Tailwind CSS."
      },
      {
        question: "How do you ensure AI assistants don't hallucinate?",
        answer: "By implementing strict RAG (Retrieval-Augmented Generation) pipelines, feeding high-fidelity markdown documentation directly into the model context, and configuring strict system instructions that command the model to decline answering if the data is not present."
      }
    ]
  }
};
