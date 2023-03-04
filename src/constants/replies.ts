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
    userOnboardedMessage: "*What would you like to do now?*",
    invalidInputMessage: unrecognizedResponses[Math.floor(Math.random()*unrecognizedResponses.length)],
    calendarDescription: "Created by Arjun.",
}

export default replies;