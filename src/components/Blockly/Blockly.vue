<script setup lang="ts">
import * as Blockly from 'blockly/core';
import * as Zh from 'blockly/msg/zh-hans';
import * as En from 'blockly/msg/en';
import '@/components/Blockly/js/custom_category'

import '@/components/Blockly/js/toolbox_style.css'
import '@/components/Blockly/js/theme'
import 'blockly/blocks';
import 'blockly/python';

import options from '@/components/Blockly/config/options.json'
import toolbox from '@/components/Blockly/config/toolbox.json'
import '@/components/Blockly/customBlocks/func'
import '@/components/Blockly/customBlocks/var'
import '@/components/Blockly/customBlocks/dict'
import '@/components/Blockly/customBlocks/pin'
import '@/components/Blockly/customBlocks/input'
import '@/components/Blockly/customBlocks/output'
import '@/components/Blockly/customBlocks/network'
import '@/components/Blockly/customBlocks/radio'
import '@/components/Blockly/customBlocks/logic'

import {onMounted, ref} from "vue";
import {pythonGenerator} from "blockly/python";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import {NavigationController} from '@blockly/keyboard-navigation';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import type {WorkspaceSvg} from "blockly/core/workspace_svg";
import {CustomCursor} from '@/components/Blockly/js/customCursor'
import {CustomMainCursor} from '@/components/Blockly/js/customMainCursor'
import '@/components/Blockly/js/custom_marker_svg';
import axios from "axios";


onMounted(() => {
    blockInit()
    keyboardListen()
})

const blocklyId = "mainBlockly"
let workspace: WorkspaceSvg


function blockInit() {
    //缩进设置
    pythonGenerator.INDENT = '    ';

    //@ts-expect-error no matter
    Blockly.setLocale(Zh)
    Blockly.Msg["LOGIC_BOOLEAN_FALSE"] = "False";
    Blockly.Msg["LOGIC_BOOLEAN_TRUE"] = "True";
    Blockly.Msg["LOGIC_BOOLEAN_TOOLTIP"] = "返回 True 或 False。";

    Blockly.ASTNode.NAVIGATE_ALL_FIELDS = true

    //@ts-expect-error no matter
    options.toolbox = toolbox
    options.plugins = {}
    // options.renderer= 'custom_renderer'
    workspace = Blockly.inject(blocklyId, options);
    workspace.getToolbox().setVisible(false)

    // let dom =Blockly.utils.xml.textToDom(decodeURIComponent(props.data.item.xml))
    // Blockly.Xml.domToWorkspace(dom, workspace);

    const navigationController = new NavigationController();
    navigationController.init();
    navigationController.addWorkspace(workspace);
    navigationController.enable(workspace)

    setTimeout(workspaceResize, 100)
}

function workspaceResize() {
    Blockly.svgResize(workspace);
    workspace.scrollCenter()

    const flyout = workspace.getFlyout()
    const flyoutWS = flyout.getWorkspace()
    flyoutWS.getMarkerManager().setCursor(new CustomCursor(workspace))
    workspace.getMarkerManager().setCursor(new CustomMainCursor(workspace))
    // console.log(this.workspace.getToolbox());
    // workspace.getMarkerManager().setCursor(new LineCursor())
}

function keyboardListen() {
    document.addEventListener('keydown', function (event) {
        switch (event.key) {
            case 't': {
                workspace.getToolbox().setVisible(true)
                workspace.getFlyout().setVisible(true)
                Blockly.svgResize(workspace);
                break
            }
            case 'Escape': {
                workspace.getFlyout().setVisible(false)
                workspace.getToolbox().setVisible(false)
                Blockly.svgResize(workspace);
                break
            }
            case 'Enter': {
                workspace.getFlyout().setVisible(false)
                workspace.getToolbox().setVisible(false)
                Blockly.svgResize(workspace);
                break
            }
        }
    });
}

function test() {
    axios.post(`http://192.168.1.231:9010/flash`, {}).then(res => {
        console.log(res);
    }).catch(e => {
        console.error(e);
    })
}
</script>

<template>
    <!--    <div><button @click="">测试</button></div>-->

    <div :id="blocklyId" style="height:320px;width: 240px;"/>
</template>

<style>
#app {
    padding: 0 !important;
}

.blocklyMainWorkspaceScrollbar {
    visibility: hidden !important;
}

.blocklyScrollbarHandle {
    visibility: hidden !important;
}
</style>
