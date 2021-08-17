// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Accentor is Ownable, AccessControl {
    struct Article {
        string text;
        address author;
        uint256 datePosted;
        bool isPosted;
    }

    bytes32 public constant EDITOR_ROLE = keccak256("EDITOR_ROLE");
	bytes32 public constant READER_ROLE = keccak256("READER_ROLE");
    uint256 public constant DONATION_FEE = 1000;

    mapping(uint256 => Article) articles;
    uint256 articleIdCounter;
    uint256[] articleIds;

    mapping(uint256 => int) articleRatings; // articleId => rating
    mapping(uint256 => mapping(address => bool)) articleRatingAddresses; // articleId => [readerAddress => hasVoted]

    event ArticleAdded(uint256 indexed id, address indexed creator);
    event ArticleEdited(uint256 indexed id);
    event EditorRegistered(address indexed editor);
    event ReaderRegistered(address indexed reader);

    function registerEditor(address editorAddres) external onlyOwner() {
        _setupRole(EDITOR_ROLE, editorAddres);
        emit EditorRegistered(editorAddres);
    }

    function registerReader(address readerAddres) external onlyOwner() {
        _setupRole(READER_ROLE, readerAddres);
        emit ReaderRegistered(readerAddress);
    }

    function addArticle(string memory articleText) external onlyRole(EDITOR_ROLE) {
        uint256 id = articleIdCounter++;
        articles[id] = Article({text: articleText, author: msg.sender, datePosted: block.timestamp, isPosted: true});
        articleIds.push(id);

        emit ArticleAdded(id, msg.sender);
    }

    function editArticle(uint256 id, string memory articleText) external onlyRole(EDITOR_ROLE) {
        Article memory article = articles[id];
        require(msg.sender == article.author, "Only author can modify his/her article.");
        
        article.text = articleText;
        articles[id] = article;
        emit ArticleEdited(id);
    }

    function getArticle(uint256 id) external view returns (string memory) {
        return articles[id].text;
    }
    
    function getArticleIds() external view returns (uint256[] memory) {
        return articleIds;
    }

    modifier articleRatingMarker(uint256 id) {
        require(articles[id].isPosted, "Article with provided identifier is not found.");
        require(!articleRatingAddresses[id][msg.sender], "You have already voted for this article.");
        _;
        articleRatingAddresses[id][msg.sender] = true;
    }

    function upvoteArticle(uint256 id) external onlyRole(READER_ROLE) articleRatingMarker(id) {
        articleRatings[id]++;
    }

    function downvoteArticle(uint256 id) external onlyRole(READER_ROLE) articleRatingMarker(id) {
        articleRatings[id]--;
    }

    function donateForArticle(uint256 id) external payable onlyRole(READER_ROLE) {
        require(articles[id].isPosted, "Article with provided identifier is not found.");
        require(msg.value > DONATION_FEE, "Donation amount should be greater than 1000 wei.");
        Article memory article = articles[id];
        require(msg.sender != article.author, "You cannot donate for your own article.");

        uint256 amountToDonate = msg.value - DONATION_FEE;

        (bool success, ) = article.author.call{value: amountToDonate}("");
        require(success, "Donation failed");
    }
    
    function getTotalAmountLocked() external view returns(uint256) {
        return address(this).balance;
    }
    
    function withdrawRevenue(uint256 amount) external onlyOwner {
        require(amount <= address(this).balance, "The specified amount is greater than current contract balance.");
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed.");
    }
}