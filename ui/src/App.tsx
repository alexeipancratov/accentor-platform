import { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import ArticlesPage from "./components/ArticlesPage";
import Header from "./components/Header";
import PostArticle from "./components/PostArticle";
import {
  ACCENTOR_ABI,
  ACCENTOR_CONTRACT_ADDRESS,
} from "./contractAbis/accentor";

function App() {
  const [instance, setInstance] = useState<Contract>();
  const [web3Instance, setWeb3Instance] = useState<Web3>();
  const [account, setAccount] = useState<string>();

  useEffect(() => {
    const createInstance = async () => {
      const ethObj = (window as any).ethereum;
      if (ethObj) {
        ethObj
          .request({ method: "eth_requestAccounts" })
          .then(async (accounts: string[]) => {
            setAccount(accounts[0]);

            const web3 = new Web3(ethObj);
            setWeb3Instance(web3);

            ethObj.on("accountsChanged", (accounts: any[]) =>
              setAccount(accounts[0] || "")
            );

            const getInstance = new web3.eth.Contract(
              ACCENTOR_ABI,
              ACCENTOR_CONTRACT_ADDRESS
            );
            setInstance(getInstance);
          })
          .catch(console.error);
      }
    };

    createInstance();
  }, []);

  return (
    <div className="container">
      <Header />
      <Switch>
        <Route
          path="/"
          exact
          component={() => (
            <ArticlesPage contract={instance} account={account} />
          )}
        />
        <Route path="/post" component={PostArticle} />
      </Switch>
    </div>
  );
}

export default App;
