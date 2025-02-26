import React from 'react'
import ReactDOM from 'react-dom'
import ReactGA from 'react-ga'
import Web3Provider, { Connectors } from 'web3-react'

import ThemeProvider, { GlobalStyle } from './theme'
import LocalStorageContextProvider, { Updater as LocalStorageContextUpdater } from './contexts/LocalStorage'
import ApplicationContextProvider, { Updater as ApplicationContextUpdater } from './contexts/Application'
import TransactionContextProvider, { Updater as TransactionContextUpdater } from './contexts/Transactions'
import TokensContextProvider from './contexts/Tokens'
import BalancesContextProvider from './contexts/Balances'
import AllowancesContextProvider from './contexts/Allowances'
import AllBalancesContextProvider from './contexts/AllBalances'

import App from './pages/App'
import NetworkOnlyConnector from './NetworkOnlyConnector'
import InjectedConnector from './InjectedConnector'
import PortisApi from '@portis/web3'

import './i18n'

if (process.env.NODE_ENV === 'production') {
  ReactGA.initialize('UA-128182339-1')
} else {
  ReactGA.initialize('test', { testMode: true })
}
ReactGA.pageview(window.location.pathname + window.location.search)

const { PortisConnector } = Connectors

const Portis = new PortisConnector({
  api: PortisApi,
  dAppId: process.env.REACT_APP_PORTIS_DAPP_ID,
  network: 'mainnet'
})

const Network = new NetworkOnlyConnector({ providerURL: process.env.REACT_APP_NETWORK_URL || '' })
const Injected = new InjectedConnector({ supportedNetworks: [Number(process.env.REACT_APP_NETWORK_ID || '1')] })
// const Portis = new PortisConnector({
//   api: PortisApi,
//   dAppId: process.env.REACT_APP_PORTIS_DAPP_ID,
//   network: 'mainnet'
// })

const connectors = { Portis, Injected, Network }

function ContextProviders({ children }) {
  return (
    <LocalStorageContextProvider>
      <ApplicationContextProvider>
        <TransactionContextProvider>
          <TokensContextProvider>
            <BalancesContextProvider>
              <AllBalancesContextProvider>
                <AllowancesContextProvider>{children}</AllowancesContextProvider>
              </AllBalancesContextProvider>
            </BalancesContextProvider>
          </TokensContextProvider>
        </TransactionContextProvider>
      </ApplicationContextProvider>
    </LocalStorageContextProvider>
  )
}

function Updaters() {
  return (
    <>
      <LocalStorageContextUpdater />
      <ApplicationContextUpdater />
      <TransactionContextUpdater />
    </>
  )
}

ReactDOM.render(
  <Web3Provider connectors={connectors} libraryName="ethers.js">
    <ContextProviders>
      <Updaters />
      <ThemeProvider>
        <>
          <GlobalStyle />
          <App />
        </>
      </ThemeProvider>
    </ContextProviders>
  </Web3Provider>,
  document.getElementById('root')
)
