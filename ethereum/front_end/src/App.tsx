import React from 'react';
import { DAppProvider, Mainnet, Ropsten } from "@usedapp/core"
import { Header } from "./components/Header"
import Container from "@mui/material/Container"
import { Main } from "./components/Main"

const config = {
  networks: [Ropsten],
}

function App() {
  return (
    <DAppProvider config={config}>
        <Header />
        <Container maxWidth="sm">
            <Main />
        </Container>
    </DAppProvider>
  );
}

export default App;
