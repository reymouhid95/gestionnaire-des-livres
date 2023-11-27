import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import FormBook from "./components/BookForm";
import Connexion from "./components/Connexion";
import Inscription from "./components/Inscription";

function App() {
  return (
    <div className="App">
      <FormBook />
      <Inscription />
      <Connexion />
    </div>
  );
}

export default App;
