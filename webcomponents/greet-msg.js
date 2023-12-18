class GreetMsg extends HTMLElement {
  constructor() {
    super();
    this.name = "World"; // default value
  }

  static get observedAttributes() {
    return ["name"];
  }

  attributeChangedCallback(property, oldValue, newValue) {
    if (oldValue === newValue) return;
    this[property] = newValue;
  }

  connectedCallback() {
    this.textContent = `Hello, ${this.name}!`;
  }
}

customElements.define("greet-msg", GreetMsg);
