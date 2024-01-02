const logMessage = (message:string) => {
    const d = new Date();
    const dateText = d.toTimeString().split(' ')[0];
    console.log(`[${dateText}] ${message}`);
};

export {
    logMessage
}
