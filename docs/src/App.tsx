import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import IconsPage from "@/pages/IconsPage";
import IconDetailPage from "@/pages/IconDetailPage";
import GuidePage from "@/pages/GuidePage";
import LicensePage from "@/pages/LicensePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="icons" element={<IconsPage />} />
        <Route path="icons/:iconName" element={<IconDetailPage />} />
        <Route path="guide" element={<GuidePage />} />
        <Route path="license" element={<LicensePage />} />
      </Route>
    </Routes>
  );
}
