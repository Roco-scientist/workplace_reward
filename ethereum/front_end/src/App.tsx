import { DAppProvider, Ropsten } from "@usedapp/core";
import { Header } from "./components/Header";
import Container from "@mui/material/Container";
import { Balances } from "./components/Balances";
import { SendAppreciation } from "./components/SendAppreciation";
import { Admin } from "./components/Admin";
import { AdminDb } from "./components/AdminDb";

const config = {
  networks: [Ropsten],
  notifications: {
    expirationPeriod: 1000,
    checkInterval: 1000,
  },
};

function App() {
  return (
    <DAppProvider config={config}>
      <Header />
      <Container maxWidth="sm">
        <Balances />
        <SendAppreciation />
        <Admin />
        <AdminDb />
      </Container>
    </DAppProvider>
  );
}

export default App;
