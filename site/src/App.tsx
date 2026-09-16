import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Journey from "./components/Journey";
import Projects from "./components/Projects";
import Education from "./components/Education";
import Hobbies from "./components/Hobbies";
import Footer from "./components/Footer";
import { useHashScroll } from "./hooks/useHashScroll";

function App() {
  useHashScroll();

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Journey />
        <Projects />
        <Education />
        <Hobbies />
      </main>
      <Footer />
    </>
  );
}

export default App;
