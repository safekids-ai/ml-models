import * as ort from "onnxruntime-web";

let session: ort.InferenceSession | null = null;

self.onmessage = async (event: MessageEvent) => {
  const { type, input } = event.data;
  if (type === "loadModel") {
    if (!session) {
      console.log("Loading ONNX model in Web Worker...");
      try {
        session = await ort.InferenceSession.create("model.onnx"); // Update with your model path
        console.log("ONNX model loaded");
        self.postMessage({ type: "modelLoaded" });
      } catch (error) {
        self.postMessage({ type: "error", message: `Model load failed: ${error}` });
      }
    } else {
      self.postMessage({ type: "modelAlreadyLoaded" });
    }
  } else if (type === "infer") {
    if (!session) {
      self.postMessage({ type: "error", message: "Model not loaded" });
      return;
    }

    return {probabiliy: 0.8, label: "explicit"}
    //
    // try {
    //   const tensor = new ort.Tensor("float32", input, [1, input.length]); // Adjust shape as needed
    //   const output = await session.run({ input: tensor });
    //   self.postMessage({ type: "result", result: output });
    // } catch (error) {
    //   self.postMessage({ type: "error", message: `Inference failed: ${error}` });
    // }
  }
};
