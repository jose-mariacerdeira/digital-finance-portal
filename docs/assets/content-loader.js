(async function () {
  const source = document.body.dataset.contentFile;
  if (!source) return;

  try {
    const response = await fetch(source, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    if (data.pageTitle) document.title = data.pageTitle;
    Object.entries(data.content || {}).forEach(([key, value]) => {
      const element = document.querySelector(`[data-bind="${CSS.escape(key)}"]`);
      if (element) element.textContent = value ?? '';
    });

    (data.tables || []).forEach((definition) => {
      const table = document.querySelector(`[data-table="${CSS.escape(definition.id)}"]`);
      if (!table) return;
      table.replaceChildren();

      if (definition.headers?.length) {
        const thead = table.createTHead();
        const row = thead.insertRow();
        definition.headers.forEach((cellData) => addCell(row, 'th', cellData));
      }

      const tbody = table.createTBody();
      (definition.rows || []).forEach((rowData) => {
        const row = tbody.insertRow();
        rowData.forEach((cellData) => addCell(row, 'td', cellData));
      });
    });
  } catch (error) {
    console.error(`Unable to load ${source}`, error);
    document.body.classList.add('content-load-error');
  }

  function addCell(row, tagName, cellData) {
    const cell = document.createElement(tagName);
    cell.innerHTML = cellData?.html ?? '';
    if (cellData?.class) cell.className = cellData.class;
    row.appendChild(cell);
  }
})();
