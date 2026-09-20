(function () {
  function createHeader() {
    const container = document.getElementById("portal-header");
    if (!container) return;

    container.innerHTML = `
       
       
      <header class="r2r-header">
        
            <div class="brand">         
                    <img src="img/selogo.svg" alt="Schneider Electric logo" width="180" height="52" style="display:block; width:180px; height:auto;">
            </div>

        <nav class="r2r-navigation" aria-label="Navegación principal">
          <a class="r2r-home" href="index.html">Home</a>

          <details class="r2r-group">
            <summary>Review</summary>
            <div class="r2r-links">
              <a href="agenda.html">Agenda</a>
              <a href="objectives-actions.html">
                Objectives & Previous Actions
              </a>
            </div>
          </details>

          <details class="r2r-group">
            <summary>Capabilities</summary>
            <div class="r2r-links">
              <a href="capability-accounting.html">Accounting</a>
              <a href="capability-accounting-operations.html">
                Accounting Operations
              </a>
              <a href="capability-close-reconciliation.html">
                Close & Reconciliation
              </a>
              <a href="capability-intercompany-consolidation.html">
                Intercompany & Consolidation
              </a>
              <a href="capability-reporting-disclosure.html">
                Reporting & Disclosure
              </a>
              <a href="capability-controls-assurance.html">
                Controls & Assurance
              </a>
            </div>
          </details>

          <details class="r2r-group">
            <summary>Portfolio</summary>
            <div class="r2r-links">
              <a href="innovation-pipeline.html">Innovation Pipeline</a>
              <a href="portfolio-review.html">Portfolio Review</a>
              <a href="investment-roadmap.html">Investment Roadmap</a>
            </div>
          </details>

          <details class="r2r-group">
            <summary>Governance</summary>
            <div class="r2r-links">
              <a href="architecture-topics.html">Architecture</a>
              <a href="decision-log.html">Decision Log</a>
              <a href="actions-escalations.html">
                Actions & Escalations
              </a>
            </div>
          </details>
        </nav>
      </header>
    `;

    // Activa apertura por hover solo con ratón.
    // En dispositivos táctiles se mantiene la apertura mediante pulsación.
    const hoverSupported = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
    );

    container.querySelectorAll(".r2r-group").forEach(group => {
    group.addEventListener("mouseenter", () => {
        if (hoverSupported.matches) {
        group.open = true;
        }
    });

    group.addEventListener("mouseleave", () => {
        if (hoverSupported.matches) {
        group.open = false;
        }
    });
    });

    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";

    container.querySelectorAll("nav a").forEach(link => {
      if (link.getAttribute("href") === currentPage) {
        link.setAttribute("aria-current", "page");

        const group = link.closest("details");
        if (group) group.classList.add("r2r-current-group");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createHeader);
  } else {
    createHeader();
  }
})();