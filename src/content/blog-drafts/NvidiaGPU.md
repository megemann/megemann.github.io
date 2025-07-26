# short crash course: GPU's for ML

## How are ML and GPUs related
### Whats ML - a review
- ML involves agents learning from data
- Large amounts of data preprocessing, cleaning, transformations are computationally expensive
- Lots of small, repeated, calcuation

COMPRESS

Machine Learning (**ML**) is a subfield of artificial intelligence that focus on developing algoirthms that allow computers to learn from data, essentially improving their performance on a specific task without needing explicit code changes. These tasks usually include pattern reconginition from datapoint to datapoint, which are 'learned' after exposure to a large sum of training data.

The hardest obstacle to machine learning is not the algorithms itself, but rather the **data itself**. If each dataset was truly indictive and clean, machine learning would have an easy task; however, data collection and processing is not a clean process in itself. Time after time, unintentional biases and 'dirt' are introduced into data that can impact the quality of a model. This is why having a **large amount of data** in machine learning is important. It reduces the impact of a singular, corrupted data point and allows the model to increase its confidence in its predictions.

While data is still the most important part of machine learning, the algorithms also play a siginifigant role in the quality of output. For example, simple linear regression models (algorithms that fit a 'line' to the data) have limitations to the data they can represent (linear relationships). While simple and effective, sometimes having numerous linear models between features can provide a signifigant increase in performance for complex datasets, as there could be some nonlinear trends in the data. This is where **Neural Networks** come in, which leverage a massive amount traditional linear models to represent non-linear relationships through the use of non-linear activation function. At each layer of a network, each node generally extracts a different type of relationship between the features in the data, usually only depending on the output of the layers before it. This output is then passed through this activation function, which transforms our outputs into non-linear space.

It completely fine if you do not completely understand a neural network after this introduction; The main takeaway should simply be that we have a problem, aka. the **deep learning** problem. That is, the more feature relationships we attempt to represent, the more our model grows in size, and the more resources it takes to train, which is the main limiting factor in generating increasingly complex models.

### Whats a GPU
- Graphics Processing unit
- Compare to CPU counterpart
- Explain what its usually used for

A Graphics Processing unit (**GPU**) is a specialized electronic circuit designed for digital image processing and to accelerate computer graphics. These are usually located in *Graphics Card*, inserting into large computers or data centers. The card contains all the accessories to the GPU, like memory (VRAM), fans, and power input. Made of silicon, there are thousands of tiny cores etched into the card, each designed to preform tiny calculations, for example, computing a slight transformation for a pixel on a screen. These cores have many different names, but we will refer to them as **CUDA** cores for the sake of machine learning.

In the relm of computing, we can compare the GPU to another processing unit, namely the **CPU**. The **CPU**, aka Central Processing unit, was designed to be the brain of the computer, which processes generated instructions in a fetch, decode, execute loop, that run a machine. Because they are designed for a lesser parallel, but more complicated task, CPU's contain only a few cores (from 4 to a few dozen) compared to a GPUs thousands.

### Perfect Union
REWORD
As described before, one of ML's main problem is scaling. The more data we have collected to train a massive model to indentify increasingly complex relationships, the more resources that are needed to train that model (whether that be time or more processing power); however, we have yet to talk about the true 'structure' of a typical machine learning problem. 

In computing, the term **embarrassingly parallel** describes a problem that is extremely easy, almost *embarrassingly* easy, to be split into problems that can be solved concurrently, aka. in *parallel*. Fundamentally, these problems usually have a massive amount of **independent jobs** that can be ran without any syncronization between them.

Now recall the general structure of a *Neural Network*: a collection **layers**, all made of different nodes that represent a different relationship between features. Since each node in a layer is **nearly independent** of the output of the other nodes in its current layer, we transform the computation of each feature from **serial space** to **parallel space**, computing all of our simple relationships in **parallel**. 

Now you may be wondering, *how does this relate to GPUs?* Well, the entire indea behind the GPU was computing small deltas, or simple calculations, on each pixel in a screen based on the input it recieved from whatever program was feeding it visual information. Since each node in our network is really just representing a function that preforms a simple calcuation using the input of the layers before it, we can leverage all these small cores to do our simple calculations rather than using our complex CPU cores that are way overkill for the task at hand. In doing so, we scale our computational power and the speed at which we can compute these feature relationships.

## What methods are there?
### NVIDIA Cuda-Toolkit
- Explain CUDA and Nvidias architectures and ecosystem
- Explain how it connect easily to deep learning

