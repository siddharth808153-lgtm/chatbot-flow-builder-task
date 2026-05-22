import type { ComponentType } from "react";

export enum BuilderNode {
    START = "start",
    TEXT_MESSAGE = "text-message",
    CONDITIONAL_PATH = "conditional-path",
    IMAGE = "image",
    VIDEO = "video",
    CONTACT = "contact",
    INTERACTIVE = "interactive",
    HANDOFF = "handoff",
    LOCATION = "location",
    PDF = "pdf",
}

export type BuilderNodeType = `${BuilderNode}`;

export interface RegisterNodeMetadata<T = Record<string, any>> {
    type: BuilderNodeType;
    node: ComponentType<any>;
    detail: {
        icon: string;
        title: string;
        description: string;
    };
    available?: boolean;
    defaultData?: T;
    propertyPanel?: ComponentType<any>;
}

export interface BaseNodeData extends Record<string, any> {
    deletable?: boolean;
}
