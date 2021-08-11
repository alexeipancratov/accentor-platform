// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract Accentor {
    struct Article {
        string text;
        address author;
    }

    mapping(uint256 => Article) articles;
    uint256 articleIdCounter;
    uint256[] articleIds;

    mapping(uint256 => int) articleRatings; // articleId => rating

    event ArticleAdded(uint256 indexed id, address indexed creator);
    event ArticleEdited(uint256 indexed id);

    function addArticle(string memory articleText) external {
        uint256 id = articleIdCounter++;
        articles[id] = Article(articleText, msg.sender);
        articleIds.push(id);
    }

    function editArticle(uint256 id, string memory articleText) external {
        Article memory article = articles[id];
        require(msg.sender == article.author, "Only author can modify his/her article.");
        
        article.text = articleText;
        articles[id] = article;
    }

    function getArticle(uint256 id) external view returns (string memory) {
        return articles[id].text;
    }
    
    function getArticleIds() external view returns (uint256[] memory) {
        return articleIds;
    }

    function upvoteArticle(uint256 id) external {
        articleRatings[id]++;
    }

    function downvoteArticle(uint256 id) external {
        articleRatings[id]--;
    }

    function donateForArticle(uint256 id) external payable {
        Article memory article = articles[id];
        require(article.author != address(0), "Article not found");
        require(msg.sender != article.author, "You cannot donate for your own article");

        (bool success, ) = article.author.call{value: msg.value}("");
        require(success, "Donation failed");
    }
}