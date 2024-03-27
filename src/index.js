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

// https://cloudflare-eth.com
import './index.css';


import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiProvider, http, createConfig } from 'wagmi'
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors'

import { sepolia, mainnet } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


const queryClient = new QueryClient()

const projectId = '1f685aaf50ce8754dc96c376f5d5c736'


const metadata = {
  name: 'Pullix Staking',
  description: 'Pullix Staking',
  url: 'https://staking.pullix.io', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http("https://cloudflare-eth.com")
  },
  connectors: [
    walletConnect({ projectId, metadata, showQrModal: false }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: metadata.name,
      appLogoUrl: metadata.icons[0]
    })
  ]
})



createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeVariables: {
    '--w3m-accent': 'linear-gradient(242.73deg, #3FC5EA -7.24%, #025E9F 90.52%)',
    '--w3m-border-radius-master': '1px'
  }

})


// ==============================|| MAIN - REACT DOM RENDER  ||============================== //

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <WagmiProvider config={config}>
    <QueryClientProvider client={queryClient}>
      <StrictMode>
        <ReduxProvider store={store}>
          <BrowserRouter>
            <GlobalProvider>
              <App />
            </GlobalProvider>
          </BrowserRouter>
        </ReduxProvider>
      </StrictMode>
    </QueryClientProvider>  
  </WagmiProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
