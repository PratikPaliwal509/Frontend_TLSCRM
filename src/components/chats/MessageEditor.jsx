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
  FiCheckSquare,
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
  socketRef,
  editingMessage,
  setEditingMessage,
  onOpenTaskModal
}) => {

  const [message, setMessage] =
    useState("");

  const [showEmojiPicker, setShowEmojiPicker] =
    useState(false);

  const [attachments, setAttachments] =
    useState([]);

  const [uploading, setUploading] =
    useState(false);

  const fileInputRef =
    useRef(null);

  const typingTimeoutRef =
    useRef(null);
  //
  useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage.text || editingMessage.message_text || "");
    }
  }, [editingMessage]);
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
      clearTimeout(typingTimeoutRef.current);
    };

  }, [message, selectedChat]);

  /* =========================================
      SEND MESSAGE
  ========================================= */

  const handleSendMessage = async () => {

    if (!message.trim() && attachments.length === 0) return;

    if (!selectedChat) return;

    /* =========================
        EDIT MESSAGE
    ========================= */

    if (editingMessage) {

      try {

        const res = await fetch(
          `https://api-0ggv.onrender.com/api/chat-messages/${editingMessage.message_id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              message_text: message,
            }),
          }
        );

        const data = await res.json();

        if (data.success) {

          socketRef.current?.emit(
            "chat:edit-message",
            data.data
          );

          setEditingMessage(null);
          setMessage("");

        }

      } catch (err) {

        console.log(err);

      }

      return;
    }

    /* =========================
        NORMAL SEND
    ========================= */

    socketRef?.current?.emit("chat:stop-typing", {
      chat_id: selectedChat.chat_id,
      user_id: currentUserId,
    });

    onSendMessage?.({
      chat_id: selectedChat.chat_id,
      message: message.trim(),
      reply_to_message_id: replyMessage?.message_id || null,
      attachments: attachments,
    });

    setMessage("");
    setAttachments([]);
    setReplyMessage?.(null);
    setShowEmojiPicker(false);
  };

  /* =========================================
      HANDLE FILES
  ========================================= */

  const handleAttachment = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    // ✅ RESET INPUT — so same file can be picked again next time
    e.target.value = "";

    setUploading(true);

    try {
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "task_attachments");
          formData.append("folder", "timelog_attachments");

          const res = await fetch(
            "https://api.cloudinary.com/v1_1/dwghrvasx/auto/upload",
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await res.json();
          return {
            file_url: data.secure_url,
            file_name: file.name,
            file_size: data.bytes,
            file_type: file.type,
            preview: data.secure_url,
          };
        })
      );

      setAttachments((prev) => [...prev, ...uploadedFiles]);
    } catch (err) {
      console.log("Upload error:", err);
    } finally {
      setUploading(false);
    }
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
      ENTER TO SEND
  ========================================= */

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
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
            replyMessage={replyMessage}
            isEditorPreview={true}
            onClose={() => setReplyMessage(null)}
          />
        </div>
      )}

      {/* ATTACHMENTS PREVIEW */}

      {attachments.length > 0 && (
        <div className="px-3 pt-3">
          <div className="d-flex flex-wrap gap-3">
            {attachments.map((attachment, index) => (
              <div
                key={index}
                className="position-relative border rounded-3 overflow-hidden"
                style={{ width: 90, height: 90 }}
              >
                {attachment.file_type?.startsWith("image") ? (
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
                  onClick={() => removeAttachment(index)}
                >
                  <FiX size={12} />
                </button>
              </div>
            ))}

            {/* UPLOADING SPINNER */}
            {uploading && (
              <div
                className="border rounded-3 d-flex align-items-center justify-content-center bg-light"
                style={{ width: 90, height: 90 }}
              >
                <div className="spinner-border spinner-border-sm text-secondary" role="status" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* INPUT ROW */}

      <div className="d-flex align-items-center">

        {/* LEFT */}

        <div className="d-flex align-items-center">

          {/* <Dropdown
            dropdownItems={callingOptions}
            triggerIcon={<FiPhoneCall size={16} />}
            dropdownMenuStyle="wd-250"
            dropdownParentStyle="border-end border-gray-4"
            triggerClass="wd-60 ht-60 d-flex align-items-center justify-content-center"
            tooltipTitle="Calling Options"
            isAvatar={false}
          /> */}

          <button
            className="btn border-0 border-end border-gray-4 rounded-0 wd-60 ht-60"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <FiLink size={18} />
          </button>

          <button
            className="btn border-0 border-end border-gray-4 rounded-0 wd-60 ht-60"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <FiImage size={18} />
          </button>
          <button
            className="btn border-0 border-end border-gray-4 rounded-0 wd-60 ht-60"
            onClick={onOpenTaskModal}
            title="Create Task"
          >
            <FiCheckSquare size={18} />
          </button>
          {/* ✅ key={attachments.length} forces remount when attachments change
              which also resets the input — belt-and-suspenders with e.target.value="" */}
          <input
            key={attachments.length}
            type="file"
            multiple
            hidden
            ref={fileInputRef}
            onChange={handleAttachment}
          />
        </div>

        {/* TEXTAREA */}

        <div className="flex-grow-1 position-relative">

          <textarea
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message ${selectedChat?.chat_name || ""}`}
            className="form-control border-0 shadow-none resize-none px-4 py-3"
            style={{ minHeight: 60, maxHeight: 140 }}
          />

          {/* EMOJI */}

          <button
            className="btn border-0 position-absolute"
            style={{ right: 12, top: "50%", transform: "translateY(-50%)" }}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <FiSmile size={18} />
          </button>

          {showEmojiPicker && (
            <div
              className="position-absolute"
              style={{ bottom: "70px", right: "10px", zIndex: 999 }}
            >
              <EmojiPicker
                onEmojiClick={(emojiData) =>
                  setMessage((prev) => prev + emojiData.emoji)
                }
              />
            </div>
          )}
        </div>

        {/* SEND */}

        <div className="border-start border-gray-4">
          <button
            className="btn border-0 wd-60 ht-60"
            onClick={handleSendMessage}
            disabled={
              uploading ||
              (!message.trim() && attachments.length === 0)
            }
          >
            <FiSend size={18} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageEditor;
