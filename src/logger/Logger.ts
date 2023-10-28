class Logger {
    private static preamble() : string {
        let now = new Date();
        let log = "[";
        log += now.getFullYear() + "-";
        log += now.getMonth() + "-";
        log += now.getDate();
        log += "] server: ";
        return log;
    }
    public static info(message: string) {
        console.log(this.preamble() + message);
    }
}

export default Logger;