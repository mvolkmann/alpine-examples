const { href } = location;
const lastSlashIndex = href.lastIndexOf("/");
const urlPrefix = href.substring(0, lastSlashIndex + 1);

function includeHTML() {
  // Find the first element that contains the include attribute.
  const element = document.querySelector("[include");
  if (!element) return; // no more found

  const xhr = new XMLHttpRequest();
  xhr.onload = () => {
    element.innerHTML = xhr.responseText;
    element.removeAttribute("include");
    // Make a recursive call to process remaining elements
    // with the w3-include-html attribute.
    includeHTML();
  };

  const file = element.getAttribute("include");
  xhr.open("GET", urlPrefix + file, true);
  xhr.send();
}

window.onload = includeHTML;
