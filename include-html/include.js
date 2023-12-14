const { href } = location;
const lastSlashIndex = href.lastIndexOf("/");
const urlPrefix = href.substring(0, lastSlashIndex + 1);

function includeHTML() {
  const attribute = "x-include";
  // Find the first element that contains the include attribute.
  const element = document.querySelector(`[${attribute}]`);
  if (!element) return; // no more found

  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    element.innerHTML = xhr.responseText;
    element.removeAttribute(attribute);
    // Make a recursive call to process remaining elements
    // with the w3-include-html attribute.
    includeHTML();
  };

  const file = element.getAttribute(attribute);
  xhr.open("GET", urlPrefix + file, true);
  xhr.send();
}

window.onload = includeHTML;
