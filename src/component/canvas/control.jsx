import React from 'react';
import ReactDOM from 'react-dom';
import { Modal ,Button} from 'antd';
import { connect } from 'react-redux';
import Style from './index.css';

@connect(({correctReducer}) => ({ correctReducer }))
class ControlPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            unable: false,
            normalButtons:[
                {actionName:'drawRight',src: require('./img/tool1.png'),activeSrc: require('./img/tool1_active.png'),unableSrc:require('./img/tool1_unable.png'),activeStatus:1},
                {actionName:'drawHalfRight',src: require('./img/tool2.png'),activeSrc: require('./img/tool2_active.png'),unableSrc:require('./img/tool2_unable.png'),activeStatus:0},
                {actionName:'drawWrong',src: require('./img/tool3.png'),activeSrc: require('./img/tool3_active.png'),unableSrc:require('./img/tool3_unable.png'),activeStatus:0},
                {actionName:'drawRect',src: require('./img/tool4.png'),activeSrc: require('./img/tool4_active.png'),unableSrc:require('./img/tool4_unable.png'),activeStatus:0},
                {actionName:'drawText',src: require('./img/tool5.png'),activeSrc: require('./img/tool5_active.png'),unableSrc:require('./img/tool5_unable.png'),activeStatus:0}
            ],
            specalButtons:[
                {actionName:'reset',src:require('./img/reset.png'),unableSrc:require('./img/reset_unable.png'),text:'清空'},
                {actionName:'revoke',src:require('./img/revoke.png'),unableSrc:require('./img/revoke_unable.png'),text:'撤销'}
            ]
        }
        this.handleResize = this.handleResize.bind(this)
    }
    componentDidMount(){
        window.addEventListener('keydown', this.handleResize);
    }
    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleResize);
    }
    handleResize(e){
        switch (e.keyCode){
            case 49:
                this.refs.normalButtons0.click();
                break;
            case 50:
                this.refs.normalButtons1.click();
                break;
            case 51:
                this.refs.normalButtons2.click();
                break;
            case 52:
                this.props.nextQuestion()
                break;
        }

    }
    setStatus(e){
        // 禁用组件
        const { unable } = this.state;
        if (unable) { return }
        // 复批提醒
        let that = this;
        let {correctReducer} = this.props;
        if(correctReducer.correctAgain){
            Modal.confirm({
                title: '清空批改笔迹后才能重新批改，是否要清空所有的批改笔迹？',
                okText: '清空',
                cancelText: '取消',
                onOk() {
                    correctReducer.correctAgain = false;
                    that.$dispatch(correctReducer, 'correctReducer');
                    that.props.onClick({actionName:'reset', status:1});
                    if(wa){wa('send', 'ba.affirm_clear_comment_click')};  //bi
                },
                onCancel() {}
            });
            return;
        }
        let target = e.target;
        if(target.tagName == "IMG"){
            target = target.parentNode;
        }
        let name = target.getAttribute('data-actionName');
        let activeStatus = target.getAttribute('data-activeStatus')||0;
        let normalButtons = this.state.normalButtons.map(function(item,index){
            let {actionName} = item;   
            if(name == actionName){
                if(activeStatus == 1){
                    item.activeStatus = 0;
                }else{
                    item.activeStatus = 1;
                }
            }else{
                item.activeStatus = 0;
            }
            return item;
        });
        this.setState({
            normalButtons:normalButtons
        })

        this.props.onClick({actionName:name,status:activeStatus})
    }
    componentWillReceiveProps(nextProps){
        let {correctReducer} = this.props;
        // 重置按钮
        if(this.props.markId != nextProps.markId){
            let normalButtons = this.state.normalButtons.map(function(item,index){
                if(item.actionName == "drawRight" && !correctReducer.correctAgain){
                    item.activeStatus = 1;
                }else{
                    item.activeStatus = 0;
                }
                return item;
            });
            this.setState({
                normalButtons: normalButtons
            })
        }
        // 禁用按钮
        if(this.props.unable != nextProps.unable){
            this.setState({
                unable: nextProps.unable
            })
        }
    }
    render() {
        const that = this;
        let {unable, normalButtons, specalButtons} = this.state;
        normalButtons = normalButtons.map(function(item,index){
            const {actionName, src, activeSrc, unableSrc, activeStatus} = item;
            return <div key={index} onClick={e=>that.setStatus(e)} data-actionName={actionName} data-activeStatus={activeStatus} ref={`normalButtons${index}`}><img src={unable?unableSrc:(activeStatus == 1?activeSrc:src)}/></div>
        });
        specalButtons = specalButtons.map(function(item,index){
            const {actionName, src, unableSrc} = item;
            return <div key={index} onClick={e=>that.setStatus(e)} data-actionName={actionName} ref={`specalButtons${index}`}><img src={unable?unableSrc:src}/></div>
        });
        return (
            <div className="control-panel" >{normalButtons}{specalButtons}</div>
        )
    }
}

export default ControlPanel;
