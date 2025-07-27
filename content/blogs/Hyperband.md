# From Theory to Code: My Hyperband Sampler for Optuna

[![Chat-GPT-Image-Jul-27-2025-06-10-55-PM.png](https://i.postimg.cc/nV22mr36/Chat-GPT-Image-Jul-27-2025-06-10-55-PM.png)](https://postimg.cc/0r67RkRf)

> **Date:** May 22, 2025  
**Author:** Austin Fairbanks  
**Tags:** Machine Learning, PyTorch, TensorFlow, Keras, Optimization
**Reading Time:** 20 min read  

## What is HP Tuning and HP Optimization?

**Hyperparameter tuning** is the process of selecting and refining hyperparameters to improve the performance of a machine learning model. It ranges from choosing the value of k in k-nearest neighbors, which defines the neighborhood size, to configuring the architecture of artificial neural networks, including parameters like layer count, learning rate, batch size, and activation functions. Overall, whether through manual trial and error or a simple elementary algorithm, the goal of tuning is to find a model with **sufficient predictive performance**.

**Hyperparameter Optimization** (HPO) is a systematic, automated approach to improving machine learning model performance by identifying the most effective hyperparameter combinations. Building on basic tuning, it leverages advanced search strategies, such as **Bayesian Optimization**, **Random Search**, or other emerging algorithms, to maximize model performance within user-defined constraints. 

To aid in systematic hyperparameter optimization, a variety of frameworks and libraries provide *black box strategies* that streamline the search-space exploration. These platforms implement the abstractions of search algorithms and enable optimization without needing extensive knowledge. Popular examples include:
1. **Optuna** – A lightweight framework focused on dynamic sampling and pruning strategies.
2. **Keras Tuner** – Designed for seamless integration with TensorFlow and neural networks.
3. **HyperOpt** – Offers support for Bayesian optimization and distributed search.

For a reference on usage of some of these frameworks, please see my [**HPO MANUAL**](https://github.com/megemann/HPOptimization/blob/main/docs/HP_Optimization_Manual.pdf) on my GitHub.

## What is Hyperband?

**Hyperband** is an optimization algorithm based on the popular *n-armed bandit problem*, designed to efficiently allocate resources while balancing *exploration and exploitation*. I know it may sound intimidating right now, but it really comes down to a few simple principles, so stick with me for a little.

Imagine you're watching your favorite tournament (whether in athletics, esports, or your favorite board game) and two teams face off against each other in a winner-takes-all match. The winning team usually then advances to the next *rung* in the bracket, earning more time and *resources* to prove themselves for the championship.

Hyperband follows a similar fundamental structure, with a few optimization-based changes. Firstly, instead of teams, it evaluates configurations, promoting the top performers at each stage. Once promoted, the selected configurations receive additional *resources* to continue their model training, while the weaker contenders are eliminated early. This strategy enables Hyperband to eliminate unpromising trials quickly, avoiding wasted resources and focusing effort where it counts the most.

[![sankeymatic-20250625-220017-1200x1200.png](https://i.postimg.cc/VvZvB30R/sankeymatic-20250625-220017-1200x1200.png)](https://postimg.cc/WqrssYnF)

After establishing the bracket structure and configuration pruning method, Hyperband faces a key question: how should the brackets be populated with configurations, and how to decide when and which ones deserve more resources?

Think of it like designing a tournament where teams compete in a few best-of-five matchups rather than a single-elimination bracket. While you may not be able to host as many teams, the extended series could improve your confidence that the winning team truly earned its spot. This dilemma mirrors how Hyperband needs to address the tradeoff between **exploration** (many teams, but eliminate quickly) and **exploitation** (few teams, but evaluate thoroughly) through parameter assignment. 

Instead of deciding on a single, fixed approach, Hyperband opts to generate numerous independent brackets. Each one varies in its resource allocation approach, enabling a blend of **exploratory** and **exploitative** strategies to effectively assess a problem space. 
- Exploitative brackets run fewer trials with high resource budgets from the start. Since each trial runs to completion, there's little early elimination, meaning fewer combinations may be explored, favoring depth over diversity.
- Exploratory brackets start with low resources and many trials, aggressively pruning early-stage models to allocate more resources to the most promising candidates later on.

By balancing exploratory and exploitative strategies, Hyperband delivers reliable performance across diverse optimization landscapes, allocating resources with not only high flexibility, but also precision.

[![image.png](https://i.postimg.cc/HL3gyby0/image.png)](https://postimg.cc/677gs2zT)

Lastly, because "resources" in practice can represent training time, dataset size, or number of epochs, Hyperband lets users set a starting value, an ending value, and a strategy for scaling between them. Additionally, because developers have a wide variety of resource budgets, Hyperband also exposes a parameter that controls the aggressiveness of elimination, and in turn decides the number of brackets that Hyperband will construct. This flexibility through defined constraints allows for adaptation to any desired search space. 

## My Implementation

Now that we've covered the foundational concepts and architecture of Hyperband, we can shift gears and explore the details of the custom package I developed.

### The idea: Keras Tuner -> Optuna

While exploring various optimization frameworks for a project, I stumbled upon both Keras Tuner (Hyperparameter Optimization tool tailored for Keras) and Optuna (A general-purpose black-box optimization framework). Though I was using [PyTorch](https://pytorch.org/), I admired many aspects of Keras Tuner, particularly its tight integration and direct access to the current model's structure.

Initially, I attempted to wrap the `HyperbandTuner` class into a *pseudo* Optuna sampler; however, there are several limitations in Keras Tuner's design that make this approach impractical. For instance, Keras Tuner automatically saves model weights after each trial, enabling it to resume training from a specific epoch rather than restarting from scratch. While this feature is extremely useful within the Keras ecosystem, it doesn't translate well to PyTorch and Optuna, which were developed largely independently. Moreover, for research purposes, I needed transparency into the sampler's internal mechanics to benchmark against other algorithms within Optuna. 

These constraints ultimately led me to develop a custom Optuna sampler that manages resources in a way tailored to my use case, distinct from Keras Tuner's approach.

### The `HyperbandSampler`

#### API Reference 

``` Python
HyperbandSampler(min_resource: int, max_resource: int, reduction_factor: int = 3, seed: int = 42)
```

#### Parameters

My implementation of the `HyperbandSampler` takes the following parameters:
1. `min_resource` - represents the minimum number of resources that must be given to run a single configuration
2. `max_resource` - represents the maximum number of resources to be given at one time in a full training session
3. `reduction_factor` - decides the number of brackets as well as the elimination within them (>= 2)
4. `seed` - random seed for configuration generation

#### Brackets
Once initialized with these parameters, the sampler calls ```generate_brackets()```. But exactly how many brackets should we actually create? This is where things get interesting.

Think about it this way: if we have a massive resource budget, we could afford to run many exploratory brackets that start cheap and scale up. But if our budget is tight, we might only afford one or two brackets that are more conservative from the start. Hyperband needs to figure out the sweet spot automatically.

The algorithm approaches this by asking: "Given my min and max resource constraints, how many times can I realistically scale up by my reduction factor?" If I start with 3 resources and want to reach 100, and I'm scaling by a factor of 3 each time, that's roughly 3 → 9 → 27 → 81. That's about 4 scaling steps, which suggests I can support around 4-5 different bracket strategies.

This intuition leads us to the exact formula that determines the number of brackets. Specifically, this method constructs exactly
$$
s_{\text{max}} = \left\lfloor \frac{\log\left(\frac{\text{max\_resource}}{\text{min\_resource}}\right)}{\log(\text{reduction\_factor})} \right\rfloor + 1
$$
brackets.
These brackets run sequentially, each balancing exploration and exploitation differently while operating under the same resource budget. Because the generation of each bracket is done prior to any sampling, each bracket is independently filled with randomly generated configuration values for the models.

In terms of the pruning approach, the first bracket contains the most rungs (`s_max + 1`). With each successive bracket, the total number of rungs decreases by one. Fewer rungs means the bracket begins with fewer candidates (specifics in the next section), but can allocate more resources to each to increase selection confidence. This pattern continues until the final bracket, which runs exactly `s_max` trials, each assigned `max_resource` resources.

#### Promotion

Now that we're shifting focus to promotion, let's unpack the `reduction_factor` parameter. When promoting to the next rung, we reduce the number of configurations by exactly $\frac{1}{\text{reduction factor}}$. To compensate, we scale the resources for each remaining configuration by `reduction_factor`, ensuring that the total resource consumption matches that of the previous rung. This scaling mechanism maintains consistent resource allocation across **all brackets** and **within each individual rung**, ensuring the search space is explored uniformly while preserving a tight overall resource budget.

This strategy also provides clarity on the number of initial configurations to allocate, as to end up with exactly one configuration after $x$ rungs, we should have exactly $x \cdot$`reduction_factor` to start. With this insight, we can concretely construct a variety of possible bracket structures given the user-defined parameters.

#### Example

An example of a possible structure was shown in Figure 2 above, with `min_resource = 3`, `max_resource = 100`, and `reduction_factor = 2`.

### The `HyperbandStudy`

```Hyperband_Study(min_resource, max_resource, reduction_factor, hyperband_iterations=1, ...)```

Since our sampler only generates one set of brackets when initialized, it becomes challenging to run multiple iterations of the algorithm in succession while maintaining encapsulation within a single `Hyperband Sampler` instance. To address this, I developed the `HyperbandStudy` class, which wraps the **Optuna Study** functionality to support multiple runs of the `HyperbandSampler`. If the `hyperband_iterations` parameter is set to 1, then it simply returns a native Optuna study using the result from our sampler. However, if `hyperband_iterations` is set to **greater than 1**, it triggers a separate method called `_serial_optimize`. This method runs multiple Hyperband cycles in succession and records the best result across all iterations as the final hyperparameter value. 

The class mirrors Optuna's core Study behavior and includes overrides for all essential methods, ensuring compatibility while enabling multi-iteration optimization.

### Advanced Functionality

To match the capabilities of Optuna's other samplers, the `HyperbandStudy` and `HyperbandSampler` classes incorporate several advanced features. The overall highlights are **Multi-Objective Sampling**, **MultiProcessing**, and **Seamless Integration with the Native Optuna Library**.

One notable enhancement is its support for Multi-Objective optimization via a Pareto front. In this approach, the sampler identifies and returns a set of non-dominating solutions, meaning each solution outperforms others in at least one attribute when compared individually across the entire set.

> **Note:** This added complexity influenced the promotion logic. Our solution was to simply select a subset of the top-performing non-dominating solutions when the number exceeds the promotion quota.

Next, the framework supports parallel execution via **MultiThreading**. Hyperband introduces a unique challenge in this area: a trial's progression may depend not only on previously executed trials but also on those yet to run. This dependency chain complicates parallel execution, as the sampler cannot advance to the next rung until all trials in the current rung are completed. To support parallel execution despite the dependency limitations in Hyperband's design, the `HyperbandStudy` class enables multiple instances of `hyperband_sampler` to run independently. This behavior is controlled via the `hyperband_iterations` parameter (in `HyperbandStudy.__init__`) and the `n_jobs` parameter (in `HyperbandStudy.optimize`). This design promotes simplicity, encapsulation, and easier scalability when extending or debugging parallel optimization workflows.

Lastly, to support the research I was conducting, I implemented direct integrations with the Optuna library, ensuring that both the `HyperbandSampler` and `HyperbandStudy` classes behave almost identically to their Optuna counterparts. This compatibility allows them to slot seamlessly into existing Optuna workflows while extending functionality.

The following features were added to achieve this:
1. **Optuna-style Logging:** Supports native Optuna verbosity levels for consistent diagnostics and output behavior.
2. **Sampler Inheritance:** `HyperbandSampler` inherits from Optuna's `BaseSampler` class and overrides all necessary methods to ensure full compliance with the sampler interface.
3. **Study Compatibility:** `HyperbandStudy` includes all expected properties of a native Optuna `Study`, ensuring it can be used transparently in place of the original class.
4. **Timeout Compatibility:** the `Hyperband Study` now also implements a timeout, where no more hyperband iterations will be ran after a time threshold is hit.

> **Note:** This design choice enhances usability and modularity, enabling researchers and engineers to adopt Hyperband with minimal friction in their existing Optuna-based pipelines.

## Limitations

The biggest limitation of this implementation is the lack of intermediate epoch-checkpoint support. Unlike Keras Tuner, which automatically saves model states after each evaluation, Optuna's sampler architecture doesn't naturally support resuming from training states without breaking encapsulation. This means configurations have to restart training from scratch at each rung, even though they may have already been evaluated at lower resource levels, wasting computational time.

Additionally, Hyperband becomes much less effective on optimization problems without clear resource constraints. For tasks like optimizing discrete functions, the algorithm essentially behaves like random sampling since there's no meaningful way to "partially evaluate" the objective. Since Optuna is fundamentally a black-box optimization framework, this limitation reduces Hyperband's usefulness across problem domains where resource-based early stopping doesn't make sense.

## How to use

The `HyperbandSampler` can be applied to any black-box optimization problem, as it supports arbitrary outputs from an `objective` function. However, the sampler's architecture is particularly well-suited for resource allocation tasks.

The following code snippet is drawn from my ongoing research study and demonstrates the use of `HyperbandStudy` on the **UCI Letter Recognition Dataset**. This dataset includes *16 principal components* and is frequently used as a lightweight benchmark in machine learning experiments.

In practice, `HyperbandStudy` serves as a more versatile framework than using `HyperbandSampler` directly. The snippet illustrates a simple example of replacing a standard Optuna study with `HyperbandStudy`. While the sampler does operate seamlessly with Optuna's native `Study` class, the wrapper provides stricter usage patterns and a broader set of features, enhancing both usability and extensibility for advanced research workflows.

### Code Examples
``` Python
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader, TensorDataset
from sklearn.datasets import fetch_openml
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from hyperband_sampler import HyperbandStudy

# Load and prepare data
X, y = fetch_openml('letter', version=1, return_X_y=True, as_frame=False)
X = StandardScaler().fit_transform(X.astype('float32'))
y = LabelEncoder().fit_transform(y)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

# Convert to PyTorch datasets
train_ds = TensorDataset(torch.from_numpy(X_train), torch.from_numpy(y_train))
test_ds = TensorDataset(torch.from_numpy(X_test), torch.from_numpy(y_test))
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Define neural network model
class LetterNet(nn.Module):
    def __init__(self, trial):
        super().__init__()
        n_layers = trial.suggest_int("n_layers", 1, 3)
        hidden_sizes = []
        
        for i in range(n_layers):
            size = trial.suggest_int(f"n_units_l{i}", 32, 256)
            hidden_sizes.append(size)
        
        # Build layers
        layers = []
        in_dim = 16  # Input features
        for hidden_size in hidden_sizes:
            layers.extend([
                nn.Linear(in_dim, hidden_size),
                nn.ReLU(),
                nn.Dropout(0.2)
            ])
            in_dim = hidden_size
        
        self.layers = nn.Sequential(*layers)
        self.output = nn.Linear(in_dim, 26)  # 26 letters
    
    def forward(self, x):
        x = self.layers(x)
        return self.output(x)

# Define objective function
def objective(trial):
    # Model hyperparameters
    model = LetterNet(trial).to(device)
    lr = trial.suggest_float("learning_rate", 1e-4, 1e-2, log=True)
    batch_size = trial.suggest_int("batch_size", 32, 256)
    
    # Resource parameter controlled by Hyperband
    epochs = trial.suggest_int("resource", 1, 50)
    
    # Data loaders
    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True)
    test_loader = DataLoader(test_ds, batch_size=batch_size, shuffle=False)
    
    # Training setup
    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    criterion = nn.CrossEntropyLoss()
    
    # Training loop
    model.train()
    for epoch in range(epochs):
        for batch_x, batch_y in train_loader:
            batch_x, batch_y = batch_x.to(device), batch_y.to(device)
            
            optimizer.zero_grad()
            outputs = model(batch_x)
            loss = criterion(outputs, batch_y)
            loss.backward()
            optimizer.step()
    
    # Evaluation
    model.eval()
    correct = 0
    total = 0
    with torch.no_grad():
        for batch_x, batch_y in test_loader:
            batch_x, batch_y = batch_x.to(device), batch_y.to(device)
            outputs = model(batch_x)
            _, predicted = torch.max(outputs.data, 1)
            total += batch_y.size(0)
            correct += (predicted == batch_y).sum().item()
    
    accuracy = correct / total
    return accuracy  # Maximize accuracy

# Create and run Hyperband study
study = HyperbandStudy(
    min_resource=3,
    max_resource=30,
    reduction_factor=3,
    directions="maximize"
)

print(f"Total trials needed: {study.n_trials}")

# Run optimization
result = study.optimize(objective, timeout=3600)  # 1 hour timeout

print(f"Best accuracy: {study.best_value:.4f}")
print(f"Best parameters: {study.best_params}")
```
### Quick Parameter Comparison

To compare the impact of the `reduction_factor`, I conducted a brief experiment using the `HyperbandSampler` on the **UCI Letter Recognition Dataset**, using the same search space outlined above. This test aimed to observe how varying values of `reduction_factor` influence performance and resource allocation across different trials.

[![best-accuracy-over-time.png](https://i.postimg.cc/P5sTsXHD/best-accuracy-over-time.png)](https://postimg.cc/gnDf3Pnc)
[![lowest-loss-over-time.png](https://i.postimg.cc/W1gphD8S/lowest-loss-over-time.png)](https://postimg.cc/jDqY1SGJ)

As shown in the results, more exploitative approaches (`reduction_factor` = 4 or 5) initially achieve higher accuracy by rapidly pruning low-performing trials and allocating resources only to the most promising candidates. However, as the resource budget increases, the more exploratory strategies (`reduction_factor` = 2 or 3) tend to converge to higher accuracy and lower loss. This behavior emerges because the search space contains many configurations that yield similar results, making it beneficial to evaluate more trials with greater resource depth.

In a different search space, one where early performance is more indicative of final convergence and where resources are more of a luxury (such as training a large CNN), the more exploitative approaches may converge to a higher accuracy within a given resource limit. In summary, the lower your resource limit, the larger the reduction factor you'll need.

> **Note:** The main parameters that can be altered are `min_resource` and `reduction_factor` when tuning. `max_resource` is best guided by an initial training example and should be set at a value that prevents overfitting.

For a more comprehensive analysis of parameter tuning and performance comparisons across multiple datasets, check out my [full research study on Hyperband optimization](LINK_TO_STUDY), coming out in late summer 2025.

### Package information
- For more information on technical specifics of the `HyperbandSampler` and `HyperbandStudy`, please refer to the [GitHub repo](https://github.com/megemann/Hyperband_sampler) for the project.
- Additionally, for some real-life examples, please refer to the [**Kaggle Notebook**](https://www.kaggle.com/code/austinfairbanks/optuna-hyperband-sampler) that highlights some of the functionality described in this blog.
  

## Future Work

Moving forward, I'm planning to tackle the checkpointing challenge that's been bugging me. Right now, when a configuration gets promoted to the next rung, it has to start training from scratch instead of picking up where it left off. If I can figure out a clean way to save and restore model states between rungs, this sampler would become way more efficient. This feature would unlock the full potential of Hyperband while keeping everything compatible with PyTorch and Optuna's ecosystem.

## Conclusion

Hyperband offers a flexible, resource-aware approach to hyperparameter optimization, especially in scenarios where training costs matter and exploration needs to be strategic. By building my own implementation on top of Optuna, I was able to unlock multi-iteration control, advanced sampling features, and increased PyTorch compatibility.

I hope this blog helps shed light on both the core ideas behind Hyperband and how you can extend them for custom workflows. Feel free to fork the repo, test new datasets, and contribute improvements!

## Glossary of Key Terms
Bracket - A complete tournament-style structure in Hyperband that runs a set of configurations through multiple elimination rounds (rungs). Each bracket has a different strategy for balancing exploration vs exploitation.

Configuration - A specific combination of hyperparameters that defines a model's settings (e.g., learning rate = 0.01, batch size = 64, 3 hidden layers). Think of it as one "contestant" in the optimization tournament.

Exploration vs Exploitation - The fundamental tradeoff in optimization. Exploration means trying many different configurations to discover promising areas, while exploitation means focusing resources on refining the best-known configurations.

Hyperparameter - A setting that controls how a model learns, but isn't learned from data itself. Examples include learning rate, number of layers, batch size, or regularization strength. These are the "knobs" you tune to improve performance.

Hyperparameter Optimization (HPO) - The systematic process of automatically finding the best hyperparameter combinations using algorithms rather than manual trial-and-error.

Optuna - A popular Python framework for hyperparameter optimization that provides various sampling strategies and pruning techniques through a clean, flexible API.

Reduction Factor - The parameter that controls how aggressively Hyperband eliminates configurations. A reduction factor of 3 means each rung keeps only 1/3 of the configurations from the previous rung.

Resource - What Hyperband allocates to evaluate configurations. Usually training epochs, but could be training time, dataset size, or computational budget. More resources generally mean better evaluation quality.

Rung - A single elimination round within a bracket. Configurations compete at each rung, and only the top performers advance to the next rung with more resources.

Sampler - An algorithm that decides which hyperparameter combinations to try next. Different samplers (Random, Bayesian, Hyperband) use different strategies to explore the search space.

Trial - A single evaluation of one configuration with a specific resource allocation. The trial runs your model with those settings and returns a performance score.

## References
- [Hyperband: A Novel Bandit-Based Approach to Hyperparameter Optimization](https://arxiv.org/abs/1603.06560)
- [Keras Tuner Hyperband](https://keras.io/keras_tuner/api/tuners/hyperband/)
- [PyTorch](https://pytorch.org/)
- [UCI Letter Recognition](https://archive.ics.uci.edu/dataset/59/letter+recognition)

## Connect With Me
- [**X/Twitter**](https://twitter.com/ajfairbanksML) - Follow me for quick updates and thoughts
- [**LinkedIn**](https://linkedin.com/in/ajf2005) - Connect professionally
- [**GitHub**](https://github.com/megemann) - Check out my code and projects
- [**Email**](mailto:ajfairbanks2005@gmail.com) - Reach out directly
