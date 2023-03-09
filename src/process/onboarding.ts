import { Request } from "express";
import Process from ".";
import replies from "../constants/replies";
import { toCapitalCase } from "../utils/messageBuilder";

class UserOnboarding extends Process {
    constructor(pid: string) {
        super(pid);
        this.questions = [
            {
                question: "*What is your current profession or field of study?*",
                validateAnswer: (answer: string) => answer.length > 0,
                errorMsg: "Please enter a valid profession.",
                answer: null
            },
            {
                question: "*Can you tell me a little more about yourself (anything you would like to tell)?*",
                validateAnswer: (answer: string) => answer.length > 0,
                errorMsg: "Please enter a valid profession.",
                answer: null
            },
        ];
    }

    async postProcessAction(req: Request) {
        req.user.name = toCapitalCase(this.questions[0].answer || "");
        await super.postProcessAction(req);
        return [`🍻 Welcome ${req.user.name}!`, replies.welcomeMessage as string];
    }
}

export default UserOnboarding;