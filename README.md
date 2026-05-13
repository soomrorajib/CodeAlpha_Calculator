# 🧮 Calculator

A clean, fully functional calculator built with **HTML**, **CSS**, and **vanilla JavaScript** — no frameworks, no dependencies.

## ✨ Features

- ➕ All four arithmetic operations: `+`, `−`, `×`, `÷`
- 🔗 Chained operations (e.g. `5 + 3 × 2`)
- 📟 Live expression display while typing
- ⌨️ Full keyboard support
- ⌫ Backspace to delete last digit
- 🔁 Sign toggle (`+/−`) and percentage (`%`)
- 🚫 Division by zero error handling
- 📐 Auto font-scaling for long numbers
- 📱 Responsive — works on mobile and desktop
- ♿ Accessible — ARIA labels and focus-visible rings

## 📁 Project Structure

```
calculator/
├── index.html       ← Main HTML file
├── css/
│   └── style.css    ← All styles (dark theme, grid layout)
├── js/
│   └── calculator.js ← Calculator logic (state machine)
└── README.md
```

## 🚀 Getting Started

No build step required. Just open `index.html` in any browser:

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/calculator.git

# Open in browser
cd calculator
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

Or deploy instantly to:
- **GitHub Pages** — push to `main`, enable Pages in repo settings
- **Netlify** — drag and drop the folder
- **Vercel** — `vercel --prod`

## ⌨️ Keyboard Shortcuts

| Key | Action |
|---|---|
| `0` – `9` | Input digits |
| `.` | Decimal point |
| `+` `-` `*` `/` | Operators |
| `Enter` or `=` | Evaluate |
| `Escape` | Clear all (AC) |
| `Backspace` | Delete last digit |
| `%` | Percentage |

## 🎨 Design

Dark themed interface with a deep navy palette and coral/red accent color for operators. Monospace font on the display for that authentic calculator feel.

## 📄 License

MIT — free to use, modify, and distribute.
