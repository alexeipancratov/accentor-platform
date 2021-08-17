import Article from "../models/Article";

export default function ArticlePreview({ article }: { article: Article }) {
  return <p>Preview for article with ID {article.id}</p>;
}
