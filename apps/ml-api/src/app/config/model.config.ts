export default () => ({
  nlp_onnx_path: process.env.NLP_ONNX_PATH || "model_files/nlp.onnx",
  vision_onnx_path: process.env.NLP_ONNX_PATH || "model_files/vision.onnx",
});
