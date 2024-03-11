import { ConnectButton } from "@rainbow-me/rainbowkit";

const NotConnected = () => {
  return (
    <div className="NotConnected">
      <p>Connect your wallet to purchase a Crazy Viking</p>
      <div className="ToConnect">
        <ConnectButton />
      </div>
    </div>
  );
};

export default NotConnected;
