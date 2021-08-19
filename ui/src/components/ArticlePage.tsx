import { useLocation } from "react-router-dom";
import Article from "../models/Article";

export default function ArticlePage() {
  const state = useLocation().state as any;
  const article = state.article as Article;

  return (
    <>
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: article.content }}></div>
    </>
  );
}
