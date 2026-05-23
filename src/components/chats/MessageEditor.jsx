import React, { useRef, useState } from "react";

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
  onMessageSent,
  currentUserId,
}) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [sending, setSending] = useState(false);

  const fileInputRef = useRef(null);

  /* =========================================
      SEND MESSAGE API
  ========================================= */

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) {
      return;
    }

    try {
      setSending(true);

      // ======================================
      // SEND TEXT MESSAGE
      // ROUTE:
      // POST /api/chat-messages
      // ======================================

      const payload = {
        chat_id: selectedChat?.chat_id,
        sender_id: currentUserId,
        message_type: attachments.length > 0 ? "file" : "text",
        message_text: message,
        reply_to_message_id:
          replyMessage?.message_id || null,
      };

      const response = await fetch(
        "http://localhost:5000/api/chat-messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      // ======================================
      // OPTIONAL:
      // UPLOAD ATTACHMENTS
      // ROUTE:
      // POST /api/chat-attachments
      // ======================================

      if (
        data?.success &&
        attachments.length > 0
      ) {
        for (const attachment of attachments) {
          const formData = new FormData();

          formData.append(
            "message_id",
            data?.data?.message_id
          );

          formData.append(
            "file",
            attachment.file
          );

          await fetch(
            "http://localhost:5000/api/chat-attachments",
            {
              method: "POST",
              body: formData,
            }
          );
        }
      }

      // ======================================
      // RESET
      // ======================================

      setMessage("");
      setAttachments([]);
      setReplyMessage?.(null);
      setShowEmojiPicker(false);

      // ======================================
      // REFRESH CHAT MESSAGES
      // ======================================

      onMessageSent?.();
    } catch (error) {
      console.log("Send Message Error:", error);
    } finally {
      setSending(false);
    }
  };

  /* =========================================
      HANDLE FILES
  ========================================= */

  const handleAttachment = (e) => {
    const files = Array.from(
      e.target.files || []
    );

    const mappedFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      file_name: file.name,
      file_size: `${(
        file.size /
        1024 /
        1024
      ).toFixed(2)} MB`,
      mime_type: file.type,
    }));

    setAttachments((prev) => [
      ...prev,
      ...mappedFiles,
    ]);
  };

  /* =========================================
      REMOVE ATTACHMENT
  ========================================= */

  const removeAttachment = (index) => {
    setAttachments((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  /* =========================================
      ENTER SEND
  ========================================= */

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="border-top border-gray-4 bg-white sticky-bottom">
      {/* =====================================
            REPLY PREVIEW
      ===================================== */}

      {replyMessage && (
        <div className="px-3 pt-3">
          <ReplyPreview
            replyMessage={replyMessage}
            isEditorPreview={true}
            onClose={() =>
              setReplyMessage(null)
            }
          />
        </div>
      )}

      {/* =====================================
            ATTACHMENTS
      ===================================== */}

      {attachments.length > 0 && (
        <div className="px-3 pt-3">
          <div className="d-flex flex-wrap gap-3">
            {attachments.map(
              (attachment, index) => (
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
                      src={attachment.preview}
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
                      removeAttachment(index)
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

      {/* =====================================
            MESSAGE INPUT
      ===================================== */}

      <div className="d-flex align-items-center">
        {/* LEFT ACTIONS */}
        <div className="d-flex align-items-center">
          <Dropdown
            dropdownItems={callingOptions}
            triggerIcon={
              <FiPhoneCall size={16} />
            }
            dropdownMenuStyle="wd-250"
            dropdownParentStyle="border-end border-gray-4"
            triggerClass="wd-60 ht-60 d-flex align-items-center justify-content-center"
            tooltipTitle="Calling Options"
            isAvatar={false}
          />

          {/* FILE */}
          <button
            className="btn border-0 border-end border-gray-4 rounded-0 wd-60 ht-60"
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            <FiLink size={18} />
          </button>

          {/* IMAGE */}
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
            onChange={handleAttachment}
          />
        </div>

        {/* MESSAGE INPUT */}
        <div className="flex-grow-1 position-relative">
          <textarea
            rows={1}
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder={`Message ${
              selectedChat?.chat_name || ""
            }`}
            className="form-control border-0 shadow-none resize-none px-4 py-3"
            style={{
              minHeight: 60,
              maxHeight: 140,
            }}
          />

          {/* EMOJI BUTTON */}
          <button
            className="btn border-0 position-absolute"
            style={{
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
            }}
            onClick={() =>
              setShowEmojiPicker(
                !showEmojiPicker
              )
            }
          >
            <FiSmile size={18} />
          </button>

          {/* EMOJI PICKER */}
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
                onEmojiClick={(emojiData) =>
                  setMessage(
                    (prev) =>
                      prev + emojiData.emoji
                  )
                }
              />
            </div>
          )}
        </div>

        {/* SEND BUTTON */}
        <div className="border-start border-gray-4">
          <button
            className="btn border-0 wd-60 ht-60"
            onClick={handleSendMessage}
            disabled={sending}
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