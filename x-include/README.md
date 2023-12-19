# include-html

This must be served from the HTTP server in order to avoid the error
"Access to XMLHttpRequeest at 'file:///...' from origin 'null'
has been blocked by CORS policy:
Cross origin requests are only supported for protocol schemes:
http, data, isolated-app, chrome-extension, chrome, https, chrome-untrusted."

One way to do this is the open a terminal window, cd to this directory,
enter `python -m http.server 1919`, and browse localhost:1919.
