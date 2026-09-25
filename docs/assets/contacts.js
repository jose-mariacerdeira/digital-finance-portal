/* Independent of content-loader.js. Paths to photos are relative to the JSON file. */
(() => {
  if (customElements.get('portal-contacts')) return;
  class PortalContacts extends HTMLElement {
    static get observedAttributes() { return ['src', 'contact-id']; }
    connectedCallback() { this.load(); }
    attributeChangedCallback() { if (this.isConnected) this.load(); }
    disconnectedCallback() { this.request?.abort(); }
    async load() {
      this.request?.abort();
      const request = new AbortController();
      this.request = request;
      this.replaceChildren();
      const source = this.getAttribute('src');
      if (!source) { this.removeAttribute('aria-busy'); return; }
      this.setAttribute('aria-busy', 'true');
      try {
        const url = new URL(source, document.baseURI);
        const response = await fetch(url, {cache: 'no-store', signal: request.signal});
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data.contacts)) throw new Error('JSON must contain a contacts array');
        if (request.signal.aborted) return;
        const selectedId = this.getAttribute('contact-id');
        let contacts = data.contacts;
        if (selectedId !== null) {
          const person = contacts.find(contact => String(contact.id ?? '') === selectedId.trim() && selectedId.trim() !== '');
          if (!person) {
            const message = document.createElement('p');
            message.className = 'pc-error';
            message.setAttribute('role', 'status');
            message.textContent = 'Contact not found.';
            this.replaceChildren(message);
            return;
          }
          contacts = [person];
        }
        const list = document.createElement('ul');
        list.className = 'pc-list';
        list.setAttribute('aria-label', this.getAttribute('label') || 'Contacts');
        for (const person of contacts) {
          const item = document.createElement('li');
          item.className = 'pc-card';
          const name = String(person.name || 'Contact');
          const avatar = document.createElement('div');
          avatar.className = 'pc-avatar';
          avatar.setAttribute('aria-hidden', 'true');
          const initials = document.createElement('span');
          initials.textContent = name.trim().split(/\s+/).slice(0, 2).map(s => s[0]).join('');
          avatar.append(initials);
          if (person.photo) {
            const photoURL = new URL(person.photo, url);
            if (['http:', 'https:', 'file:'].includes(photoURL.protocol)) {
              const img = document.createElement('img');
              img.alt = ''; img.loading = 'lazy'; img.src = photoURL.href;
              img.addEventListener('error', () => img.remove(), {once: true});
              avatar.append(img);
            }
          }
          const title = document.createElement('p');
          title.className = 'pc-name'; title.textContent = name;
          const role = document.createElement('p');
          role.className = 'pc-role'; role.textContent = String(person.role || '');
          item.append(avatar, title, role);
          if (person.email) {
            const link = document.createElement('a');
            link.className = 'pc-email';
            link.href = 'mailto:' + encodeURIComponent(String(person.email).trim()).replace(/%40/g, '@');
            link.textContent = 'Email';
            link.setAttribute('aria-label', `Email ${name}`);
            item.append(link);
          }
          list.append(item);
        }
        this.replaceChildren(list);
      } catch (error) {
        if (request.signal.aborted) return;
        const message = document.createElement('p');
        message.className = 'pc-error';
        message.setAttribute('role', 'status');
        message.textContent = 'Contacts could not be loaded.';
        this.replaceChildren(message);
        console.error('Contacts:', source, error);
      } finally {
        if (this.request === request) this.removeAttribute('aria-busy');
      }
    }
  }
  customElements.define('portal-contacts', PortalContacts);
})();
