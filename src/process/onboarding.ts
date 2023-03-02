import { Request } from "express";
import Process from ".";
import replies from "../constants/replies";
import { toCapitalCase } from "../utils/messageBuilder";

class UserOnboarding extends Process {
    constructor(pid: string) {
        super(pid);
        this.questions = [
            {
                question: "Hi There!😁💙 \n\nI am Arjun. I can help you manage your schedule and answer your general queries.\n\n*May I know your name?*",
                validateAnswer: (answer: string) => answer.length > 0,
                errorMsg: "Please enter a valid name",
                answer: null
            },
        ];
    }

    async postProcessAction(req: Request) {
        req.user.name = toCapitalCase(this.questions[0].answer!);
        await super.postProcessAction(req);
        return [`🍻 Welcome ${req.user.name}!`, replies.userOnboardedMessage as string];
    }
}

export default UserOnboarding;