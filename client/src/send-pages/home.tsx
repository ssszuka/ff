import { createRoot } from "react-dom/client";
import { Homepage } from "@/pages/homepage";
import "@/styles/fonts.css";
import "@/styles/index.css";

createRoot(document.getElementById("root")!).render(
  <Homepage />
);
