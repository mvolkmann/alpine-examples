// TODO: Turn this into an official Alpine plugin.
let defaultDelimiters = "{}";
let re;

function getRegExp(delimiters) {
  let len = delimiters.length;
  if (len % 2 !== 0) {
    throw new Error(`x-interp invalid delimiters: ${delimiters}`);
  }
  len /= 2;
  const start = delimiters.slice(0, len);
  const end = delimiters.slice(len);
  return new RegExp(`${start}([^}]+)${end}`, "g");
}

function updateText(el, evaluate) {
  for (const child of el.childNodes) {
    const { nodeType } = child;
    if (nodeType === Node.TEXT_NODE) {
      if (!child.originalValue) child.originalValue = child.nodeValue;
      child.nodeValue = child.originalValue.replaceAll(
        re,
        // evaluate doesn't throw an error if the expression is invalid.
        // It outputs an error message and returns undefined.
        (_, capture) => evaluate(capture) || capture
      );
    } else if (nodeType === Node.ELEMENT_NODE) {
      updateText(child, evaluate); // recursive call
    }
  }
}

document.addEventListener("alpine:init", () => {
  // TODO: Pass to this the delimiters to use, ex. '{{}}' or '{}'.
  // Have default delimiters, allow the default to be overridden, and allow per-use delimiters.
  Alpine.directive("interp", (el, { expression }, { effect, evaluate }) => {
    re = getRegExp(expression || defaultDelimiters);
    effect(() => updateText(el, evaluate));
  });
});
