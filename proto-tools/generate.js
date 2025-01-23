const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Ensure output directory exists
const outputDir = path.join(__dirname, '..', 'client', 'src', 'proto', 'generated');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Path to protoc in grpc-tools
const protocPath = path.join(__dirname, 'node_modules', 'grpc-tools', 'bin', 'protoc.exe');
const grpcWebPlugin = path.join(__dirname, 'node_modules', 'protoc-gen-grpc-web', 'bin', 'protoc-gen-grpc-web.exe');

// Proto file path
const protoPath = path.join(__dirname, '..', 'proto', 'quiz.proto');

// Command to generate JavaScript code
const command = `"${protocPath}" \
--proto_path="${path.join(__dirname, '..', 'proto')}" \
--js_out=import_style=commonjs:"${outputDir}" \
--grpc-web_out=import_style=commonjs+dts,mode=grpcwebtext:"${outputDir}" \
--plugin=protoc-gen-grpc-web="${grpcWebPlugin}" \
"${protoPath}"`;

console.log('Executing command:', command);

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error: ${error}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
    }
    if (stdout) {
        console.log(`stdout: ${stdout}`);
    }
    console.log('Proto files generated successfully!');
});