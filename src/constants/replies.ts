const getGreetingsResponse = (name: string): string => {
    const greetingsResponse = [
        `Hi ${name},\n*How can I assist you today?*`,
        `Hello ${name}!\nIt's great to hear from you.\n\n*How can I help you?*`,
        `Hey ${name},\n*How can I help you?*`,
        `Hi ${name},\n*What would like me to do?*`,
    ];

    return greetingsResponse[Math.floor(Math.random() * greetingsResponse.length)]
}
const appreciationResponse = [
    "You're welcome! It's my pleasure to assist you.\n\n*How can I help you?*",
    "Thank you for your kind words! It's always great to hear positive feedback.\n\n*How can I help you?*",
    "Glad I could help! Let me know if you need anything else.",
    "It's my pleasure to serve you!\n\n*How can I help you?*",
    "Thanks for the appreciation.\n\n*How can I help you?*",
    "I am glad you like the results.\n\n*How can I help you?*"
]

const unrecognizedResponses = [
    "I'm sorry, I didn't quite catch that.",
    "I'm still learning, can you try again with simpler words?",
    "I'm not quite sure what you're asking.",
    "I'm not sure how to respond to that.",
    "I didn't understand what you said.",
    "I'm afraid I don't have an answer for that.",
    "I'm not sure how to respond to that.",
    "I'm sorry, I did't understand that.",
]


const replies: { [key: string]: string | ((name: string) => string) } = {
    welcomeMessage: "*What would you like to do now?*",
    invalidInputMessage: unrecognizedResponses[Math.floor(Math.random() * unrecognizedResponses.length)],
    greetingMessage: (name: string) => getGreetingsResponse(name),
    appreciationMessage: appreciationResponse[Math.floor(Math.random() * appreciationResponse.length)],
    chatLaterMessage: "Sure, I'll be here if you need me.\n\nIn the meantime, you can check out our website at https://arjun.vb.tech.",
}

export default replies;