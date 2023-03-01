import { Question } from "../types";
import { Request } from "express";
import ProcessManager from "../utils/processManager";
import replies from "../constants/replies";

abstract class Process {
    questions: Question[] = [];
    pid: string;

    constructor(pid: string) {
        this.pid = pid;
    }

    get welcomeMessage() {
        if (this.nextQuestion() === null) return null;
        return (this.nextQuestion() as Question).question;
    }

    nextQuestion() {
        return this.questions.find((q: Question) => q.answer === null) || null;
    }

    async handleUserResponse(message: string) {
        if (this.nextQuestion() === null) return null;
        const question: Question = this.nextQuestion() as Question;

        const isAnswerValid: boolean = await question.validateAnswer(message);

        if (!isAnswerValid) {
            return question.errorMsg;
        }

        question.answer = message;
        const nextQuestion = this.nextQuestion();
        return nextQuestion === null ? null : nextQuestion.question;
    }

    async postProcessAction(req: Request): Promise<string[]> {
        await req.saveUserSession(req.user);
        ProcessManager.destroyProcess(this.pid, req);

        return [replies.welcomeMessage as string];
    }
}

export default Process;