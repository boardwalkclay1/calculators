import { CalculatorCore } from "../core/calculator-core.js";
import { createSecretEngine } from "../core/secret-engine.js";

const displayMain = document.getElementById("display-main");
const displaySecondary = document.getElementById("display-secondary");
const secretPanel = document.getElementById("secret-panel");
const secretClose = document.getElementById("secret-close");
const contactsList = document.getElementById("contacts-list");
const addContactBtn = document.getElementById("add-contact-btn");

let contacts = loadContacts();

function loadContacts() {
  try {
    const raw = localStorage.getItem("contacts-calculator");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveContacts() {
  localStorage.setItem("contacts-calculator", JSON.stringify(contacts));
}

function renderContacts() {
  contactsList.innerHTML = "";
  if (!contacts.length) {
    contactsList.innerHTML =
      '<div style="font-size:0.8rem;color:#9ca3af;">No contacts yet.</div>';
    return;
  }

  contacts.forEach((c, idx) => {
    const row = document.createElement("div");
    row.className = "contact-row";

    const main = document.createElement("div");
    main.className = "contact-main";

    const name = document.createElement("div");
    name.className = "contact-name";
    name.textContent = c.name;

    const number = document.createElement("div");
    number.className = "contact-number";
    number.textContent = c.number;

    main.appendChild(name);
    main.appendChild(number);

    const actions = document.createElement("div");
    actions.className = "contact-actions";

    const callBtn = document.createElement("button");
    callBtn.textContent = "Call";
    callBtn.onclick = () => {
      window.location.href = `tel:${c.number}`;
    };

    const textBtn = document.createElement("button");
    textBtn.textContent = "Text";
    textBtn.onclick = () => {
      window.location.href = `sms:${c.number}`;
    };

    const emailBtn = document.createElement("button");
    emailBtn.textContent = "Email";
    emailBtn.onclick = () => {
      if (!c.email) return;
      window.location.href = `mailto:${c.email}`;
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "×";
    delBtn.onclick = () => {
      contacts.splice(idx, 1);
      saveContacts();
      renderContacts();
    };

    actions.appendChild(callBtn);
    actions.appendChild(textBtn);
    if (c.email) actions.appendChild(emailBtn);
    actions.appendChild(delBtn);

    row.appendChild(main);
    row.appendChild(actions);
    contactsList.appendChild(row);
  });
}

function openVault() {
  renderContacts();
  secretPanel.classList.add("active");
}

function closeVault() {
  secretPanel.classList.remove("active");
}

secretClose.addEventListener("click", closeVault);

addContactBtn.addEventListener("click", () => {
  const number = prompt("Phone number:");
  if (!number) return;
  const name = prompt("Name:");
  if (!name) return;
  const email = prompt("Email (optional):") || "";
  contacts.push({ name, number, email });
  saveContacts();
  renderContacts();
});

const secretHandler = createSecretEngine({
  onOpenContactsVault: openVault,
  onOpenContactsEntry: () => {
    const number = prompt("Phone number:");
    if (!number) return;
    const name = prompt("Name:");
    if (!name) return;
    const email = prompt("Email (optional):") || "";
    contacts.push({ name, number, email });
    saveContacts();
  }
});

const core = new CalculatorCore({
  displayMain,
  displaySecondary,
  onSecretSequence: secretHandler
});

document.querySelectorAll(".calc-btn").forEach((btn) => {
  const digit = btn.dataset.digit;
  const op = btn.dataset.op;
  const action = btn.dataset.action;

  if (digit !== undefined) {
    btn.addEventListener("click", () => core.handleDigit(digit));
  } else if (op) {
    btn.addEventListener("click", () => core.handleOperator(op));
  } else if (action) {
    btn.addEventListener("click", () => {
      switch (action) {
        case "ac":
          core.handleClear(true);
          break;
        case "sign":
          core.handleSign();
          break;
        case "percent":
          core.handlePercent();
          break;
        case "dot":
          core.handleDot();
          break;
        case "equals":
          core.handleEquals();
          break;
        default:
          break;
      }
    });
  }
});
