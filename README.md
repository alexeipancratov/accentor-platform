# Accentor
dApp platform for sharing content.

## Smart Contract specification

### Accentor.sol
|Function Name | Function Visibility | Function mutability | Modifiers | Parameters/Return value | Action - Notes |
|--------------|---------------------|----------------------------------|-----------|------------|----------------|
| `registerEditor` | `external`      | N/A           | `onlyOwner` | - `address editorAddres`<br/> | - registers the address as Editor user<br/> - emits an `EditorRegistered` event | 
| `registerReader` | `external`      | N/A           | `onlyOwner` | - `address readerAddres` | - registers the address as Reader user<br/> - emits a `ReaderRegistered` event |
| `addArticle`     | `external`      | N/A           | `onlyRole(EDITOR_ROLE)` | - `string memory articleText` | - increments the `articleIdCounter`<br/>- inserts new `Article` object in the `articles` array<br />- emits an `ArticleAdded` event |
| `editArticle`    | `external`      | N/A           | `onlyRole(EDITOR_ROLE)` | - `uint256 id`<br/>- `string memory articleText` | - checks if `msg.sender` is the article creator<br/>- updates the `Article` object<br/>- emits an `ArticleEdited` event |
| `getArticle`     | `external`      | `view`        | N/A         | - `uint256 id`<br/>- returns `string memory` | - returns the the article text by ID |
| `getArticleIds`  | `external`      | `view`        | N/A         | - returns `uint256[] memory` | - returns the array of article IDs |
| modifier `articleRatingMarker` | N/A      | N/A        | N/A         | - `uint256 id` | - checks if an article with given ID is found<br/>- checks if user has already voted for this article<br/>- executes function body (`_`)<br/>- marks `msg.sender` as voted for a given article |
| `upvoteArticle`  | `external`      | N/A        | - `onlyRole(READER_ROLE)`<br/> - articleRatingMarker(id) | - `uint256 id` | - increments votes count for a given article |
| `downvoteArticle`| `external`      | N/A        | - `onlyRole(READER_ROLE)`<br/> - articleRatingMarker(id) | - `uint256 id` | - decrements votes count for a given article |
|`donateForArticle`| `external`      | `payable`  | - `onlyRole(READER_ROLE)` | - `uint256 id` | - checks if article with such ID exists<br/>- ensures that passed ETH amount is greater than the `DONATION_FEE` constant<br/>- ensures that the `msg.sender` is not the article author<br/>- sends the difference between sent ETH and `DONATION_FEE` to the article author |
|`getTotalAmountLocked`| `external`  | `view`     | N/A            | - returns `uint256` | - returns the total amount currently locked in smart contract
|`withdrawRevenue`     | `external`  | N/A        | `onlyOwner`    | - `uint256 amount`  | - ensures the required amount is <= than the currently locked amount<br/>- transfers the specified amount to contract owner<br/>- ensures transfer succeeded
