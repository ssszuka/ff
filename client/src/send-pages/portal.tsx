import { createRoot } from "react-dom/client";
import { VerificationPortal } from "@/pages/verification-portal";
import "@/styles/fonts-portal.css";
import "@/styles/index.css";

createRoot(document.getElementById("root")!).render(
  <VerificationPortal />
);
