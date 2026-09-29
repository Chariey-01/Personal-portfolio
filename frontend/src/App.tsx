import { BrowserRouter, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { PortfolioContentProvider } from "./data/PortfolioContentContext";
import { AdminApp } from "./sections/AdminApp";
import { About } from "./sections/About";
import { Contact } from "./sections/Contact";
import { Experience } from "./sections/Experience";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { Navigation } from "./sections/Navigation";
import { NotFound } from "./sections/NotFound";
import { ProjectDetail } from "./sections/ProjectDetail";
import { Projects } from "./sections/Projects";
import { Skills } from "./sections/Skills";
import { Testimonials } from "./sections/Testimonials";
import { ThemeProvider } from "./theme/ThemeContext";

function PublicHome() {
  return (
    <div className="public-site min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <Projects />
        <About />
        <Skills />
        <Experience />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function ProjectRoute() {
  const { slug = "" } = useParams();
  return <ProjectDetail slug={slug} />;
}

function AppRoutes() {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
        <AdminApp onAuthenticated={() => navigate("/admin/dashboard")} onSignOut={() => navigate("/admin")} />
        }
      />
      <Route path="/" element={<PortfolioContentProvider><PublicHome /></PortfolioContentProvider>} />
      <Route path="/projects/:slug" element={<PortfolioContentProvider><ProjectRoute /></PortfolioContentProvider>} />
      <Route path="*" element={<PortfolioContentProvider><NotFound /></PortfolioContentProvider>} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}
