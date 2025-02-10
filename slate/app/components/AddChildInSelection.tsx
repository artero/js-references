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
import ViewerComponent from "./ViewerComponent";

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

const AddChildInSelection = () => {
  const [editor] = useState(
    () => withChat(withHistory(withReact(createEditor()))),
    []
  );
  const [value, setValue] = useState(initialValue);
  const [deserializeInput, setDeserializeInput] = useState(
    "hello <orchestra_dataset_id>1</orchestra_dataset_id> foobar"
  );

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

  const addToolTag = useCallback(() => {
    const dataset = datasets[Math.floor(Math.random() * datasets.length)];
    console.log({ data });
    const helloWorldElement = {
      type: "tool-tag",
      data: dataset,
      children: [{ text: "" }], // Empty to allow remove with one backspace
    };
    Transforms.insertNodes(editor, [helloWorldElement, { text: " " }]);
    Transforms.move(editor, { distance: 1, unit: "offset" });
    ReactEditor.focus(editor);
  }, [editor]);
  const [content, setContent] = useState("");

  const serialize = (node) => {
    if (Text.isText(node)) {
      let string = escapeHtml(node.text);

      return string;
    }

    const children = node.children.map((n) => serialize(n)).join("");

    switch (node.type) {
      case "tool-tag":
        return `<orchestra_dataset_id>${node.data.id}</orchestra_dataset_id>`;
      case "paragraph":
        return `${children}\n`;
      default:
        return children;
    }
  };

  const addSerializeToContent = useCallback(() => {
    const content = serialize(editor);
    setContent(content);
  }, [editor]);

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
  const handleDeserialize = useCallback(
    (deserializeInput) => {
      console.log({ deserializeInput });
      const document = new DOMParser().parseFromString(
        deserializeInput,
        "text/html"
      );
      const parsed = deserialize(document.body);
      console.log({ parsed });

      // Si 'parsed' es un fragmento con children, extrae los children.
      const newNodes = parsed.children ? parsed.children : parsed;

      Transforms.removeNodes(editor, { at: [0] });
      Transforms.insertNodes(editor, {
        type: "paragraph",
        children: newNodes,
      });
    },
    [editor]
  );

  return (
    <div>
      <textarea
        className="block  p-2 border border-gray-300 text-gray-900 rounded-md bg-white w-full"
        placeholder="Enter some plain text..."
        value={deserializeInput}
        onChange={(e) => setDeserializeInput(e.target.value)}
      />
      <button
        type="submit"
        className="my-4 rounded bg-blue-500 px-2 py-1 text-white"
        onClick={() => handleDeserialize(deserializeInput)}
      >
        Deserialize
      </button>
      <hr className="my-4" />
      <h3 className="text-gray-700 text-sm font-semibold">
        Deserialized no editable:
      </h3>
      <ViewerComponent content={deserializeInput} />
      <hr className="my-4" />
      <button
        className="mb-4 rounded bg-blue-500 px-2 py-1 text-white"
        onClick={addToolTag}
      >
        Add Tool Tag
      </button>
      <Slate
        editor={editor}
        initialValue={emptyInitialValue}
        onChange={(value) => setValue(value)}
      >
        <Editable
          className="
            border border-gray-300
            p-2
            rounded-md
            text-gray-900
            max-h-40
            overflow-y-auto
            focus:outline-none
            bg-white
          "
          renderElement={(props) => <Element {...props} />}
          renderLeaf={(props) => <Leaf {...props} />}
          placeholder="Enter some plain textEnter some plain..."
        />
      </Slate>
      asfsdf
      <div className="mt-4">
        <button
          className="mb-4 rounded bg-blue-500 px-2 py-1 text-white"
          onClick={addSerializeToContent}
        >
          Serialize
        </button>
        <pre className="border border-gray-300 p-2 rounded-md text-gray-900">
          {content}
        </pre>
      </div>
    </div>
  );
};

const initialValue = [
  {
    type: "paragraph",
    children: [
      { text: "Loreipsun dolor sit amet, " },
      {
        type: "tool-tag",
        data: {
          id: "1",
          name: "Legal documents",
          description:
            "Dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ",
        },
        children: [{ text: "" }],
      },
      { text: " consectetur adipiscing elit." },
    ],
  },
];

const emptyInitialValue = [{ type: "paragraph", children: [{ text: "" }] }];

const datasets = [
  {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Legal documents",
    description:
      "Dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    name: "Financial reports",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    name: "Technical manuals",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    name: "Marketing materials",
    description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    name: "HR policies",
    description:
      "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    name: "Project plans",
    description:
      "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos.",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440006",
    name: "Meeting notes",
    description:
      "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440007",
    name: "Research papers",
    description:
      "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440008",
    name: "Training guides",
    description:
      "Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440009",
    name: "Client contracts",
    description:
      "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque.",
  },
];

export default AddChildInSelection;
