import "./App.css";
import { AuthProvider } from "./permissions/auth-provider";
import Layout from "./layout";

function App() {
  return (
    <AuthProvider>
      <Layout />
    </AuthProvider>
  );
}

export default App;
