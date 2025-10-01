import { createRoot } from "react-dom/client";
import { Homepage } from "@/pages/homepage";
import { initializeAnimations } from "@/lib/meta-utils";
import "@/styles/index.css";

createRoot(document.getElementById("root")!).render(
  <Homepage />
);

window.addEventListener('load', () => {
  initializeAnimations();
});
