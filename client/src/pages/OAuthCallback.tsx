import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      login(token)
        .then(() => navigate('/dashboard'))
        .catch(() => navigate('/'));
    } else {
      navigate('/');
    }
  }, []);

  return <p>Logging you in...</p>;
};

export default OAuthCallback;
