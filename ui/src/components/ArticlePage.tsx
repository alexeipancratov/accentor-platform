import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Web3Context, { Web3State } from "../contexts/web3Context";
import Article from "../models/Article";

export default function ArticlePage() {
  const [weiAmount, setWeiAmount] = useState<string>("");
  const [rating, setRating] = useState<number | undefined>(0);
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

  const updateRating = async () => {
    const rating = await web3Context.contract?.methods
      .articleRatings(article.id)
      .call();
    setRating(web3Context.web3?.utils.toNumber(rating));
  };

  useEffect(() => {
    updateDonatedAmount();
    updateRating();
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
      toast.success("This article matches with its version on blockchain!");
    } else {
      toast.error("This article differs from its version on blockchain!");
    }
  };

  const onUpvote = async () => {
    await web3Context.contract?.methods
      .upvoteArticle(article.id)
      .send({ from: web3Context.account });

    toast.success("Upvoted!");
    updateRating();
  };

  const onDownvote = async () => {
    await web3Context.contract?.methods
      .downvoteArticle(article.id)
      .send({ from: web3Context.account });

    toast.success("Downvoted.");
    updateRating();
  };

  return (
    <>
      <h1>{article.title}</h1>
      <div className="mt-3 mb-3">
        <p>
          <span>
            <i
              className="bi bi-cash-coin text-success"
              title="Total donated in ETH"></i>{" "}
            {weiAmount} ETH
          </span>{" "}
          |{" "}
          <span>
            <i className="bi bi-star text-warning" title="User rating"></i>{" "}
            {rating}
          </span>
        </p>
      </div>
      <div className="mt-2 mb-2">
        <button
          className="btn btn-outline-primary btn-sm"
          title="Thumbs up"
          onClick={onUpvote}>
          <i className="bi bi-hand-thumbs-up"></i>
        </button>
        <button
          className="btn btn-outline-danger btn-sm ms-1"
          title="Thumbs down"
          onClick={onDownvote}>
          <i className="bi bi-hand-thumbs-down"></i>
        </button>
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
      <div className="mb-4">
        <button
          className="btn btn-outline-success btn-sm"
          onClick={onDonateClick}
          title="Donate 4000 wei to publisher (fee is 1000 wei)">
          <i className="bi bi-cash-coin"></i> Donate to publisher
        </button>
        <button
          className="btn btn-outline-info ms-3 btn-sm"
          onClick={onVerifyAuthenticity}
          title="Compare hashes of this article on-chain and off-chain">
          <i className="bi bi-file-earmark-medical"></i> Verify authenticity
        </button>
      </div>
    </>
  );
}
