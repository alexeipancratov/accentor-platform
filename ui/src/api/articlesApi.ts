import Article from "../models/Article";
import { handleResponse } from "./apiUtils";
const baseApiUrl = "http://localhost:3001";
const baseUrl = baseApiUrl + "/articles/";

export async function getArticles(): Promise<Article[]> {
  try {
    const response = await fetch(baseUrl);
    return handleResponse<Article[]>(response);
  } catch (error) {
    throw error;
  }
}

export async function postArticle(article: Article): Promise<Article> {
  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(article),
    });
    return handleResponse<Article>(response);
  } catch (error) {
    throw error;
  }
}
