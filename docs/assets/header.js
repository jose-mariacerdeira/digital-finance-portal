document.addEventListener("DOMContentLoaded", () => {
  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  const links = [
    ["index.html", "Home"],
    ["agenda.html", "Agenda"],
    ["objectives-actions.html", "Objectives"],
    ["capability-accounting.html", "Capabilities"],
    ["innovation-pipeline.html", "Innovation"],
    ["portfolio-review.html", "Portfolio"],
    ["architecture-topics.html", "Architecture"],
    ["investment-roadmap.html", "Investment"],
    ["decision-log.html", "Decisions"],
    ["actions-escalations.html", "Actions"]
  ];

  const navigation = links
    .map(([url, label]) => {
      const active = currentPage === url ? "active" : "";

      return `<a class="${active}" href="${url}">${label}</a>`;
    })
    .join("");

  document.getElementById("portal-header").innerHTML = `
    <header class="top">
     <div class="bar">
            <div class="brand">         
                    <img src="img/selogo.svg" alt="Schneider Electric logo" width="180" height="52" style="display:block; width:180px; height:auto;">
            </div>

            <nav class="nav">
            ${navigation}
            </nav>

            <span class="mobile">Menu</span>
        </div>
    </header>
  `;
});