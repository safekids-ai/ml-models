#!/bin/sh

source ./env.sh

# clean older run's
rm -rf output
rm -rf onnx

DATA_SIZE=$(grep -c '.' data.json)
echo "'Number of records in complete data set: $DATA_SIZE"

# set a different size for a smaller run. remove me when production build
if [ -n "$1" ]; then
  if [[ $1 =~ ^[0-9]+$ ]]; then
    DATA_SIZE=$1
  else
    echo "Error: Argument is not a number"
  fi
fi

echo "'Number of records in model training data set: $DATA_SIZE"

head -n $DATA_SIZE ./data.json > sample.json

python $HF_DIR/run_text_classification.py \
       --model_name_or_path "google/bert_uncased_L-2_H-128_A-2" \
       --train_file ./sample.json \
       --output_dir output \
       --do_train True \
       --num_train_epochs 5 \
       --max_seq_length 48 \
       --save_steps 1000 \
       --save_total_limit 6 \
       --per_device_train_batch_size 32 \
       --per_device_eval_batch_size 8 \
       --do_eval \
       --evaluation_strategy epoch
