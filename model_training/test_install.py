import torch, tensorflow as tf
# Both should return 'True'
print(torch.backends.mps.is_available())
print(torch.backends.mps.is_built())

print("Num GPUs Available: ", len(tf.config.experimental.list_physical_devices('GPU')))
