import { useState, useRef, useEffect } from "react";
import { Send, Activity, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import ReactMarkdown from "react-markdown";

export default function AskPulseBoard() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const buildContext = (snapshots) => {
    const BOARD_IDS = ['18413113348', '18413113346', '18413113347'];
    return BOARD_IDS.map(boardId => {
      const snap = snapshots.find(s => s.board_id === boardId);
      if (!snap) return { board_name: boardId, items: [] };
      let rawItems = [];
      try { rawItems = JSON.parse(snap.raw_items_json); } catch { rawItems = []; }
      return {
        board_name: snap.board_name,
        items: rawItems.map(item => {
          const flat = { id: item.id, name: item.name, updated_at: item.updated_at };
          (item.column_values || []).forEach(cv => {
            if (cv.text && cv.text.trim() && cv.column?.title) {
              flat[cv.column.title] = cv.text.trim();
            }
          });
          return flat;
        }),
      };
    });
  };

  const handleSend = async () => {
    const q = input.trim();
    if (!q || loading) return;

    setInput("");
    setMessages(prev => [...prev, { role: "user", content: q }]);
    setLoading(true);

    const user = await base44.auth.me();
    let answer = "";

    try {
      const snapshots = await base44.entities.BoardSnapshot.list('-fetched_at', 10);
      const context = buildContext(snapshots);

      const systemPrompt = `You are PulseBoard's data assistant. You answer questions about three monday.com boards (Bug Tracker, Engineering Sprint, Marketing Campaigns) using ONLY the data provided in the CONTEXT block. Do not invent items, statuses, owners, or numbers. If the question cannot be answered from CONTEXT, say so plainly and suggest which board might have the relevant data.

When citing items, use their actual names from CONTEXT. When citing counts, count them yourself from CONTEXT — never estimate or round. Prefer concrete numbers ("3 items are stuck") over vague phrases ("a few items are stuck").

When asked for counts or aggregates, count items one at a time through the data, then state the final count. Do not estimate. Do not round. If you are uncertain, say "I count X items matching that criterion based on the data provided" and explain what you matched.

Keep responses under 4 sentences unless the user explicitly asks for detail.`;

      const userMessage = `Question: ${q}\n\nCONTEXT:\n${JSON.stringify(context, null, 2)}`;

      answer = await base44.integrations.Core.InvokeLLM({
        prompt: `${systemPrompt}\n\n---\n\n${userMessage}`,
        model: 'gpt_5_4',
      });

    } catch (err) {
      answer = "Sorry, I couldn't generate an answer right now. Please try again.";
    }

    setMessages(prev => [...prev, { role: "assistant", content: answer }]);
    setLoading(false);

    await base44.entities.ChatQuery.create({
      user_email: user.email,
      question: q,
      answer,
    });
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
              "How many critical bugs are open?" · "What's the sprint velocity trend?""
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
            <div className={`max-w-[70%] rounded-lg px-4 py-3 text-[13px] leading-relaxed ${msg.role === "user"
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