import { useMemo, useRef } from "react";

import type { VideoNodeData } from "~/modules/nodes/nodes/video-node/types";
import type { BuilderNodeType } from "~/modules/nodes/types";

import { cn } from "~@/utils/cn";

type VideoNodePropertyPanelProps = Readonly<{
    id: string;
    type: BuilderNodeType;
    data: VideoNodeData;
    updateData: (data: Partial<VideoNodeData>) => void;
}>;

export default function VideoNodePropertyPanel({ id, data, updateData }: VideoNodePropertyPanelProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const hasVideo = useMemo(() => {
        return data.videoUrl && data.videoUrl.length > 0;
    }, [data.videoUrl]);

    const onVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            updateData({ videoUrl: dataUrl });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="flex flex-col gap-4.5 p-4">
            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    Unique Identifier
                </div>

                <div className="mt-2 flex">
                    <input type="text" value={id} readOnly className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition hover:(bg-dark-300/60) read-only:(text-light-900/80 op-80 hover:bg-dark-300/30)" />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    Video
                </div>

                <div className="mt-2 flex flex-col gap-2">
                    {hasVideo ? (
                        <div className="relative overflow-clip rounded-md border border-dark-200">
                            <video
                                src={data.videoUrl}
                                className="w-full max-h-48 object-cover"
                                controls
                                muted
                                playsInline
                                preload="metadata"
                            />
                            <div className="flex gap-1 bg-dark-400/50 p-2">
                                <button
                                    type="button"
                                    className="h-7 flex items-center gap-1.5 border border-dark-100 rounded-md bg-dark-300/90 px-2.5 text-xs font-medium shadow-sm backdrop-blur-sm outline-none transition active:(bg-dark-400) hover:(bg-dark-200)"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="i-mynaui:edit size-3.5" />
                                    Replace
                                </button>
                                <button
                                    type="button"
                                    className="h-7 flex items-center gap-1.5 border border-dark-100 rounded-md bg-dark-300/90 px-2.5 text-xs font-medium text-red-400 shadow-sm backdrop-blur-sm outline-none transition active:(bg-dark-400) hover:(bg-dark-200)"
                                    onClick={() => updateData({ videoUrl: "" })}
                                >
                                    <div className="i-mynaui:trash size-3.5" />
                                    Remove
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            type="button"
                            className={cn(
                                "w-full flex flex-col items-center justify-center border border-dashed border-dark-100 rounded-md bg-dark-400/30 p-8 transition cursor-pointer",
                                "hover:(border-rose-600/50 bg-dark-400/50)",
                            )}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <div className="i-mynaui:video size-10 text-light-900/20" />
                            <span className="mt-3 text-xs text-light-900/50">
                                Click to upload a video
                            </span>
                            <span className="mt-1 text-[10px] text-light-900/30">
                                MP4, WebM, OGG
                            </span>
                        </button>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={onVideoUpload}
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    Video URL
                </div>

                <div className="mt-2 flex">
                    <input
                        type="text"
                        value={data.videoUrl}
                        onChange={e => updateData({ videoUrl: e.target.value })}
                        placeholder="https://example.com/video.mp4"
                        className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition focus:(border-rose-800 bg-dark-500 ring-2 ring-rose-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic)"
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    Caption
                </div>

                <div className="mt-2 flex">
                    <textarea
                        value={data.caption}
                        onChange={e => updateData({ caption: e.target.value })}
                        placeholder="Optional caption for the video..."
                        className="min-h-20 w-full resize-none border border-dark-200 rounded-md bg-dark-400 px-2.5 py-2 text-sm font-medium shadow-sm outline-none transition focus:(border-rose-800 bg-dark-500 ring-2 ring-rose-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic) read-only:(text-light-900/80)"
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    Autoplay
                </div>

                <div className="mt-2 flex">
                    <button
                        type="button"
                        className={cn(
                            "h-8 w-full flex items-center justify-between border rounded-md px-2.5 text-sm font-medium shadow-sm outline-none transition",
                            data.autoplay
                                ? "border-rose-700/50 bg-rose-900/20 hover:(bg-rose-900/30)"
                                : "border-dark-200 bg-dark-400 hover:(bg-dark-300/60)",
                        )}
                        onClick={() => updateData({ autoplay: !data.autoplay })}
                    >
                        <span className="text-light-900/80">
                            {data.autoplay ? "Enabled" : "Disabled"}
                        </span>

                        <div
                            className={cn(
                                "h-5 w-9 flex items-center rounded-full p-0.5 transition-colors",
                                data.autoplay ? "bg-rose-600" : "bg-dark-100",
                            )}
                        >
                            <div
                                className={cn(
                                    "size-4 rounded-full bg-white shadow-sm transition-transform",
                                    data.autoplay ? "translate-x-4" : "translate-x-0",
                                )}
                            />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
}
