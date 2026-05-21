import { nanoid } from "nanoid";

import { BuilderNode } from "~/modules/nodes/types";
import { createNodeWithDefaultData } from "~/modules/nodes/utils";

const startNode = createNodeWithDefaultData(BuilderNode.START, { position: { x: 50, y: 150 } });
const textMessageNode = createNodeWithDefaultData(BuilderNode.TEXT_MESSAGE, { position: { x: 450, y: 150 } });
const endNode = createNodeWithDefaultData(BuilderNode.END, { position: { x: 850, y: 150 } });

const nodes = [startNode, textMessageNode, endNode];

const edges = [
    { id: nanoid(), source: startNode.id, target: textMessageNode.id, type: "deletable" },
    { id: nanoid(), source: textMessageNode.id, target: endNode.id, type: "deletable" },
];

export {
    nodes as defaultNodes,
    edges as defaultEdges,
};
