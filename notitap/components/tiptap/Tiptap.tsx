"use client"

import { EditorContent, useEditor } from "@tiptap/react";
import { useState } from "react";
import { getExtensions } from "./extensions/starter-kit";
import "./styles.css";

export const Tiptap = () => {
  const [isAddingNewLink, setIsAddingNewLink] = useState(false);
  const openLinkModal = () => setIsAddingNewLink(true);

  const editor = useEditor({
    extensions: getExtensions({ openLinkModal }),
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl prose-p:my-2 prose-h1:my-2 prose-h2:my-2 prose-h3:my-2 max-w-none",
      }
    }
  });

  const addImage = () => {
    editor?.commands.setMedia({
      src: "https://source.unsplash.com/8xznAGy4HcY/800x400",
      "media-type": "img",
      alt: "Something else",
      title: "Something",
    });
  }

  const videoUrl =
    "https://user-images.githubusercontent.com/45892659/178123048-0257e732-8cc2-466b-8447-1e2b7cd1b5d9.mov";

  const addVideo = () =>
    editor?.commands.setMedia({
      src: videoUrl,
      "media-type": "video",
      alt: "Some Video",
      title: "Some Title Video",
    });

  return <section>
    <span className="flex gap-2">
      <button className="border border-transparent px-2.5 py-1.5 text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
        type="button" onClick={() => addImage()}>Add Image</button>
      <button className="border border-transparent px-2.5 py-1.5 text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
        type="button" onClick={() => addVideo()}>Add Video</button>
    </span>
    <EditorContent editor={editor} />
  </section>
}