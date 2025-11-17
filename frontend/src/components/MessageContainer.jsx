import React, { useEffect, useRef, useState } from "react";
import userConversation from "../zustans/useConversation";
import { useAuth } from "../context/AuthContext";
import { TiMessages } from "react-icons/ti";
import { IoArrowBackSharp, IoSend } from "react-icons/io5";
import axios from "axios";
import { useSocketContext } from "../context/SocketContext";

function MessageContainer({ onBackUser }) {
  const {
    messages,
    selectedConversation,
    setMessage,
  } = userConversation();
  const { authUser } = useAuth();
  const { socket } = useSocketContext();
  const [loading, setLoading] = useState(false);
  const [sendData, setSendData] = useState("");
  const [sending, setSending] = useState(false);
  const lastMessageRef = useRef();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setMessage((prev) => [...prev, newMessage]);
    });

    return () => socket?.off("newMessage");
  }, [socket, setMessage]);

  useEffect(() => {
    const scrollToBottom = () => {
      lastMessageRef?.current?.scrollIntoView({ behavior: "smooth" });
    };
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const getMessage = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `/api/message/${selectedConversation?._id}`
        );
        const data = res.data;

        if (data.success === false) {
          console.log(data.messages);
          return;
        }

        setMessage(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) getMessage();
  }, [selectedConversation?._id, setMessage]);

  const handleMessage = (e) => {
    setSendData(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sendData.trim()) return;
    setSending(true);
    try {
      const res = await axios.post(
        `/api/message/send/${selectedConversation?._id}`,
        { message: sendData }
      );
      const data = res.data;

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setMessage((prev) => [...prev, data]);
      setSendData("");
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {selectedConversation === null ? (
        <div className="flex h-full flex-col items-center justify-center gap-5 text-center text-white/80">
          <div className="rounded-3xl border border-white/5 bg-white/5 px-10 py-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-2 text-xs uppercase tracking-[0.3em] text-white/60">
              Ready
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </div>
            <h3 className="mt-6 text-3xl font-semibold text-white">
              Welcome back, {authUser?.fullname?.split(" ")[0]}
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/60">
              Pick a contact on the left to resume an existing conversation or start a new one.
            </p>
            <TiMessages className="mx-auto mt-6 text-6xl text-indigo-300" />
          </div>
        </div>
      ) : (
        <>
          <header className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onBackUser(true)}
                className="md:hidden rounded-full border border-white/10 p-2 text-white"
              >
                <IoArrowBackSharp size={22} />
              </button>
              <div className="flex items-center gap-3">
                <img
                  src={selectedConversation?.profilePic}
                  className="h-11 w-11 rounded-2xl object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-white">
                    {selectedConversation?.fullname}
                  </p>
                  <span className="text-xs uppercase tracking-[0.4em] text-white/50">
                    @{selectedConversation?.username}
                  </span>
                </div>
              </div>
            </div>
          </header>

          <div className="scroll-area flex-1 space-y-4 overflow-y-auto py-6 pr-2">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <span className="loading loading-dots loading-lg text-indigo-300" />
              </div>
            ) : messages?.length === 0 ? (
              <p className="text-center text-sm text-white/60">
                Say hi and kick off the conversation ✨
              </p>
            ) : (
              messages?.map((message, idx) => {
                const isMine = message.senderId === authUser._id;
                const isLast = idx === messages.length - 1;
                return (
                  <div
                    key={message?._id}
                    ref={isLast ? lastMessageRef : null}
                    className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`message-bubble ${
                        isMine ? "message-bubble--mine" : "message-bubble--theirs"
                      }`}
                    >
                      <p>{message?.message}</p>
                      <span className="mt-2 block text-right text-[0.65rem] uppercase tracking-[0.4em] text-white/70">
                        {new Date(message?.createdAt).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form className="mt-auto" onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3">
              <input
                type="text"
                value={sendData}
                onChange={handleMessage}
                required
                id="message"
                placeholder="Write a thoughtful reply..."
                className="flex-1 bg-transparent text-sm text-white placeholder:text-white/50 focus:outline-none"
              />
              <button
                type="submit"
                disabled={sending}
                className="rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20 disabled:opacity-50"
              >
                {sending ? (
                  <span className="loading loading-spinner text-white" />
                ) : (
                  <IoSend size={20} />
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default MessageContainer;
