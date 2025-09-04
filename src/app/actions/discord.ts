"use server"
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL
if (!discordWebhookUrl) {
    throw new Error("DISCORD_WEBHOOK_URL is not defined");
}
export const sendDiscordMessage = async (message: string) => {
    try {
        // A fetch request to send data through the discord
        // webhook, and display it as a message in your
        // discord channel
        const response = await fetch(discordWebhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                content: message,
            }),
        });

        if (!response.ok) {
            throw new Error(`Discord API error: ${response.status} ${response.statusText}`);
        }
    } catch (err: unknown) {
        console.error("Failed to send Discord message:");
        if (err instanceof Error) {
            console.error(err.message);
        }
        // Consider adding error tracking service integration here
    }
}