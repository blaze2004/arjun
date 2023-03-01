import { Request } from "express";
import Process from ".";
import replies from "../constants/replies";
import { toCapitalCase } from "../utils/messageBuilder";

class UserOnboarding extends Process {
    constructor(pid: string) {
        super(pid);
        this.questions = [
            {
                question: "Hi There!😁💙 \n\nI am FinoBird Assistant. I'll provide you with the most up-to-date and accurate infomation on listed stocks of your favourite company.\n\n*May I know your name?*",
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