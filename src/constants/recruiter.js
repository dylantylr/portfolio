// Point this at your deployed worker. Set VITE_ASSISTANT_URL in a .env file to
// override it locally without editing this file.
export const ASSISTANT_URL =
  import.meta.env.VITE_ASSISTANT_URL ||
  "https://dylan-recruiter-assistant.dylantylr.workers.dev";

export const MESSAGE_LIMIT = 10;

export const recruiterProfile = {
  name: "Dylan Taylor",
  title: "Software Engineer at Atlassian",
  location: "San Francisco, CA",
  availability: "Open to interesting opportunities",
};

export const quickQuestions = [
  {
    id: "summary",
    label: "Give me the 30-second summary",
    prompt: "Give me a 30-second summary of Dylan's background.",
  },
  {
    id: "current",
    label: "What does he do at Atlassian?",
    prompt: "What does Dylan work on at Atlassian day to day?",
  },
  {
    id: "impact",
    label: "Biggest impact so far",
    prompt:
      "What is the most significant impact Dylan has had in his work so far?",
  },
  {
    id: "stack",
    label: "What's his tech stack?",
    prompt:
      "What languages and technologies does Dylan work with most, and how deeply?",
  },
  {
    id: "backend",
    label: "Backend or platform experience?",
    prompt:
      "How much backend and platform engineering experience does Dylan have?",
  },
  {
    id: "education",
    label: "Education and certifications",
    prompt: "What is Dylan's education and what certifications does he hold?",
  },
];
