FROM tensorflow/tensorflow:latest

WORKDIR /usr/src/app

RUN apt-get update && \
    apt-get install -y git && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p text_classifier


RUN pip install transformers

RUN cd text_classifier && git clone https://github.com/huggingface/transformers

RUN cp -r text_classifier/transformers/examples/tensorflow/text-classification/* .

RUN pip install -r requirements.txt

COPY train_model.sh /entrypoint.sh

RUN chmod ug+x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
