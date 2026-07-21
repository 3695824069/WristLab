# 图片使用说明

本项目的图片存储在 `public/images/` 目录下，使用本地图片路径。

## 目录结构

```
public/images/
├── courses/          # 课程封面图
│   ├── fat-loss-hiit.jpg
│   ├── fat-loss-cardio.jpg
│   ├── muscle-chest.jpg
│   ├── muscle-back.jpg
│   ├── home-fullbody.jpg
│   └── home-yoga.jpg
└── exercises/        # 动作封面图
    ├── chest/
    │   ├── ex-chest-pushup.jpg
    │   ├── ex-chest-dumbbell-fly.jpg
    │   └── ex-chest-incline-press.jpg
    ├── back/
    │   ├── ex-back-pullup.jpg
    │   ├── ex-back-row.jpg
    │   └── ex-back-lat-pulldown.jpg
    ├── legs/
    │   ├── ex-legs-squat.jpg
    │   ├── ex-legs-deadlift.jpg
    │   └── ex-legs-lunge.jpg
    └── core/
        ├── ex-core-plank.jpg
        ├── ex-core-crunch.jpg
        └── ex-core-russian-twist.jpg
```

## 图片命名规则

### 课程封面图
- 路径：`/images/courses/[课程ID].jpg`
- 尺寸：640x360 像素（16:9 比例）
- 格式：JPG 或 PNG

### 动作封面图
- 路径：`/images/exercises/[分类]/[动作ID].jpg`
- 尺寸：400x300 像素（4:3 比例）
- 格式：JPG 或 PNG

## 所需图片清单

### 课程（6张）
1. `fat-loss-hiit.jpg` - 高效燃脂 HIIT 训练（HIIT/有氧）
2. `fat-loss-cardio.jpg` - 低冲击有氧减脂操（有氧运动）
3. `muscle-chest.jpg` - 胸肌塑形训练（胸部训练）
4. `muscle-back.jpg` - 背部线条塑造（背部训练）
5. `home-fullbody.jpg` - 居家全身燃脂训练（自重训练）
6. `home-yoga.jpg` - 晨间瑜伽唤醒（瑜伽/伸展）

### 胸部动作（3张）
1. `ex-chest-pushup.jpg` - 俯卧撑
2. `ex-chest-dumbbell-fly.jpg` - 哑铃飞鸟
3. `ex-chest-incline-press.jpg` - 上斜哑铃卧推

### 背部动作（3张）
1. `ex-back-pullup.jpg` - 引体向上
2. `ex-back-row.jpg` - 哑铃划船
3. `ex-back-lat-pulldown.jpg` - 高位下拉

### 腿部动作（3张）
1. `ex-legs-squat.jpg` - 杠铃深蹲
2. `ex-legs-deadlift.jpg` - 罗马尼亚硬拉
3. `ex-legs-lunge.jpg` - 弓步蹲

### 核心动作（3张）
1. `ex-core-plank.jpg` - 平板支撑
2. `ex-core-crunch.jpg` - 卷腹
3. `ex-core-russian-twist.jpg` - 俄罗斯转体

## 如何添加图片

1. 准备符合尺寸要求的图片
2. 按照命名规则重命名图片文件
3. 将图片复制到对应的目录中
4. 重启开发服务器（`npm run dev`）
5. 刷新浏览器查看效果

## 图片来源建议

- [Unsplash](https://unsplash.com) - 免费高质量图片
- [Pexels](https://www.pexels.com) - 免费图片和视频
- [Pixabay](https://pixabay.com) - 免费图片和视频
- 自己拍摄的照片

## 注意事项

- 图片文件名必须与代码中的 ID 完全一致
- 建议使用压缩后的图片，以提高加载速度
- 如果使用他人的图片，请确保有合法的使用授权
