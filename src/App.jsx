import React from "react";
import Home from "./pages/Home";


function App() {
  return (
    <div className="min-h-screen">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">📚 Book Finder</h1>
      </header>
      <Home />
    </div>
  );
}

export default App;
