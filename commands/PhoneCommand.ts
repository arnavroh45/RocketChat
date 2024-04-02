import {
    IHttp,
    IModify,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    ISlashCommand,
    SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';

export class PhoneCommand implements ISlashCommand {
    public command = 'GSOC:Arnav'; 
    public i18nParamsExample = '';
    public i18nDescription = '';
    public providesPreview = false;

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp): Promise<void> {
        const [subcommand] = context.getArguments(); 

        if (!subcommand) { 
            throw new Error('Error!');
        }

        switch (subcommand) { 
            case 'Intro':
                await this.sendMessage(context, modify, 'Greetings! This is Arnav Sharma and I would like to contribute to RocketChat. I am currently a Pre-Final Year student, pursuing Computer Engineering at Thapar Institute of Engineering and Technology, Punjab, India.');
                break;
            case 'Experience':
                await this.sendMessage(context, modify, 'I am currently a GenAI intern at NextAI. I have been working closely with LLMs and RAG for the past 6 months. I built a production level Chatbot for NextAI, similar to the idea proposed by RocketChat. So, I have quite an experience as to what is the vision of RocketChat. I have also built some projects like Chatting with Confluence Docs, PostgreSQLDB and many more. ');
                break;
            case 'Why':
                await this.sendMessage(context, modify, 'Considering my experience with LLMs and RAG, makes me stand out from the rest of the applicants. I am also familiar Llama Index and Langchain. I have used these frameworks a lot and have also created multiple issues and have had discussions with their contributors. I also have built FastAPIs for NextAI.');
                break;
            default: 
                throw new Error('Error!');
            
        }
    }
    private async sendMessage(context: SlashCommandContext, modify: IModify, message: string): Promise<void> {
        const messageStructure = modify.getCreator().startMessage();
        const sender = context.getSender(); 
        const room = context.getRoom();
        
        messageStructure
            .setSender(sender)
            .setRoom(room)
            .setText(message);
        
        await modify.getCreator().finish(messageStructure);
    }
}

