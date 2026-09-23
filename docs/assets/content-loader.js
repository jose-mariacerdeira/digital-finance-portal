/* Trusted portal JSON only: HTML formatting is rendered as in the original loader. */
(function () {
  let explorerSequence = 0;
  async function loadContent() {
    const source = document.body.dataset.contentFile;
    if (!source) return;
    try {
      const response = await fetch(source, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if (data.pageTitle) document.title = data.pageTitle;
      Object.entries(data.content || {}).forEach(([key, value]) => {
        document.querySelectorAll(`[data-bind="${CSS.escape(key)}"]`).forEach(element => {
          element.innerHTML = value ?? '';
        });
      });
      (data.tables || []).forEach(definition => {
        const id = CSS.escape(definition.id);
        document.querySelectorAll(`table[data-table="${id}"]`).forEach(table => renderTable(table, definition));
        document.querySelectorAll(`[data-assessment="${id}"]`).forEach(container => renderAssessment(container, definition));
      });
      document.body.classList.remove('content-load-error');
      document.dispatchEvent(new CustomEvent('portal:content-loaded'));
    } catch (error) {
      console.error(`Unable to load ${source}`, error);
      document.body.classList.add('content-load-error');
    }
  }

  function setCellContent(element, cell) {
    element.innerHTML = cell?.html ?? '';
    if (cell?.class) element.classList.add(...cell.class.split(/\s+/).filter(Boolean));
  }

  function renderTable(table, definition) {
    table.replaceChildren();
    if (definition.headers?.length) {
      const row = table.createTHead().insertRow();
      definition.headers.forEach(cell => {
        const th = document.createElement('th');
        th.scope = 'col';
        setCellContent(th, cell);
        row.append(th);
      });
    }
    const tbody = table.createTBody();
    (definition.rows || []).forEach(rowData => {
      const row = tbody.insertRow();
      rowData.forEach(cell => setCellContent(row.insertCell(), cell));
    });
  }

  function plain(cell) {
    const template = document.createElement('template');
    template.innerHTML = cell?.html ?? '';
    template.content.querySelectorAll('br').forEach(br => br.replaceWith(' '));
    return template.content.textContent.trim();
  }

  function renderAssessment(container, definition) {
    container.classList.add('capability-explorer');
    container.replaceChildren();
    const rows = definition.rows || [];
    if (!rows.length) {
      const message = document.createElement('p');
      message.textContent = 'No sub-capabilities available.';
      container.append(message);
      return;
    }
    // Default schema: Name, Purpose, Current, Target, Priority, Initiatives, Radar.
    // All indexes are zero-based. Override on the container if columns differ.
    function index(name, fallback) {
      const raw = container.getAttribute(`data-${name}-column`);
      const value = raw === null ? fallback : Number(raw);
      return Number.isInteger(value) && value >= 0 ? value : -1;
    }
    const nameIndex = index('name', 0);
    const currentIndex = index('current', 2);
    const targetIndex = index('target', 3);
    const prefix = `capability-explorer-${++explorerSequence}`;
    const navigation = document.createElement('nav');
    navigation.className = 'ce-list';
    navigation.setAttribute('aria-label', 'Sub-capabilities');
    const detail = document.createElement('article');
    detail.className = 'ce-detail';
    detail.id = `${prefix}-detail`;
    detail.setAttribute('aria-live', 'polite');
    container.append(navigation, detail);
    const buttons = [];
    const columnCount = Math.max(definition.headers?.length || 0, ...rows.map(row => row.length));

    function field(row, column) {
      const section = document.createElement('section');
      section.className = 'ce-field';
      const heading = document.createElement('h4');
      heading.textContent = plain(definition.headers?.[column]) || `Column ${column + 1}`;
      const value = document.createElement('div');
      value.className = 'ce-value';
      setCellContent(value, row[column]);
      section.append(heading, value);
      return section;
    }

    function select(row, rowIndex) {
      buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === rowIndex)));
      detail.replaceChildren();
      const title = document.createElement('h3');
      title.id = `${prefix}-title`;
      title.textContent = plain(row[nameIndex]) || `Sub-capability ${rowIndex + 1}`;
      detail.setAttribute('aria-labelledby', title.id);
      detail.append(title);
      const pair = new Set([currentIndex, targetIndex].filter(i => i >= 0 && i < columnCount && i !== nameIndex));
      const pairStart = pair.size ? Math.min(...pair) : -1;
      for (let column = 0; column < columnCount; column++) {
        if (column === nameIndex) continue;
        if (column === pairStart) {
          const comparison = document.createElement('div');
          comparison.className = 'ce-comparison';
          [...pair].forEach(i => comparison.append(field(row, i)));
          detail.append(comparison);
        }
        if (!pair.has(column)) detail.append(field(row, column));
      }
    }
    rows.forEach((row, i) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'ce-choice';
      button.textContent = plain(row[nameIndex]) || `Sub-capability ${i + 1}`;
      button.setAttribute('aria-controls', detail.id);
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => select(row, i));
      buttons.push(button);
      navigation.append(button);
    });
    select(rows[0], 0);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadContent, { once: true });
  } else {
    loadContent();
  }
})();
