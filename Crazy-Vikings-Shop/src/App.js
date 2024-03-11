import "./styles/App.css";
import "./styles/Navbar.css";
import "./styles/Dashboard.css";

import Protocol from "./Protocol";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { CustomAvatar } from "./components/CustomAvatar";

import { useAccount, configureChains, createClient, WagmiConfig } from "wagmi";
// import { hardhat, sepolia, bscTestnet, bsc } from "wagmi/chains";
import { bsc } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

const projectId = "ace38378662d2dfc57279789ef80a66d";

const { chains, provider } = configureChains(
  [bsc], // [hardhat, sepolia, bscTestnet, bsc], // https://wagmi.sh/react/chains#wagmichains
  [publicProvider()]
);
const { connectors } = getDefaultWallets({ appName: "Crazy Vikings Shop", projectId, chains });
const wagmiClient = createClient({ autoConnect: true, connectors, provider });

function App() {
  const { address } = useAccount();
  console.log("Connected with", address);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        avatar={CustomAvatar}
        theme={darkTheme({
          accentColor: "#a511f0",
          accentColorForeground: "white",
        })}
        chains={chains}
      >
        <div className="App">
          <Protocol />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
