import { useState, useRef, useEffect } from "react";
import { Send, Activity, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { mockAiResponses } from "@/lib/mockData";
import ReactMarkdown from "react-markdown";

export default function AskPulseBoard() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const mockIndex = useRef(0);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    const q = input.trim();
    if (!q || loading) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", content: q }]);
    setLoading(true);

    // Mock delay
    await new Promise(r => setTimeout(r, 1200));

    const answer = mockAiResponses[mockIndex.current % mockAiResponses.length];
    mockIndex.current++;

    setMessages(prev => [...prev, { role: "assistant", content: answer }]);
    setLoading(false);

    // Save to ChatQuery (fire-and-forget)
    try {
      const user = await base44.auth.me();
      await base44.entities.ChatQuery.create({
        user_email: user.email,
        question: q,
        answer: answer,
      });
    } catch (e) {
      // silent — mock mode
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="px-6 h-14 flex items-center border-b border-border flex-shrink-0">
        <h1 className="text-sm font-semibold text-foreground tracking-tight">Ask PulseBoard</h1>
        <span className="ml-2 text-[11px] font-mono text-muted-foreground">natural-language queries across boards</span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
              <Activity className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Ask anything about your boards</p>
            <p className="text-[12px] text-muted-foreground mt-1 max-w-sm">
              "How many critical bugs are open?" · "What's the sprint velocity trend?" · "Which campaign has the best CAC?"
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Activity className="h-3.5 w-3.5 text-primary" />
              </div>
            )}
            <div className={`max-w-[70%] rounded-lg px-4 py-3 text-[13px] leading-relaxed ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-foreground"
            }`}>
              {msg.role === "assistant" ? (
                <ReactMarkdown className="prose prose-sm prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_strong]:text-foreground [&_p]:my-1">
                  {msg.content}
                </ReactMarkdown>
              ) : (
                <p>{msg.content}</p>
              )}
            </div>
            {msg.role === "user" && (
              <div className="h-7 w-7 rounded-md bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Activity className="h-3.5 w-3.5 text-primary animate-pulse" />
            </div>
            <div className="bg-card border border-border rounded-lg px-4 py-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-6 pb-6 pt-2 border-t border-border flex-shrink-0">
        <div className="flex gap-2 items-end">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about bugs, sprint progress, campaigns..."
            className="resize-none min-h-[44px] max-h-32 bg-secondary border-border text-[13px] focus-visible:ring-1 focus-visible:ring-primary"
            rows={1}
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="h-[44px] w-[44px] flex-shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}