import { SyntheticEvent, useRef, useState } from "react";
import SunEditor from "suneditor-react";
import SunEditorCore from "suneditor/src/lib/core";
import {
  align,
  font,
  fontColor,
  fontSize,
  formatBlock,
  hiliteColor,
  horizontalRule,
  lineHeight,
  list,
  paragraphStyle,
  table,
  template,
  textStyle,
  image,
  link,
} from "suneditor/src/plugins";
import { Contract } from "web3-eth-contract";
import Article from "../models/Article";
import { postArticle } from "../api/articlesApi";
import ipfs from "../services/ipfs";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";

export default function PostArticle({
  contract,
  account,
}: {
  contract: Contract | undefined;
  account: string | undefined;
}) {
  const history = useHistory();
  const [title, setTitle] = useState<string | null>();
  const [imageFile, setImageFile] = useState();

  const editor = useRef<SunEditorCore>();
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };

  const onTitleChange = (e: any) => {
    setTitle(e.target.value);
  };

  const onImageFileChange = async (e: any) => {
    setImageFile(e.target.files[0]);
  };

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    // Upload image to IPFS.
    const ipfsResult = await ipfs.add(imageFile);
    console.log("IPFS image path", ipfsResult.path);

    // Save article in API.
    const id = await contract?.methods.articleIdCounter().call();
    console.log("Smart Contract ID", id);

    const article = new Article();
    article.id = +id;
    article.title = title || "";
    article.content = editor.current?.getContents(false) || "";
    article.author = account || "";
    article.image = ipfsResult.path;

    console.log("Article to post", article);

    await postArticle(article);

    // Save article to the blockchain.
    const receipt = await contract?.methods
      .addArticle(article.title, article.content)
      .send({ from: account });
    console.log("Transaction receipt", receipt);

    // Navigate away.
    toast.success("Article has been successfully posted!");
    history.push("/");
  };

  return (
    <>
      <h2>New Article</h2>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            autoFocus
            type="text"
            className="form-control"
            id="title"
            onChange={onTitleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Image
          </label>
          <input
            type="file"
            className="form-control"
            id="image"
            required
            onChange={onImageFileChange}
          />
        </div>
        <label className="form-label">Content</label>
        <SunEditor
          name="articleText"
          setDefaultStyle="font-family: Arial; font-size: 13px;"
          getSunEditorInstance={getSunEditorInstance}
          setOptions={{
            showPathLabel: false,
            minHeight: "50vh",
            maxHeight: "50vh",
            plugins: [
              align,
              font,
              fontColor,
              fontSize,
              formatBlock,
              hiliteColor,
              horizontalRule,
              lineHeight,
              list,
              paragraphStyle,
              table,
              template,
              textStyle,
              image,
              link,
            ],
            buttonList: [
              ["undo", "redo"],
              ["font", "fontSize", "formatBlock"],
              ["paragraphStyle"],
              [
                "bold",
                "underline",
                "italic",
                "strike",
                "subscript",
                "superscript",
              ],
              ["fontColor", "hiliteColor"],
              ["removeFormat"],
              ["outdent", "indent"],
              ["align", "horizontalRule", "list", "lineHeight"],
              ["table", "link"],
            ],
            formats: ["p", "div", "h1", "h2", "h3", "h4", "h5", "h6"],
            font: [
              "Arial",
              "Calibri",
              "Comic Sans",
              "Courier",
              "Garamond",
              "Georgia",
              "Impact",
              "Lucida Console",
              "Palatino Linotype",
              "Segoe UI",
              "Tahoma",
              "Times New Roman",
              "Trebuchet MS",
            ],
          }}
        />
        <button className="btn btn-primary mt-3 mb-3" type="submit">
          Post
        </button>
      </form>
    </>
  );
}
