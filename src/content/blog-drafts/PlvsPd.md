# Polars vs Pandas

## Why Polars? Why Pandas? Why now?

In the world of Data Science, tabular data is a widespread method to store information for analysis, transformations, and machine learning model inputs. You can imagine this as a 2D matrix, with each column usually representing a *feature,* and each row representing a *sample* that contains *features.* In Python, a common high-level general-purpose programming language, there exists many libraries that implement the properties of a DataFrame. Since 2010, a library called **Pandas** has been the usual choice, being widely used for Finance, Data Science, and Economics in both industry and research. However, with the recent rise of efficiency in computing and memory, datasets are exploding in size; this has allowed some competition, like **Polars**, to start to flourish in the space. With **Polars** creating all this buzz, now is a better time than ever to explore the advantages and disadvantages each provide.

## What is Pandas?

**Pandas** (referring to **Pan**el **da**ta) was created by [Wes McKinney](https://wesmckinney.com/) during his time as a researcher at AQR Capital from 2007-2010. Originally developed for time-series economic data, it has expanded to be used in a wide variety of industries today.

On a technical level, pandas implements two different dataframe objects: A **Series** and a **DataFrame**.
1. Series: A 1D labeled and singularly typed array
2. DataFrame: 2D labeled, resizable tabular structure with possibly multi-typed columns

Pandas was developed using **[NumPy](https://numpy.org/)**, essentially adding a layer on top of their native array to support DataFrame specific operations. Since NumPy arrays are heavily integrated into many other libraries, (matplotlib, keras, etc.) pandas merges well into any project.

### Under the hood

Functionally, a Pandas DataFrame is represented by the following, just with names for the columns / row.
 
$$
\begin{array}{ccc}
\text{col}_1 & \text{col}_2 & \text{col}_3
\end{array}
\\
\begin{bmatrix}
\textcolor{red}{a_{11}} & \textcolor{red}{a_{12}} & \textcolor{red}{a_{13}} \\
\textcolor{orange}{a_{21}} & \textcolor{orange}{a_{22}} & \textcolor{orange}{a_{23}} \\
\textcolor{green}{a_{31}} & \textcolor{green}{a_{32}} & \textcolor{green}{a_{33}}
\end{bmatrix}
$$

However, NumPy was created using a **Row-Major Structure**, meaning each row of the frame is stored contiguous in memory. So, the storage of the elements looks a little more like this: 

$$
\begin{array}{|c|c|c|c|c|c|c|c|c|}
\hline
\textcolor{red}{a_{11}} & \textcolor{red}{a_{12}} & \textcolor{red}{a_{13}} &
\textcolor{orange}{a_{21}} & \textcolor{orange}{a_{22}} & \textcolor{orange}{a_{23}} &
\textcolor{green}{a_{31}} & \textcolor{green}{a_{32}} & \textcolor{green}{a_{33}} \\
\hline
\end{array}
$$

This allows for easy access to rows in memory, with no bit offset being required. In contrast, when accessing columns, items are spread much farther apart in memory and must be accessed individually.

### Syntax

Pandas offers a flexible, indexing-based syntax for working with tabular data. DataFrames behave similarly to Python dictionaries, where columns can be accessed by name and a variety of intuitive methods support querying, filtering, and transforming data.

**Selecting Columns**
``` python
df[["col1", "col2"]]
```

**Adding Columns**
``` python
df["col100"] = df["col3"] > 80
```

**Selecting at positions**
``` python
# Get row at position 2
df.iloc[2]

# Get column at index 1
df.iloc[:, 1]

# Get element at row 1, col 2
df.iloc[1, 2]
```

**Copying the array**
``` python
df.copy()
```


## What is Polars?

**Polars**, aka. the new kid on the block, is a highly-optimized DataFrame library developed in 2020 by [Ritchie Vink](https://www.ritchievink.com/) as a side project. The inspiration for Polars originated from a growing need for a DataFrame library specifically designed with massive datasets in mind, while still providing an easy-to-use interface. Originally implemented under-the-hood in Rust, Polars supports 3 languages (Rust, Python, and JS) with two more in development (R, Ruby).

On their page, they provide a philosophy of:
> 1. Utilizes all available cores on your machine.
>2. Optimizes queries to reduce unneeded work/memory allocations.
>3. Handles datasets much larger than your available RAM.
>4. A consistent and predictable API.
>5. Adheres to a strict schema (data-types should be known before running the query).

Polars also implements the exact same **Series** and **DataFrame** objects as Pandas, with the same structure and naming. 

### Under the hood 

Much like Pandas, a DataFrame looks much like a 2D matrix, with the same names for columns and possibly rows.
$$
\begin{array}{ccc}
\text{col}_1 & \text{col}_2 & \text{col}_3
\end{array}
\\
\begin{bmatrix}
\textcolor{red}{a_{11}} & \textcolor{red}{a_{12}} & \textcolor{red}{a_{13}} \\
\textcolor{orange}{a_{21}} & \textcolor{orange}{a_{22}} & \textcolor{orange}{a_{23}} \\
\textcolor{green}{a_{31}} & \textcolor{green}{a_{32}} & \textcolor{green}{a_{33}}
\end{bmatrix}
$$
The first main difference occurs in the storage of dataframes, where each **column** is stored contiguous in memory, a big difference from the **row** focus of pandas. This is called **Column-Major Storage**
$$
\begin{array}{|c|c|c|c|c|c|c|c|c|}
\hline
\textcolor{red}{a_{11}} & \textcolor{orange}{a_{21}} & \textcolor{green}{a_{31}} &
\textcolor{red}{a_{12}} & \textcolor{orange}{a_{22}} & \textcolor{green}{a_{32}} &
\textcolor{red}{a_{13}} & \textcolor{orange}{a_{23}} & \textcolor{green}{a_{33}} \\
\hline
\end{array}
$$
This shifts the penalties to be incurred when accessing entire **rows** instead of **columns**

### Syntax

Polars uses an expression-based syntax designed for high performance. Unlike Pandas, operations are syntactically similar to *database querying* on DataFrames, allowing for much more complex yet easy-to-understand queries.

**Selecting Columns**
``` python
df.select(["col1", "col2"])
```

**Adding Columns**
``` python
df = df.with_columns((pl.col("col3") > 80).alias("col100"))
```

**Selecting at positions**
``` python
# Get row at position 2
df.row(2) 

# Get column at index 1
df[:, 1] 

# Get element at row 1, col 2
df[1, 2]
```

**Copying the array**
``` python
df.clone()
```

### Optimize it: the LazyFrame

Another major addition to the Polars library was the development of the **LazyFrame** in late 2020. Although it does not support all of the operations the Eager DataFrame does (execute operations immediately), it optimizes your query to be executed in the order that takes the least amount of computational resources, and delays collection and storage until explicitly ordered. The LazyFrame was designed for *query chaining*, where operations are made on a DataFrame in succession. 

**An Example Query**
``` python
query = (
    lf
    .filter(pl.col("col1") > 15)
    .with_columns(
        (pl.col("col1") * pl.col("col2")).alias("col4")
    )
    .groupby("group")
    .agg([
        pl.col("col3").mean().alias("avg_col3"),
        pl.col("col4").sum().alias("total_col4")
    ])
    .sort("total_col4", descending=True)
)
```

To execute a query of operations, just run ```.collect()``` on the DataFrame.

**Executions**
``` python
df = query.collect()
```

## Side by Side Implementation

### Core DataFrame Operations
_________________
#### Column & Row Selection
**Pandas**
``` Python
col = df['col1']
row = df.iloc[0, :]
```

**Polars**
``` Python
col = df.select("col1")
row = df.row(0)
```

#### Filtering with conditions
**Pandas**
``` Python
df = df[df['col1'] > 0.5]
```

**Polars**
``` Python
df = df.filter(pl.col("col1") > 0.5)
```

#### Adding new columns
**Pandas**
``` Python
df['new_col'] = df['col1'] + 2
```

**Polars**
``` Python
df = df.with_columns((pl.col("col1") + 2).alias("new_col"))
```
________________________________
### Aggregation & Transformation
___________________________________

#### Groupby with aggregations
**Pandas**
``` Python
df = df.groupby('col_2')['col1'].mean()
```

**Polars**
``` Python
df = df.group_by('col_2').agg(pl.col('col1').mean())
```

#### Chained expressions vs method calls

We start with boolean masking to filter rows where ```col0``` is greater than 0.5. Then, we sort by ```col1``` in descending order. After sorting, we group by ```col2``` and compute the mean of ```col0```. Finally, we scale the resulting mean values in ```col0``` by multiplying them by 2, storing the result in a new column called ```col0_scaled```.

**Pandas**
``` Python
df = df[df["col0"] > 0.5]
df = df.sort_values("col1", ascending=False)
df = df.groupby("col2")["col0"].mean().reset_index()
df["col0_scaled"] = df["col0"] * 2
```

**Polars**
``` Python
df = (
    df.filter(pl.col("col0") > 0.5)
      .sort("col1", descending=True)
      .group_by("col2").agg(pl.col("col0").mean())
      .with_columns((pl.col("col0") * 2).alias("col0_scaled"))
)
```
#### Arithmetic between columns
**Pandas**
``` Python
df["sum"] = df["col1"] + df["col2"]
df["diff"] = df["col1"] - df["col2"]
df["prod"] = df["col1"] * df["col2"]
df["ratio"] = df["col1"] / df["col2"]
```

**Polars**
``` Python
df = df.with_columns([
    (pl.col("col1") + pl.col("col2")).alias("sum"),
    (pl.col("col1") - pl.col("col2")).alias("diff"),
    (pl.col("col1") * pl.col("col2")).alias("prod"),
    (pl.col("col1") / pl.col("col2")).alias("ratio"),
])
```
____________________
### Performance Patterns
______________________________________

#### Lazy vs eager evaluation
**Pandas**
``` Python
df = df[df["col0"] > 0.5]
df = df.sort_values("col1", ascending=False)
df["col0_scaled"] = df["col0"] * 2
```

**Polars**
``` Python
df = (
    df.lazy()
      .filter(pl.col("col0") > 0.5)
      .sort("col1", descending=True)
      .with_columns((pl.col("col0") * 2).alias("col0_scaled"))
      .collect()
)
```

*Lazy execution* defers computation until explicitly triggered (e.g. with ```.collect()```), allowing Polars to optimize the query as a whole. This leads to big performance wins, especially with complex pipelines or large datasets.

#### Memory handling with large files
**Pandas**
``` Python
df = pd.read_csv("large_file.csv", chunksize=100_000)
df = pd.concat(chunk[chunk["value"] > 0.5] for chunk in df)
```

**Polars**
``` Python
df = pl.read_csv("large_file.csv", low_memory=True)
df = df.filter(pl.col("value") > 0.5)
```
Polars uses Arrow memory under the hood and supports memory-mapped reading. It's significantly more memory-efficient, and lazy mode only pulls what's needed for computation.

#### Apply vs expressions

**Pandas (apply, slower on large data)**
``` Python
df["double"] = df["col1"].apply(lambda x: x * 2)
```

**Polars (expression engine, SIMD-optimized)**
```Python
df = df.with_columns((pl.col("col1") * 2).alias("double"))
```

Polars expressions are compiled down to fast native instructions. Avoiding ```.apply()``` equivalents is key to maximizing performance.
> Note: The lazy API **does not** implement apply equivalents

## Short Benchmarking

In Machine Learning, datasets are incredibly diverse. You may have a dataset with a huge amount of rows and only a few features, or possibly one with a ton of features but only a few datapoints. To cover all cases, we can sort tabular datasets into three categories: **Column Dominated**, **Balanced**, or **Row Dominated.** In order to evaluate the effectiveness of these libraries, I formulated a benchmarking suite filled with these possible shapes, sizes, and mixes of data. 
For my benchmarking tests, I created dataframes filled with random numbers, each containing the same total number of elements. I compared performance across Pandas, Polars Eager, and Polars Lazy implementations while testing the following operations:

1. Arithmetic
2. Filtering
3. Grouping
4. Insertion
5. Merging
6. Sorting
7. Chaining Pipeline

Let's dive straight into the results.

### Pipeline Operations

<div align="center">
  <img src="https://i.postimg.cc/ZYPzsGPQ/pipeline-bar-benchmark.png" alt="Pipeline Operations Bar Chart">
  <img src="https://i.postimg.cc/PrtsgS25/pipeline-line-benchmark.png" alt="Pipeline Operations Line Chart">
</div>

*Figure 1a (bar) shows that Polars eager is extremely slow for column-heavy dataframes (left side), while Polars Lazy performs competitively across most shapes. Figure 1b (line) illustrates the dramatic performance differences across data shapes, with Pandas maintaining consistent performance while Polars shows significant variation. Notably, Pandas excels with column-dominated datasets, while Polars Lazy becomes increasingly competitive as datasets become more row-dominated.*

### Groupby Operations

<div align="center">
  <img src="https://i.postimg.cc/hjFNpsXg/groupby-bar-benchmark.png" alt="Groupby Operations Bar Chart">
  <img src="https://i.postimg.cc/4ysqT3vS/groupby-line-benchmark.png" alt="Groupby Operations Line Chart">
</div>

*The groupby operations show similar patterns to pipeline operations. Pandas demonstrates superior performance on column-heavy datasets (left side of charts), while Polars Lazy shows competitive performance that improves as datasets become more row-dominated. The bar chart reveals that Polars eager struggles significantly with column-heavy data, while the line chart shows Pandas maintaining relatively stable performance across all data shapes, contrasting with Polars' more variable performance profile.*

### Some more comparisons

<div align="center">
  <img src="https://i.postimg.cc/tgnL3wC2/insertion-line-benchmark.png" alt="Insertion Operations Line Chart">
  <img src="https://i.postimg.cc/0QpF3SSS/filter-line-benchmark.png" alt="Filtering Operations Line Chart">
  <img src="https://i.postimg.cc/1XSh5BSM/sort-line-benchmark.png" alt="Sort Operations Line Chart">
</div>

*The insertion operations chart shows Polars (both eager and lazy) consistently outperforming Pandas across all data shapes, with performance improving as datasets become more row-dominated. For filtering operations, Pandas maintains steady performance while Polars shows dramatic improvements with row-heavy data. The sorting benchmark reveals that all frameworks perform similarly on balanced datasets, but Pandas struggles with very row-dominated data while Polars maintains consistent performance.*

> For the total suite and results, please refer to this [Kaggle Notebook](https://www.kaggle.com/code/austinfairbanks/pandaspolarsbenchmarking?cellIds=7&kernelSessionId=246692710)

## What's best for you?

Choosing between Pandas and Polars involves significant tradeoffs in performance, functionality, and code readability, making an informed decision critically important. Let's explore the key characteristics of each library to help you determine which one best suits your needs.

### Pandas:
| **Pros**                                                                 | **Cons**                                |
|--------------------------------------------------------------------------|------------------------------------------|
| Row-major dataframe makes it ideal for medium-size, column-heavy datasets | Poor scaling on very large datasets      |
| NumPy-based integration with existing scientific libraries         | No distinguishing between Suboptimal vs. Optimal operations|
| Easy, almost *instinctual* syntax                                        |  Single-Threaded                          |
| Long-term documentation and community support                            |   |



### Polars:
| **Pros**                                                                 | **Cons**                                |
|--------------------------------------------------------------------------|------------------------------------------|
| Column Major memory makes it scale well for row heavy; feature light data  | Poor performance on column-heavy dataset     |
| Arrow base allows for extremely fast computation, low memory footprint   | Lack of documentation and widespread debugging |
| Lazy Frame optimizes queries prior to execution                          | No integration into popular libraries    |
| Straight-Forward, Modern 'Querying' Syntax                              |  Infant stage of development                   |
| Integrated GPU and Parallelized usage                                   | |

When push comes to shove, Polars is much better for large, computationally heavy workloads, while Pandas excels in rapid prototyping and integration. The choice ultimately depends on your specific use case:

- **Choose Polars** if you're working with massive datasets, need optimal performance on row-heavy data, or require parallel processing capabilities.
- **Choose Pandas** if you're working with column-heavy datasets, need seamless integration with the scientific Python ecosystem, or value extensive documentation and community support.

I hope this comparison helps you make an informed decision for all your data processing needs!

## Links & References
### References

- [Wikipedia: Pandas (software)](https://en.wikipedia.org/wiki/Pandas_(software)) - Overview and history of Pandas
- [Pandas Official Documentation: 10 Minutes to Pandas](https://pandas.pydata.org/docs/user_guide/10min.html) - Quick start guide for Pandas
- [Polars GitHub Repository](https://github.com/pola-rs/polars) - Source code and documentation for Polars
- [Apache Arrow Documentation](https://arrow.apache.org/docs/index.html) - Documentation for the columnar memory format used by Polars
- [RAPIDS cuDF FAQ: Pandas Comparison](http://docs.rapids.ai/api/cudf/latest/cudf_pandas/faq/) - Comparison between Pandas and GPU-accelerated dataframes
- [Pandas Getting Started Guide](https://pandas.pydata.org/docs/getting_started/overview.html) - Official introduction to Pandas
- [NumPy Documentation: Absolute Beginners Guide](https://numpy.org/doc/2.3/user/absolute_beginners.html) - Introduction to NumPy, which underlies Pandas
- [Polars Benchmarks](https://pola.rs/posts/benchmarks/) - Performance benchmarks comparing Polars to other dataframe libraries
- [Polars Documentation: Lazy API](https://docs.pola.rs/user-guide/concepts/lazy-api/) - Guide to Polars' LazyFrame optimization capabilities
- [Wikipedia: Row and Column-Major Order](https://en.wikipedia.org/wiki/Row-_and_column-major_order) - Explanation of memory layout differences in dataframes


