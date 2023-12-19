document.addEventListener("alpine:init", () => {
  Alpine.directive(
    "alpha",
    (el, { value, modifiers, expression }, { Alpine, effect, cleanup }) => {
      el.innerHTML = `<ul>
        <li>value = ${value}</li>
        <li>modifiers = ${JSON.stringify(modifiers)}</li>
        <li>expression = ${expression}</li>
      </ul>`;
    }
  );

  Alpine.directive("greet", (el, { value, expression }, {}) => {
    const text = `Hello, ${expression || "World"}!`;
    el.textContent = value === "upper" ? text.toUpperCase() : text;
  });
});
