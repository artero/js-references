import React, { useCallback, useMemo, useState } from "react";
import { createEditor, Transforms } from "slate";
import { Slate, Editable, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { LibraryBig } from "lucide-react";

export type MentionElement = {
  type: "mention";
  character: string;
  children: CustomText[];
};

const withChat = (editor) => {
  const { isInline } = editor;

  editor.isInline = (element) => {
    return element.type === "tooltag-dataset" ? true : isInline(element);
  };

  return editor;
};
const AddChildInSelection = () => {
  const editor = useMemo(
    () => withChat(withHistory(withReact(createEditor()))),
    []
  );
  const [value, setValue] = useState(initialValue);

  const addHelloWorld = useCallback(() => {
    const helloWorldElement = {
      type: "tooltag-dataset",
      children: [{ text: "" }],
    };
    Transforms.insertNodes(editor, helloWorldElement);
  }, [editor]);

  return (
    <div>
      <button
        className="mb-4 rounded bg-blue-500 px-2 py-1 text-white"
        onClick={addHelloWorld}
      >
        Add Hello World
      </button>
      <Slate
        editor={editor}
        initialValue={value}
        onChange={(value) => setValue(value)}
      >
        <Editable
          className="border border-gray-300 p-2 rounded-md text-gray-900"
          renderElement={(props) => <Element {...props} />}
          renderLeaf={(props) => <Leaf {...props} />}
          placeholder="Enter some plain text..."
        />
      </Slate>
    </div>
  );
};

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case "tooltag-dataset":
      return (
        <span
          {...attributes}
          className="
            bg-slate-600 bg-opacity-5
            text-blue-800
            px-1 pr-2
            border border-blue-700
            rounded-md
          "
          contentEditable={false}
        >
          <LibraryBig className="inline pt-0.5 pb-1 py-0" />
          Hello World
        </span>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  return <span {...attributes}>{children}</span>;
};

const initialValue = [
  {
    type: "paragraph",
    children: [
      { text: "Loreipsun dolor sit amet, " },
      {
        type: "tooltag-dataset",
        children: [{ text: "Loreipsun" }],
      },
      { text: " consectetur adipiscing elit." },
    ],
  },
];

export default AddChildInSelection;
