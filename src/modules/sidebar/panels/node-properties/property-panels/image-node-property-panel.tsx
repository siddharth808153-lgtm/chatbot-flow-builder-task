import { useMemo, useRef } from "react";
import { toast } from "sonner";

import type { ImageNodeData } from "~/modules/nodes/nodes/image-node/types";
import type { BuilderNodeType } from "~/modules/nodes/types";

import { cn } from "~@/utils/cn";

type ImageNodePropertyPanelProps = Readonly<{
    id: string;
    type: BuilderNodeType;
    data: ImageNodeData;
    updateData: (data: Partial<ImageNodeData>) => void;
}>;

export default function ImageNodePropertyPanel({ id, data, updateData }: ImageNodePropertyPanelProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const hasImage = useMemo(() => {
        return data.imageUrl && data.imageUrl.length > 0;
    }, [data.imageUrl]);

    const onImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Meta guideline: image size limit is 5MB
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image file size exceeds the Meta guideline limit of 5 MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            updateData({ imageUrl: dataUrl });
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
                    Image
                </div>

                <div className="mt-2 flex flex-col gap-2">
                    {hasImage
                        ? (
                                <div className="relative overflow-clip border border-dark-200 rounded-md">
                                    <img
                                        src={data.imageUrl}
                                        alt="Uploaded image"
                                        className="max-h-48 w-full object-cover"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 flex gap-1 from-dark-400/90 to-transparent bg-gradient-to-t p-2 pt-6">
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
                                            onClick={() => updateData({ imageUrl: "" })}
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
                                        "hover:(border-amber-600/50 bg-dark-400/50)",
                                    )}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="i-mynaui:image size-10 text-light-900/20" />
                                    <span className="mt-3 text-xs text-light-900/50">
                                        Click to upload an image
                                    </span>
                                    <span className="mt-1 text-[10px] text-light-900/30">
                                        PNG, JPG, GIF, SVG, WEBP
                                    </span>
                                </button>
                            )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onImageUpload}
                    />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    Image URL
                </div>

                <div className="mt-2 flex">
                    <input
                        type="text"
                        value={data.imageUrl}
                        onChange={e => updateData({ imageUrl: e.target.value })}
                        placeholder="https://example.com/image.png"
                        className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition focus:(border-amber-800 bg-dark-500 ring-2 ring-amber-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic)"
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
                        placeholder="Optional caption for the image..."
                        className="min-h-20 w-full resize-none border border-dark-200 rounded-md bg-dark-400 px-2.5 py-2 text-sm font-medium shadow-sm outline-none transition focus:(border-amber-800 bg-dark-500 ring-2 ring-amber-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic read-only:text-light-900/80)"
                    />
                </div>
            </div>
        </div>
    );
}
