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
  userOnboardedMessage: (name: string) => `Hi ${name},\n\nI am Arjun, your personal assistant on WhatsApp. I can help you manage your schedule and answer your general queries.\n\nBefore moving ahead, let's know each other little more.`,
  invalidInputMessage: unrecognizedResponses[Math.floor(Math.random() * unrecognizedResponses.length)],
  calendarDescription: "Created by Arjun.",
  unregisteredUser: "Hi, I am Arjun. \nI can be your personal assistant on WhatsApp, but before that you have to first create an account on my website so that I can remember you and manage your schedule.\n\nRegister yourself on link below.\n\nhttps://arjunai.vercel.app",
  internalErrorMessage: "I am facing some issues connecting to my server. Please try again after some time or report the issue at shubham@visualbrahma.tech",
}

export default replies;