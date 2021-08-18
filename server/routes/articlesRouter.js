const express = require("express");
const Article = require("../mongoModels/Article");

function createArticlesRouter() {
  const articlesRouter = express.Router();

  articlesRouter.post("/", (req, res) => {
    Article.find({ id: req.body.id }, (err, articles) => {
      if (articles.length > 0) {
        return res.send({ error: "Duplicate key" });
      }

      Article.create(
        {
          id: req.body.id,
          title: req.body.title,
          content: req.body.content,
          author: req.body.author,
          datePosted: new Date(),
        },
        (err) => {
          if (err) {
            return res.send(err);
          }

          return res.sendStatus(201);
        }
      );
    });
  });

  articlesRouter.get("/", (_, res) => {
    Article.find(null, (err, articles) => {
      if (err) {
        return res.json(err);
      }

      return res.json(articles);
    }).limit(1000);
  });

  articlesRouter.delete("/:id", (req, res) => {
    Article.deleteOne({ id: req.params.id }, (err) => {
      if (err) {
        return res.json(err);
      }

      return res.sendStatus(200);
    });
  });

  return articlesRouter;
}

module.exports = createArticlesRouter;
