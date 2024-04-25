export interface ModelConfig {
  nlp_onnx_path: string
  vision_onnx_path: string
}

export default () => ({
  modelConfig: {
    nlp_onnx_path: process.env.NLP_ONNX_PATH || "model_files/nlp.onnx",
    vision_onnx_path: process.env.VISION_ONNX_PATH || "model_files/vision.onnx",
  } as ModelConfig
});
