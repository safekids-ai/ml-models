export class DOMUtils {
    public static getChildElements(collection: Set<Node>, node: Node) {
        if (!node.hasChildNodes()) {
            collection.add(node);
            return;
        }

        for (let i = 0; i < node.childNodes.length; i++) {
            this.getChildElements(collection, node.childNodes[i]);
        }
    }
}
