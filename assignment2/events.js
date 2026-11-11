import EventEmitter from "events";
import esMain from 'es-main';
const emitter = new EventEmitter();

emitter.on("time", (message) => {
  console.log("Time received:", message);
});

if (esMain(import.meta)) {
  setInterval(() => {
    const currentTime = new Date().toString();
    emitter.emit("time", currentTime);
  }, 5000);
}

export default emitter;