import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '../../domain/entities/user';
import { UserService } from '../../services/user-service';
import { LoginMyUser } from '../../domain/use_cases/login-my-user';
import { minidenticon } from 'minidenticons';

interface HeaderProps {
  user?: User;
  userService: UserService;
  handleLoggedIn: (user: User) => void;
}

const Header: React.FC<HeaderProps> = (props) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userImage, setUserImage] = useState('');

  const handleLogin = async () => {
    const user = await new LoginMyUser(props.userService).execute();
    props.handleLoggedIn(user);
    setUserName(user.username.length > 0 ? user.username : shorthandNpub(user.npub));
    setUserImage(user.image.length > 0 ? user.image : 'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(userName, 90)));
    navigate('/');
  };

  const shorthandNpub = (npub: string) => {
    return npub.slice(0, 10) + '...' + npub.slice(-10);
  };

  return (
    <header className="bg-black text-gray-200 shadow-md">
      <nav className="container mx-auto flex justify-between items-center py-4 px-6">
        <a href="/" className="text-xl font-semibold text-gray-100">Nostr Wallet Connect Image Gallery</a>
        {props.user ? (
          <div className="text-sm font-medium">
            <Link to="/settings" className="text-blue-300 hover:text-blue-400">
              <img src={userImage} alt={userName} className="w-8 h-8 rounded-full inline-block" />
              <span className='ml-2'>{userName}</span>
            </Link>
          </div>
        ) : (
          <button
            className="text-gray-200 bg-gray-800 hover:bg-gray-700 font-bold py-2 px-4 rounded-full transition duration-300"
            onClick={handleLogin}>
            Login
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
