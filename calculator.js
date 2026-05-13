/**
 * Calculator — js/calculator.js
 *
 * Features:
 *  - All four arithmetic operations: +, −, ×, ÷
 *  - Chained operations
 *  - Percentage and sign toggle
 *  - Division by zero error handling
 *  - Keyboard support (0-9, ., +, -, *, /, Enter, Escape, Backspace, %)
 *  - Active operator highlight
 *  - Result font scaling for long numbers
 */

(function () {
  "use strict";

  /* ── State ── */
  let current    = "0";   // number currently being built
  let previous   = "";    // left-hand operand
  let operator   = null;  // pending operator
  let freshEntry = false; // next digit replaces current
  let justEvaled = false; // just pressed = ; next op chains from result

  /* ── DOM refs ── */
  const resultEl = document.getElementById("result");
  const exprEl   = document.getElementById("expr");
  const keysEl   = document.getElementById("keys");

  /* ── Helpers ── */

  /**
   * Format a number for display: remove floating-point noise,
   * fall back to exponential for very large/small values.
   */
  function fmt(n) {
    const num = parseFloat(n);
    if (isNaN(num)) return "Error";
    // Remove float noise (e.g. 0.1 + 0.2 = 0.30000000000000004)
    const rounded = parseFloat(num.toPrecision(10));
    if (Math.abs(rounded) >= 1e12 || (Math.abs(rounded) < 1e-7 && rounded !== 0)) {
      return rounded.toExponential(4);
    }
    return String(rounded);
  }

  /** Render current number and scale font to fit */
  function render() {
    const display = current === "Error" ? "Error" : current;
    resultEl.textContent = display;
    resultEl.classList.toggle("error", current === "Error");

    const len = display.length;
    resultEl.classList.remove("shrink", "xshrink");
    if (len > 12) resultEl.classList.add("xshrink");
    else if (len > 9) resultEl.classList.add("shrink");
  }

  /** Highlight the active operator button */
  function highlightOp(op) {
    document.querySelectorAll(".key.op").forEach((btn) => {
      btn.classList.toggle("active-op", btn.dataset.val === op);
    });
  }

  /** Perform arithmetic */
  function calculate(a, op, b) {
    a = parseFloat(a);
    b = parseFloat(b);
    switch (op) {
      case "+": return a + b;
      case "−": return a - b;
      case "×": return a * b;
      case "÷": return b === 0 ? null : a / b;
      default:  return b;
    }
  }

  /* ── Action Handlers ── */

  function handleDigit(val) {
    if (justEvaled) { current = "0"; justEvaled = false; }
    if (freshEntry) { current = val; freshEntry = false; return; }
    if (current.length >= 15) return;
    current = current === "0" ? val : current + val;
  }

  function handleDot() {
    if (justEvaled) { current = "0"; justEvaled = false; }
    if (freshEntry) { current = "0"; freshEntry = false; }
    if (!current.includes(".")) current += ".";
  }

  function handleOperator(op) {
    if (current === "Error") return;
    // If there's already a pending operator and we haven't entered a new number,
    // just swap the operator.
    if (operator && freshEntry) {
      operator = op;
      exprEl.textContent = previous + " " + op;
      highlightOp(op);
      return;
    }
    // Chain: evaluate the pending operation first
    if (operator && !freshEntry) {
      const result = calculate(previous, operator, current);
      if (result === null) { current = "Error"; render(); return; }
      current = fmt(result);
      render();
    }
    previous   = current;
    operator   = op;
    freshEntry = true;
    justEvaled = false;
    exprEl.textContent = previous + " " + op;
    highlightOp(op);
  }

  function handleEquals() {
    if (!operator || current === "Error") return;
    const expr = previous + " " + operator + " " + current + " =";
    const result = calculate(previous, operator, current);
    if (result === null) {
      current = "Error";
    } else {
      current = fmt(result);
    }
    exprEl.textContent = expr;
    operator   = null;
    freshEntry = false;
    justEvaled = true;
    highlightOp(null);
    render();
  }

  function handleClear() {
    current    = "0";
    previous   = "";
    operator   = null;
    freshEntry = false;
    justEvaled = false;
    exprEl.textContent = "";
    highlightOp(null);
    render();
  }

  function handleSign() {
    if (current === "0" || current === "Error") return;
    current = current.startsWith("-") ? current.slice(1) : "-" + current;
    render();
  }

  function handlePercent() {
    if (current === "Error") return;
    current = fmt(parseFloat(current) / 100);
    render();
  }

  function handleBackspace() {
    if (justEvaled || freshEntry || current === "Error") {
      current = "0";
    } else if (current.length > 1) {
      current = current.slice(0, -1);
    } else {
      current = "0";
    }
    render();
  }

  /* ── Dispatch ── */
  function dispatch(action, val) {
    switch (action) {
      case "digit":   handleDigit(val); render(); break;
      case "dot":     handleDot();      render(); break;
      case "op":      handleOperator(val);        break;
      case "equals":  handleEquals();             break;
      case "clear":   handleClear();              break;
      case "sign":    handleSign();               break;
      case "percent": handlePercent();            break;
    }
  }

  /* ── Mouse / Touch ── */
  keysEl.addEventListener("click", function (e) {
    const btn = e.target.closest("button");
    if (!btn) return;
    dispatch(btn.dataset.action, btn.dataset.val);
  });

  /* ── Keyboard ── */
  const keyMap = {
    "0": ["digit", "0"], "1": ["digit", "1"], "2": ["digit", "2"],
    "3": ["digit", "3"], "4": ["digit", "4"], "5": ["digit", "5"],
    "6": ["digit", "6"], "7": ["digit", "7"], "8": ["digit", "8"],
    "9": ["digit", "9"],
    ".": ["dot"],
    ",": ["dot"],
    "Enter":     ["equals"],
    "=":         ["equals"],
    "Escape":    ["clear"],
    "Backspace": ["backspace"],
    "Delete":    ["clear"],
    "+": ["op", "+"],
    "-": ["op", "−"],
    "*": ["op", "×"],
    "/": ["op", "÷"],
    "%": ["percent"],
  };

  document.addEventListener("keydown", function (e) {
    const mapped = keyMap[e.key];
    if (!mapped) return;

    // Prevent "/" from opening browser quick-find
    e.preventDefault();

    const [action, val] = mapped;

    if (action === "backspace") {
      handleBackspace();
    } else {
      dispatch(action, val);
    }

    // Visual key-press feedback
    flashKey(action, val);
  });

  /** Briefly add .pressed class to the matching DOM button */
  function flashKey(action, val) {
    let btn = null;
    if (action === "digit" || action === "op") {
      btn = keysEl.querySelector(`[data-val="${CSS.escape(val)}"]`);
    } else {
      btn = keysEl.querySelector(`[data-action="${action}"]`);
    }
    if (!btn) return;
    btn.classList.add("pressed");
    setTimeout(() => btn.classList.remove("pressed"), 130);
  }

  /* ── Init ── */
  render();
})();
