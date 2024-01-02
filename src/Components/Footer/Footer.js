import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faYoutube,
  faFacebook,
  faTwitter,
  faInstagram
} from "@fortawesome/free-brands-svg-icons";
const Footer = () => {
  return (
    <footer >
      <div className="Footer-Main-Section-Container">
        <div className="Footer-Brand-Logo">
          <a href="https://www.youtube.com/c/jamesqquick">Jol Tartip</a>
        </div>
      </div>
      <div className="Footer-Baseline-Section-Container">
        <section className="Baseline-Social">
        <a href="https://www.youtube.com/c/jamesqquick"
        className="youtube social">
        <FontAwesomeIcon icon={faYoutube} size="2x" />
      </a>
      <a href="https://www.facebook.com/learnbuildteach/"
        className="facebook social">
        <FontAwesomeIcon icon={faFacebook} size="2x" />
      </a>
      <a href="https://www.twitter.com/jamesqquick" className="twitter social">
        <FontAwesomeIcon icon={faTwitter} size="2x" />
      </a>
      <a href="https://www.instagram.com/learnbuildteach"
        className="instagram social">
        <FontAwesomeIcon icon={faInstagram} size="2x" />
      </a>
        </section>
        <section>
          <ul className="Baseline-Other-Links">
           <li> Copyright 2023 all license reserved
           </li>
          </ul>
        </section>
      </div>
    </footer>
  );
};

export default Footer;
