import React, { useEffect, useRef } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";

import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

const ChatMessageList = ({
  messages = [],
  currentUserId,
  typingUsers = [],
  onReply,
  onReaction,
  onDelete,
}) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typingUsers]);

  return (
    <PerfectScrollbar className="content-area-body chat-message-list">
      <div className="p-4 d-flex flex-column gap-3">
        {messages.length > 0 ? (
          messages.map((message) => (
            <ChatMessage
              key={message.message_id}
              message={message}
              currentUserId={currentUserId}
              onReply={onReply}
              onReaction={onReaction}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="h-100 d-flex align-items-center justify-content-center py-5">
            <div className="text-center">
              <h6 className="mb-2">No messages yet</h6>
              <p className="text-muted fs-12 mb-0">
                Start your conversation now 🚀
              </p>
            </div>
          </div>
        )}

        {typingUsers?.length > 0 && (
          <TypingIndicator users={typingUsers} />
        )}

        <div ref={bottomRef} />
      </div>
    </PerfectScrollbar>
  );
};

export default ChatMessageList;