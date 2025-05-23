import Canvas from './canvas';
import Customizer from './pages/Customizer';
import Home from './pages/Home';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function CustomerProduct() {
  return (
    <main className="app transition-all ease-in">
      <Home />
      <Canvas />
      <Customizer />
    </main>
  );
}
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/customerProduct" element={<CustomerProduct />} />
      </Routes>
    </Router>
  );
}

export default App;

