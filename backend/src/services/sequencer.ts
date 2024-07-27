import * as fs from "node:fs";

export enum actor {
    U = "User",
    C = "Consumer",
    SP = "Service Provider",
}

enum flowType {
    SyncRequest = '->',
    SyncReturn = '-->',
}

var singleton: FluentSequencer;

/**
 *  @returns a lazily-created singleton {@FluentSequencer} instance, initialized
 *  with the name of the logFile (or none) configured for the application
 */
export const getSequencer = (): FluentSequencer => {
    if (!singleton) {
        singleton = new FluentSequencer(process.env.SEQUENCE_LOG_FILE);
    }
    return singleton;
}

/**
 *  FluentSequencer currently supports only websequencediagrams.
 *  @see https://www.websequencediagrams.com
 */
export class FluentSequencer {
    private readonly logFilename: string | undefined;

    /**
     * @param logFilename name of the logfile (or empty or undefined if none)
     *        to receive the sequence diagram text.
     */
    constructor(logFilename: string | undefined) {
        this.logFilename = logFilename;

        this.deleteSequenceLog();
        this.appendSequenceLog('title OAuth2 Email Bridge PoC');

        Object.entries(actor).forEach(([alias, name]) => {
            this.appendSequenceLog(`participant ${name} as ${alias}`);
        });
    }

    /**
     * @param from originating actor
     * @param to receiving actor
     * @param what message text describing what `from` synchronously passed to `to`
     */
    public message(from: actor, to: actor, what: string): FluentSequencer {
        this.appenddSequenceFlow(from, flowType.SyncRequest, to, what);
        return this;
    }

    /**
     * @param from originating actor
     * @param to receiving actor
     * @param what message text describing a synchronous response or asynchronous message from `from` to `to`
     */
    public response(from: actor, to: actor, what: string): FluentSequencer {
        this.appenddSequenceFlow(from, flowType.SyncReturn, to, what);
        return this;
    }

    /**
     * @param who zero or more actors whose "activation state" (along the lifeline) should be increased by one
     */
    public activate(...who: actor[]): FluentSequencer {
        this.appendActivations(true, ...who);
        return this;
    }

    /**
     * @param who zero or more actors whose "activation state" (along the lifeline) should be decreased by one
     */
    public deactivate(...who: actor[]): FluentSequencer {
        this.appendActivations(false, ...who);
        return this;
    }

    /**
     * @param text text to note
     * @param who actor over whom the text will be placed
     */
    public noteOver(text: string, ...who: actor[]): FluentSequencer {
        this.appendSequenceLog(`note over ${who.join(",")}: ${text}`);
        return this;
    }


    private appenddSequenceFlow(from: actor, type: string, to: actor, what: string): void {
        this.appendSequenceLog(`${from} ${type} ${to}: ${what}`);
    }

    private appendActivations(isActivation: boolean, ...who: actor[]): void {
        who.forEach(a => {
            this.appendSequenceLog(`${!isActivation ? 'de' : ''}activate ${a}`);
        });
    }

    private deleteSequenceLog(): void {
        if (!this.logFilename) {
            return;
        }

        fs.rmSync(this.logFilename, { force: true });
    }

    private appendSequenceLog(line: string): void {
        if (!this.logFilename) {
            return;
        }

        fs.appendFileSync(this.logFilename, line + '\n');
    }

}
