## actions
- 定义动作的名称，以及触发更新方法

## reducer
- state数据的初始化，定义dispatch的触发的动作函数，返回新的state数据

## connect
- 第一个参数把新的state数据捆绑到组件的props上，
- 第二个参数把更新action方法绑定到到组件的props上
- (只剩props，原有的setState方法按需使用)

打包到执行过程：

webpack
编译，打包

router
调用页面组件

redux
页面组件数据管理

component
接收redux的数据，渲染页面，或者触发redux的action


dispatch本身不会做页面渲染，它改变的是store里存储的数据

由数据改变，联动到react上，然后react开始改变UI。





# 更新
```
@connect(({reducer名字})=>({reducer新名字:reducer名字}))
class Com externs Component{
    componentDidMount(){
	    this.$dispatch(新action数据,'action的名字');
	}
    render(){
        // 接收的新的state
        console.log(this.propos.reducer新名字);
    }
}
```
