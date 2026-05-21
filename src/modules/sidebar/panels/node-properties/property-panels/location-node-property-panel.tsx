import type { LocationNodeData } from "~/modules/nodes/nodes/location-node/types";
import type { BuilderNodeType } from "~/modules/nodes/types";

type LocationNodePropertyPanelProps = Readonly<{
    id: string;
    type: BuilderNodeType;
    data: LocationNodeData;
    updateData: (data: Partial<LocationNodeData>) => void;
}>;

export default function LocationNodePropertyPanel({ id, data, updateData }: LocationNodePropertyPanelProps) {
    return (
        <div className="flex flex-col gap-4.5 p-4">
            {/* Unique Identifier */}
            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    Unique Identifier
                </div>
                <div className="mt-2 flex">
                    <input
                        type="text"
                        value={id}
                        readOnly
                        className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition hover:(bg-dark-300/60) read-only:(text-light-900/80 op-80 hover:bg-dark-300/30)"
                    />
                </div>
            </div>

            {/* Location Coordinates */}
            <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                    <div className="text-xs text-light-900/60 font-semibold">
                        Latitude
                    </div>
                    <div className="mt-2 flex">
                        <input
                            type="text"
                            value={data.latitude || ""}
                            onChange={e => updateData({ latitude: e.target.value })}
                            placeholder="37.48429"
                            className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition focus:(border-sky-800 bg-dark-500 ring-2 ring-sky-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic)"
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="text-xs text-light-900/60 font-semibold">
                        Longitude
                    </div>
                    <div className="mt-2 flex">
                        <input
                            type="text"
                            value={data.longitude || ""}
                            onChange={e => updateData({ longitude: e.target.value })}
                            placeholder="-122.1487"
                            className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition focus:(border-sky-800 bg-dark-500 ring-2 ring-sky-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic)"
                        />
                    </div>
                </div>
            </div>
            <div className="text-[10px] text-light-900/40">
                Coordinates must be valid decimals for location pinpointing.
            </div>

            {/* Location Name */}
            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    Location Name
                </div>
                <div className="mt-2 flex">
                    <input
                        type="text"
                        value={data.name || ""}
                        onChange={e => updateData({ name: e.target.value })}
                        placeholder="Meta HQ"
                        className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition focus:(border-sky-800 bg-dark-500 ring-2 ring-sky-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic)"
                    />
                </div>
                <div className="mt-1 text-[10px] text-light-900/40">
                    The name of the location as shown in the WhatsApp location card header.
                </div>
            </div>

            {/* Address */}
            <div className="flex flex-col">
                <div className="text-xs text-light-900/60 font-semibold">
                    Address
                </div>
                <div className="mt-2 flex">
                    <textarea
                        value={data.address || ""}
                        onChange={e => updateData({ address: e.target.value })}
                        placeholder="1 Hacker Way, Menlo Park, CA 94025"
                        className="min-h-20 w-full resize-none border border-dark-200 rounded-md bg-dark-400 px-2.5 py-2 text-sm font-medium shadow-sm outline-none transition focus:(border-sky-800 bg-dark-500 ring-2 ring-sky-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic)"
                    />
                </div>
                <div className="mt-1 text-[10px] text-light-900/40">
                    Full postal/street address for reference on map cards.
                </div>
            </div>
        </div>
    );
}
