import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import CveList from "./Components/CveList/index";
import CVEDetails from './Components/CVEDetails/index';
import './App.css';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<CveList/>}/>
          <Route path="/cves/:id" element={<CVEDetails/>}/>
        </Routes>
      </BrowserRouter>
  );
}

export default App;
