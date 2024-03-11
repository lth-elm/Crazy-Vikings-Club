import { Outlet, NavLink } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import { BsTwitter, BsTelegram, BsDiscord } from "react-icons/bs";

import logo from "../images/IAESIR-logo-white.png";

const NavBar = () => {
  const { isConnected } = useAccount();

  return (
    <>
      <div className="medianav">
        <ul style={{ margin: "0", padding: "6px", gap: "12px" }}>
          <li>
            <a href="https://twitter.com/iaesirfinance" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
              <BsTwitter style={{ width: "0.85rem" }} />
            </a>
          </li>
          {/* <li>
            <a
              href="https://instagram.com/iaesirfinance/"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <BsInstagram style={{ width: "0.85rem" }} />
            </a>
          </li> */}
          {/* <li>
            <a href="#" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
              <BsGithub style={{ width: "0.85rem" }} />
            </a>
          </li> */}
          {/* <li>
            <a href="https://iaesirfinance.medium.com/" aria-label="Medium" target="_blank" rel="noopener noreferrer">
              <BsMedium style={{ width: "0.85rem" }} />
            </a>
          </li> */}
          <li>
            <a href="https://t.me/iaesirfinance" aria-label="Telegram" target="_blank" rel="noopener noreferrer">
              <BsTelegram style={{ width: "0.85rem" }} />
            </a>
          </li>
          <li>
            <a href="https://discord.gg/NEe8uMTWZM" aria-label="Discord" target="_blank" rel="noopener noreferrer">
              <BsDiscord style={{ width: "0.85rem" }} />
            </a>
          </li>
        </ul>
      </div>

      <nav className="nav">
        <a href="https://iaesirfinance.com/" target="_blank" rel="noreferrer">
          <img src={logo} alt="IAESIR Logo" />
        </a>

        <h1 className="NavTitle">Crazy Vikings Club</h1>
        {isConnected ? (
          <div className="connect-grid">
            <ConnectButton />
          </div>
        ) : (
          ""
        )}
      </nav>

      <Outlet />
    </>
  );
};

export default NavBar;
