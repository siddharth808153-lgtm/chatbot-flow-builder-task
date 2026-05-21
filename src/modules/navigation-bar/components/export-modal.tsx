import { type Edge, type Node } from "@xyflow/react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

import { BuilderNode } from "~/modules/nodes/types";
import { defaultOverlayScrollbarsOptions } from "~/utils/overlayscrollbars";
import { cn } from "~@/utils/cn";

type ExportModalProps = Readonly<{
    isOpen: boolean;
    onClose: () => void;
    nodes: Node[];
    edges: Edge[];
}>;

export function ExportModal({ isOpen, onClose, nodes, edges }: ExportModalProps) {
    const [activeTab, setActiveTab] = useState<"flow" | "payloads">("flow");
    const [selectedNodeIdForPayload, setSelectedNodeIdForPayload] = useState<string>("");
    const [isCopied, setIsCopied] = useState(false);

    // Compile entire chatbot flow to WhatsApp compatible format
    const compiledFlow = useMemo(() => {
        const startNode = nodes.find(n => n.type === BuilderNode.START);
        
        const trigger = {
            event: "message_received",
            type: (startNode?.data as any)?.triggerType || "exact",
            keywords: startNode && (startNode.data as any)?.triggerKeywords
                ? ((startNode.data as any).triggerKeywords as string)
                      .split(",")
                      .map(k => k.trim())
                      .filter(Boolean)
                : [],
        };

        const getNextNodeId = (sourceId: string, sourceHandleId?: string | null) => {
            const edge = edges.find(
                e => e.source === sourceId && (!sourceHandleId || e.sourceHandle === sourceHandleId)
            );
            return edge ? edge.target : null;
        };

        const compiledNodes: Record<string, any> = {};

        // Loop over nodes to construct their WhatsApp payloads and routing steps
        nodes.forEach((node) => {
            if (node.type === BuilderNode.START || node.type === BuilderNode.END) {
                if (node.type === BuilderNode.END) {
                    compiledNodes[node.id] = {
                        type: "end_flow",
                    };
                }
                return;
            }

            if (node.type === BuilderNode.TEXT_MESSAGE) {
                compiledNodes[node.id] = {
                    type: "text_message",
                    channel: (node.data as any).channel || "sms",
                    whatsapp_payload: {
                        messaging_product: "whatsapp",
                        recipient_type: "individual",
                        to: "{{recipient_phone_number}}",
                        type: "text",
                        text: {
                            body: (node.data as any).message || "",
                        },
                    },
                    next_node_id: getNextNodeId(node.id),
                };
            } else if (node.type === BuilderNode.IMAGE) {
                compiledNodes[node.id] = {
                    type: "image_message",
                    whatsapp_payload: {
                        messaging_product: "whatsapp",
                        recipient_type: "individual",
                        to: "{{recipient_phone_number}}",
                        type: "image",
                        image: {
                            link: (node.data as any).imageUrl || "",
                            caption: (node.data as any).caption || "",
                        },
                    },
                    next_node_id: getNextNodeId(node.id),
                };
            } else if (node.type === BuilderNode.VIDEO) {
                compiledNodes[node.id] = {
                    type: "video_message",
                    whatsapp_payload: {
                        messaging_product: "whatsapp",
                        recipient_type: "individual",
                        to: "{{recipient_phone_number}}",
                        type: "video",
                        video: {
                            link: (node.data as any).videoUrl || "",
                            caption: (node.data as any).caption || "",
                            autoplay: !!(node.data as any).autoplay,
                        },
                    },
                    next_node_id: getNextNodeId(node.id),
                };
            } else if (node.type === BuilderNode.CONDITIONAL_PATH) {
                compiledNodes[node.id] = {
                    type: "conditional_path",
                    condition_attribute: (node.data as any).condition?.condition || "unknown",
                    paths: (((node.data as any).paths as any[]) || []).map(p => ({
                        case: p.case?.value || "",
                        next_node_id: getNextNodeId(node.id, p.id),
                    })),
                };
            }
        });

        const firstEdge = edges.find(e => e.source === startNode?.id);
        const startNodeId = firstEdge ? firstEdge.target : null;

        return {
            flowName: "WhatsApp Chatbot Flow",
            version: "1.0",
            trigger,
            startNodeId,
            nodes: compiledNodes,
        };
    }, [nodes, edges]);

    // List of message nodes that have WhatsApp API payloads
    const messageNodes = useMemo(() => {
        return nodes.filter(
            n =>
                n.type === BuilderNode.TEXT_MESSAGE ||
                n.type === BuilderNode.IMAGE ||
                n.type === BuilderNode.VIDEO
        );
    }, [nodes]);

    // Select the first message node payload by default if none is selected
    useMemo(() => {
        if (messageNodes.length > 0 && !selectedNodeIdForPayload) {
            setSelectedNodeIdForPayload(messageNodes[0].id);
        }
    }, [messageNodes, selectedNodeIdForPayload]);

    const activeNodePayload = useMemo(() => {
        if (!selectedNodeIdForPayload) return null;
        const node = nodes.find(n => n.id === selectedNodeIdForPayload);
        if (!node) return null;

        let payload = {};
        let endpoint = "POST https://graph.facebook.com/v20.0/FROM_PHONE_NUMBER_ID/messages";

        if (node.type === BuilderNode.TEXT_MESSAGE) {
            payload = {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: "{{recipient_phone_number}}",
                type: "text",
                text: {
                    body: (node.data as any).message || "",
                },
            };
        } else if (node.type === BuilderNode.IMAGE) {
            payload = {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: "{{recipient_phone_number}}",
                type: "image",
                image: {
                    link: (node.data as any).imageUrl || "",
                    caption: (node.data as any).caption || "",
                },
            };
        } else if (node.type === BuilderNode.VIDEO) {
            payload = {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: "{{recipient_phone_number}}",
                type: "video",
                video: {
                    link: (node.data as any).videoUrl || "",
                    caption: (node.data as any).caption || "",
                },
            };
        }

        return {
            endpoint,
            headers: {
                Authorization: "Bearer EAAXX...",
                "Content-Type": "application/json",
            },
            payload,
        };
    }, [selectedNodeIdForPayload, nodes]);

    // Code string to display
    const codeString = useMemo(() => {
        if (activeTab === "flow") {
            return JSON.stringify(compiledFlow, null, 2);
        } else {
            return activeNodePayload ? JSON.stringify(activeNodePayload, null, 2) : "// No payload available";
        }
    }, [activeTab, compiledFlow, activeNodePayload]);

    // Copy to clipboard helper
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(codeString).then(() => {
            setIsCopied(true);
            toast.success("Copied to clipboard!");
            setTimeout(() => setIsCopied(false), 2000);
        });
    }, [codeString]);

    // Download file helper
    const handleDownload = useCallback(() => {
        const fileName = activeTab === "flow" ? "whatsapp-chatbot-flow.json" : `whatsapp-node-payload-${selectedNodeIdForPayload}.json`;
        const blob = new Blob([codeString], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        URL.revokeObjectURL(url);
        toast.success(`Downloaded ${fileName} successfully!`);
    }, [codeString, activeTab, selectedNodeIdForPayload]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-dark-900/70 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Dialog */}
            <div className="relative w-full max-w-4xl h-[85vh] flex flex-col border border-dark-100 rounded-2xl bg-dark-300 shadow-2xl overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-dark-100 bg-dark-400 px-6 py-4">
                    <div className="flex items-center gap-2.5">
                        <div className="size-8 flex items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <div className="i-mynaui:check-double size-5 animate-pulse" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-light-50">
                                Flow Successfully Compiled!
                            </h3>
                            <p className="text-xs text-light-900/50">
                                WhatsApp Flow configuration and message payloads generated.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="size-8 flex items-center justify-center border border-transparent rounded-lg text-light-900/60 hover:(bg-dark-100 text-light-50) active:(bg-dark-400) transition outline-none cursor-pointer"
                        onClick={onClose}
                    >
                        <div className="i-mynaui:x size-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center justify-between bg-dark-400/50 px-6 py-2 border-b border-dark-100 shrink-0">
                    <div className="flex gap-1 bg-dark-500 rounded-lg p-0.5 border border-dark-100">
                        <button
                            type="button"
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition outline-none cursor-pointer",
                                activeTab === "flow"
                                    ? "bg-teal-600 text-white shadow-sm"
                                    : "text-light-900/60 hover:text-light-50"
                            )}
                            onClick={() => setActiveTab("flow")}
                        >
                            <div className="i-mynaui:git-branch size-4" />
                            WhatsApp Flow Schema
                        </button>
                        <button
                            type="button"
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition outline-none cursor-pointer",
                                activeTab === "payloads"
                                    ? "bg-teal-600 text-white shadow-sm"
                                    : "text-light-900/60 hover:text-light-50"
                            )}
                            onClick={() => setActiveTab("payloads")}
                        >
                            <div className="i-mynaui:chat size-4" />
                            WhatsApp API Message Payloads
                        </button>
                    </div>

                    {/* Node Selector (only for Message Payloads tab) */}
                    {activeTab === "payloads" && messageNodes.length > 0 && (
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-light-900/50 font-medium">Select Node:</span>
                            <select
                                value={selectedNodeIdForPayload}
                                onChange={e => setSelectedNodeIdForPayload(e.target.value)}
                                className="h-7 border border-dark-200 rounded-md bg-dark-400 px-2 text-xs font-medium text-light-50 shadow-sm outline-none transition hover:bg-dark-300 cursor-pointer"
                            >
                                {messageNodes.map(node => (
                                    <option key={node.id} value={node.id}>
                                        {((node.data as any).label as string) || `${(node.type || "NODE").toUpperCase()} (#${node.id})`}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Body Content (Simulated Code Editor) */}
                <div className="grow relative flex flex-col bg-dark-500 overflow-hidden">
                    {/* Action Bar */}
                    <div className="absolute right-4 top-4 z-10 flex gap-2">
                        <button
                            type="button"
                            className="h-8 flex items-center gap-1.5 border border-dark-100 rounded-md bg-dark-300/90 px-3 text-xs font-semibold text-light-50 shadow-sm backdrop-blur-sm outline-none transition active:bg-dark-400 hover:bg-dark-200 cursor-pointer"
                            onClick={handleCopy}
                        >
                            {isCopied ? (
                                <div className="i-mynaui:check size-4 text-green-400" />
                            ) : (
                                <div className="i-mynaui:copy size-4" />
                            )}
                            {isCopied ? "Copied!" : "Copy"}
                        </button>
                        <button
                            type="button"
                            className="h-8 flex items-center gap-1.5 border border-dark-100 rounded-md bg-dark-300/90 px-3 text-xs font-semibold text-light-50 shadow-sm backdrop-blur-sm outline-none transition active:bg-dark-400 hover:bg-dark-200 cursor-pointer"
                            onClick={handleDownload}
                        >
                            <div className="i-mynaui:download size-4" />
                            Download
                        </button>
                    </div>

                    {/* Simulated Code Panel */}
                    <OverlayScrollbarsComponent 
                        className="grow font-mono text-xs p-6"
                        defer
                        options={defaultOverlayScrollbarsOptions}
                    >
                        <div className="flex gap-4 min-w-full">
                            {/* Line Numbers */}
                            <div className="text-light-900/20 select-none text-right pr-2 border-r border-dark-100/10">
                                {codeString.split("\n").map((_, i) => (
                                    <div key={i}>{i + 1}</div>
                                ))}
                            </div>

                            {/* Actual code display with elegant formatting */}
                            <pre className="text-emerald-400 leading-relaxed overflow-x-auto whitespace-pre">
                                {codeString}
                            </pre>
                        </div>
                    </OverlayScrollbarsComponent>
                </div>

                {/* Footer Info */}
                <div className="flex items-center justify-between border-t border-dark-100 bg-dark-400 px-6 py-3.5 text-xs text-light-900/50">
                    <div className="flex items-center gap-1.5">
                        <div className="i-mynaui:brand-whatsapp size-4.5 text-green-500" />
                        <span>Ready for WhatsApp Business API webhook handlers and message pipelines.</span>
                    </div>
                    <span>Compiled 100% Client-Side</span>
                </div>
            </div>
        </div>
    );
}
