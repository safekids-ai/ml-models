import {ChakraProvider, defaultSystem} from '@chakra-ui/react';
import SidebarWithHeader from './components/layout/Sidebar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Vision from './pages/Vision';
import Hate from './pages/Hate';
import NotFound from './pages/NotFound';
import Docs from './pages/Docs'
import TextClassification from './pages/TextClassification';

function App() {
  return (
    <BrowserRouter>
      <ChakraProvider value={defaultSystem}>
        <SidebarWithHeader>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vision" element={<Vision />} />
            <Route path="/classify-intent" element={<TextClassification />} />
            <Route path="/hate" element={<Hate />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SidebarWithHeader>
      </ChakraProvider>
    </BrowserRouter>
  );
}

export default App;
