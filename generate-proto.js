// generate-proto.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure the output directory exists
const outputDir = path.join(__dirname, 'client', 'src', 'proto', 'generated');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Command to generate proto files
const command = `protoc \
--proto_path=proto \
--js_out=import_style=commonjs:./client/src/proto/generated \
--grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:./client/src/proto/generated \
quiz.proto`;

// Execute the command
exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log('Proto files generated successfully!');
});