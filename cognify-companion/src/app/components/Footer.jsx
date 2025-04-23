'use client';
import {
  footerContainer,
  footerText,
  footerLink,
} from './styles/footer.styles';

const Footer = () => {
  return (
    <footer className={footerContainer}>
      <p className={footerText}>
        © {new Date().getFullYear()} Cognify Companion. All rights reserved.
      </p>
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className={footerLink}
      >
        GitHub
      </a>
    </footer>
  );
};

export default Footer;
