import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import '../Login/LoginPage.css'; // We can reuse the login page CSS

// Import your assets
import logo from '../../assets/images/logo-full.png';
import illustration from '../../assets/images/login-illustration.png';
import googleIcon from '../../assets/images/google-icon.png';
import facebookIcon from '../../assets/images/facebook-icon.png';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <img src={logo} alt="AcadeMeet Logo" className="logo" />
        <h2 className="welcome-text">Create an Account</h2>
        
        <form>
          <label>Name</label>
          <Input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
          
          <label>Email</label>
          <Input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Password</label>
          <Input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          
          <label>Confirm Password</label>
          <Input type="password" placeholder="Re-enter your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

          <Button type="submit">Sign up</Button>
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
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </div>
      <div className="auth-illustration-container">
        <img src={illustration} alt="Desk Illustration" className="illustration" />
      </div>
    </div>
  );
};

export default SignUpPage;