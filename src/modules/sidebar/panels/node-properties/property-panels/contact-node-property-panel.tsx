import type { ContactNodeData } from "~/modules/nodes/nodes/contact-node/types";
import type { BuilderNodeType } from "~/modules/nodes/types";

type ContactNodePropertyPanelProps = Readonly<{
    id: string;
    type: BuilderNodeType;
    data: ContactNodeData;
    updateData: (data: Partial<ContactNodeData>) => void;
}>;

export default function ContactNodePropertyPanel({ id, data, updateData }: ContactNodePropertyPanelProps) {
    const handlePhoneChange = (phoneVal: string) => {
        const cleaned = phoneVal.replace(/\D/g, "");
        // If waId is empty or is equal to the old cleaned phone, update it automatically
        const oldCleaned = (data.phone || "").replace(/\D/g, "");
        const shouldUpdateWaId = !data.waId || data.waId === oldCleaned;

        updateData({
            phone: phoneVal,
            waId: shouldUpdateWaId ? cleaned : data.waId,
        });
    };

    const handleFirstChange = (firstVal: string) => {
        const last = data.lastName || "";
        const formatted = `${firstVal} ${last}`.trim();
        const oldFormatted = `${data.firstName || ""} ${last}`.trim();
        const shouldUpdateFormatted = !data.formattedName || data.formattedName === oldFormatted;

        updateData({
            firstName: firstVal,
            formattedName: shouldUpdateFormatted ? formatted : data.formattedName,
        });
    };

    const handleLastChange = (lastVal: string) => {
        const first = data.firstName || "";
        const formatted = `${first} ${lastVal}`.trim();
        const oldFormatted = `${first} ${data.lastName || ""}`.trim();
        const shouldUpdateFormatted = !data.formattedName || data.formattedName === oldFormatted;

        updateData({
            lastName: lastVal,
            formattedName: shouldUpdateFormatted ? formatted : data.formattedName,
        });
    };

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

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-light-900/60 font-semibold">
                            First Name
                        </div>
                        <span className="text-[10px] text-light-900/40">
                            {(data.firstName || "").length} / 50
                        </span>
                    </div>
                    <div className="mt-2 flex">
                        <input
                            type="text"
                            value={data.firstName || ""}
                            maxLength={50}
                            onChange={e => handleFirstChange(e.target.value)}
                            placeholder="John"
                            className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition focus:(border-cyan-800 bg-dark-500 ring-2 ring-cyan-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic)"
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-light-900/60 font-semibold">
                            Last Name
                        </div>
                        <span className="text-[10px] text-light-900/40">
                            {(data.lastName || "").length} / 50
                        </span>
                    </div>
                    <div className="mt-2 flex">
                        <input
                            type="text"
                            value={data.lastName || ""}
                            maxLength={50}
                            onChange={e => handleLastChange(e.target.value)}
                            placeholder="Doe"
                            className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition focus:(border-cyan-800 bg-dark-500 ring-2 ring-cyan-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic)"
                        />
                    </div>
                </div>
            </div>

            {/* Formatted Name */}
            <div className="flex flex-col">
                <div className="flex items-center justify-between">
                    <div className="text-xs text-light-900/60 font-semibold">
                        Formatted Name (Display Name)
                    </div>
                    <span className="text-[10px] text-light-900/40">
                        {(data.formattedName || "").length} / 100
                    </span>
                </div>
                <div className="mt-2 flex">
                    <input
                        type="text"
                        value={data.formattedName || ""}
                        maxLength={100}
                        onChange={e => updateData({ formattedName: e.target.value })}
                        placeholder="John Doe"
                        className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition focus:(border-cyan-800 bg-dark-500 ring-2 ring-cyan-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic)"
                    />
                </div>
                <div className="mt-1 text-[10px] text-light-900/40">
                    The name that will be displayed in the WhatsApp chat contact card.
                </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col">
                <div className="flex items-center justify-between">
                    <div className="text-xs text-light-900/60 font-semibold">
                        Phone Number
                    </div>
                    <span className="text-[10px] text-light-900/40">
                        {(data.phone || "").length} / 30
                    </span>
                </div>
                <div className="mt-2 flex">
                    <input
                        type="text"
                        value={data.phone || ""}
                        maxLength={30}
                        onChange={e => handlePhoneChange(e.target.value)}
                        placeholder="+1 (650) 555-1234"
                        className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition focus:(border-cyan-800 bg-dark-500 ring-2 ring-cyan-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic)"
                    />
                </div>
            </div>

            {/* WhatsApp ID */}
            <div className="flex flex-col">
                <div className="flex items-center justify-between">
                    <div className="text-xs text-light-900/60 font-semibold">
                        WhatsApp wa_id
                    </div>
                    <span className="text-[10px] text-light-900/40">
                        {(data.waId || "").length} / 30
                    </span>
                </div>
                <div className="mt-2 flex">
                    <input
                        type="text"
                        value={data.waId || ""}
                        maxLength={30}
                        onChange={e => updateData({ waId: e.target.value })}
                        placeholder="16505551234"
                        className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition focus:(border-cyan-800 bg-dark-500 ring-2 ring-cyan-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic)"
                    />
                </div>
                <div className="mt-1 text-[10px] text-light-900/40">
                    Numeric value used for WhatsApp chat redirection. E.g. country code + number.
                </div>
            </div>

            {/* Organization Info */}
            <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-light-900/60 font-semibold">
                            Company Name
                        </div>
                        <span className="text-[10px] text-light-900/40">
                            {(data.company || "").length} / 50
                        </span>
                    </div>
                    <div className="mt-2 flex">
                        <input
                            type="text"
                            value={data.company || ""}
                            maxLength={50}
                            onChange={e => updateData({ company: e.target.value })}
                            placeholder="Example Corp"
                            className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition focus:(border-cyan-800 bg-dark-500 ring-2 ring-cyan-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic)"
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-light-900/60 font-semibold">
                            Job Title
                        </div>
                        <span className="text-[10px] text-light-900/40">
                            {(data.title || "").length} / 50
                        </span>
                    </div>
                    <div className="mt-2 flex">
                        <input
                            type="text"
                            value={data.title || ""}
                            maxLength={50}
                            onChange={e => updateData({ title: e.target.value })}
                            placeholder="Manager"
                            className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition focus:(border-cyan-800 bg-dark-500 ring-2 ring-cyan-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic)"
                        />
                    </div>
                </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col">
                <div className="flex items-center justify-between">
                    <div className="text-xs text-light-900/60 font-semibold">
                        Email Address
                    </div>
                    <span className="text-[10px] text-light-900/40">
                        {(data.email || "").length} / 80
                    </span>
                </div>
                <div className="mt-2 flex">
                    <input
                        type="email"
                        value={data.email || ""}
                        maxLength={80}
                        onChange={e => updateData({ email: e.target.value })}
                        placeholder="john.doe@example.com"
                        className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition focus:(border-cyan-800 bg-dark-500 ring-2 ring-cyan-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic)"
                    />
                </div>
            </div>

            {/* Website URL */}
            <div className="flex flex-col">
                <div className="flex items-center justify-between">
                    <div className="text-xs text-light-900/60 font-semibold">
                        Website URL
                    </div>
                    <span className="text-[10px] text-light-900/40">
                        {(data.url || "").length} / 200
                    </span>
                </div>
                <div className="mt-2 flex">
                    <input
                        type="url"
                        value={data.url || ""}
                        maxLength={200}
                        onChange={e => updateData({ url: e.target.value })}
                        placeholder="https://www.example.com"
                        className="h-8 w-full border border-dark-200 rounded-md bg-dark-400 px-2.5 text-sm font-medium shadow-sm outline-none transition focus:(border-cyan-800 bg-dark-500 ring-2 ring-cyan-800/50) hover:(bg-dark-300/60) placeholder:(text-light-900/50 font-normal italic)"
                    />
                </div>
            </div>
        </div>
    );
}
