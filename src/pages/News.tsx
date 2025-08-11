import React from "react";
import { Header, Footer } from "../components";

const News: React.FC = () => {
  return (
    <div className="w-full">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 min-h-[60vh]">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">News</h1>
        <p className="text-gray-600">
          Cette page est en cours de construction.
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default News;
