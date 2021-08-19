import React from "react";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";

export type Web3State = {
  web3: Web3 | undefined;
  contract: Contract | undefined;
  account: string | undefined;
};

const Web3Context = React.createContext<Web3State>({
  web3: undefined,
  contract: undefined,
  account: undefined,
});

export const Web3Provider = Web3Context.Provider;

export default Web3Context;
