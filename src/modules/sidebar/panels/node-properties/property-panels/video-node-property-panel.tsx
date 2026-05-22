import { useMemo, useRef } from "react";
import { toast } from "sonner";

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

        // Meta guideline: video size limit is 16MB
        if (file.size > 16 * 1024 * 1024) {
            toast.error("Video file size exceeds the Meta guideline limit of 16 MB.");
            return;
        }

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
                    {hasVideo
                        ? (
                                <div className="relative overflow-clip border border-dark-200 rounded-md">
                                    <video
                                        src={data.videoUrl}
                                        className="max-h-48 w-full object-cover"
                                        controls
                                        muted
                                        playsInline
                                        preload="metadata"
                                    />
                                    <div className="flex gap-1 bg-dark-400/50 p-2">
                                        <button
                                            type="button"
                                            className="h-7 flex items-center gap-1.5 border border-dark-100 rounded-md bg-dark-300/90 px-2.5 text-xs font-medium shadow-sm outline-none backdrop-blur-sm transition active:(bg-dark-400) hover:(bg-dark-200)"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <div className="i-mynaui:edit size-3.5" />
                                            Replace
                                        </button>
                                        <button
                                            type="button"
                                            className="h-7 flex items-center gap-1.5 border border-dark-100 rounded-md bg-dark-300/90 px-2.5 text-xs text-red-400 font-medium shadow-sm outline-none backdrop-blur-sm transition active:(bg-dark-400) hover:(bg-dark-200)"
                                            onClick={() => updateData({ videoUrl: "" })}
                                        >
                                            <div className="i-mynaui:trash size-3.5" />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )
                        : (
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
                <div className="flex items-center justify-between">
                    <div className="text-xs text-light-900/60 font-semibold">
                        Caption
                    </div>
                    <span className="text-[10px] text-light-900/40">
                        {(data.caption || "").length} / 1024
                    </span>
                </div>

                <div className="mt-2 flex">
                    <textarea
                        value={data.caption}
                        maxLength={1024}
                        onChange={e => updateData({ caption: e.target.value })}
                        placeholder="Optional caption for the video..."
                        className="min-h-20 w-full resize-none border border-dark-200 rounded-md bg-dark-400 px-2.5 py-2 text-sm font-medium shadow-sm outline-none transition focus:(border-rose-800 bg-dark-500 ring-2 ring-rose-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic) read-only:(text-light-900/80)"
                    />
                </div>
            </div>
        </div>
    );
}
