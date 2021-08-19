import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Contract } from "web3-eth-contract";
import { getArticles } from "../api/articlesApi";
import Article from "../models/Article";
import ArticlePage from "./ArticlePage";

export default function ArticlesPage({
  contract,
  account,
}: {
  contract: Contract | undefined;
  account: string | undefined;
}) {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const makeCall = async () => {
      const articles = await getArticles();
      setArticles(articles);
    };

    makeCall();
  }, []);

  return (
    <>
      <h3>Trending now</h3>
      <div className="row">
        {articles.map((a) => (
          <div key={a.id} className="col-sm-4">
            <div className="card" style={{ width: "18rem" }}>
              <Link
                to={{
                  pathname: `/article/${a.id}`,
                  state: { article: a },
                }}>
                <img
                  src={`http://localhost:8080/ipfs/${a.image}`}
                  className="card-img top"
                  alt="articleImage"
                />
              </Link>
              <div className="card-body">
                <h5 className="card-title">{a.title}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
