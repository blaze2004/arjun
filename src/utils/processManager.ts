import { Request } from "express";
import { randomUUID } from "crypto";
import UserOnboarding from "../process/onboarding";
import Process from "../process";

class ProcessManager {
    static processes: Process[] = [];

    static async createProcess(processType: string, req: Request) {
        let process = null;
        const processId = randomUUID();

        if (processType === 'user-onboarding') {
            process = new UserOnboarding(processId);
        } else {
            process = new UserOnboarding(processId);
        }
        req.user.processId = process.pid;
        await req.saveUserSession(req.user);

        ProcessManager.processes.push(process);
        return process;
    }

    static findProcess(pid: string) {
        return ProcessManager.processes.find(p => p.pid === pid) || null;
    }

    static async destroyProcess(pid: string, req: Request) {
        const pIndex = ProcessManager.processes.findIndex(p => p.pid === pid);
        const removedProcess = ProcessManager.processes.splice(pIndex, 1);

        if (req.user.processId === pid) {
            req.user.processId = null;
            await req.saveUserSession(req.user);
        }

        return removedProcess;
    }
}

export default ProcessManager;