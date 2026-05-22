import { type Node, getConnectedEdges, useReactFlow } from "@xyflow/react";
import { useState } from "react";
import { toast } from "sonner";

import { useFlowValidator } from "~/modules/flow-builder/hooks/use-flow-validator";
import { ExportModal } from "~/modules/navigation-bar/components/export-modal";
import { SocialButtonLink } from "~/modules/navigation-bar/components/social-button-link";
import { BuilderNode } from "~/modules/nodes/types";
import { useApplicationState } from "~/stores/application-state";
import { trackSocialLinkClick } from "~/utils/ga4";

import { Switch } from "~@/components/generics/switch-case";
import { Whenever } from "~@/components/generics/whenever";
import { cn } from "~@/utils/cn";

export function NavigationBarModule() {
    const [isMobileView] = useApplicationState(s => [s.view.mobile]);
    const { getNodes, getEdges } = useReactFlow();

    const [isExportOpen, setIsExportOpen] = useState(false);
    const [isExportValidating, setIsExportValidating] = useState(false);

    const [isValidating, validateFlow] = useFlowValidator((isValid) => {
        if (isValid)
            toast.success("Flow is valid", { description: "You can now proceed to save or export this flow", dismissible: true });
        else
            toast.error("Flow is invalid", { description: "Please check if the flow is complete and has no lone nodes" });
    });

    const handleExportClick = async () => {
        setIsExportValidating(true);
        // Add visual validation feedback delay
        await new Promise(resolve => setTimeout(resolve, 400));

        const nodes = getNodes();
        const edges = getEdges();
        const connectedEdges = getConnectedEdges(nodes, edges);

        let isStartConnected = false;
        const nodesWithEmptyTarget: Node[] = [];

        for (const node of nodes) {
            const outgoingEdges = connectedEdges.filter(edge => edge.source === node.id);
            const incomingEdges = connectedEdges.filter(edge => edge.target === node.id);

            if (node.type === BuilderNode.START) {
                isStartConnected = outgoingEdges.length >= 1;
            }

            // Lone node check (excluding the start node specifically)
            const isLone = node.type === BuilderNode.START
                ? outgoingEdges.length === 0
                : incomingEdges.length === 0;

            if (isLone) {
                nodesWithEmptyTarget.push(node);
            }
        }

        const hasAnyLoneNode = nodesWithEmptyTarget.length > 0;
        const isFlowComplete = isStartConnected && !hasAnyLoneNode;

        setIsExportValidating(false);

        if (isFlowComplete) {
            setIsExportOpen(true);
        } else {
            toast.error("Flow is invalid", {
                description: "Cannot export. Please check if the flow is complete and has no lone nodes.",
                dismissible: true,
            });
        }
    };

    return (
        <div className="relative shrink-0 border-b border-dark-300 bg-dark-700 px-1.5 py-2">
            <div className="absolute inset-0">
                <div className="absolute h-full w-4/12 from-teal-900/20 to-transparent bg-gradient-to-r <md:(from-teal-900/50)" />
            </div>

            <div className="relative flex items-stretch justify-between gap-x-8">
                <div className="flex items-center py-0.5 pl-2">
                    <div className="size-8 flex shrink-0 select-none items-center justify-center rounded-lg bg-teal-600 text-sm font-bold leading-none">
                        <span className="translate-y-px">
                            DS
                        </span>
                    </div>

                    <div className="ml-3 h-full flex flex-col select-none justify-center gap-y-1 leading-none">
                        <div className="text-sm font-medium leading-none <md:(text-xs)">
                            Chatbot Flow Builder - BiteSpeed Frontend Task
                        </div>

                        <div className="text-xs text-light-50/60 leading-none">
                            By Azim Ahmed
                        </div>
                    </div>
                </div>

                <Whenever condition={isMobileView} not>
                    <div className="flex items-center justify-end gap-x-2">
                        {/* Validate Button */}
                        <button
                            type="button"
                            className={cn(
                                "h-full flex items-center justify-center outline-none gap-x-2 border border-dark-300 rounded-lg bg-dark-300/50 px-3 py-1.5 text-sm transition active:(bg-dark-400) hover:(bg-dark-200)",
                                isValidating && "cursor-not-allowed op-50 pointer-events-none",
                            )}
                            onClick={() => validateFlow()}
                        >
                            <Switch match={isValidating}>
                                <Switch.Case value>
                                    <div className="i-svg-spinners:180-ring size-5" />
                                </Switch.Case>
                                <Switch.Case value={false}>
                                    <div className="i-mynaui:check-circle size-5" />
                                </Switch.Case>
                            </Switch>
                            <span className="pr-0.5">
                                {isValidating ? "Validating Flow" : "Validate Flow"}
                            </span>
                        </button>

                        {/* WhatsApp Save & Export Button */}
                        <button
                            type="button"
                            className={cn(
                                "h-full flex items-center justify-center outline-none gap-x-2 border border-emerald-900/30 rounded-lg bg-emerald-950/20 text-emerald-400 px-3.5 py-1.5 text-sm font-semibold transition active:(bg-emerald-950/40) hover:(bg-emerald-950/30)",
                                isExportValidating && "cursor-not-allowed op-50 pointer-events-none",
                            )}
                            onClick={handleExportClick}
                        >
                            <Switch match={isExportValidating}>
                                <Switch.Case value>
                                    <div className="i-svg-spinners:180-ring size-5" />
                                </Switch.Case>
                                <Switch.Case value={false}>
                                    <div className="i-mynaui:brand-whatsapp size-5 text-emerald-400" />
                                </Switch.Case>
                            </Switch>
                            <span className="pr-0.5">
                                {isExportValidating ? "Compiling Flow" : "Save & Export"}
                            </span>
                        </button>

                        <div className="mx-1 h-4 w-px bg-dark-300" />

                        <div className="flex items-stretch gap-x-0.5">
                            <SocialButtonLink
                                onClick={() => trackSocialLinkClick("linkedin")}
                                href="https://www.linkedin.com/in/azimuahmed"
                            >
                                <div className="i-mynaui:brand-linkedin size-4.5" />
                            </SocialButtonLink>

                            <SocialButtonLink
                                onClick={() => trackSocialLinkClick("github")}
                                href="https://github.com/Azim-Ahmed/chatbot-flow-builder"
                            >
                                <div className="i-mynaui:brand-github size-4.5" />
                            </SocialButtonLink>
                        </div>
                    </div>
                </Whenever>
            </div>

            {/* Export Modal */}
            <ExportModal
                isOpen={isExportOpen}
                onClose={() => setIsExportOpen(false)}
                nodes={getNodes()}
                edges={getEdges()}
            />
        </div>
    );
}
