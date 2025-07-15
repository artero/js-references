import "./style.css";
import { createRoot } from "react-dom/client";
import { App } from "./app.jsx";

const root = createRoot(document.getElementById("app"));
root.render(<App />);
