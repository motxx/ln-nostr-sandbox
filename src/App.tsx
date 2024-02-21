import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Home from './components/Home';
import Settings from './components/Settings';
import { Note } from './domain/entities/note';
import { User } from './domain/entities/user';
import { SubscribeTimeline } from './domain/use_cases/subscribe-timeline';
import { NoteService } from './services/note-service';
import { UserService } from './services/user-service';
import { WalletService } from './services/wallet-service';

const userService = new UserService();
const noteService = new NoteService();
const walletService = new WalletService();

function App() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [notes, setNotes] = useState<Note[]>([]);
  useEffect(() => {
    if (user && noteService) {
      new SubscribeTimeline(noteService).execute((note) => setNotes([...notes, note]));
    }
    if (user && walletService) {
      walletService.connectNwc(user.settings.connectionUri);
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Header user={user} userService={userService} handleLoggedIn={(u) => setUser(u)}/>
      <Routes>
        <Route path="/" element={<Home notes={notes} noteService={noteService} userService={userService} walletService={walletService}/>} />
        <Route path="/settings" element={<Settings user={user} userService={userService} walletService={walletService} handleSettingsApplied={(u) => setUser(u)}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
