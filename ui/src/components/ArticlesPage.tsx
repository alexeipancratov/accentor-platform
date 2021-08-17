import { useEffect, useState } from "react";
import { Contract } from "web3-eth-contract";

export default function ArticlesPage({contract, account}: {contract: Contract | undefined, account: string | undefined}) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const makeCall = async () => {
      const ids = await contract?.methods.getArticleIds().call();
      setIds(ids);
    };

    makeCall();
  }, [contract]);

  return (
    <>
    <h1>Articles</h1>
    <ul>
      {ids?.map(id => (
        <li key={id}>{id}</li>
      ))}
    </ul>
    </>
  );
}
