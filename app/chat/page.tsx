"use client";

import { useState, useEffect, useRef } from "react";
import classNames from "classnames";

import { TextField, InputAdornment } from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import Markdown from "markdown-to-jsx";

import { useChat } from "ai/react";

import Code from "./Code";

function ChatMessage({ message }: any) {
  console.log(message);
  return (
    <div
      className={classNames(
        "chat-response flex px-8 py-4 border mb-5 rounded-3xl   ",
        {
          "float-right bg-blue-800 text-white rounded-tr-none ml-auto":
            message.role === "user",
          "rounded-tl-none mr-auto bg-white max-w-4xl": message.role !== "user",
        }
      )}
    >
      {/* <div>{message.author}</div> */}
      <div>
        {/* <div>{message.content}</div> */}
        {/* <textarea 
        value={markdown} 
        onChange={(e) => setMarkdown(e.target.value)}
      /> */}
        <Markdown
          options={{
            // forceBlock: true,
            disableParsingRawHTML: true,
            overrides: {
              code: {
                component: Code,
              },
            },
          }}
        >
          {message.content}
        </Markdown>
        <div className="text-xs">{message.createdAt.toDateString()}</div>
      </div>
    </div>
  );
}

export default function ChatRoom() {
  const agents = ["Preseed", "Paul", "Josef"];
  const [userInput, setUserInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { input, handleInputChange, handleSubmit, isLoading, messages } =
    useChat({
      body: {
        userInput,
      },
      onResponse() {
        scrollToCurrentMessage();
      },
    });

  useEffect(() => {
    scrollToCurrentMessage();
  }, [messages]);

  const scrollToCurrentMessage = () => {
    if (scrollRef.current !== null) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  console.log(messages);
  const onSubmit = async (e: any) => {
    setUserInput(input);
    handleSubmit(e);
  };

  return (
    <div className="w-3/4 mx-auto mt-32 rounded shadow-xl h-[80vh] flex flex-row ">
      {/* <Box className="text-center w-52">
        Agents
        <List>
          {agents.map((agent, i) => (
            <ListItem key={agent} disableGutters>
              <ListItemText primary={agent} />
            </ListItem>
          ))}
          <div ref={scrollRef} />
        </List>
      </Box> */}
      <div className="flex flex-col justify-between w-full px-6 py-12 border bg-slate-100">
        <div className="flex flex-col overflow-auto">
          {messages.map((message, i) => (
            <ChatMessage key={i} message={message} />
          ))}
          <div ref={scrollRef} />
        </div>
        <div>
          <form onSubmit={onSubmit}>
            <TextField
              className="bg-white "
              variant="outlined"
              multiline
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message"
              fullWidth
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit(e);
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <button type={"submit"} className="p-1 bg-red-500 rounded">
                      <SendIcon className="text-white" />
                    </button>
                  </InputAdornment>
                ),
              }}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
