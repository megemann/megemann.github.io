# When to Torch vs. When to Flow: A TF.Keras vs. PyTorch Side-by-Side Guide


> Note: Assumes familiarity with Python, NumPy, and basic ML. Won’t cover layer types, parameters, or loss functions.
## Table of Contents
- [When to Torch vs. When to Flow: A TF.Keras vs. PyTorch Side-by-Side Guide](#when-to-torch-vs-when-to-flow-a-tfkeras-vs-pytorch-side-by-side-guide)
  - [Table of Contents](#table-of-contents)
  - [PyTorch vs TensorFlow: What's the Inspiration?](#pytorch-vs-tensorflow-whats-the-inspiration)
  - [What is PyTorch?](#what-is-pytorch)
    - [Key Features and Syntax](#key-features-and-syntax)
  - [What is TensorFlow / Keras?](#what-is-tensorflow--keras)
    - [Key Features and Syntax](#key-features-and-syntax-1)
  - [Side by Side Implementation of Identical Models](#side-by-side-implementation-of-identical-models)
    - [Basic Feed Forward Neural Network](#basic-feed-forward-neural-network)
    - [Convolutional Neural Network (CNN)](#convolutional-neural-network-cnn)
    - [Recurrent Neural Network (RNN)](#recurrent-neural-network-rnn)
    - [Training Process](#training-process)
      - [Model Evaluation](#model-evaluation)
  - [Conclusions](#conclusions)
    - [Want to find out more about PyTorch and TensorFlow?](#want-to-find-out-more-about-pytorch-and-tensorflow)
      - [Visualization Tools](#visualization-tools)
      - [Advanced Documentation](#advanced-documentation)
  - [References and Resources](#references-and-resources)
    - [Industry Surveys \& Research](#industry-surveys--research)
    - [PyTorch Resources](#pytorch-resources)
    - [TensorFlow \& Keras Resources](#tensorflow--keras-resources)


## PyTorch vs TensorFlow: What's the Inspiration?

While the roots of deep learning can be traced back to the 1940s, the field has been ever evolving since birth. With the recent rise of cheaper but powerful computing, deep learning has seen a rapid increase in popularity and a significant decrease in the barrier to entry. This has led to the development of a plethora of frameworks that simplify the construction of models, each with their own unique features, capabilities, and work-flows. In this blog post, we will be comparing two of the most popular frameworks, **TensorFlow/Keras** and **PyTorch**. This article is not intended to be a comprehensive guide to either framework, but rather to objectively compare both frameworks with identical model constructions and training processes.


## What is PyTorch?

**PyTorch** is a machine learning library that is inspired by the [Torch7](https://en.wikipedia.org/wiki/Torch_(machine_learning)) library, used in applications like NLP and computer vision. It was originally developed by Meta (formerly Facebook) AI Research in 2016 by Adam Paszke working under Soumith Chintala. According to the developers, it took main inspiration from [Chainer](https://en.wikipedia.org/wiki/Chainer), was written in C++, and was designed to optimize compute-intensive deep-learning workloads. Today, PyTorch is most popular in research and development, being present in over 70% of all machine learning research papers according to a PyTorch survey. [(PyTorch)](https://pytorch.org/blog/2024-year-in-review/?utm_source=chatgpt.com)

### Key Features and Syntax

According to [PyTorch's website](https://docs.pytorch.org/docs/stable/community/design.html), their design philosophy was: 
1. Usability over Performance.
2. Simple over Easy.
3. Python First with best in class language Interoperability. 

We can start with the foundation of PyTorch, namely the data structure called a *Tensor*. These are similar to NumPy arrays, with both storing multi-dimensional data; however, the developers added the ability to be used on GPUs and are optimized them for deep learning tasks. Using these Tensors, PyTorch implements the ```nn``` package, which is a module that provides many tools to construct and train neural networks. These include ```nn.Module, nn.Linear, nn.Conv2d, nn.ReLU, and nn.Dropout,``` all providing the basic building blocks of neural networks in a graph structure. Specifically, you define a model by creating a class that inherits from ```nn.Module``` and implements the ```forward``` method.

```python
import torch.nn as nn

class MyModel(nn.Module):
    def __init__(self, …):
        …

    def forward(self, x):
        …
```
The **```nn.Module```** class is the base class for all neural networks. It can be used to track parameters (```model.parameters()```), move the model to a GPU (```model.to('cuda')```), select model modes (```model.train()```, ```model.eval()```), and more. Without this class, the model would not have any functionality to process data it receives nor how to do any machine learning tasks.

Moving on, lets dive into the structure of the class. Firstly, the ```__init__``` method is used to define any layers or parameters that the model will use.

```python
def __init__(self, …):
    super().__init__() # Calls the __init__ method of the parent class
    self.layer = nn.Linear(in_features=10, out_features=10) # Defines a layer
```

In this method, we can initialize an instance of the any of the modules in the ```nn``` package, as well as implement any desired custom functionality.

Next, we can define the ```forward``` method to tell the model how to handle the all of its attributes defined in the ```__init__``` method with respect to input data. This is equivalent to a forward pass over a model, basically taking data as input, putting it through the model layers we defined, and then finally returning the output.

```python
def forward(self, x):
    x = nn.ReLU(self.layer(x)) # Applies the weights and biases to the input
    return x
```

We can also use the items from our parent class in the ```forward``` method, such as ```F.ReLU```, ```nn.layer```, and more. The specifics will be covered in the code comparison section.

## What is TensorFlow / Keras?

[**TensorFlow**](https://en.wikipedia.org/wiki/TensorFlow) is a software library designed for machine learning and artificial intelligence. Developed by [Google Brain](https://research.google.com/teams/brain/) in 2015, it provides wide variety of tools and features to users for building a plethora of different things; however, as of recently, its main use has been the construction of Neural Networks for deep learning. Much like PyTorch, TensorFlow itself exposes low-level graph and tensors functionality, but most newer users tend to interface with its high-level tf.keras API. 

[**Keras**](https://en.wikipedia.org/wiki/Keras) is an open-source neural network library that provides simple interface to develop deep learning models. First an independent software, it has now found its home in **Tensorflow** when it migrated to version 2.0, providing a less cumbersome approach to model development. It was developed primarily by François Chollet, under the larger research project ONEIROS during his time at Google. In our case, it uses tensorflow as a backend, which means that every call to keras is actually a call to tensorflow's core functions.

### Key Features and Syntax

The input to the model is a multi-dimensional array, similar to PyTorch. However, instead of using a custom object like a PyTorch Tensor, the model accepts *numpy arrays* or *pandas DataFrames* as input.


The key feature of Keras is the ability to build and train feed-forward neural networks without the need to define any model specific functions. This is done through the use of the [```Sequential``` class](https://keras.io/guides/sequential_model/), which allows us to build a network by simply adding layers to the model. This is an intuitive approach to model development, with no initialization of layers before hand being required. 

```python
from tensorflow import keras

model = keras.Sequential([
  keras.Input(shape=(10, 1)),
  keras.layers.Dense(10, activation="relu"),
])
```
The ```Sequential``` class requires only two things:
1. The input layer, shaped by the parameter ```shape``` passed to the constructor.
2. A list of layers to add to the model, with the last layer being the output layer.

The ```Input``` layer is used to define the structure of the input data, which allows the model to know how to handle the data it receives. A ```Dense``` layer is simply a linear layer with a defined number of neurons, and is used to define the output layer of the model.

After construction of the model, we can compile the model with the ```compile``` method, which allows us to access the methods of the model, like ```model.fit```, ```model.evaluate```, and more. This will be covered in the code comparison section.

> Note: PyTorch also implements a sequential class, but it is not as intuitive as the Keras sequential model and is not as widely used in practice.

## Side by Side Implementation of Identical Models

Let's compare the implementation of various neural network architectures and processes in both frameworks.

<style>
.comparison-table {
    width: 100%;
    border-collapse: collapse;
}
.comparison-table td {
    width: 50%;
    vertical-align: top;
    padding: 10px;
}
.comparison-table h4 {
    margin-top: 0;
}
</style>

### Basic Feed Forward Neural Network
This creates a simple feed forward neural network with 1 linear layer and 1 output layer. It takes in a 10x1 vector and outputs a 1x1 vector.
<table class="comparison-table">
<tr>
<td>
<h4>PyTorch</h4>

```python
import torch
import torch.nn as nn

class Model(nn.Module):
    def __init__(self):
        super().__init__()
        self.layer = nn.Linear(10, 100)
        self.output = nn.Linear(100, 1)

    def forward(self, x):
        x = nn.ReLU(self.layer(x))
        return self.output(x)
```
</td>
<td>
<h4>TensorFlow/Keras</h4>

```python
from tensorflow import keras

model = keras.Sequential([
  keras.Input(shape=(10, 1)),
  keras.layers.Dense(100, activation="relu"),
  keras.layers.Dense(1),
])
```
</td>
</tr>
</table>

### Convolutional Neural Network (CNN)
This creates a simple CNN model with 1 convolutional layer and 1 linear layer. It takes in a 28x28x1 image and outputs a 10x1 vector.
<table class="comparison-table">
<tr>
<td>
<h4>PyTorch</h4>

```python
class Model(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 32, kernel_size=3, padding=1)
        self.linear = nn.Linear(32*7*7, 10)

    def forward(self, x):
        x = nn.ReLU(self.conv1(x))
        x = x.view(-1, 32*7*7)
        x = nn.ReLU(self.linear(x))
        return self.linear(x)
```
</td>
<td>
<h4>TensorFlow/Keras</h4>

```python
model = keras.Sequential([
  keras.Input(shape=(28, 28, 1)),
  keras.layers.Conv2D(32, kernel_size=(3, 3), activation="relu"),
  keras.layers.Flatten(),
  keras.layers.Dense(10, activation="softmax")
])
```
</td>
</tr>
</table>

### Recurrent Neural Network (RNN)
This creates a simple RNN model with 1 RNN cell and 1 linear layer. It takes in a 32x1 vector and outputs a 10x1 vector.
<table class="comparison-table">
<tr>
<td>
<h4>PyTorch</h4>

```python
class CustomRNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.rnn_cell = nn.RNNCell(
            input_size=self.input_size,
            hidden_size=self.hidden_size
        )

    def forward(self, x):
        batch_size = x.size(0)
        seq_len = x.size(1)

        h = torch.zeros(batch_size, self.hidden_size)
        for t in range(seq_len):
            h = self.rnn_cell(x[:, t, :], h)
            
        return h
```
</td>
<td>
<h4>TensorFlow/Keras</h4>

```python
model = keras.Sequential([
    keras.Input(shape=(None, 32)), 
    keras.layers.SimpleRNN(64),   
    keras.layers.Dense(10)     
])
```
</td>
</tr>
</table>

### Training Process
Training a model is a process that involves the following steps:
1. Define the model
2. Compile the model
3. Train the model
4. Evaluate the model

**Notes**
- PyTorch refers to the loss function as a criterion, while TensorFlow/Keras refers to it as a loss.
- PyTorch uses the ```torch.optim``` package to optimize the model, while TensorFlow/Keras uses the ```model.compile``` method with an optimizer passed as an argument.
- PyTorch does not require a DataLoader object to train the model, however it is a good practice to use one for more complex datasets.

<table class="comparison-table">
<tr>
<td>
<h4>PyTorch</h4>

```python
model = YourModel()
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.parameters())

train_loader = torch.utils.data.DataLoader(
    train_dataset, batch_size=32, shuffle=True
)
val_loader = torch.utils.data.DataLoader(
    val_dataset, batch_size=32
)

num_epochs = 10
for epoch in range(num_epochs):
    model.train() # training mode
    running_loss = 0.0
    for i, (inputs, labels) in enumerate(train_loader):
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, labels)
        
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item()
    
    print(f'Epoch {epoch+1}/{num_epochs}, Loss: {running_loss/len(train_loader):.4f}')
    
    # Note: Add validation phase here using eval code.
```
</td>
<td>
<h4>TensorFlow/Keras</h4>

```python
model.compile(
    optimizer='adam', 
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

history = model.fit(
    x_train, y_train,
    batch_size=32,
    epochs=10,
    validation_data=(x_val, y_val),
)
```
</td>
</tr>
</table>

#### Model Evaluation
<table class="comparison-table">
<tr>
<td>
<h4>PyTorch</h4>

```python
model.eval() # evaluation mode
with torch.no_grad():
    outputs = model(x_test)
    _, predicted = torch.max(outputs.data, 1)
    total += labels.size(0)
    correct += (predicted == labels).sum().item()

accuracy = 100 * correct / total
```
</td>
<td>
<h4>TensorFlow/Keras</h4>

```python
test_loss, test_accuracy = model.evaluate(x_test, y_test)

predictions = model.predict(x_test)
predicted_classes = np.argmax(predictions, axis=1)
```
</td>
</tr>
</table>


## Conclusions
As shown above, the implementation of a model is much more concise in Keras; however, the flexibility and customizability of PyTorch can be very advantageous when working with more complex models or datasets. Even after a deep dive into these frameworks, there still exists many questions that can be asked and answered about what framework is better for a given task. Having seen an objective overview of the two frameworks, we hope you can decide what may work better for your intended use case.

### Want to find out more about PyTorch and TensorFlow?

#### Visualization Tools
- **PyTorch**: [Torch Vision](https://pytorch.org/vision/stable/index.html) - Visualize and work with computer vision models
- **TensorFlow**: [TensorBoard](https://www.tensorflow.org/tensorboard) - Visualize metrics, model graphs, and training progress

#### Advanced Documentation
- **PyTorch**: [Official Documentation](https://pytorch.org/docs/stable/index.html) - Comprehensive API reference and tutorials
- **TensorFlow**: [Advanced ML Resources](https://www.tensorflow.org/resources/learn-ml/theoretical-and-advanced-machine-learning) - Theoretical and advanced machine learning concepts

## References and Resources

### Industry Surveys & Research
- [Stack Overflow Developer Survey 2024: ML Frameworks](https://survey.stackoverflow.co/2024/technology#1-other-frameworks-and-libraries)
- [NeurIPS Paper: PyTorch vs TensorFlow Analysis (2019)](https://proceedings.neurips.cc/paper_files/paper/2019/file/bdbca288fee7f92f2bfa9f7012727740-Paper.pdf)

### PyTorch Resources
- [PyTorch: 2024 Year in Review](https://pytorch.org/blog/2024-year-in-review/)
- [PyTorch Design Philosophy](https://docs.pytorch.org/docs/stable/community/design.html)
- [PyTorch Tutorials](https://docs.pytorch.org/tutorials/)
- [Torch (PyTorch predecessor) - Wikipedia](https://en.wikipedia.org/wiki/Torch_(machine_learning))
- [Chainer (PyTorch inspiration) - Wikipedia](https://en.wikipedia.org/wiki/Chainer)

### TensorFlow & Keras Resources
- [TensorFlow - Wikipedia](https://en.wikipedia.org/wiki/TensorFlow)
- [Keras - Wikipedia](https://en.wikipedia.org/wiki/Keras)
- [Keras Sequential Model Guide](https://keras.io/guides/sequential_model/)
