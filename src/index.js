import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GlobalProvider } from 'context/GlobalContext';

// scroll bar
import 'simplebar/src/simplebar.css';

// third-party
import { Provider as ReduxProvider } from 'react-redux';

// apex-chart
import 'assets/third-party/apex-chart.css';

// project import
import App from './App';
import { store } from 'store';
import reportWebVitals from './reportWebVitals';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import '@rainbow-me/rainbowkit/styles.css';

import './index.css';
const { chains, provider } = configureChains(
  [sepolia],
  [
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Orbeon Staking',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})


// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}>
      <StrictMode>
        <ReduxProvider store={store}>
          <BrowserRouter>
            <GlobalProvider>
              <App />
            </GlobalProvider>
          </BrowserRouter>
        </ReduxProvider>
      </StrictMode>
    </RainbowKitProvider>
  </WagmiConfig>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
