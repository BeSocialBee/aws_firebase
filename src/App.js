import LoginPage from './components/LoginPage.js';
import AdminHome from './components/AdminHome.js';
import AdminAddCard from './components/AdminAddCard.js';
import AdminViewUsers from './components/AdminViewUsers.js';
import AdminViewAvatars from './components/AdminViewAvatars.js';
import {Route, HashRouter, Routes} from 'react-router-dom';
import AdminAddCollection from './components/AdminAddCollection.js';


function App() {
  return (
    <HashRouter>
      <Routes>
        <Route exact path="/" element={<AdminHome />}/>
        <Route exact path="/login" element={<LoginPage />}/>

        <Route exact path="/admin/home" element={<AdminHome />}/>
        <Route exact path="/admin/viewusers" element={<AdminViewUsers />}/>
        <Route exact path="/admin/viewavatars" element={<AdminViewAvatars />}/>
        <Route exact path="/admin/addcard" element={<AdminAddCard />}/>
        <Route exact path="/admin/addcollection" element={<AdminAddCollection />}/>
      </Routes>
    </HashRouter>
  );
}

export default App;
