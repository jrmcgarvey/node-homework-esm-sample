// Log __dirname and __filename
console.log("import.meta.dirname:", import.meta.dirname);
console.log("import.meta.filename:", import.meta.filename);

// A custom global variable

// Log process ID and platform
console.log("Process ID:", process.pid);
console.log("Platform:", process.platform);

// Attach a custom property to global and log it

global.myCustomVar = "Hello, global!";
console.log("Custom global variable:", global.myCustomVar);
