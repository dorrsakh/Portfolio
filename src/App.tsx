import { SmoothScroll } from "./components/SmoothScroll";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/sections/Hero";
import { About } from "./components/sections/About";
import { Skills } from "./components/sections/Skills";
import { Projects } from "./components/sections/Projects";
import { Experience } from "./components/sections/Experience";
import { Contact } from "./components/sections/Contact";
import { Footer } from "./components/sections/Footer";

/**
 * Main App Component
 * Portfolio website with smooth scrolling and animations
 */
function App() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <Contact />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}

export default App;
