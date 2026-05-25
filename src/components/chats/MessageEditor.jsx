import React, {
  useRef,
  useState,
  useEffect,
} from "react";

import Dropdown from "@/components/shared/Dropdown";

import {
  FiImage,
  FiLink,
  FiPaperclip,
  FiPhoneCall,
  FiSend,
  FiSmile,
  FiVideo,
  FiX,
} from "react-icons/fi";

import EmojiPicker from "emoji-picker-react";

import ReplyPreview from "./ReplyPreview";

const callingOptions = [
  {
    icon: <FiPhoneCall />,
    label: "Audio Call",
    modalTarget: "#voiceCallingModalScreen",
  },
  {
    icon: <FiVideo />,
    label: "Video Call",
    modalTarget: "#videoCallingModalScreen",
  },
];

const MessageEditor = ({
  selectedChat,
  replyMessage,
  setReplyMessage,
  onSendMessage,
  currentUserId,
  socketRef, // ✅ ADD THIS
}) => {

  const [message, setMessage] =
    useState("");

  const [showEmojiPicker, setShowEmojiPicker] =
    useState(false);

  const [attachments, setAttachments] =
    useState([]);

  const fileInputRef =
    useRef(null);

  const typingTimeoutRef =
    useRef(null);

  /* =========================================
      TYPING EMIT
  ========================================= */
useEffect(() => {

  if (
    !socketRef?.current ||
    !selectedChat?.chat_id
  ) {
    return;
  }

  if (message.trim()) {

    socketRef.current.emit(
      "chat:typing",
      {
        chat_id:
          selectedChat.chat_id,

        user_id:
          currentUserId,

        user_name: JSON.parse(
          localStorage.getItem("user")
        )?.full_name,
      }
    );

    clearTimeout(
      typingTimeoutRef.current
    );

    typingTimeoutRef.current =
      setTimeout(() => {

        socketRef.current.emit(
          "chat:stop-typing",
          {
            chat_id:
              selectedChat.chat_id,

            user_id:
              currentUserId,
          }
        );

      }, 1000);

  } else {

    socketRef.current.emit(
      "chat:stop-typing",
      {
        chat_id:
          selectedChat.chat_id,

        user_id:
          currentUserId,
      }
    );
  }

  return () => {

    clearTimeout(
      typingTimeoutRef.current
    );
  };

}, [
  message,
  selectedChat,
]);

  /* =========================================
      SEND MESSAGE
  ========================================= */

  const handleSendMessage = () => {

    if (
      !message.trim() &&
      attachments.length === 0
    ) {
      return;
    }

    if (!selectedChat) {
      return;
    }

    // stop typing immediately
    socketRef?.current?.emit(
      "typing:stop",
      {
        chat_id:
          selectedChat.chat_id,

        user_id:
          currentUserId,
      }
    );

    onSendMessage?.({
      chat_id:
        selectedChat.chat_id,

      message:
        message.trim(),

      reply_to_message_id:
        replyMessage?.message_id || null,
    });

    setMessage("");

    setAttachments([]);

    setReplyMessage?.(null);

    setShowEmojiPicker(false);
  };

  /* =========================================
      HANDLE FILES
  ========================================= */

  const handleAttachment = (e) => {

    const files =
      Array.from(
        e.target.files || []
      );

    const mappedFiles =
      files.map((file) => ({
        file,

        preview:
          URL.createObjectURL(file),

        file_name:
          file.name,

        file_size:
          `${(
            file.size /
            1024 /
            1024
          ).toFixed(2)} MB`,

        mime_type:
          file.type,
      }));

    setAttachments((prev) => [
      ...prev,
      ...mappedFiles,
    ]);
  };

  /* =========================================
      REMOVE ATTACHMENT
  ========================================= */

  const removeAttachment = (
    index
  ) => {

    setAttachments((prev) =>
      prev.filter(
        (_, i) => i !== index
      )
    );
  };

  /* =========================================
      ENTER TO SEND
  ========================================= */

  const handleKeyDown = (e) => {

    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {

      e.preventDefault();

      handleSendMessage();
    }
  };

  return (
    <div className="border-top border-gray-4 bg-white sticky-bottom">

      {/* REPLY PREVIEW */}

      {replyMessage && (
        <div className="px-3 pt-3">
          <ReplyPreview
            replyMessage={
              replyMessage
            }
            isEditorPreview={true}
            onClose={() =>
              setReplyMessage(null)
            }
          />
        </div>
      )}

      {/* ATTACHMENTS */}

      {attachments.length > 0 && (
        <div className="px-3 pt-3">
          <div className="d-flex flex-wrap gap-3">

            {attachments.map(
              (
                attachment,
                index
              ) => (
                <div
                  key={index}
                  className="position-relative border rounded-3 overflow-hidden"
                  style={{
                    width: 90,
                    height: 90,
                  }}
                >

                  {attachment.mime_type?.startsWith(
                    "image"
                  ) ? (
                    <img
                      src={
                        attachment.preview
                      }
                      alt="attachment"
                      className="w-100 h-100 object-fit-cover"
                    />
                  ) : (
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                      <FiPaperclip size={22} />
                    </div>
                  )}

                  <button
                    className="btn btn-danger btn-sm position-absolute top-0 end-0 rounded-circle p-1"
                    onClick={() =>
                      removeAttachment(
                        index
                      )
                    }
                  >
                    <FiX size={12} />
                  </button>
                </div>
              )
            )}

          </div>
        </div>
      )}

      {/* INPUT ROW */}

      <div className="d-flex align-items-center">

        {/* LEFT */}

        <div className="d-flex align-items-center">

          <Dropdown
            dropdownItems={
              callingOptions
            }
            triggerIcon={
              <FiPhoneCall size={16} />
            }
            dropdownMenuStyle="wd-250"
            dropdownParentStyle="border-end border-gray-4"
            triggerClass="wd-60 ht-60 d-flex align-items-center justify-content-center"
            tooltipTitle="Calling Options"
            isAvatar={false}
          />

          <button
            className="btn border-0 border-end border-gray-4 rounded-0 wd-60 ht-60"
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            <FiLink size={18} />
          </button>

          <button
            className="btn border-0 border-end border-gray-4 rounded-0 wd-60 ht-60"
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            <FiImage size={18} />
          </button>

          <input
            type="file"
            multiple
            hidden
            ref={fileInputRef}
            onChange={
              handleAttachment
            }
          />
        </div>

        {/* TEXTAREA */}

        <div className="flex-grow-1 position-relative">

          <textarea
            rows={1}
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            onKeyDown={
              handleKeyDown
            }
            placeholder={`Message ${
              selectedChat?.chat_name ||
              ""
            }`}
            className="form-control border-0 shadow-none resize-none px-4 py-3"
            style={{
              minHeight: 60,
              maxHeight: 140,
            }}
          />

          {/* EMOJI */}

          <button
            className="btn border-0 position-absolute"
            style={{
              right: 12,
              top: "50%",
              transform:
                "translateY(-50%)",
            }}
            onClick={() =>
              setShowEmojiPicker(
                !showEmojiPicker
              )
            }
          >
            <FiSmile size={18} />
          </button>

          {showEmojiPicker && (
            <div
              className="position-absolute"
              style={{
                bottom: "70px",
                right: "10px",
                zIndex: 999,
              }}
            >
              <EmojiPicker
                onEmojiClick={(
                  emojiData
                ) =>
                  setMessage(
                    (prev) =>
                      prev +
                      emojiData.emoji
                  )
                }
              />
            </div>
          )}
        </div>

        {/* SEND */}

        <div className="border-start border-gray-4">

          <button
            className="btn border-0 wd-60 ht-60"
            onClick={
              handleSendMessage
            }
            disabled={
              !message.trim() &&
              attachments.length === 0
            }
          >
            <FiSend
              size={18}
              strokeWidth={2}
            />
          </button>

        </div>
      </div>
    </div>
  );
};

export default MessageEditor;