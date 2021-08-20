import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getArticles } from "../api/articlesApi";
import Article from "../models/Article";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    const makeCall = async () => {
      const articles = await getArticles();
      setArticles(articles);
    };

    makeCall();
  }, []);

  const previews = articles.map((a) => (
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
  ));

  const numberOfRows = Math.ceil(articles.length / 3);

  return (
    <>
      <h3>Trending now</h3>
      {Array.from(Array(numberOfRows)).map((_, i) => (
        <div key={i} className="row">
          {previews.slice(i * 3, (i + 1) * 3)}
        </div>
      ))}
    </>
  );
}