The most common architecture for leveraging GPU's for parallel computation is called CUDA (Compute Unified Device Architecture). Provided by NVIDIA for only their line of Graphics Cards, CUDA is computing platform and programming model (API) that allows for a simple interface into accessing GPU computing. This expands the use of GPUs past simply Graphics and rather allows for gneral use development for any massively-parallel computing uses. At a micro level, CUDA compiles code first to **PTX** (Parallel Thread Execution), an intermediate instruction set, before finally reaching the GPU's real hardware.  this software layer gives direct access to the GPU's virtual instruction set and parallel computational elements for the execution of compute kernels

**RESEARCH PTX, LOW LEVEL STUFF, AND SM'S**

In addition to drivers and runtime kernels, the CUDA platform includes compilers, libraries and developer tools to help programmers accelerate their applications.

The reason that CUDA is so widely used is not only because of the simple API that allows for low-level developers to access the GPU, but rather the plethora of software availble that uses CUDA to implement higher-level interfaces that can perform higher level computing tasks. Libraries such as PyTorch, Tensorflow, and OpenCV all natively leverage CUDA for parallel processing. 

For native installation, their toolkit not only provides the API for programming, but also a set of tools for GPU development. This includes toools like the **Nsight** profiler, GPU debuggers, and the direct compiler **nvcc**.


### ROCm

While CUDA may be the most common, the software only works for NVIDIA GPU's, so many companies have started developing their own API's for programming natively on their GPUs. A prime example of this is **ROCm**, AMD's open-source software stack designed specifically for AI and HPC (High Process Computing) development.

**ROCm** is paving the way for open source parallel computing ecosystems to be more visible during development; However, the lack of maturity and integration does limit the usability in most professional and personal settings. To name a few, ROCm has a lack of optimization, is mostly only availible on linux-based machines, and has a growing but small ecosystem compared to CUDA. That being said, both ROCm and CUDA are availible for us in Deep Learning through CUDA native ports. For more information on setup and usage of **ROCm** please refer to the *Links and References* section.

### Open CL
The final, most versatile language is OpenCL (Open Computing Language), which is an open source, royalty-free standard for cross-platform, parallel programming of diverse accelerators (Like PCs, Cloud Servers, and even super computers). It was designed to be a uniformly designed interface into any hetergenous computing system (More than one processor core) imaginable. It allows developer to launch compute kernels written using a limited subset of the C programming language on a GPU.

Although OpenCL does have a big performance hit compared to NVIDIA's CUDA and AMD's ROCm, developers needing uniformity accross many different devices from different providers can leverage OpenCL for much easier development. For more information on OpenCL, please refer to the *Links and References* section.

## How do I do this on my own?
- Local startup references
- Google cloud, other GPU resources
- Hint at parallel

Since CUDA is the most widely used API, all of the examples I will provide in this blog will be related to their architecture. However, if you are searching for a more in depth guide to using either ROCm or OpenCL with references, refer to the ROCm and OpenCL section in *Links and References*

### Installation

Local installation of CUDA varies depending on what system your GPU is running on, as well as what package manager you want to use.

**Methods:**
1. Conda: https://anaconda.org/nvidia/cuda
2. Local (Linux): https://developer.nvidia.com/cuda-downloads?target_os=Linux&target_arch=x86_64
3. Local (Windows): https://developer.nvidia.com/cuda-downloads?target_os=Windows&target_arch=x86_64
4. Docker: https://hub.docker.com/r/nvidia/cuda

