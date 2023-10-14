# 动态尺寸

### 提供不同已知参数对应布局方式

- `C` 表示col
- `R` 表示row
- `size` 表示尺寸信息
- `margin` 表示间距信息


| 提供col或row | 提供size | 提供margin |            布局行为             |
|:---------:|:------:|:--------:|:---------------------------:|
|    yes    |  yes   |   yes    |            所见即所得            |
|    yes    |   no   |   yes    |     自动通过容器剩余空间设定size尺寸      |
|    yes    |  yes   |    no    |     自动通过容器剩余空间margin尺寸      |
|    yes    |   no   |    no    | 通过传入的radio自动设定size和margin尺寸 |
|    no     |  yes   |   yes    |         自动设定CR的栅格数          |
|    no     |   no   |   yes    |     自动通过容器剩余空间设定size尺寸      |
|    no     |  yes   |    no    |    自动通过容器剩余空间设定margin尺寸     |
|    no     |   no   |    no    |              无              |

### 演示

<Automatic/>
