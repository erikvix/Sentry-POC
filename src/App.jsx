import "./App.css";
import Home from "./components/Home";
import { ThemeProvider } from "./provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Home />
    </ThemeProvider>
  );
}

export default App;
