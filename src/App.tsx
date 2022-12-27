import './App.css';
import Routers from './Routers';
import { BrowserRouter as Router} from 'react-router-dom';

import TopBar from "./components/layouts/MyTopBar";
import SideBar from './components/layouts/MySideBar';
import './css/main.css';
import './css/featuredinfo.css';

function App() {

  return (
    <Router>
      <div className='Main'>
          <TopBar />
          <div className='container'>
              <SideBar />
              <Routers />
              {/* <SolanaBoard /> */}
          </div>
      </div>
    </Router>
  );
}

export default App;
