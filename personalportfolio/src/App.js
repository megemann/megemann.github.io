import './App.css';
import Home from './pages/home/home';
import "./fonts/NovaFlat-Regular.ttf";
import ProjectPage from './pages/projectPage/projectPage';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ProjectList from './pages/projectList/projectList';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/project/:projectKey" element={<ProjectPage/>}></Route>
          <Route path="/projects" element={<ProjectList/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
