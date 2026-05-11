export class CalculatorCore {
  constructor({ displayMain, displaySecondary, onSecretSequence }) {
    this.displayMain = displayMain;
    this.displaySecondary = displaySecondary;
    this.onSecretSequence = onSecretSequence;

    this.current = "0";
    this.previous = "";
    this.operator = null;
    this.sequence = "";
  }

  updateDisplay() {
    this.displayMain.textContent = this.current;
    this.displaySecondary.textContent = this.previous
      ? `${this.previous} ${this.operator || ""}`
      : "";
  }

  handleDigit(d) {
    this.sequence += d;
    if (this.sequence.length > 8) this.sequence = this.sequence.slice(-8);
    if (this.onSecretSequence) this.onSecretSequence(this.sequence);

    if (this.current === "0") this.current = d;
    else this.current += d;
    this.updateDisplay();
  }

  handleDot() {
    if (!this.current.includes(".")) {
      this.current += ".";
      this.updateDisplay();
    }
  }

  handleClear(all = false) {
    if (all) {
      this.current = "0";
      this.previous = "";
      this.operator = null;
      this.sequence = "";
    } else {
      this.current = "0";
    }
    this.updateDisplay();
  }

  handleOperator(op) {
    if (this.current === "" && !this.previous) return;
    if (this.previous) {
      this.compute();
    } else {
      this.previous = this.current;
      this.current = "0";
    }
    this.operator = op;
    this.updateDisplay();
  }

  compute() {
    const a = parseFloat(this.previous || "0");
    const b = parseFloat(this.current || "0");
    let result = b;

    switch (this.operator) {
      case "+":
        result = a + b;
        break;
      case "-":
        result = a - b;
        break;
      case "×":
        result = a * b;
        break;
      case "÷":
        result = b === 0 ? 0 : a / b;
        break;
    }

    this.current = String(result);
    this.previous = "";
    this.operator = null;
    this.updateDisplay();
  }

  handleEquals() {
    if (!this.operator || !this.previous) return;
    this.compute();
  }

  handlePercent() {
    const val = parseFloat(this.current || "0");
    this.current = String(val / 100);
    this.updateDisplay();
  }

  handleSign() {
    if (this.current.startsWith("-")) this.current = this.current.slice(1);
    else if (this.current !== "0") this.current = "-" + this.current;
    this.updateDisplay();
  }
}
