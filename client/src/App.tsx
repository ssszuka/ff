import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";

const Homepage = lazy(() => import("@/pages/homepage").then(module => ({ default: module.Homepage })));
const VerificationPortal = lazy(() => import("@/pages/verification-portal").then(module => ({ default: module.VerificationPortal })));
const NotFound = lazy(() => import("@/pages/not-found"));

function App() {
  return (
    <Suspense fallback={null}>
      <Switch>
        {/* Homepage */}
        <Route path="/" component={Homepage} />
        
        {/* Verification portal */}
        <Route path="/portal" component={VerificationPortal} />
        
        {/* 404 fallback */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

export default App;
