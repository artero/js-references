import React, { useCallback, useEffect, useMemo, useState } from "react";
import escapeHtml from "escape-html";
import { createEditor, Transforms, Text, Editor } from "slate";
import {
  Slate,
  Editable,
  withReact,
  ReactEditor,
  useSelected,
  useFocused,
} from "slate-react";
import { withHistory } from "slate-history";
import { LibraryBig } from "lucide-react";
import { data, Form } from "@remix-run/react";
import { jsx } from "slate-hyperscript";

export type MentionElement = {
  type: "mention";
  character: string;
  children: CustomText[];
};

const withChat = (editor) => {
  const { isInline, isVoid, markableVoid } = editor;

  editor.isInline = (element) => {
    return element.type === "tool-tag" ? true : isInline(element);
  };
  editor.isVoid = (element) => {
    return element.type === "tool-tag" ? true : isVoid(element);
  };
  editor.markableVoid = (element) => {
    return element.type === "tool-tag" || markableVoid(element);
  };

  return editor;
};

const Element = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();
  const style = {
    boxShadow: selected && focused ? "0 0 0 2px #B4D5FF" : "none",
  };

  switch (element.type) {
    case "tool-tag":
      return (
        <span
          {...attributes}
          className={`
          px-1 pr-2
          border
          rounded-md
          inline-block
          baseline
          my-1
          ${
            selected && focused
              ? "border-blue-500 text-blue-700 shadow-blue-700 bg-blue-50"
              : "text-purple-800 border-purple-800"
          }
          `}
          contentEditable={false}
          style={style}
        >
          <div
            contentEditable={false}
            className="bg-transparent selection:bg-transparent"
          >
            <LibraryBig className="inline pt-0.5 pb-1 py-0" />
            {element.data.name}
            {children}
          </div>
        </span>
      );
    default:
      return (
        <div {...attributes} style={{ position: "relative" }}>
          {children}
        </div>
      );
  }
};

const Leaf = ({ attributes, children, leaf }) => {
  return <span {...attributes}>{children}</span>;
};

const emptyInitialValue = [{ type: "paragraph", children: [{ text: "" }] }];

const ViewerComponent = ({ content }) => {
  const editor = useMemo(() => withChat(withReact(createEditor())), []);
  useEffect(() => {
    if (content) {
      console.log({ content });
      const document = new DOMParser().parseFromString(content, "text/html");
      const parsed = deserialize(document.body);
      console.log(parsed.children);

      const newNodes = parsed.children ? parsed.children : parsed;

      Transforms.removeNodes(editor, { at: [0] });
      Transforms.insertNodes(editor, {
        type: "paragraph",
        children: newNodes,
      });
    }
  }, [content]);

  const deserialize = (el, markAttributes = {}) => {
    if (el.nodeType === Node.TEXT_NODE) {
      return jsx("text", markAttributes, el.textContent);
    } else if (el.nodeType !== Node.ELEMENT_NODE) {
      return null;
    }

    const nodeAttributes = { ...markAttributes };

    const children = Array.from(el.childNodes)
      .map((node) => deserialize(node, nodeAttributes))
      .flat();

    if (children.length === 0) {
      children.push(jsx("text", nodeAttributes, ""));
    }

    switch (el.nodeName) {
      case "ORCHESTRA_DATASET_ID":
        return {
          type: "tool-tag",
          data: {
            id: el.textContent,
            name: "Example",
            description:
              "Dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ",
          },
          children: [{ text: "" }], // Empty to allow remove with one backspace
        };
      default:
        return children;
    }
  };

  return (
    <Slate editor={editor} initialValue={emptyInitialValue} onChange={() => {}}>
      <Editable
        className="border border-l-4 p-2 text-gray-400 border-r-0 border-y-0"
        readOnly // Indica que el contenido es de solo lectura
        renderElement={(props) => <Element {...props} />}
        renderLeaf={(props) => <Leaf {...props} />}
      />
    </Slate>
  );
};

export default ViewerComponent;
