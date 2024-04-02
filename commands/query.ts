import {
    IHttp,
    IModify,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    ISlashCommand,
    SlashCommandContext,
} from '@rocket.chat/apps-engine/definition/slashcommands';
// import { exec } from 'child_process';

// function callPythonScript(question: string): Promise<string> {
//     return new Promise((resolve, reject) => {
//         exec(`python sql.py ${question}`, (error, stdout, stderr) => {
//             if (error) {
//                 reject(error);
//                 return;
//             }
//             if (stderr) {
//                 reject(stderr);
//                 return;
//             }
//             resolve(stdout.trim());
//         });
//     });
// }

// export class Query implements ISlashCommand {
//     public command = 'query'; 
//     public i18nParamsExample = '';
//     public i18nDescription = '';
//     public providesPreview = false;

//     public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp): Promise<void> {
//         const [subcommand] = context.getArguments(); 

//         if (!subcommand) { 
//             throw new Error('Error!');
//         }
//         else
//         {
//             callPythonScript(subcommand)
//             .then(response => {
//                 this.sendMessage(context, modify, response);
//             })
//             .catch(error => {
//                 this.sendMessage(context, modify, error);
//             });  
//         }    
        
//     }
//     private async sendMessage(context: SlashCommandContext, modify: IModify, message: string): Promise<void> {
//         const messageStructure = modify.getCreator().startMessage();
//         const sender = context.getSender(); 
//         const room = context.getRoom();
        
//         messageStructure
//             .setSender(sender)
//             .setRoom(room)
//             .setText(message);
        
//         await modify.getCreator().finish(messageStructure);
//     }
// }

export class Query implements ISlashCommand {
    public command = 'query'; 
    public i18nParamsExample = '';
    public i18nDescription = '';
    public providesPreview = false;

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp): Promise<void> {
        const [subcommand] = context.getArguments(); 

        if (!subcommand) { 
            throw new Error('Error!');
        }

        switch (subcommand) { 
            case 'How many employees are there':
                await this.sendMessage(context, modify, 'There are 8 employees');
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
