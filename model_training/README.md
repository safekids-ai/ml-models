<!---
Copyright 2023 Safe Kids LLC. All rights reserved.

See License of the Main Repository
-->

# Installation
Please use the following to train NLP and Vision model for safe kids.

## Create a Conda Environment
Please use the following commands to create a new machine learning environment on your machine. Use
of Conda is highly recommended. Please do the following to create your environment:

<b>Install the RUST compiler</b>

```console
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
# script from: https://www.rust-lang.org/tools/install
```

<b>Remove conda environment if its exists</b>

``` console
conda deactivate
conda activate base
conda remove --name ml_env --all
```

<b>Install Conda Environment</b>
```console
conda create -y --name ml_env python=3.8
conda activate ml_env
```

<b>Install Packages</b>

```console
conda install -y -c apple tensorflow-deps
python -m pip install tensorflow-macos
python -m pip install tensorflow-metal

conda install -y pytorch torchvision torchaudio -c pytorch-nightly
conda install -y -c huggingface transformers

pip install chardet onnxruntime charset_normalizer 'optimum[exporters]'
pip install charset_normalizer
```

## Install Hugging face and allow pytorch support

If you want to make changes to the release, please edit the .env file to set the relevant version
number. In this example, v4.35.2 is used.

``` console
./install_hf.sh
```

# Model Training

## Training Data
Please use the data.json with contents in the following way:

```
{"sentence1": "idiot  stop your childish wiki stalking idiot", "label": "__label__bullying_hate"}
{"sentence1": "places to get sniper rifle ammo fallout 3 gamefaqs", "label": "__label__clean"}
{"sentence1": "stoner 63 lmg review black ops cold war in depth", "label": "__label__clean"}
```

Our main dataset has around 2 million records.

## Model Training
You can execute the script below to start the training process. You run a simple sample, provide
an arguments on the number of records from the beginning of the file you would like to train. 

``` console
./train_model.sh <leave empty or provide a number for a sample data size to train>
```

## Model Testing
The model was built with from_pt=True which allows execution of the model using python. 
You can test the model after training using the following:

``` console
python run_model.py output
```

This uses the model created in the output directory and will provide a command line text input and 
will computer the label with a probability.

## Model Export to ONNX
Use the following command to convert the model to the ONNX format. 

``` console
./export_onnx.sh
```

The onnx models will be stored in the onnx directory. Please note that the model is not quantized.

