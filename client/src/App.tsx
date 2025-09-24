import { Route, Switch } from "wouter";
import { Homepage } from "@/pages/homepage";
import { VerificationPortal } from "@/pages/verification-portal";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <Switch>
      {/* Homepage */}
      <Route path="/" component={Homepage} />
      
      {/* Verification portal */}
      <Route path="/portal" component={VerificationPortal} />
      
      {/* 404 fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
