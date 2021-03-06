# Accentor
![logo_final_Alt_small](https://user-images.githubusercontent.com/3188163/130112750-872b9eaa-073c-4c90-9268-a144ffc3065b.png) <br/>
dApp platform for sharing content powered by the Ethereum blockchain.

## Use cases
![use-case](https://user-images.githubusercontent.com/3188163/130249577-ef84fd2e-5dc6-41ee-973b-f4f69f4fca1e.png)

* Publisher - posts articles, and can read other articles
* Reader - can read articles, donate to publishers, verify authenticity of an article (by comparing on-chain and off-chain version)

## Architecture
![architecture diagram](https://user-images.githubusercontent.com/3188163/130240496-2753d3cd-c6b5-48b5-b913-2b00edd77b27.png)

* UI - presents the aggregated data to the end user, which is retrieved from Smart Contract, API, and IPFS
* Smart Contract - stores articles and manages donations to publishers. Is deployed on the Ethereum blockchain
* IPFS - stores article images
* API - stores/retrieves off-chain data to/from MongoDB database
* MongoDB - stores off-chain data for faster/easier retrieval

## Tech Stack
Tech stack is based on MERN for the web application. And Solidity for the smart contract development. The full breakdown is as follows:
* UI - React 17
* Smart Contract - Solidity
* API - Node.js + Express
* MongoDB

## Smart Contract specification

|Function Name | Function Visibility | Function mutability | Modifiers | Parameters/Return value | Action - Notes |
|--------------|---------------------|----------------------------------|-----------|------------|----------------|
| `registerEditor` | `external`      | N/A           | `onlyOwner` | - `address editorAddres`<br/> | - registers the address as Editor user<br/> - emits an `EditorRegistered` event | 
| `registerReader` | `external`      | N/A           | `onlyOwner` | - `address readerAddres` | - registers the address as Reader user<br/> - emits a `ReaderRegistered` event |
| `addArticle`     | `external`      | N/A           | `onlyRole(EDITOR_ROLE)` | - `string memory articleText` | - increments the `articleIdCounter`<br/>- inserts new `Article` object in the `articles` array<br />- emits an `ArticleAdded` event |
| `editArticle`    | `external`      | N/A           | `onlyRole(EDITOR_ROLE)` | - `uint256 id`<br/>- `string memory articleText` | - checks if `msg.sender` is the article creator<br/>- updates the `Article` object<br/>- emits an `ArticleEdited` event |
| `getArticleHash` | `external`      | `view`        | N/A         | - `uint256 id`<br/>- returns `bytes32` | - returns keccak256 hash of the specified article |
| `getArticleIds`  | `external`      | `view`        | N/A         | - returns `uint256[] memory` | - returns the array of article IDs |
| modifier `articleRatingMarker` | N/A      | N/A        | N/A         | - `uint256 id` | - checks if an article with given ID is found<br/>- checks if user has already voted for this article<br/>- executes function body (`_`)<br/>- marks `msg.sender` as voted for a given article |
| `upvoteArticle`  | `external`      | N/A        | - `onlyRole(READER_ROLE)`<br/> - articleRatingMarker(id) | - `uint256 id` | - increments votes count for a given article |
| `downvoteArticle`| `external`      | N/A        | - `onlyRole(READER_ROLE)`<br/> - articleRatingMarker(id) | - `uint256 id` | - decrements votes count for a given article |
|`donateForArticle`| `external`      | `payable`  | - `onlyRole(READER_ROLE)` | - `uint256 id` | - checks if article with such ID exists<br/>- ensures that passed ETH amount is greater than the `DONATION_FEE` constant<br/>- ensures that the `msg.sender` is not the article author<br/>- sends the difference between sent ETH and `DONATION_FEE` to the article author |
|`getTotalAmountLocked`| `external`  | `view`     | N/A            | - returns `uint256` | - returns the total amount currently locked in smart contract
|`withdrawRevenue`     | `external`  | N/A        | `onlyOwner`    | - `uint256 amount`  | - ensures the required amount is <= than the currently locked amount<br/>- transfers the specified amount to contract owner<br/>- ensures transfer succeeded

## UI
The image below shows the home page with the list of all articles posted.

![130291013-8a0dd54f-ab3d-48a8-a7f5-f2145d9a0a43](https://user-images.githubusercontent.com/3188163/130291229-41efdbba-55da-4d25-9d5e-421d18aa2f69.png)

The next image shows the page which allows purblishers (journalists) to post new articles.

![image](https://user-images.githubusercontent.com/3188163/130291442-1b7bacb5-5608-4091-83f2-357f3d23a684.png)

Finally, the last image shows how does a reader see a posted article. Here a reader can donate ETH to publisher, upvote/downvote, verify article authenticity (comparison of hashes of data on-chain vs off-chain).

![image](https://user-images.githubusercontent.com/3188163/130291138-226c9208-fef8-44dd-8047-e26edb46caf1.png)

## How to run project
1. Deploy smart contract on any test network
2. Update smart contract address in the ui/src/contractAbis/accentor.ts
3. Start UI by navingating to the ui/ and by running `npm install` and then `npm start`
4. Start API by navingating to the server/ and by running `npm install` and then `npm start`
5. Start IPFS HTTP API locally - https://github.com/ipfs/go-ipfs
6. The application is ready to use
