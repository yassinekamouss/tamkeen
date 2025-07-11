import { Header, Hero } from "./components";
import "./App.css";

function App() {
  return (
    <div className="w-full">
      <Header />
      <Hero />
      {/* Section test pour le scroll */}
      <section className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto pt-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">Nos Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Accompagnement</h3>
              <p className="text-gray-600">Nous vous accompagnons dans toutes les étapes de votre projet d'investissement.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Conseil</h3>
              <p className="text-gray-600">Des conseils personnalisés pour optimiser vos chances d'obtenir des subventions.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Formation</h3>
              <p className="text-gray-600">Formation aux meilleures pratiques entrepreneuriales et de gestion.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
