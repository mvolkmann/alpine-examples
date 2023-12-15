const RE = /{([^}]+)}/g;

function updateText(el, evaluate) {
  for (const child of el.childNodes) {
    const type = child.nodeType;
    if (type === Node.TEXT_NODE) {
      const text = child.textContent;
      // TODO: How can you use a capture group to get only inside the braces?
      const newText = text.replaceAll(RE, (match) => {
        const expression = match.substring(1, match.length - 1);
        return evaluate(expression);
      });
      child.nodeValue = newText;
    } else if (type === Node.ELEMENT_NODE) {
      updateText(child, evaluate); // recursive call
    }
  }
}

document.addEventListener("alpine:init", () => {
  Alpine.directive("interp", (el, {}, { effect, evaluate }) => {
    effect(() => updateText(el, evaluate));
  });
});