Additionally, for version control, please refer to the NVIDIA [compute capability guide](https://developer.nvidia.com/cuda-gpus) and this [stack overflow thread](https://stackoverflow.com/questions/28932864/which-compute-capability-is-supported-by-which-cuda-versions) on compatible versions

### Code Integration: Python
To give an example of how simple high level interfacing is with CUDA, specifically for deep learning, we can reference PyTorch native support for GPU training by a single line code change (assuming that CUDA is installed on your system).

``` python
# Change a model or a tensor to be located on cpu
tensor.to('cuda')

# Check if cuda is available on your system
torch.cuda.is_available()

# Dynamic device allocation (Works with both CPU and GPU)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
tensor.to(device)
```

For more Python integration examples, view this [NVIDIA reference](https://developer.nvidia.com/cuda-python)

### Code Integration: Coding in CUDA

> Note: to compile CUDA code you MUST use the local installation, not conda or docker

To code through CUDA's API, you only have to follow three steps:

1. Download CUDA-toolkit directly on a CUDA compatible system
2. Create a .cu file, which will interface using the CUDA (close to C++) language
3. execute using the NVCC compiler

Here's a code snippet and how to run it in a terminal.

``` C
// filename: vector_add.cu
#include <stdio.h>

__global__ void add(int *a, int *b, int *c, int N) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < N)
        c[i] = a[i] + b[i];
}

int main() {
    const int N = 10;
    int h_a[N], h_b[N], h_c[N];
    for (int i = 0; i < N; i++) {
        h_a[i] = i;
        h_b[i] = 2 * i;
    }

    int *d_a, *d_b, *d_c;
    size_t size = N * sizeof(int);
    cudaMalloc(&d_a, size);
    cudaMalloc(&d_b, size);
    cudaMalloc(&d_c, size);

    cudaMemcpy(d_a, h_a, size, cudaMemcpyHostToDevice);
    cudaMemcpy(d_b, h_b, size, cudaMemcpyHostToDevice);

    add<<<1, N>>>(d_a, d_b, d_c, N);

    cudaMemcpy(h_c, d_c, size, cudaMemcpyDeviceToHost);

    for (int i = 0; i < N; i++)
        printf("%d + %d = %d\n", h_a[i], h_b[i], h_c[i]);

    cudaFree(d_a); cudaFree(d_b); cudaFree(d_c);
    return 0;
}
```

Now execute through the terminal
``` bash
# Compile with nvcc
nvcc vector_add.cu -o vector_add

# Run the executable
./vector_add
```

### Through the Cloud

Most cloud computing services have CUDA services already installed, and allow for easy use. Some possible methods that you can use are:
1. AWS (Amazon EC2 with NVIDIA GPUs)
    - Instance types: g4, g5, p3, p4, etc.
    - You can SSH into the VM, install the CUDA toolkit, and run/compile .cu files using nvcc.
    - Supports custom kernel development, PyTorch/TensorFlow, and CUDA-native C++ apps.
2. Google Cloud (GCE with GPU accelerators)
    - Supports NVIDIA GPUs like A100, V100, T4.
    - You can pre-install CUDA via Deep Learning VMs or roll your own.
    - Full nvcc compilation and device memory management are available.
3. Microsoft Azure (N-series VMs)
    - VM series like NC, ND, NV with full support for CUDA toolkits.
    - Use either the Data Science VM or a custom image and install the full stack.

For a more in depth guide on CUDA C++ development, please view this [cuda blog](https://developer.nvidia.com/blog/easy-introduction-cuda-c-and-c/#:~:text=CUDA%20Programming%20Model%20Basics,the%20device%20to%20the%20host.)

## Where is there to go from here?

There are many sophisticated libraries that provide high level interfacing into complicated cuda background code. Since this blog is specifically about Machine Learning, I chose to review the popular data science libraries that leverage CUDA Acceleration. Referenced from [https://developer.nvidia.com/machine-learning](https://developer.nvidia.com/machine-learning)

### Rapids
Much of the new data science work is focused an open source project called **RAPIDS**. **RAPIDS** relies on NVIDIA CUDA primitives for low-level compute optimization, but exposes GPU parallelism and high-bandwidth memory speed through user-friendly Python interfaces. Here are a few examples of the libraries it implements:
1. CuDF - DataFrame analytics (like pandas)
2. cuML - Simple Machine learning methods (like scikit-learn)
3. cuGraph -Graph analytics
4. cuDNN - Deep Learning
as well as a few additional, less popular libraries.

### Linear Algebra and Math Libraries

- cuBLAS: fast GPU-accelerated implmentation of the standard basic lienar algebra subroutines
- cuSPARSE: same as cuBLAS, but for sparse matrices
- cuSOLVER: Dense and Sparse solver to accelerate linear optimization applications

### Parallel Algorithms Libraries

- NCCL: multi-GPU and multi-node communcation links that are performance optimized for NVIDIA GPUs
- Thrust: Provides a flexible, high-level interface for GPU programming

## Links and references
- https://en.wikipedia.org/wiki/Graphics_processing_unit
- https://en.wikipedia.org/wiki/CUDA
- ROCm:
    - Setup: https://rocm.docs.amd.com/projects/install-on-windows/en/latest/how-to/install.html
    - Libaries: https://rocm.docs.amd.com/en/latest/compatibility/ml-compatibility/pytorch-compatibility.html
    - Developer Hub: https://www.amd.com/en/developer/resources/rocm-hub.html
    - Benchmarking: https://www.databricks.com/blog/amd-mi250
- OpenCL:
    - Docs: https://www.khronos.org/opencl/
    - Nvidia Integration: https://developer.nvidia.com/opencl
    - Guide: https://github.com/KhronosGroup/OpenCL-Guide
      