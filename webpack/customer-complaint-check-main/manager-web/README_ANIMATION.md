# 动画系统使用指南

## 📦 已安装的库

- **Naive UI** - 现代化Vue 3 UI组件库
- **GSAP** - 强大的JavaScript动画库
- **@vueuse/motion** - Vue 3声明式动画
- **AOS** - 滚动触发动画
- **Lottie** - JSON动画播放
- **Lucide Vue** - 现代图标库
- **NProgress** - 顶部进度条

## 🎨 设计系统

### 变量文件 (`@/styles/variables.scss`)
包含完整的设计令牌:
- 颜色系统 (主色、辅助色、中性色)
- 间距系统 (xs, sm, md, lg, xl, xxl)
- 字体系统 (字号、字重、行高)
- 圆角系统
- 动画时长和曲线
- 层级系统
- 响应式断点

### Mixins (`@/styles/mixins.scss`)
提供丰富的样式工具:
- Flexbox布局 (`@include flex-center`)
- 文本处理 (`@include text-ellipsis(2)`)
- 阴影效果 (`@include shadow-md`)
- 悬停效果 (`@include hover-lift`)
- 渐变背景 (`@include gradient-primary`)
- 玻璃态效果 (`@include glass-effect`)
- 响应式断点 (`@include respond-to(md)`)
- 自定义滚动条 (`@include custom-scrollbar`)

### 动画关键帧 (`@/styles/animations.scss`)
预定义的CSS动画:
- fadeIn/fadeOut
- slideInUp/Down/Left/Right
- scaleIn/scaleOut
- rotateIn
- bounce, pulse, shake, spin, float
- shimmer, skeleton, ripple

## 🚀 使用方法

### 1. GSAP动画 (JavaScript控制)

```typescript
import { fadeIn, slideInUp, scaleIn, staggerFadeIn } from '@/utils/gsap'
import { onMounted, ref } from 'vue'

const elementRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // 单个元素动画
  fadeIn(elementRef.value)

  // 滑入动画
  slideInUp('.card', 30, 0.5)

  // 缩放动画
  scaleIn('.button')

  // 交错动画
  staggerFadeIn('.list-item', 0.1)
})
```

### 2. VueUse Motion (声明式)

```vue
<template>
  <div
    v-motion
    :initial="{ opacity: 0, y: 30 }"
    :enter="{ opacity: 1, y: 0 }"
    :leave="{ opacity: 0, y: -30 }"
  >
    内容
  </div>
</template>
```

或使用预定义变量:

```vue
<script setup>
import { useMotionVariants } from '@/composables/useAnimation'

const { slideUpVariants } = useMotionVariants()
</script>

<template>
  <div v-motion :initial="slideUpVariants.initial" :enter="slideUpVariants.enter">
    内容
  </div>
</template>
```

### 3. AOS滚动动画 (HTML属性)

```vue
<template>
  <div data-aos="fade-up" data-aos-delay="100">
    滚动时显示
  </div>

  <div data-aos="zoom-in" data-aos-duration="800">
    缩放进入
  </div>
</template>
```

可用的AOS动画:
- fade, fade-up, fade-down, fade-left, fade-right
- zoom-in, zoom-out
- slide-up, slide-down, slide-left, slide-right
- flip-left, flip-right, flip-up, flip-down

### 4. CSS工具类

```vue
<template>
  <!-- 动画类 -->
  <div class="fade-in delay-200">淡入</div>
  <div class="slide-in-up">滑入</div>
  <div class="scale-in">缩放</div>

  <!-- 悬停效果 -->
  <div class="hover-lift">悬停抬起</div>
  <div class="hover-scale">悬停缩放</div>
  <div class="hover-glow">悬停发光</div>

  <!-- 卡片样式 -->
  <div class="card-hover">卡片</div>

  <!-- 玻璃态 -->
  <div class="glass">玻璃效果</div>

  <!-- 渐变背景 -->
  <div class="gradient-primary">渐变</div>
</template>
```

### 5. Composables

#### useGsapAnimation
```typescript
import { useGsapAnimation } from '@/composables/useAnimation'
import { fadeIn } from '@/utils/gsap'

const { addAnimation, clearAnimations } = useGsapAnimation()

const anim = fadeIn('.element')
addAnimation(anim)
```

#### useScrollAnimation
```typescript
import { useScrollAnimation } from '@/composables/useAnimation'

const elementRef = ref(null)
const { isVisible } = useScrollAnimation(elementRef)

watch(isVisible, (visible) => {
  if (visible) {
    // 元素进入视口
  }
})
```

#### useHoverAnimation
```typescript
import { useHoverAnimation } from '@/composables/useAnimation'

const cardRef = ref(null)
const { isHovered } = useHoverAnimation(cardRef)
```

#### useStaggerAnimation
```typescript
import { useStaggerAnimation } from '@/composables/useAnimation'

const itemsRef = ref([])
useStaggerAnimation(itemsRef, 0.1, 'fadeInUp')
```

### 6. Naive UI组件

```vue
<template>
  <n-button type="primary" @click="handleClick">
    按钮
  </n-button>

  <n-card title="卡片标题">
    卡片内容
  </n-card>

  <n-input v-model:value="inputValue" placeholder="请输入" />

  <n-modal v-model:show="showModal">
    模态框内容
  </n-modal>
</template>

<script setup>
import { useMessage, useDialog, useNotification } from '@/plugins/naive'

const message = useMessage()
const dialog = useDialog()
const notification = useNotification()

const handleClick = () => {
  message.success('操作成功')
  notification.info({ title: '提示', content: '这是通知' })
}
</script>
```

### 7. NProgress进度条

```typescript
import { startProgress, doneProgress } from '@/plugins/nprogress'

// 路由守卫中使用
router.beforeEach(() => {
  startProgress()
})

router.afterEach(() => {
  doneProgress()
})
```

## 🎯 最佳实践

1. **性能优化**
   - 使用`will-change`属性优化动画性能
   - 避免同时运行过多动画
   - 使用`transform`和`opacity`而非`width`/`height`

2. **用户体验**
   - 保持动画时长在200-500ms之间
   - 使用合适的缓动函数
   - 提供禁用动画的选项

3. **响应式设计**
   - 在移动端减少或禁用复杂动画
   - 使用`prefers-reduced-motion`媒体查询

4. **代码组织**
   - 复用动画配置
   - 使用Composables封装动画逻辑
   - 保持动画代码的可维护性

## 📚 示例组件

查看以下示例组件了解具体用法:
- `@/components/AnimatedCard.vue` - 动画卡片
- `@/components/LoadingSpinner.vue` - 加载动画

## 🔗 相关文档

- [GSAP文档](https://greensock.com/docs/)
- [VueUse Motion](https://motion.vueuse.org/)
- [AOS文档](https://michalsnik.github.io/aos/)
- [Naive UI文档](https://www.naiveui.com/)
- [Lucide图标](https://lucide.dev/)
