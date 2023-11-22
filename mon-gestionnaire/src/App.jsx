import "./App.css";
import SignIn from "./components/Connexion";
import SignUp from "./components/Inscription";
import DataTable from "./components/TableAdmin";

function App() {
  return (
    <>
      <SignUp />
      <SignIn />
      <DataTable />
    </>
  );
}

export default App;
