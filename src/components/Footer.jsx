import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaTwitter, FaInstagram, FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">

        
        {/* Column 2: Quick Links */}
        <div className="footer__column">
          <h5 className="footer__title">Quick Links</h5>
          <ul className="footer__list footer__list--links">
            <li><Link to="/about" className="footer__link">About Us</Link></li>
            <li><Link to="/contact" className="footer__link">Contact Us</Link></li>
            <li><Link to="/faq" className="footer__link">FAQ</Link></li>
            <li><Link to="/terms" className="footer__link">Terms & Conditions</Link></li>
            <li><Link to="/privacy" className="footer__link">Privacy Policy</Link></li>
          </ul>
        </div>
        {/* Column 1: Get in Touch */}
        <div className="footer__column">
          <h5 className="footer__title">Get in Touch</h5>
          <ul className="footer__list">
            <li className="footer__list-item">
              <FaMapMarkerAlt className="footer__icon" />
              <span>123 Street, New York, USA</span>
            </li>
            <li className="footer__list-item">
              <FaPhoneAlt className="footer__icon" />
              <span>+012 345 67890</span>
            </li>
            <li className="footer__list-item">
              <FaEnvelope className="footer__icon" />
              <span>mail@domain.com</span>
            </li>
          </ul>
        </div>


        {/* Column 3: We Accept & Social */}
        <div className="footer__column">
          <h5 className="footer__title">We Accept</h5>
          <div className="footer__payment-icons">
            <FaCcVisa size={32} />
            <FaCcMastercard size={32} />
            <FaCcPaypal size={32} />
            <FaCcAmex size={32} />
          </div>
          <h5 className="footer__title mt-6">Follow Us</h5>
          <div className="footer__social-icons">
            <a href="#" className="footer__social-link"><FaFacebookF /></a>
            <a href="#" className="footer__social-link"><FaTwitter /></a>
            <a href="#" className="footer__social-link"><FaInstagram /></a>
          </div>
        </div>
      </div>
      <div className="footer__bottom-bar">
        <p>&copy; {new Date().getFullYear()} Your Company Name. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;