import { render } from "preact";
import { html } from "htm/preact";

export function App() {
  return html` <h1>Hello, World!</h1> `;
}

render(html`<${App} />`, document.getElementById("app"));
