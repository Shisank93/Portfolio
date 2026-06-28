"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Play, RefreshCw } from "lucide-react";
import { sendChatMessage, ChatMessage } from "../../lib/ai-client";

export default function AILabPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Sentiment states
  const [sentimentInput, setSentimentInput] = useState("");
  interface SentimentResult {
    sentiment: string;
    score: number;
    color: string;
    bgColor: string;
  }
  const [sentimentResult, setSentimentResult] = useState<SentimentResult | null>(null);
  const [sentimentLogs, setSentimentLogs] = useState<string[]>([]);
  const [isSentimentLoading, setIsSentimentLoading] = useState(false);

  // Neural network states
  const [numLayers, setNumLayers] = useState(2);
  const [nodesPerLayer, setNodesPerLayer] = useState(3);
  const [activation, setActivation] = useState("ReLU");
  const [isNetworkForwarding, setIsNetworkForwarding] = useState(false);
  const [weightsGlow, setWeightsGlow] = useState(false);
  const [outputs, setOutputs] = useState<number[]>([]);

  // Listen to custom sorting simulation event from FAB AI triggers
  useEffect(() => {
    const handleTrigger = () => {
      // Smooth scroll to sandbox demos
      const el = document.getElementById("sentiment-playground");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    window.addEventListener("trigger-sorting-simulation", handleTrigger);
    return () => window.removeEventListener("trigger-sorting-simulation", handleTrigger);
  }, []);

  const handleSendChat = async () => {
    const query = input.trim();
    if (!query) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", text: query }]);
    setIsChatLoading(true);

    try {
      const response = await sendChatMessage(query, messages, "/ai-lab");
      setMessages(prev => [...prev, { role: "model", text: response.response }]);
    } catch {
      setMessages(prev => [...prev, { role: "model", text: "Error connecting to AI assistant service." }]);
    } finally {
      setIsChatLoading(true);
      setIsChatLoading(false);
    }
  };

  // Run mock Sentiment inference loops
  const runSentimentInference = () => {
    if (!sentimentInput.trim()) return;
    setIsSentimentLoading(true);
    setSentimentResult(null);
    setSentimentLogs(["[SYSTEM] Fetching tokenizers metadata...", "[SYSTEM] Encoding raw text input..."]);

    const steps = [
      `[TOKENIZER] Input mapped to token indices: [${sentimentInput.split(" ").map((_, i) => 100 + i * 7).join(", ")}]`,
      "[TRANSFORMER] Generating contextual semantic embeddings. Size: (1, 12, 768)",
      "[TRANSFORMER] Computing self-attention weight factors across 12 layers...",
      "[CLASSIFIER] Pooling token logits. Softmax calculation initiated...",
      "[SYSTEM] Inference terminated. Generating response classes."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setSentimentLogs(prev => [...prev, steps[currentStep]]);
        currentStep++;
      } else {
        clearInterval(interval);
        setIsSentimentLoading(false);

        // Simple sentiment rule engine
        const text = sentimentInput.toLowerCase();
        let sentiment = "Neutral";
        let score = 0.54;
        let color = "text-zinc-400";
        let bgColor = "bg-zinc-950/40 border-zinc-900";

        if (text.includes("great") || text.includes("love") || text.includes("awesome") || text.includes("perfect") || text.includes("premium")) {
          sentiment = "Positive";
          score = 0.94;
          color = "text-[#10b981]";
          bgColor = "bg-[#10b981]/5 border-[#10b981]/25";
        } else if (text.includes("bad") || text.includes("error") || text.includes("worst") || text.includes("broken") || text.includes("slow")) {
          sentiment = "Negative";
          score = 0.88;
          color = "text-[#e82127]";
          bgColor = "bg-[#e82127]/5 border-[#e82127]/25";
        }

        setSentimentResult({ sentiment, score, color, bgColor });
      }
    }, 700);
  };

  // Run neural network forward pass animation
  const runForwardPass = () => {
    setIsNetworkForwarding(true);
    setWeightsGlow(true);
    setOutputs([]);

    setTimeout(() => {
      setIsNetworkForwarding(false);
      
      // Generate mock activations floats between 0 and 1
      const generatedOutputs = [];
      for (let i = 0; i < 2; i++) {
        generatedOutputs.push(parseFloat(Math.random().toFixed(4)));
      }
      setOutputs(generatedOutputs);
      
      // Keep weight glow for a bit
      setTimeout(() => setWeightsGlow(false), 2000);
    }, 1500);
  };

  return (
    <div className="container-custom py-12 space-y-16 text-left">
      
      {/* Header Info */}
      <div className="space-y-4 max-w-2xl">
        <div className="inline-flex items-center gap-1.5 text-xs text-[#e82127] font-mono uppercase tracking-wider">
          <Sparkles className="w-4 h-4" /> Intelligence Layer
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display">
          AI Playground Lab
        </h1>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed font-sans">
          Welcome to the Machine Learning laboratory. Below you can configure neural network parameters, run real-time text sentiment inference, and chat with the RAG assistant console.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Playgrounds Side */}
        <div className="lg:col-span-7 space-y-16">
          
          {/* Sentiment Analyzer */}
          <div id="sentiment-playground" className="space-y-4">
            <h3 className="text-lg font-bold text-white font-display border-b border-zinc-900 pb-2">
              1. Real-Time Text Sentiment Analyzer
            </h3>
            <p className="text-zinc-500 text-xs font-sans">
              Enter a statement (e.g. *&quot;This project is awesome and works perfectly&quot;* or *&quot;Inference speed is too slow&quot;*) to watch a simulated transformer model pooling classification log probabilities.
            </p>
            
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="Enter some text statement to analyze..."
                value={sentimentInput}
                onChange={e => setSentimentInput(e.target.value)}
                disabled={isSentimentLoading}
                className="flex-1 bg-zinc-950 border border-zinc-800 text-white px-3 py-2.5 rounded-xl text-xs focus:ring-1 focus:ring-[#e82127] focus:outline-none placeholder-zinc-600 font-sans"
              />
              <button
                onClick={runSentimentInference}
                disabled={isSentimentLoading || !sentimentInput.trim()}
                className="btn-primary py-2 px-4 rounded-xl text-xs gap-1.5 shrink-0"
              >
                <Play className="w-3.5 h-3.5" /> Analyze
              </button>
            </div>

            {/* Console Log Stream */}
            <div className="border border-zinc-900 bg-zinc-950/60 p-4 rounded-xl font-mono text-[11px] text-zinc-500 min-h-[160px] max-h-[220px] overflow-y-auto space-y-1.5">
              {sentimentLogs.length === 0 ? (
                <div className="text-center py-12 text-zinc-700">Enter a query and click Analyze to stream classification steps.</div>
              ) : (
                sentimentLogs.map((log, idx) => (
                  <div key={idx} className={log.includes("[SYSTEM]") ? "text-zinc-650" : "text-zinc-400"}>
                    <span className="text-zinc-700 mr-1.5">&gt;</span>
                    {log}
                  </div>
                ))
              )}
            </div>

            {/* Inference Output details */}
            {sentimentResult && (
              <div className={`border p-4 rounded-xl flex items-center justify-between text-xs transition-all ${sentimentResult.bgColor}`}>
                <div className="space-y-1">
                  <div className="text-zinc-500 font-mono">Classification Class</div>
                  <div className={`text-base font-bold ${sentimentResult.color}`}>{sentimentResult.sentiment}</div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="text-zinc-500 font-mono">Confidence Level</div>
                  <div className="text-base font-bold text-white">{(sentimentResult.score * 100).toFixed(2)}%</div>
                </div>
              </div>
            )}

          </div>

          {/* Neural Network Node Visualizer */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white font-display border-b border-zinc-900 pb-2">
              2. Forward Propagation Visualizer
            </h3>
            <p className="text-zinc-500 text-xs font-sans">
              Configure parameters of a shallow dense neural network, then propagate activations to generate random floating logit output classes.
            </p>

            {/* Configurations Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#141416] border border-zinc-900 p-4 rounded-xl text-xs">
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Hidden Layers</span>
                <select
                  value={numLayers}
                  onChange={e => setNumLayers(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 px-2 py-1.5 rounded-lg focus:outline-none"
                >
                  <option value={1}>1 Layer</option>
                  <option value={2}>2 Layers</option>
                  <option value={3}>3 Layers</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Nodes Per Layer</span>
                <select
                  value={nodesPerLayer}
                  onChange={e => setNodesPerLayer(Number(e.target.value))}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 px-2 py-1.5 rounded-lg focus:outline-none"
                >
                  <option value={2}>2 Nodes</option>
                  <option value={3}>3 Nodes</option>
                  <option value={4}>4 Nodes</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Activation fn</span>
                <select
                  value={activation}
                  onChange={e => setActivation(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 px-2 py-1.5 rounded-lg focus:outline-none"
                >
                  <option value="ReLU">ReLU</option>
                  <option value="Sigmoid">Sigmoid</option>
                  <option value="Tanh">Tanh</option>
                </select>
              </div>
            </div>

            {/* Neural Net SVG visualization (CDD Aligned clean rendering) */}
            <div className="border border-zinc-900 bg-zinc-950 p-6 rounded-2xl flex flex-col items-center justify-center min-h-[220px]">
              <div className="flex items-center justify-center gap-12 relative w-full max-w-sm h-36">
                
                {/* Inputs node */}
                <div className="flex flex-col gap-4">
                  <div className="w-4 h-4 rounded-full bg-zinc-800 border border-zinc-700" />
                  <div className="w-4 h-4 rounded-full bg-zinc-800 border border-zinc-700" />
                </div>

                {/* Simulated Hidden Layer 1 */}
                <div className="flex flex-col gap-3">
                  {Array.from({ length: nodesPerLayer }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-4 h-4 rounded-full border transition-all duration-300 ${
                        weightsGlow ? "bg-[#e82127]/20 border-[#e82127] scale-110" : "bg-zinc-800 border-zinc-700"
                      }`} 
                    />
                  ))}
                </div>

                {/* Simulated Hidden Layer 2 (Conditionally rendered) */}
                {numLayers >= 2 && (
                  <div className="flex flex-col gap-3">
                    {Array.from({ length: nodesPerLayer }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-4 h-4 rounded-full border transition-all duration-300 ${
                          weightsGlow ? "bg-[#e82127]/20 border-[#e82127] scale-110" : "bg-zinc-800 border-zinc-700"
                        }`} 
                      />
                    ))}
                  </div>
                )}

                {/* Outputs node */}
                <div className="flex flex-col gap-6">
                  <div className={`w-4 h-4 rounded-full border transition-all duration-300 ${
                    outputs.length > 0 ? "bg-[#10b981]/20 border-[#10b981]" : "bg-zinc-800 border-zinc-700"
                  }`} />
                  <div className={`w-4 h-4 rounded-full border transition-all duration-300 ${
                    outputs.length > 0 ? "bg-[#10b981]/20 border-[#10b981]" : "bg-zinc-800 border-zinc-700"
                  }`} />
                </div>

              </div>

              <div className="flex gap-4 items-center mt-4">
                <button
                  onClick={runForwardPass}
                  disabled={isNetworkForwarding}
                  className="btn-primary py-1.5 px-4 rounded-xl text-xs gap-1.5 font-mono"
                >
                  {isNetworkForwarding ? (
                    <>
                      <RefreshCw className="w-3 h-3 animate-spin" /> Forwarding...
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3" /> Run Forward Pass
                    </>
                  )}
                </button>
                
                {outputs.length > 0 && (
                  <div className="text-[10px] font-mono text-[#10b981] flex gap-2 border border-[#10b981]/20 bg-[#10b981]/5 px-2.5 py-1 rounded-lg">
                    <span>Out[0]: {outputs[0]}</span>
                    <span>Out[1]: {outputs[1]}</span>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* Dedicated Chat Console Side */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#141416] border border-zinc-900 rounded-2xl overflow-hidden flex flex-col h-[480px]">
            
            {/* Header info */}
            <div className="px-4 py-3 bg-[#0d0d10] border-b border-zinc-900 flex justify-between items-center text-xs">
              <span className="font-bold text-white font-display">Aether Dedicated Console</span>
              <span className="font-mono text-[9px] text-[#e82127] bg-[#e82127]/10 px-2 py-0.5 rounded">RAG grounded</span>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#0c0c0e] space-y-4">
              {messages.length === 0 ? (
                <div className="text-zinc-600 text-center py-36 font-sans text-xs space-y-1">
                  <p>AI Lab Assistant console ready.</p>
                  <p className="text-[10px] text-zinc-700">Ask questions about neural layers, data tokenizers, or skills.</p>
                </div>
              ) : (
                messages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div 
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                        m.role === "user" 
                          ? "bg-[#e82127] text-white rounded-br-none" 
                          : "bg-[#1e1e22] text-zinc-300 rounded-bl-none border border-zinc-800"
                      }`}
                    >
                      <p>{m.text}</p>
                    </div>
                  </div>
                ))
              )}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#1e1e22] text-zinc-500 rounded-2xl rounded-bl-none border border-zinc-800 px-3 py-2 text-xs font-mono animate-pulse">
                    Thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input form */}
            <div className="p-3 bg-[#0d0d10] border-t border-zinc-900 flex gap-2">
              <input
                type="text"
                placeholder="Ask playground questions..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSendChat()}
                className="flex-1 bg-zinc-950 border border-zinc-800 text-white px-3 py-2 rounded-xl text-xs focus:outline-none placeholder-zinc-650"
              />
              <button
                onClick={handleSendChat}
                className="bg-[#e82127] hover:bg-[#ff333a] text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Send
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
