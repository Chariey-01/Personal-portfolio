import { About } from "./sections/About";
import { CaseStudies } from "./sections/CaseStudies";
import { Contact } from "./sections/Contact";
import { Experience } from "./sections/Experience";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { Navigation } from "./sections/Navigation";
import { Projects } from "./sections/Projects";
import { Skills } from "./sections/Skills";
import { AdminApp } from "./sections/AdminApp";
import { PortfolioContentProvider } from "./data/PortfolioContentContext";
import { Testimonials } from "./sections/Testimonials";
import { ThemeProvider } from "./theme/ThemeContext";

export default function App() {
  if (window.location.pathname.startsWith("/admin")) {
    return (
      <ThemeProvider>
        <AdminApp />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <PortfolioContentProvider>
        <div className="min-h-screen bg-ink text-slate-100">
          <Navigation />
          <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <CaseStudies />
            <Testimonials />
            <Experience />
            <Contact />
          </main>
          <Footer />
        </div>
      </PortfolioContentProvider>
    </ThemeProvider>
  );
}
