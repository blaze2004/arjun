import { Request } from "express";
import Process from ".";
import replies from "../constants/replies";

class UserOnboarding extends Process {
  constructor(pid: string) {
    super(pid);
    this.questions = [
      {
        question: "*Hey, How are you doing?*",
        validateAnswer: (answer: string) => answer.length > 0,
        errorMsg: "Please enter a valid answer.",
        answer: null
      }
    ];
  }

  async postProcessAction(req: Request) {
    await super.postProcessAction(req);
    return [replies.welcomeMessage as string];
  }
}

export default UserOnboarding;
