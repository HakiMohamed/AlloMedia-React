// src/App.jsx
import Header from './Components/Header';
import Footer from './Components/Footer';
import AppRouter from './Router'; 

function App() {
  return (
    <>
      <Header />
      <div className="mx-auto p-4 dark:bg-gray-900">
        <AppRouter /> 
      </div>
      <Footer />
    </>
  );
}

export default App;
