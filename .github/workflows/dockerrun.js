const { exec } = require("child_process");

setTimeout(() => {
    exec("sudo docker ps -a --format '{{.Names}}'", (error, stdout, stderr) => {
        if (error) {
            process.exit(1)
        }
        if (stderr) {
            process.exit(1)
        }
        console.log(stdout);
        if (stdout.includes("chessapp") && stdout.includes("backendsocket")) {
            process.exit(0)
        } else {
            process.exit(1)
        }
    });
}, 20000)
