import * as Blockly from 'blockly/core';


export class CustomMainCursor extends Blockly.BasicCursor {
    private workspace: Blockly.WorkspaceSvg;

    constructor(workspace: Blockly.WorkspaceSvg | never) {
        super();
        this.workspace = workspace
    }

    getBlockBaseSizeByType(type: string) {
        const tempBlock = this.workspace.newBlock(type);

        // 初始化和渲染以获取准确宽高
        tempBlock.initSvg();
        tempBlock.render();

        // 获取宽高
        const {width, height} = tempBlock.getHeightWidth();

        // 删除临时块
        tempBlock.dispose();

        return {width, height};
    }

    centerOnBlock(newNode: Blockly.ASTNode, blockOnly?: boolean) {
        const newNodeBlock: Blockly.Block | null = newNode.getSourceBlock()
        if (!newNodeBlock) {
            return
        }
        const id = newNodeBlock.id
        const curBlock = id ? this.workspace.getBlockById(id) : null;

        if (curBlock) {
            const originBlockHW = this.getBlockBaseSizeByType(curBlock.type);
            const curXY = curBlock.getRelativeToSurfaceXY();
            const curHW = blockOnly ? originBlockHW : curBlock.getHeightWidth();
// console.log(curHW, curBlock);
            const curScale = this.workspace.scale;

// 计算块左上角的缩放后位置
            const newWidth = curXY.x * curScale; // 不再计算块的宽度，直接使用左上角 X 坐标
            const newHeight = curXY.y * curScale; // 同理，使用左上角 Y 坐标
            const curMetrics = this.workspace.getMetrics();

// 滚动到块的左上角，使其位于视野中心
            const scrollToX = -(newWidth - curMetrics.viewWidth / 2);
            const scrollToY = -(newHeight - curMetrics.viewHeight / 2);
            this.workspace.scroll(scrollToX, scrollToY);
            this.workspace.scroll(scrollToX, scrollToY);

        }

    }

    centerOnField(newNode: Blockly.ASTNode, blockOnly?: boolean) {
        const newNodeBlock: Blockly.Block | null = newNode.getSourceBlock()
        if (!newNodeBlock) {
            return
        }

        console.log(newNode.getLocation());
        let fieldTransform: string
        //@ts-expect-error textElement_ actually exists
        if (newNode.getLocation().textElement_) {
            //@ts-expect-error textElement_ actually exists
            fieldTransform = newNode.getLocation().textElement_.parentElement.attributes.transform.value
        } else {
            //@ts-expect-error imageElement actually exists
            fieldTransform = newNode.getLocation().imageElement.parentElement.attributes.transform.value
        }

        const translateMatch = fieldTransform.match(/translate\(([-\d.]+),\s*([-\d.]+)\)/);
        if (!translateMatch) {
            return
        }
        const x = parseFloat(translateMatch[1]);
        const y = parseFloat(translateMatch[2]);
        const id = newNodeBlock.id

        const curBlock = id ? this.workspace.getBlockById(id) : null;

        if (curBlock) {
            const originBlockHW = this.getBlockBaseSizeByType(curBlock.type)
            const curXY = curBlock.getRelativeToSurfaceXY();
            const curHW = blockOnly ? originBlockHW : curBlock.getHeightWidth();
            // console.log(curHW, curBlock);
            const curScale = this.workspace.scale;
            const newWidth = (curXY.x + (this.workspace.RTL ? -1 : 1) * curHW.width / 2) * curScale;
            const newHeight = (curXY.y + curHW.height / 2) * curScale;
            const curMetrics = this.workspace.getMetrics();

            const scrollToX = -(newWidth - curMetrics.viewWidth + x)
            const scrollToY = -(newHeight - curMetrics.viewHeight / 2)
            this.workspace.scroll(scrollToX, scrollToY)
            console.log({x: x, y: y})
            console.log({scrollToX: scrollToX, scrollToY: scrollToY})
        }
    }

    edgeScrollY(newNode: Blockly.ASTNode) {
        const useOnBlock = ["block"]
        const useOnField = ["field"]

        console.log(newNode.getType(), newNode.getLocation());

        if (useOnField.includes(newNode.getType())) {
            //@ts-expect-error name actually exists
            if (newNode.getLocation().name !== undefined) {
                this.centerOnBlock(newNode, true)
                return
            }
            this.centerOnField(newNode, true)
        } else if (useOnBlock.includes(newNode.getType())) {
            this.centerOnBlock(newNode, true)
        }
    }

