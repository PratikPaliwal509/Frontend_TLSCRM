import React from "react";
import {
  FiDownload,
  FiFile,
  FiImage,
} from "react-icons/fi";

const AttachmentPreview = ({
  attachments = [],
}) => {
  if (!attachments.length) return null;

  return (
    <div className="d-flex flex-column gap-2 mt-2">
      {attachments.map((file) => (
        <div
          key={file.attachment_id}
          className="border rounded-3 p-2 bg-white"
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              {file.file_type?.includes("image") ? (
                <FiImage size={18} />
              ) : (
                <FiFile size={18} />
              )}

              <div>
                <div className="fw-semibold small">
                  {file.file_name}
                </div>

                <small className="text-muted">
                  {file.file_size || ""}
                </small>
              </div>
            </div>

            <a
              href={file.file_url}
              target="_blank"
              rel="noreferrer"
              className="btn btn-sm btn-light"
            >
              <FiDownload />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AttachmentPreview;