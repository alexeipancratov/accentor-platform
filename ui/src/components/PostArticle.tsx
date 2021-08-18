import { ChangeEvent, useRef, useState } from "react";
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

export default function PostArticle() {
  const [title, setTitle] = useState<string | null>();
  const editor = useRef<SunEditorCore>();

  // The sunEditor parameter will be set to the core suneditor instance when this function is called
  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };

  const onTitleChange = (e: ChangeEvent) => {
    setTitle(e.target.nodeValue);
  };

  const onPost = () => {
    console.log({
      title: title,
      articleText: editor.current?.getContents(false),
    });
  };

  return (
    <>
      <h2>New Article</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            autoFocus
            type="text"
            className="form-control"
            id="title"
            required
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
        <button className="btn btn-primary mt-3" onClick={onPost}>
          Post
        </button>
      </form>
    </>
  );
}
