import os from "os";
import path from "path";
import fs from "fs";
import fsp from "fs/promises";

const sampleFilesDir = path.join(import.meta.dirname, "sample-files");
if (!fs.existsSync(sampleFilesDir)) {
  fs.mkdirSync(sampleFilesDir, { recursive: true });
}

// OS module

console.log("Platform: ", os.platform());
console.log("CPU: ", os.cpus());
console.log("Total Memory: ", os.totalmem());
console.log("free memory: ", os.freemem());

// Path module

const sampleFile = path.join(sampleFilesDir, "demo.txt");
console.log("Joined path: ", sampleFile);

// fs.promises API

const run = async (fn) => {
  await fsp.writeFile(fn, "Hello from fs.promises!", "utf8");
  const data = await fsp.readFile(fn, "utf8");
  console.log("fs.promises read:", data);
};

try {
  run(sampleFile);
} catch (err) {
  console.err("error in file operations: ", err);
}
// Streams for large files- log first 40 chars of each chunk

// Bonus: Streams for large files
const largeFilePath = path.join(sampleFilesDir, 'largefile.txt');
// Always create/overwrite the large file for demonstration
const stream = fs.createWriteStream(largeFilePath);
for (let i = 0; i < 100; i++) {
  stream.write('This is a line in a large file.\n');
}
stream.end();

stream.on('finish', () => {
  const readStream = fs.createReadStream(largeFilePath, { encoding: 'utf8', highWaterMark: 1024 });
  readStream.on('data', chunk => {
    console.log('Read chunk:', chunk.slice(0, 40) + '...'); // Log first 40 chars of each chunk
  });
  readStream.on('end', () => {
    console.log('Finished reading large file with streams.');
  });
}); 
