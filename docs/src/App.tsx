import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import IconsPage from "@/pages/IconsPage";
import IconDetailPage from "@/pages/IconDetailPage";
import LicensePage from "@/pages/LicensePage";

// Guide pages
import GuideLayout from "@/pages/guide/GuideLayout";
import InstallationPage from "@/pages/guide/InstallationPage";
import RenderingPage from "@/pages/guide/RenderingPage";
import UsagePage from "@/pages/guide/UsagePage";
import PropsPage from "@/pages/guide/PropsPage";
import CliPage from "@/pages/guide/CliPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="icons" element={<IconsPage />} />
        <Route path="icons/:iconName" element={<IconDetailPage />} />
        <Route path="guide" element={<GuideLayout />}>
          <Route path="installation" element={<InstallationPage />} />
          <Route path="rendering" element={<RenderingPage />} />
          <Route path="usage" element={<UsagePage />} />
          <Route path="props" element={<PropsPage />} />
          <Route path="cli" element={<CliPage />} />
        </Route>
        <Route path="license" element={<LicensePage />} />
      </Route>
    </Routes>
  );
}
