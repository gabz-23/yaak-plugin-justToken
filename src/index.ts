import * as fs from 'fs';
import { PluginDefinition } from '@yaakapp/api';

export const plugin: PluginDefinition = {
    httpRequestActions: [
        {
            label: 'Copy Token',
            icon: 'copy',
            async onSelect(ctx, args) {
                const resID = await ctx.httpResponse.find({
                    requestId: args.httpRequest.id,
                });

                const filePath: string = resID[0]?.bodyPath as string;
                const token = getToken(filePath);

                if (!token) {
                    await ctx.toast.show({
                        icon: 'info',
                        color: 'danger',
                        message: `The response does not have a token`,
                    });
                    return;
                }

                await ctx.clipboard.copyText(token);
                await ctx.toast.show({
                    icon: 'copy',
                    color: 'success',
                    message: `Token copied to clipboard`,
                });
            },
        },
    ],
};

export function getToken(filePath: string): string {
    const file = fs.readFileSync(filePath, 'utf-8');
    const token = JSON.parse(file).token;
    return token;
}
