<template>
    <div class="container">
        <!-- 1. 默认插槽 -->
        <DefaultSlot1 title="美食">
            <img src="https://img.zcool.cn/community/01e3875d579d75a8012187f4fe9e65.jpg@1280w_1l_2o_100sh.jpg">
        </DefaultSlot1>

        <DefaultSlot1 title="游戏">
            <ul>
                <li v-for="(item,index) in games" :key="index">{{item}}</li>
            </ul>
        </DefaultSlot1>

        <DefaultSlot1 title="电影">
            <video controls src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"></video>
        </DefaultSlot1>

        <!-- 2. 具名插槽 -->
        <NamedSlot2 title="美食">
            <!-- 指定第一个插槽，放入 img -->
            <img slot="center" src="https://img.zcool.cn/community/01e3875d579d75a8012187f4fe9e65.jpg@1280w_1l_2o_100sh.jpg">
            <!-- 指定第二个插槽，放入 a -->
            <a slot="footer" href="http://www.bilibili.com">更多好康的</a>
        </NamedSlot2>

        <NamedSlot2 title="游戏">
            <ul slot="center">
                <li v-for="(item,index) in games" :key="index">{{item}}</li>
            </ul>
            <!-- 可以将多个内容放入同一个插槽 -->
            <a slot="center" href="http://www.bilibili.com">更多好康的</a>
        </NamedSlot2>

        <NamedSlot2 title="电影">
            <video controls slot="center" src="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"></video>
            <template v-slot:footer>
                <a slot="center" href="http://www.bilibili.com">快！</a>
                <a slot="center" href="http://www.bilibili.com">给我康康！</a>
                <a slot="center" href="http://www.bilibili.com">拿来把你</a>
            </template>
        </NamedSlot2>

        <!-- 3. 作用域插槽 -->
        <ScopeSlot3 title="游戏">
            <!-- 接收插槽传来的数据，外部必须包裹 template -->
            <template scope="data">
                <ul>
                    <li v-for="(item,index) in data.games2" :key="index">{{item}}</li>
                </ul>
                <!-- 传递多个参数 -->
                <span>{{data.msg}}</span>
            </template>
            
        </ScopeSlot3>
        <ScopeSlot3 title="游戏">
            <template scope="data">
                <ol>
                    <li v-for="(item,index) in data.games2" :key="index">{{item}}</li>
                </ol>
            </template>
        </ScopeSlot3>

    </div>
</template>

<script>

    /* 
        slot 插槽

            简介：
                1. 使 父组件 向 子组件 指定位置插入 html 结构的方法
                    (1) 在父组件 渲染之后 填充到子组件插槽
                    (2) html 结构中的样式写在父/子组件里都可以正常显示
                        在父中写样式就是渲染带样式放入插槽，写子中就是放入插槽子组件控制样式
                2. 一种组件间通信的方式，适用于 父组件 ===> 子组件

            使用方式：

                1. 默认插槽             DefaultSlot1
                    1) 子组件中定义
                        <slot>插槽默认内容(可以是 html，默认内容在没有传递结构时出现)...</slot>
                        (1) 在需要使用插槽的位置 定义插槽
                            如果没有默认值可以直接写自结束标签： <slot/>
                    2) 父组件中使用
                        <子组件标签>
                            (1) 编写任意 html 结构(tempalte 包裹也可以)
                        </子组件标签>
                    3) 仅支持单个插槽
                        子组件声明多个 <slot/> 会将插槽渲染多次

                2. 具名插槽             NamedSlot2
                    1) 子组件中定义
                        <slot name="插槽名1">插槽默认内容(可以是 html)...</slot>
                        <slot name="插槽名2">插槽默认内容2(可以是 html)...</slot>
                    2) 父组件中使用
                        <子组件标签>
                            <任意元素 slot="插槽名" …… ></任意元素>
                            <任意元素2 slot="插槽名2" …… ></任意元素2>
                            (1) 编写任意 html 结构(tempalte 包裹也可以)
                            (2) 通过标签属性 slot="插槽名" 指点元素放入的插槽
                            (3) 可将多个元素放入同一个插槽(指定相同的插槽名会按顺序放入)
                            (4) 使用 template 内容放入插槽，可以使用另一种方式指定插槽(原先的方式也可以使用)
                                <template v-slot:插槽名></template>     (仅 template 可用)
                                vue3 中推荐使用，对 API兼容更好
                        </子组件标签>
                    3) 支持多个插槽

                3. 作用域插槽           ScopeSlot3
                    1) 作用
                        (1) 使插槽的使用者 可以获取到 定义插槽的组件 中的数据
                        (2) 这样就可以使数据由组件决定，结构由插槽使用者决定

                    2) 子组件中定义插槽，传递数据
                        <slot :传递的数据名1="组件内数据变量1" ...传递多个参数...>插槽默认内容(可以是 html)...</slot>
                    2) 父组件中使用插槽，调用数据
                        <子组件标签>
                            <template scope="数据总和名">
                                <任意元素 v-for="(item,index) in 数据总和名.传递的数据名1" :key="index">{{item}}</任意元素>
                                (1) 接收插槽传来的数据，外部必须包裹 template
                                (2) 数据总和 存放所有插槽传来的数据
                                    调用数据：  数据总和名.传递数据名
                                (3) 另一种写法(新 API，用起来效果一样，vue3 中推荐使用，对 API兼容更好)
                                    <template slot-scope="数据总和名">
                                (4) scope 支持解构赋值
                                    scope="{data1,data2,...}"       调用: 直接数据名
                            </template>
                        </子组件标签>
                    3) 其他都相同，只是增加了数据传递
                        也可以有 name，从而支持多个作用域插槽
                
                4. 向自身插槽发送的 虚拟DOM 可以通过 this.$slots 读取(无论有没有定义插槽都可以接收到)

    */

    import DefaultSlot1 from './components/DefaultSlot1.vue'
    import NamedSlot2 from './components/NamedSlot2.vue'
    import ScopeSlot3 from './components/ScopeSlot3.vue'

    export default {
        name: 'App',
        data() {
            return {
                foods: ['烧卖','焖面','刀削','地三鲜'],
                games: ['逆战','LOL','DOTA','罪恶都市','魔兽争霸'],
                films: ['死亡诗社','熔炉','花束般恋爱','土拨鼠之日','教父']
            }
        },
        components:{ DefaultSlot1,NamedSlot2,ScopeSlot3 }
    }
</script>

<style lang="css">
    .container{
        display: flex;
        width: 800px;
        flex-wrap: wrap;
    }
    video , img{
        width: 90%;
    }
</style>