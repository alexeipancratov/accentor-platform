import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Web3Context, { Web3State } from "../contexts/web3Context";
import Article from "../models/Article";

export default function ArticlePage() {
  const [weiAmount, setWeiAmount] = useState<string>("");
  const web3Context = useContext<Web3State>(Web3Context);

  const locationState = useLocation().state as any;
  const article = locationState.article as Article;

  const updateDonatedAmount = async () => {
    if (web3Context.contract) {
      const weiAmount = await web3Context.contract.methods
        .articleDonationAmounts(article.id)
        .call();

      if (web3Context.web3) {
        setWeiAmount(web3Context.web3.utils.fromWei(weiAmount));
      }
    }
  };

  useEffect(() => {
    updateDonatedAmount();
  });

  const onDonateClick = async () => {
    if (web3Context.contract) {
      console.log("article ID", article.id);
      const receipt = await web3Context.contract.methods
        .donateForArticle(article.id)
        .send({ from: web3Context.account, value: 5000 });
      console.log("Transaction receipt", receipt);
      toast.success("Donated successfully. Thank you!");

      updateDonatedAmount();
    }
  };

  const onVerifyAuthenticity = async () => {
    const blockchainArticleHash = await web3Context.contract?.methods
      .getArticleHash(article.id)
      .call();
    const localArticleHash = web3Context.web3?.utils.keccak256(
      `${article.title}${article.content}`
    );

    if (blockchainArticleHash === localArticleHash) {
      toast.success("Match!");
    } else {
      toast.error("No match!");
    }
  };

  return (
    <>
      <h1>{article.title}</h1>
      <div className="mt-3 mb-3">
        <p>Currently donated: {weiAmount} ETH</p>
        <button className="btn btn-outline-success" onClick={onDonateClick}>
          <i className="bi bi-cash-coin"></i> Donate to publisher
        </button>
        <button
          className="btn btn-outline-info ms-3"
          onClick={onVerifyAuthenticity}>
          <i className="bi bi-file-earmark-medical"></i> Verify authenticity
        </button>
      </div>
      <div className="mt-2 mb-2">
        <i className="bi bi-hand-thumbs-up"></i>
        <i className="bi bi-hand-thumbs-down ms-1"></i>
      </div>
      <img
        src={`http://localhost:8080/ipfs/${article.image}`}
        className="card-img top"
        alt="articleImage"
        style={{ width: "25rem" }}
      />
      <div
        dangerouslySetInnerHTML={{ __html: article.content }}
        className="mt-3"></div>
    </>
  );
}
