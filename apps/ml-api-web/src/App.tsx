import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import theme from "./theme";
import SidebarWithHeader from "./components/layout/Sidebar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Vision from "./pages/Vision";
import Hate from "./pages/Hate";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <BrowserRouter>
        <ChakraProvider theme={theme}>
          <ColorModeScript initialColorMode="system" />
          <SidebarWithHeader>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/vision" element={<Vision />} />
              <Route path="/hate" element={<Hate />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SidebarWithHeader>
        </ChakraProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
