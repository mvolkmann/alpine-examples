const { href } = location;
const lastSlashIndex = href.lastIndexOf("/");
const urlPrefix = href.substring(0, lastSlashIndex + 1);

const scriptStart = "<script>";
const scriptEnd = "</script>";

function includeHTML() {
  const attribute = "x-include";
  // Find the first element that contains the include attribute.
  const element = document.querySelector(`[${attribute}]`);
  if (!element) return; // no more found

  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    // HTML5 does not dynamically add script tags using the innerHTML property!
    let text = xhr.responseText;

    // Look for one script element in the text.
    const startIndex = text.indexOf(scriptStart);
    const endIndex = text.indexOf(scriptEnd);
    const foundScript = startIndex !== -1 && endIndex > startIndex;
    if (foundScript) {
      // Get the text before, in, and after the script element.
      const prefix = text.substring(0, startIndex);
      const script = text.substring(startIndex + scriptStart.length, endIndex);
      const suffix = text.substring(endIndex + scriptEnd.length);

      // Replace the element text with only the non-script text.
      element.innerHTML = prefix + "\n" + suffix;

      // Create a script element and add it before the element.
      const scriptElement = document.createElement("script");
      scriptElement.appendChild(document.createTextNode(script));
      element.parentElement.insertBefore(scriptElement, element);
    } else {
      // No script element was found, so just use all of the text.
      element.innerHTML = text;
    }

    element.removeAttribute(attribute);
    // Make a recursive call to process remaining elements
    // with the w3-include-html attribute.
    includeHTML();
  };

  const file = element.getAttribute(attribute);
  xhr.open("GET", `${urlPrefix}${file}.html`, true);
  xhr.send();
}

window.onload = includeHTML;
