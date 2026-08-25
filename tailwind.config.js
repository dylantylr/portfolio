/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  mode: "jit",
  theme: {
    extend: {
      // Mapped onto the CSS variables in index.css, so the existing token
      // names keep working and the whole palette moves in one place.
      colors: {
        primary: "var(--bg)",
        secondary: "var(--text-dim)",
        tertiary: "var(--surface)",
        "black-100": "var(--surface-2)",
        "black-200": "var(--surface)",
        "white-100": "var(--text)",
        accent: "var(--accent)",
        "accent-dim": "var(--accent-dim)",
        line: "var(--line)",
        "line-strong": "var(--line-strong)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      boxShadow: {
        // Hairline lift rather than the template's heavy purple bloom.
        card: "0 1px 0 0 rgba(255,255,255,0.04), 0 18px 40px -24px rgba(0,0,0,0.9)",
      },
      screens: {
        xs: "450px",
      },
    },
  },
  plugins: [
    // text-wrap utilities ship in Tailwind 3.4; this project is on 3.3.
    function ({ addUtilities }) {
      addUtilities({
        ".text-balance": { "text-wrap": "balance" },
        ".text-pretty": { "text-wrap": "pretty" },
      });
    },
  ],
};
