import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Home from './components/Home';
import Settings from './components/Settings';
import { User } from './domain/entities/user';
import { UserService } from './services/user-service';
import { Content } from './domain/entities/content';
import { ContentService } from './services/content-service';
import { FetchUserContents } from './domain/use_cases/fetch-user-contents';
import { WalletService } from './services/wallet-service';

const userService = new UserService();
const contentService = new ContentService();
const walletService = new WalletService();

function App() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [contents, setContents] = useState<Content[]>([]);
  useEffect(() => {
    if (user && contentService) {
      console.log('fetching user contents');
      new FetchUserContents(contentService).execute(user.npub).then((cs) => setContents(cs));
    }
  }, [user]);

  return (
    <BrowserRouter>
      <Header user={user} userService={userService} handleLoggedIn={(u) => setUser(u)}/>
      <Routes>
        <Route path="/" element={<Home contents={contents} contentService={contentService} userService={userService} walletService={walletService}/>} />
        <Route path="/settings" element={<Settings user={user} userService={userService} handleSettingsApplied={(u) => setUser(u)}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
