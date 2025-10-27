import { invoices } from "./data.js";

const tbody = document.getElementById("invoice-body");
const countEl = document.getElementById("invoiceCount"); // ← updated ID
const tabButtons = document.querySelectorAll(".tab");

function renderInvoices(filter = "all") {
  tbody.innerHTML = "";

  let filtered = invoices;

  if (filter === "paid") {
    filtered = invoices.filter(inv => parseFloat(inv.amountOwed.replace("$", "")) === 0);
  } else if (filter === "owed") {
    filtered = invoices.filter(inv => parseFloat(inv.amountOwed.replace("$", "")) > 0);
  }

  // Insert invoice rows
  filtered.forEach(inv => {
    const row = `
      <tr>
        <td>${inv.date}</td>
        <td>${inv.summary}</td>
        <td>${inv.amountPaid}</td>
        <td>${inv.amountOwed}</td>
        <td><button class="btn btn-sm btn-outline-light">${inv.action}</button></td>
      </tr>
    `;
    tbody.insertAdjacentHTML("beforeend", row);
  });

  // Calculate totals
  let totalPaid = 0;
  let totalOwed = 0;

  filtered.forEach(inv => {
    totalPaid += parseFloat(inv.amountPaid.replace("$", "")) || 0;
    totalOwed += parseFloat(inv.amountOwed.replace("$", "")) || 0;
  });

  // Update total values in tfoot
  document.getElementById("total-paid").textContent = `$${totalPaid.toFixed(2)}`;
  document.getElementById("total-owed").textContent = `$${totalOwed.toFixed(2)}`;

  // Update invoice count text
  if (countEl) {
    const label = filtered.length === 1 ? "Invoice" : "Invoices";
    countEl.textContent = `${filtered.length} ${label}`;
  }
}

// Handle tab filtering
tabButtons.forEach(tab => {
  tab.addEventListener("click", () => {
    tabButtons.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    renderInvoices(tab.dataset.filter);
  });
});

// Initial render
renderInvoices();
