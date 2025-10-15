import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import './LoginPage.css';

// Import your assets
import logo from '../../assets/images/logo-full.png';
import illustration from '../../assets/images/login-illustration.png';
import googleIcon from '../../assets/images/google-icon.png';
import facebookIcon from '../../assets/images/facebook-icon.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <img src={logo} alt="AcadeMeet Logo" className="logo" />
        <h2 className="welcome-text">Welcome to AcadeMeet</h2>
        
        <form>
          <label>Email</label>
          <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Password</label>
          <Input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          
          <div className="forgot-password">
            <a href="/forgot-password">Forgot your password?</a>
          </div>

          <Button type="submit">Log in</Button>
        </form>

        <div className="separator">OR</div>

        <div className="social-login">
          <button className="social-button">
            <img src={googleIcon} alt="Google" />
          </button>
          <button className="social-button">
            <img src={facebookIcon} alt="Facebook" />
          </button>
        </div>

        <div className="redirect-link">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </div>
      </div>
      <div className="auth-illustration-container">
        <img src={illustration} alt="Desk Illustration" className="illustration" />
      </div>
    </div>
  );
};

export default LoginPage;