import {
    IAppAccessors,
    IConfigurationExtend,
    ILogger,
    IRead, 
    IHttp, 
    IPersistence,
    IModify,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { Query } from './commands/query';
import { PhoneCommand } from './commands/PhoneCommand';
import { OpenCtxBarCommand } from './commands/contextualbar';
import {createContextualBarBlocks} from './commands/contextualbar';
import { BlockElementType, ISectionBlock, IUIKitResponse, UIKitBlockInteractionContext, UIKitViewSubmitInteractionContext, IUIKitInteractionHandler, UIKitActionButtonInteractionContext } from '@rocket.chat/apps-engine/definition/uikit';
import { UIActionButtonContext } from '@rocket.chat/apps-engine/definition/ui';

export class DemoForGsocApp extends App {

    private readonly appLogger: ILogger
    
    constructor(info: IAppInfo, logger: ILogger, accessors: IAppAccessors) {
        super(info, logger, accessors)
        this.appLogger = this.getLogger()
        this.appLogger.debug('Hello, World!')
    }
    // [7]
    public async extendConfiguration(configuration: IConfigurationExtend){
        configuration.slashCommands.provideSlashCommand(new PhoneCommand());
        configuration.slashCommands.provideSlashCommand(new Query());
        configuration.slashCommands.provideSlashCommand(
            new OpenCtxBarCommand(this),
        )
        configuration.ui.registerButton({
            actionId: 'my-action-id', // this identifies your button in the interaction event
            labelI18n: 'my-action-name', // key of the i18n string containing the name of the button
            context: UIActionButtonContext.MESSAGE_ACTION, // the context in which the action button will be displayed on the UI
        });
    }

    // [8]
    public async executeBlockActionHandler(context: UIKitBlockInteractionContext, _read: IRead, _http: IHttp, _persistence: IPersistence, modify: IModify) {
        const data = context.getInteractionData();

        const contextualbarBlocks = createContextualBarBlocks(modify, data.container.id);

        // [9]
        await modify.getUiController().updateContextualBarView(contextualbarBlocks, { triggerId: data.triggerId }, data.user);

        return {
            success: true,
        };
    }

    // [10]
    public async executeViewSubmitHandler(context: UIKitViewSubmitInteractionContext): Promise<IUIKitResponse> {
        const data = context.getInteractionData()

        // [11]
        const text = (data.view.blocks[0] as ISectionBlock).text.text;

        // [12]
        console.log(text);

        return {
            success: true,
        };
    }

    public async executeActionButtonHandler(
        context: UIKitActionButtonInteractionContext,
        read: IRead,
        http: IHttp,
        persistence: IPersistence,
        modify: IModify
    ): Promise<IUIKitResponse> {
        const { 
            buttonContext, 
            actionId, 
            triggerId, 
            user, 
            room, 
            message,
        } = context.getInteractionData();

        // If you have multiple action buttons, use `actionId` to determine 
        // which one the user interacted with
        if (actionId === 'my-action-id') {
            const blockBuilder = modify.getCreator().getBlockBuilder();
            
            return context.getInteractionResponder().openModalViewResponse({
                title: blockBuilder.newPlainTextObject('Interaction received'),
                blocks: blockBuilder.addSectionBlock({
                    text: blockBuilder.newPlainTextObject('We received your interaction, thanks!')
                }).getBlocks(),
            });
        }

        return context.getInteractionResponder().successResponse();
    }
}
