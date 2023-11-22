"use client"

import {useState} from "react";

interface Message {
  role: string
  content: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [content, setContent] = useState<string>('');

  const handleSendMessage = () => {
    const newMessage: Message = {
      role: "user",
      content: content,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setContent('');

    chatGptResponse(newMessage)
      .then(() => console.log("success"))
      .catch((err) => console.log(err));
  };

  const chatGptResponse = async (input: Message) => {
    const content = input.content;
    const response = await fetch('/api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({content, messages}),
    });

    const data = await response.json();

    const newMessage: Message = {
      role: "assistant",
      content: data,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      <div className={"flex flex-col w-full"}>
        <p className={"text-4xl pb-2 mt-5 text-center"}>Chat with GPT-4 🪄</p>
        <div className={"bg-[#CAE9FF] overflow-y-auto h-[500px] mx-32 no-scrollbar scroller border rounded-2xl"}>
          <div className={"scroller-content"}>
            {messages.map((message, index) => (
              <div key={index} className={`item chat ${message.role === "user" ? 'chat-end' : 'chat-start'}`}>
                <div className="chat-bubble">{message.content}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-row items-center justify-center h-16 text-base-content m-5">
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="btn bg-[#CAE9FF] text-black mx-5" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </>
  )
}

export default App
