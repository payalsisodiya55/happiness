const { exec } = require('child_process');
const fs = require('fs');

const log = (msg) => fs.appendFileSync('kill-port.log', msg + '\n');

exec('netstat -ano', (err, stdout, stderr) => {
    if (err) {
        log('Error running netstat: ' + err.message);
        return;
    }

    const lines = stdout.split('\n');
    const portLine = lines.find(line => line.includes(':5001') && line.includes('LISTENING'));

    if (portLine) {
        log('Found process on port 5001: ' + portLine.trim());
        const parts = portLine.trim().split(/\s+/);
        const pid = parts[parts.length - 1]; // PID is the last element

        if (pid) {
            log(`Attempting to kill PID: ${pid}`);
            exec(`taskkill /F /PID ${pid}`, (killErr, killStdout, killStderr) => {
                if (killErr) {
                    log('Error killing process: ' + killErr.message);
                } else {
                    log('Process killed successfully.');
                }
            });
        }
    } else {
        log('No process found listening on port 5001.');
    }
});
