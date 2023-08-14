"use client";

import { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import Image from "next/image";

import {
  TextField,
  InputAdornment,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import Markdown from "markdown-to-jsx";

import { Message, useChat } from "ai/react";

import Code from "./Code";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function ChatMessage({ message, selectedAgent }: any) {
  console.log(message);
  console.log({ selectedAgent });
  return (
    <>
      <div>
        <div
          className={classNames(
            "chat-response flex px-2 py-4 border mb-5 rounded-xl",
            {
              "float-right  rounded-tr-none ml-auto": message.role === "user",
              "rounded-tl-none mr-auto bg-slate-100": message.role !== "user",
            }
          )}
        >
          <Avatar className="mr-3">
            {message.role === "user" ? (
              <AvatarImage src="/images/user.png" />
            ) : (
              <AvatarImage src={selectedAgent.avatar} />
            )}
            <AvatarFallback>U</AvatarFallback>
          </Avatar>

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
            {/* <div className="text-xs">{message.createdAt.toDateString()}</div> */}
          </div>
        </div>
      </div>
    </>
  );
}

type Agent = {
  name: string;
  avatar: string;
  systemMessage?: Message;
};
export default function ChatRoom() {
  const agents = [
    {
      name: "Preseed",
      avatar: "/images/preseed.jpeg",
      systemMessage: {
        id: "1",
        role: "system",
        content:
          "You are a highly enthusiastic, helpful and eager collegiate assistant that follows the exact commands issued by the user.",
      },
    },
    {
      name: "Josef",
      avatar: "/images/josef.jpeg",
      systemMessage: {
        id: "1",
        role: "system",
        content:
          "You are an assistant and help in translating English to French.",
      },
    },
    {
      name: "Paul",
      avatar: "/images/paul.jpeg",
      systemMessage: {
        id: "1",
        role: "system",
        content:
          "You are an assistant that helps in solving the python programming problems and coding issues.",
      },
    },
  ];
  const defaultAgent = agents[0];
  const [userInput, setUserInput] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Agent>(
    defaultAgent as Agent
  );
  const scrollRef = useRef<HTMLDivElement>(null);

  const { input, handleInputChange, handleSubmit, isLoading, messages } =
    useChat({
      initialMessages: [selectedAgent?.systemMessage!],
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
      <div className="border w-80">
        <div className="flex flex-col mt-3 space-y-2 ">
          {agents.map((agent) => {
            return (
              <div
                key={agent.name}
                className={classNames(
                  "flex items-center cursor-pointer hover:bg-slate-100",
                  {
                    "bg-slate-100 border-r border-r-white z-10  -mr-1 shadow-lg":
                      agent.name === selectedAgent?.name,
                  }
                )}
                onClick={() => {
                  setSelectedAgent(agent as Agent);
                }}
              >
                <Image
                  className="mx-2 my-3 rounded-full aspect-square"
                  alt={agent.name}
                  src={agent.avatar}
                  width={100}
                  height={100}
                />
                <div className="">
                  <div>{agent.name}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col justify-between w-full px-6 py-12 border-t ">
        <div className="flex flex-col px-3 overflow-auto">
          {messages.map((message, i) => (
            <ChatMessage
              key={i}
              message={message}
              selectedAgent={selectedAgent}
            />
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
