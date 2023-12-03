#!/bin/sh

# Get the release of hugging face
source ./env.sh

rm -rf $HF_DIR
wget -P $HF_DIR https://github.com/huggingface/transformers/archive/refs/tags/$HF_RELEASE_TAG.zip
unzip $HF_DIR/$HF_RELEASE_TAG.zip -d ./$HF_DIR

HG_TR_DIR=$(ls -d $HF_DIR/* | head -n 1)
echo "Hugging face directory: "$HG_TR_DIR

# Copy the requirements and install it
HF_TEXT_EXAMPLES_DIR=$HG_TR_DIR/examples/tensorflow/text-classification
cp -r $HF_TEXT_EXAMPLES_DIR/* $HF_DIR/
pip install -r $HF_DIR/requirements.txt

# we are going to dynamically add a from_pt to True so we can run this model in PyTorch
TC_FILE=$HF_DIR/run_text_classification.py
sed -i '' 's/model_path,/model_path,from_pt=True,/g' $TC_FILE

