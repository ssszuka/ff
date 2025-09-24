import { Route, Switch } from "wouter";
import { Suspense, lazy } from "react";

// Lazy load all pages for code splitting
const Homepage = lazy(() => import("@/pages/homepage").then(module => ({ default: module.Homepage })));
const VerificationPortal = lazy(() => import("@/pages/verification-portal").then(module => ({ default: module.VerificationPortal })));
const NotFound = lazy(() => import("@/pages/not-found"));

// Loading component for Suspense fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-dark-300 text-lg">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
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
