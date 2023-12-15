const { href } = location;
const lastSlashIndex = href.lastIndexOf("/");
const urlPrefix = href.substring(0, lastSlashIndex + 1);

function updateText(el, evaluate) {
  for (const child of el.childNodes) {
    const type = child.nodeType;
    if (type === Node.TEXT_NODE) {
      const text = child.textContent;
      const newText = text.replaceAll(/{{([^}]+)}}/g, (match) => {
        const expression = match.substring(2, match.length - 2);
        return evaluate(expression);
      });
      child.nodeValue = newText;
    } else if (type === Node.ELEMENT_NODE) {
      updateText(child, evaluate);
    }
  }
}

document.addEventListener("alpine:init", () => {
  Alpine.directive("interp", (el, {}, { effect, evaluate }) => {
    effect(() => {
      updateText(el, evaluate);
    });
  });
});
