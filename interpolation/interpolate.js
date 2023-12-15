// TODO: Turn this into an official Alpine plugin.
const RE = /{([^}]+)}/g;

function updateText(el, evaluate) {
  for (const child of el.childNodes) {
    const { nodeType } = child;
    if (nodeType === Node.TEXT_NODE) {
      if (!child.originalValue) child.originalValue = child.nodeValue;
      child.nodeValue = child.originalValue.replaceAll(RE, (_, capture) =>
        evaluate(capture)
      );
    } else if (nodeType === Node.ELEMENT_NODE) {
      updateText(child, evaluate); // recursive call
    }
  }
}

document.addEventListener("alpine:init", () => {
  // TODO: Pass to this the delimiters to use, ex. '{{}}' or '{}'.
  // Have default delimiters, allow the default to be overridden, and allow per-use delimiters.
  Alpine.directive("interp", (el, {}, { effect, evaluate }) => {
    effect(() => updateText(el, evaluate));
  });
});
