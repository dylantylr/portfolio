import React, { useEffect, useRef, useState } from "react";

import {
  ASSISTANT_URL,
  MESSAGE_LIMIT,
  quickQuestions,
} from "../constants/recruiter";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#915EFF] focus-visible:ring-offset-2 focus-visible:ring-offset-primary";

const SendIcon = () => (
  <svg
    aria-hidden='true'
    viewBox='0 0 20 20'
    className='w-4 h-4'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M4 10h11M10.5 5.5 15 10l-4.5 4.5' />
  </svg>
);

const Bubble = ({ role, text, error }) => {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed break-words ${
          isUser
            ? "bg-[#915EFF] text-white"
            : error
            ? "bg-[#3a1e1e] text-[#ffc9c9]"
            : "bg-black-100 text-white-100"
        }`}
      >
        {text}
      </div>
    </div>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [used, setUsed] = useState(0);

  const logRef = useRef(null);
  const inputRef = useRef(null);

  const remaining = MESSAGE_LIMIT - used;
  const exhausted = remaining <= 0;

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages, loading]);

  const send = async (text) => {
    const question = text.trim();
    if (!question || loading || exhausted) return;

    // Only real exchanges become history, so errors never poison the context.
    const history = messages
      .filter((m) => !m.error)
      .map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInput("");
    setUsed((n) => n + 1);
    setLoading(true);

    try {
      const response = await fetch(ASSISTANT_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: question, history }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: "model",
            error: true,
            text:
              data?.error ||
              "The assistant is unavailable right now. Dylan is reachable at dylnbtylr@gmail.com.",
          },
        ]);
      } else {
        setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          error: true,
          text:
            "Could not reach the assistant. Dylan is reachable at dylnbtylr@gmail.com.",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const started = messages.length > 0;

  return (
    <section
      aria-labelledby='assistant-heading'
      className='rounded-2xl bg-tertiary p-5 sm:p-7'
    >
      <h2 id='assistant-heading' className='text-white text-[22px] font-bold'>
        Ask about Dylan
      </h2>
      <p className='mt-1 text-secondary text-[14px]'>
        Answers come only from Dylan&rsquo;s resume and professional background.
      </p>

      {!started && (
        <div className='mt-5'>
          <h3 className='sr-only'>Suggested questions</h3>
          <ul className='flex flex-wrap gap-2 list-none'>
            {quickQuestions.map((q) => (
              <li key={q.id}>
                <button
                  type='button'
                  onClick={() => send(q.prompt)}
                  disabled={loading}
                  className={`rounded-full border border-white/10 bg-black-100 px-4 py-2 text-[14px] text-white-100 transition-colors duration-200 hover:border-[#915EFF] hover:text-white disabled:opacity-50 touch-manipulation ${focusRing}`}
                >
                  {q.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        ref={logRef}
        role='log'
        aria-live='polite'
        aria-label='Conversation'
        className={`mt-5 flex flex-col gap-3 overflow-y-auto pr-1 ${
          started ? "min-h-[220px] max-h-[420px]" : "min-h-0"
        }`}
      >
        {messages.map((m, i) => (
          <Bubble key={i} role={m.role} text={m.text} error={m.error} />
        ))}

        {loading && (
          <div className='flex justify-start'>
            <div className='rounded-2xl bg-black-100 px-4 py-3'>
              <span className='sr-only'>Thinking</span>
              <span aria-hidden='true' className='flex gap-1'>
                <i className='h-2 w-2 animate-bounce rounded-full bg-secondary [animation-delay:-0.3s]' />
                <i className='h-2 w-2 animate-bounce rounded-full bg-secondary [animation-delay:-0.15s]' />
                <i className='h-2 w-2 animate-bounce rounded-full bg-secondary' />
              </span>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className='mt-5'
      >
        <label htmlFor='assistant-input' className='sr-only'>
          Ask a question about Dylan
        </label>

        <div className='flex gap-2'>
          <input
            id='assistant-input'
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading || exhausted}
            maxLength={600}
            autoComplete='off'
            placeholder={
              exhausted ? "Message limit reached" : "Ask about his experience…"
            }
            className={`flex-1 rounded-lg bg-black-100 px-4 py-3 text-[15px] text-white placeholder:text-secondary border-none disabled:opacity-60 ${focusRing}`}
          />

          <button
            type='submit'
            disabled={loading || exhausted || !input.trim()}
            className={`inline-flex items-center gap-2 rounded-lg bg-[#915EFF] px-5 py-3 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#7d4ae8] disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation ${focusRing}`}
          >
            <span className='hidden sm:inline'>Send</span>
            <SendIcon />
          </button>
        </div>

        <p className='mt-2 text-[13px] text-secondary' aria-live='polite'>
          {exhausted
            ? "That is the limit for this session. Email dylnbtylr@gmail.com to keep the conversation going."
            : `${remaining} ${remaining === 1 ? "message" : "messages"} remaining`}
        </p>
      </form>
    </section>
  );
};

export default Chat;
