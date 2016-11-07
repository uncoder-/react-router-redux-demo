## actions
- 定义动作的名称，以及触发更新方法

## reducer
- state数据的初始化，定义dispatch的触发的动作函数，返回新的state数据

## connect
- 第一个参数把新的state数据捆绑到组件的props上，
- 第二个参数把更新action方法绑定到到组件的props上
- (只剩props，原有的setState方法按需使用)