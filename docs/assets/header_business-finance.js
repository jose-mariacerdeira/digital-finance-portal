(function () {
  function createHeader() {
    const container = document.getElementById("portal-header");
    if (!container) return;

    container.innerHTML = `
       
       
      <header class="dynamic_menu-header">
        
        <div class="brand">         
            <img src="../img/selogo.svg" alt="Schneider Electric logo" width="180" height="52" style="display:block; width:180px; height:auto;">
        </div>

        <nav class="dynamic_menu-navigation" aria-label="Navegación principal">
          <a class="dynamic_menu-home" href="../index.html">Home</a>

          <details class="dynamic_menu-group"> 
            <summary>Review</summary>
            <div class="dynamic_menu-links">
              <a href="agenda.html">Agenda</a>
              <a href="objectives-actions.html">
                Objectives & Previous Actions
              </a>
            </div>
          </details>

          <details class="dynamic_menu-group">
            <summary>Capabilities</summary>
            <div class="dynamic_menu-links">
              <a href="capability-forecasting.html">Forecasting</a>
              <a href="capability-performance-management.html">Performance Management</a>
              <a href="capability-data-reporting-analytics.html">Data Reporting & Analytics</a>
              <a href="capability-specialized-operational-forecasting.html">Specialized Operational Forecasting</a>
              
            </div>
          </details>

          <details class="dynamic_menu-group">
            <summary>Portfolio</summary>
            <div class="dynamic_menu-links">
              <a href="innovation-pipeline.html">Innovation Pipeline</a>
              <a href="portfolio-review.html">Portfolio Review</a>
              <a href="investment-roadmap.html">Investment Roadmap</a>
            </div>
          </details>

          <details class="dynamic_menu-group">
            <summary>Governance</summary>
            <div class="dynamic_menu-links">
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

    container.querySelectorAll(".dynamic_menu-group").forEach(group => {
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