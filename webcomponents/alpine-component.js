const { href } = location;
const lastSlashIndex = href.lastIndexOf("/");
const urlPrefix = href.substring(0, lastSlashIndex + 1);

const scriptStart = "<script>";
const scriptEnd = "</script>";

const _alpineIncludeCache = {};

function useCachedContent(element, componentName) {
  let content = _alpineIncludeCache[componentName];
  if (!content) return false;

  const token = setInterval(() => {
    if (content !== "loading") {
      element.innerHTML = patchNames(element, content);
      clearInterval(token);
    } else {
      content = _alpineIncludeCache[componentName];
    }
  }, 100);

  return true;
}

function includeHTML(element) {
  const componentName = element.getAttribute("file");
  if (useCachedContent(element, componentName)) return;

  _alpineIncludeCache[componentName] = "loading";
  let content = "";

  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    // HTML5 does not dynamically add script tags using the innerHTML property!
    let text = xhr.responseText;

    let index = 0;
    while (true) {
      // Look for a script tag.
      const startIndex = text.indexOf(scriptStart, index);

      // TODO: Check for src attribute on script tag.

      if (startIndex === -1) {
        content += text.substring(index);
        break;
      } else {
        const endIndex = text.indexOf(scriptEnd, startIndex);
        if (endIndex !== -1) {
          // Get the text before and in the script element.
          const prefix = text.substring(0, startIndex);
          const script = text.substring(
            startIndex + scriptStart.length,
            endIndex
          );

          // Create a script element and add it before the element.
          const scriptElement = document.createElement("script");
          scriptElement.appendChild(document.createTextNode(script));
          element.parentElement.insertBefore(scriptElement, element);

          content += prefix;

          index = endIndex + scriptEnd.length;
        } else {
          throw new Error("found script start tag, but not end tag");
        }
      }
    }

    _alpineIncludeCache[componentName] = content;
    element.innerHTML = patchNames(element, content);
  };

  xhr.open("GET", `${urlPrefix}${componentName}.html`, true);
  xhr.send();
}

function patchNames(element, content) {
  let newContent = content;
  // Replace all occurrences of attribute names with the value.
  for (let i = 0; i < element.attributes.length; i++) {
    const { name, value } = element.attributes[i];
    const trimmedName = name.trim();
    if (trimmedName === "file") continue;
    if (!/^[a-zA-Z]/.test(trimmedName)) continue;
    newContent = newContent.replaceAll(name, value);
  }
  return newContent;
}

class AlpineComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    includeHTML(this);
  }
}

customElements.define("alpine-component", AlpineComponent);
