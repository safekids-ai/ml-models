import {OnnxRuntimeSessionProvider} from "@safekids-ai/onnx-common";

let runtime: OnnxRuntimeSessionProvider

async function loadONNXRuntime() {
  if (!runtime) {
    try {
      // Try to load onnxruntime-web first (for Browser)
      runtime = await import("@safekids-ai/onnx-web").then(m => m.default);
      console.log("Using onnxruntime-web");
    } catch (webErr) {
      console.warn("@safekids-ai/onnx-web not found, falling back to @safekids-ai/onnx-node");

      // If onnxruntime-web fails, load onnxruntime-node
      try {
        runtime = await import("@safekids-ai/onnx-node").then(m => m.default);
        console.log("Using onnxruntime-node");
      } catch (nodeErr) {
        console.error("Both @safekids-ai/onnx-weband @safekids-ai/onnx-node failed to load.");
        throw new Error("ONNX runtime could not be loaded.");
      }
    }
  }
  return runtime;
}

export {loadONNXRuntime}

