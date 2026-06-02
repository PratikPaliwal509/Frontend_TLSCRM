import React from "react";

const ChatMessageSkeleton = () => {
    console.log("Rendering ChatMessageSkeleton");
    return (
        <>
            {[...Array(8)].map((_, index) => {
                const isMine = index % 2 === 0;

                return (
                    <div
                        key={index}
                        className={`single-chat-item mb-3 ${
                            isMine ? "text-end" : ""
                        }`}
                    >
                        {/* Header */}
                        <div
                            className={`d-flex align-items-center gap-3 mb-2 ${
                                isMine ? "justify-content-end" : ""
                            }`}
                        >
                            {!isMine && (
                                <div
                                    className="placeholder-glow"
                                    style={{
                                        width: 40,
                                        height: 40,
                                    }}
                                >
                                    <span
                                        className="placeholder rounded-circle d-block"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    />
                                </div>
                            )}

                            <div className="placeholder-glow">
                                <span
                                    className="placeholder rounded"
                                    style={{
                                        width: 100,
                                        height: 12,
                                        display: "block",
                                    }}
                                />
                            </div>
                              {isMine && (
                                <div
                                    className="placeholder-glow"
                                    style={{
                                        width: 40,
                                        height: 40,
                                    }}
                                >
                                    <span
                                        className="placeholder rounded-circle d-block"
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                        }}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Message Bubble */}
                        <div
                            className={`rounded-4 p-3 ${
                                isMine ? "ms-auto" : ""
                            }`}
                            style={{
                                width: isMine ? 280 : 340,
                                background: "#f1f3f5",
                            }}
                        >
                            <div className="placeholder-glow">
                                <span
                                    className="placeholder rounded d-block mb-2"
                                    style={{ height: 12 }}
                                />
                                <span
                                    className="placeholder rounded d-block mb-2"
                                    style={{
                                        height: 12,
                                        width: "85%",
                                    }}
                                />
                                <span
                                    className="placeholder rounded d-block"
                                    style={{
                                        height: 12,
                                        width: "60%",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default ChatMessageSkeleton;