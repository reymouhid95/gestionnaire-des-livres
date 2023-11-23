import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import FormBook from "./components/BookForm";
import SignUp from "./components/Inscription";
import SignIn from "./components/Connexion";

function App() {
  return (
    <div className="App">
      <FormBook />
      <SignUp />
      <SignIn />
    </div>
  );
}

export default App;
