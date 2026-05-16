import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useSearchParams } from "react-router-dom";
import { initAuth } from "./lib/auth";
import { refreshEntitlements } from "./lib/entitlements";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { CoursesPage } from "./pages/CoursesPage";
import { CourseDetailPage } from "./pages/CourseDetailPage";
import { RevisionPage } from "./pages/RevisionPage";
import { CertificationPage } from "./pages/CertificationPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { LessonPage } from "./pages/LessonPage";
import { FinalTestPage } from "./pages/FinalTestPage";
import { LoginPage } from "./pages/LoginPage";
import { PricingPage } from "./pages/PricingPage";
import { TeamsPage } from "./pages/TeamsPage";
import { TeamCheckoutPage } from "./pages/TeamCheckoutPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TermsOfServicePage } from "./pages/TermsOfServicePage";
import { AiUsePolicyPage } from "./pages/AiUsePolicyPage";
import { HipaaStatementPage } from "./pages/HipaaStatementPage";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  return null;
}

function CheckoutReturnHandler() {
  const [params] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    if (params.get("checkout") === "success") {
      void refreshEntitlements();
    }
  }, [location.search, params]);

  return null;
}

export default function App() {
  useEffect(() => {
    void initAuth();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <CheckoutReturnHandler />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="courses" element={<CoursesPage />} />
          <Route path="courses/:slug" element={<CourseDetailPage />} />
          <Route path="courses/:slug/lessons/:lessonId" element={<LessonPage />} />
          <Route path="courses/:slug/revise" element={<RevisionPage />} />
          <Route path="courses/:slug/final-test" element={<FinalTestPage />} />
          <Route path="checkout/:slug/:tier" element={<CheckoutPage />} />
          <Route path="certification" element={<CertificationPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="teams/checkout/:planId" element={<TeamCheckoutPage />} />
          <Route path="privacy" element={<PrivacyPolicyPage />} />
          <Route path="terms" element={<TermsOfServicePage />} />
          <Route path="ai-policy" element={<AiUsePolicyPage />} />
          <Route path="hipaa" element={<HipaaStatementPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
