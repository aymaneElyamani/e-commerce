import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Design } from "./screens/Design/Design";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Design />
  </StrictMode>,
);
