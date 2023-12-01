#!/bin/sh

optimum-cli export onnx --model "google/bert_uncased_L-2_H-128_A-2" onnx
# optimum-cli onnxruntime quantize --onnx_model onnx/model.onnx --output quantized/
