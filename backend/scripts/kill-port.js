const { exec } = require('child_process');

exec('netstat -ano', (err, stdout, stderr) => {
    if (err) {
        console.error('Error running netstat:', err);
        return;
    }

    const lines = stdout.split('\n');
    const portLine = lines.find(line => line.includes(':5001') && line.includes('LISTENING'));

    if (portLine) {
        console.log('Found process on port 5001:', portLine.trim());
        const parts = portLine.trim().split(/\s+/);
        const pid = parts[parts.length - 1]; // PID is the last element

        if (pid) {
            console.log(`Attempting to kill PID: ${pid}`);
            exec(`taskkill /F /PID ${pid}`, (killErr, killStdout, killStderr) => {
                if (killErr) {
                    console.error('Error killing process:', killErr);
                } else {
                    console.log('Process killed successfully:', killStdout);
                }
            });
        }
    } else {
        console.log('No process found listening on port 5001.');
    }
});
