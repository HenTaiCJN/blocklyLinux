import * as Blockly from 'blockly/core';


export class CustomCursor extends Blockly.Cursor {
    private flyout: Blockly.IFlyout

    constructor(workspace: Blockly.WorkspaceSvg | any) {
        super();
        this.flyout = workspace.getFlyout()
    }

    edgeScrollY(newNode: Blockly.ASTNode) {
        const wsHeight = this.flyout.getHeight()
        const newNodeBlock: Blockly.Block | null = newNode.getSourceBlock()
        if (newNodeBlock) {
            //@ts-expect-error newNodeBlock.height actually exists
            const BlockBottomToTop = newNodeBlock.getRelativeToSurfaceXY().y + newNodeBlock.height + 10
            const scrollY = (BlockBottomToTop > wsHeight) ? wsHeight - BlockBottomToTop : BlockBottomToTop
            this.flyout.getWorkspace().scroll(0, scrollY)
        }
    }

    next() {
        // The current Blockly.ASTNode the cursor is on.
        const curNode = this.getCurNode();
        if (!curNode) {
            return null;
        }
        // The next Blockly.ASTNode.
        const newNode = curNode.next();
        if (newNode) {
            this.edgeScrollY(newNode)
            this.setCurNode(newNode);
        }
        return newNode;
    }

    in() {
        const curNode = this.getCurNode();
        if (!curNode) {
            return null;
        }
        const newNode = curNode.in();
        if (newNode) {
            this.edgeScrollY(newNode)
            this.setCurNode(newNode);
        }
        return newNode;
    }

    prev() {
        const curNode = this.getCurNode();
        if (!curNode) {
            return null;
        }
        const newNode = curNode.prev();
        if (newNode) {
            this.edgeScrollY(newNode)
            this.setCurNode(newNode);
        }
        return newNode;
    }

    out() {
        const curNode = this.getCurNode();
        if (!curNode) {
            return null;
        }
        const newNode = curNode.out();
        if (newNode) {
            this.edgeScrollY(newNode)
            this.setCurNode(newNode);
        }
        return newNode;
    }
}
