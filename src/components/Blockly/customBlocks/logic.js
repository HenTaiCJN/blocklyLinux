import * as Blockly from 'blockly/core';
import {Order, pythonGenerator} from 'blockly/python';

Blockly.Blocks['logic_in'] = {
    init: function () {
        this.appendValueInput("args1");
        this.appendDummyInput()
            .appendField(" in ")
        this.appendValueInput("args2");
        this.setColour("#D435D4");
        this.setInputsInline(true);
        this.setTooltip("");
        this.setHelpUrl("");
        this.setOutput(true);
    }
};
pythonGenerator.forBlock['logic_in'] = function (block) {
    let args1 = pythonGenerator.valueToCode(block, 'args1', Order.ATOMIC);
    let args2 = pythonGenerator.valueToCode(block, 'args2', Order.ATOMIC);

    return [`${args1} in ${args2}`,Order.ATOMIC];
};