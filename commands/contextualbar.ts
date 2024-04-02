import {
    IAppAccessors,
    IConfigurationExtend,
    IHttp,
    ILogger,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';

import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

import { BlockElementType, ISectionBlock, IUIKitResponse, UIKitBlockInteractionContext, UIKitViewSubmitInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';

import { IUIKitContextualBarViewParam } from '@rocket.chat/apps-engine/definition/uikit/UIKitInteractionResponder';
export function createContextualBarBlocks(modify: IModify, viewId?: string): IUIKitContextualBarViewParam {
    const blocks = modify.getCreator().getBlockBuilder();

    const date = new Date().toISOString();

    blocks.addSectionBlock({
        text: blocks.newMarkdownTextObject(`The current date-time is\n${date}`), // [4]
        accessory: { // [5]
            type: BlockElementType.BUTTON,
            actionId: 'date',
            text: blocks.newPlainTextObject('Refresh'),
            value: date,
        },
    });

    return { // [6]
        id: viewId || 'contextualbarId',
        title: blocks.newPlainTextObject('Contextual Bar'),
        submit: blocks.newButtonElement({
            text: blocks.newPlainTextObject('Submit'),
        }),
        blocks: blocks.getBlocks(),
    };
}

export class OpenCtxBarCommand implements ISlashCommand {
    // this is what we will type when calling the slashcommand: /contextualbar
    public command = 'contextualbar';
    public i18nParamsExample = 'slashcommand_params';
    public i18nDescription = 'slashcommand_description';
    public providesPreview = false;

    constructor(private readonly app: App) {}

    public async executor(context: SlashCommandContext, _read: IRead, modify: IModify): Promise<void> {
        const triggerId = context.getTriggerId() as string; // [1]
        const user = context.getSender();

        const contextualbarBlocks = createContextualBarBlocks(modify); // [2]

        await modify.getUiController().openContextualBarView(contextualbarBlocks, {triggerId }, user); // [3]
    }
}