    next() {
        const curNode = this.getCurNode();
        if (!curNode) {
            return null;
        }
        let newNode = this.getNextNode_(curNode, this.validLineNode);

        // Skip the input or next value if there is a connected block.
        if (
            newNode &&
            (newNode.getType() == Blockly.ASTNode.types.INPUT ||
                newNode.getType() == Blockly.ASTNode.types.NEXT) &&
            //@ts-expect-error targetBlock() actually exists
            newNode.getLocation().targetBlock()
        ) {
            newNode = this.getNextNode_(newNode, this.validLineNode);
        }
        if (newNode) {
            this.edgeScrollY(newNode)
            this.setCurNode(newNode);
        }
        return newNode;
    }

    /**
     * Moves the cursor to the next input connection or field
     * in the pre order traversal.
     * @returns {Blockly.ASTNode} The next node, or null if the current node is
     *     not set or there is no next value.
     * @override
     */
    in() {
        const curNode = this.getCurNode();
        if (!curNode) {
            return null;
        }
        const newNode = this.getNextNode_(curNode, this.validInLineNode);

        if (newNode) {
            this.edgeScrollY(newNode)
            this.setCurNode(newNode);
        }
        return newNode;
    }

    /**
     * Moves the cursor to the previous next connection or previous connection in
     * the pre order traversal.
     * @returns {Blockly.ASTNode} The previous node, or null if the current node
     *     is not set or there is no previous value.
     * @override
     */
    prev() {
        const curNode = this.getCurNode();
        if (!curNode) {
            return null;
        }
        let newNode = this.getPreviousNode_(curNode, this.validLineNode);

        if (
            newNode &&
            (newNode.getType() == Blockly.ASTNode.types.INPUT ||
                newNode.getType() == Blockly.ASTNode.types.NEXT) &&
            //@ts-expect-error targetBlock() actually exists
            newNode.getLocation().targetBlock()
        ) {
            newNode = this.getPreviousNode_(newNode, this.validLineNode);
        }

        if (newNode) {
            this.edgeScrollY(newNode)
            this.setCurNode(newNode);
        }
        return newNode;
    }

    /**
     * Moves the cursor to the previous input connection or field in the pre order
     * traversal.
     * @returns {Blockly.ASTNode} The previous node, or null if the current node
     *     is not set or there is no previous value.
     * @override
     */
    out() {
        const curNode = this.getCurNode();
        if (!curNode) {
            return null;
        }
        const newNode = this.getPreviousNode_(curNode, this.validInLineNode);

        if (newNode) {
            this.edgeScrollY(newNode)
            this.setCurNode(newNode);
        }
        return newNode;
    }

    /**
     * Decides if the previous and next methods should traverse the given node.
     * The previous and next method only traverse previous connections, next
     * connections and blocks.
     * @param {Blockly.ASTNode} node The AST node to check.
     * @returns {boolean} True if the node should be visited, false otherwise.
     * @protected
     */
    validLineNode(node: Blockly.ASTNode | null) {
        if (!node) {
            return false;
        }
        let isValid = false;
        const location = node.getLocation();
        const type = node && node.getType();
        if (type == Blockly.ASTNode.types.BLOCK) {
            //@ts-expect-error location.outputConnection actually exists
            if (location.outputConnection === null) {
                isValid = true;
            }
        } else if (
            type == Blockly.ASTNode.types.INPUT &&
            //@ts-expect-error location.type actually exists
            location.type == Blockly.NEXT_STATEMENT
        ) {
            isValid = true;
        } else if (type == Blockly.ASTNode.types.NEXT) {
            isValid = true;
        }
        return isValid;
    }

    /**
     * Decides if the in and out methods should traverse the given node.
     * The in and out method only traverse fields and input connections.
     * @param {Blockly.ASTNode} node The AST node to check whether it is valid.
     * @returns {boolean} True if the node should be visited, false otherwise.
     * @protected
     */
    validInLineNode(node: Blockly.ASTNode | null) {
        if (!node) {
            return false;
        }
        let isValid = false;
        const location = node.getLocation();
        const type = node && node.getType();
        if (type == Blockly.ASTNode.types.FIELD) {
            isValid = true;
        } else if (
            type == Blockly.ASTNode.types.INPUT &&
            //@ts-expect-error location.type actually exists
            location.type == Blockly.INPUT_VALUE
        ) {
            isValid = true;
        }
        return isValid;
    }
}
