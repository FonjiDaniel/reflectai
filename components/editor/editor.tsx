"use client";
import { defaultEditorContent } from "@/lib/content";
import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  ImageResizer,
  type JSONContent,
  handleCommandNavigation,
  handleImageDrop,
  handleImagePaste,
  useEditor,
} from "novel";
import { useEffect, useState, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { defaultExtensions } from "./extensions";
import { ColorSelector } from "./selectors/color-selector";
import { LinkSelector } from "./selectors/link-selector";
import { MathSelector } from "./selectors/math-selector";
import { NodeSelector } from "./selectors/node-selector";
import { Separator } from "./ui/separator";


import GenerativeMenuSwitch from "./generative/generative-menu-switch";
import { uploadFn } from "./image-upload";
import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";

import hljs from "highlight.js";
import { useMyAuth } from "@/hooks/useAuth";
import io from "socket.io-client"
import { config } from "@/lib/config";
import { Input } from "../ui/input";


const extensions = [...defaultExtensions, slashCommand];

const TailwindAdvancedEditor = ({ initialValue }: JSONContent) => {
  const { token } = useMyAuth();

  const [initialContent, setInitialContent] = useState<null | JSONContent>(null);
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [charsCount, setCharsCount] = useState();
  const [editorContent, setEditorContent] = useState<JSONContent>(initialValue.content)

  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openAI, setOpenAI] = useState(false);
  const [title, setTitle] = useState<string>(initialValue.title);

  const titleRef = useRef<HTMLInputElement | null>(null); // Ref for the title input
  const editor = useEditor();


  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "ArrowDown") {
      event.preventDefault(); 
      editor.editor?.commands.focus()
    }
  };


  //Apply Codeblock Highlighting on the HTML from editor.getHTML()
  const highlightCodeblocks = (content: string) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    doc.querySelectorAll("pre code").forEach((el) => {
      //@ts-ignore
      // https://highlightjs.readthedocs.io/en/latest/api.html?highlight=highlightElement#highlightelement
      hljs.highlightElement(el);
    });
    return new XMLSerializer().serializeToString(doc);
  };




  const socket = io(config.socketUrl, {
    auth: {
      token: token
    }
  });

  useEffect(() => {

    const updateOnTitleChange = () => {
      socket.emit("updateLibrary", {
        id: initialValue.id,
        title: title,
        content: editorContent,
        metadata: initialValue.metadata

      })
    }

    if (title) {
      const debounce = setTimeout(updateOnTitleChange, 500);
      return () => clearTimeout(debounce);
    }


  }, [title])

  const debouncedUpdates = useDebouncedCallback(async (editor: EditorInstance) => {

    socket.emit("updateLibrary", {
      id: initialValue.id,
      title: title,
      content: editor.getJSON(),
      metadata: initialValue.metadata

    })
    setEditorContent(editor.getJSON());  

    setCharsCount(editor.storage.characterCount?.words() || 0);


    // Ensure markdown storage exists before using it
    if (editor.storage.markdown) {
      window.localStorage.setItem("markdown", editor.storage.markdown.getMarkdown());
    }

    setSaveStatus("Saved");
  }, 500);


  useEffect(() => {
    if (initialValue && initialValue.content) {
      console.log("Setting initial content from initialValue:", initialValue.content);
      setInitialContent(initialValue.content);
    } else {
      console.log("Setting initial content to defaultEditorContent");
      setInitialContent(defaultEditorContent);
    }
  }, [initialValue]);


  if (!initialContent) return null;

  return (
    <div className="relative w-full max-w-screen-lg">

      <div className="border-none mb-5">
        <Input
          id="title"
          onChange={(e) => setTitle(e.target.value)}
          defaultValue={title}
          onKeyDown={handleKeyDown}
          ref={titleRef}
          className="border-none bg-transparent p-3 text-[#b7bdc1] dark:text-[#E4E4E7] text-3xl font-bold outline-none focus:border-transparent focus:text-3xl transition-all duration-300 ease-in-out 
             focus:scale-105 "
        />


      </div>
      <div className="flex absolute right-5 top-5 z-10 mb-5 gap-2">
        <div className="rounded-lg bg-gray-700 px-2 py-1 text-sm text-muted-foreground text-[#c2baba]">{saveStatus}</div>
        <div className={charsCount ? "rounded-lg bg-accent px-2 py-1 text-sm bg-gray-700 text-[#bbb9b9] text-muted-foreground" : "hidden"}>
          {charsCount} Words
        </div>
      </div>
      <EditorRoot>
        <EditorContent
          initialContent={initialContent}
          extensions={extensions}
          className=" p-5 relative min-h-[500px] w-full max-w-screen-lg text-[#b7bdc1]  bg-[#191919] sm:mb-[calc(20vh)] sm:rounded-lg "
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class:
                "prose prose-lg dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full",
            },
          }}
          onUpdate={({ editor }) => {
            debouncedUpdates(editor);
            setSaveStatus("Unsaved");
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border p-3 bg-[#212121]  border-[#3b3a3a] scrollbar-custom shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">No results</EditorCommandEmpty>
            <EditorCommandList className="bg-[#212121]">
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command && item.command(val)}
                  className="flex w-full  items-center   space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-[#312f2f] "
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center text-[#817f7f] justify-center rounded-md border border-[#3b3a3a] bg-">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium text-[#bbb8b8]">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <GenerativeMenuSwitch open={openAI} onOpenChange={setOpenAI}>
            <Separator orientation="vertical" />
            <NodeSelector open={openNode} onOpenChange={setOpenNode} />
            <Separator orientation="vertical" />

            <LinkSelector open={openLink} onOpenChange={setOpenLink} />
            <Separator orientation="vertical" />
            <MathSelector />
            <Separator orientation="vertical" />
            <TextButtons />
            <Separator orientation="vertical" />
            <ColorSelector open={openColor} onOpenChange={setOpenColor} />
          </GenerativeMenuSwitch>
        </EditorContent>
      </EditorRoot>
    </div>
  );
};

export default TailwindAdvancedEditor;