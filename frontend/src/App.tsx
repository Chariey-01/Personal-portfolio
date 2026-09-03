import { About } from "./sections/About";
import { CaseStudies } from "./sections/CaseStudies";
import { Contact } from "./sections/Contact";
import { Experience } from "./sections/Experience";
import { Footer } from "./sections/Footer";
import { Hero } from "./sections/Hero";
import { Navigation } from "./sections/Navigation";
import { Projects } from "./sections/Projects";
import { Skills } from "./sections/Skills";

export default function App() {
  return (
    <div className="min-h-screen bg-ink text-slate-100">
      <Navigation />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <CaseStudies />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
