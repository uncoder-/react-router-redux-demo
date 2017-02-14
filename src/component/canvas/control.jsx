import React from 'react';
import ReactDOM from 'react-dom';
import Style from './index.css';

class ControlPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            normalButtons:[
                {actionName:'drawRight',text:'对✅',activeStatus:0},
                {actionName:'drawHalfRight',text:'半✅',activeStatus:0},
                {actionName:'drawWrong',text:'错❌',activeStatus:0},
                {actionName:'drawRect',text:'画框',activeStatus:0},
                {actionName:'drawText',text:'写字',activeStatus:0}
            ],
            specalButtons:[
                {actionName:'clear',text:'清空'},
                {actionName:'revoke',text:'撤销'}
            ]
        }
    }
    setStatus(e){
        let target = e.target;
        let name = target.getAttribute('data-action');
        let activeStatus = target.getAttribute('data-activeStatus')||'false';
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
    render() {
        let {normalButtons,specalButtons} = this.state;
        const that = this;
        normalButtons = normalButtons.map(function(item,index){
            const {actionName, text, activeStatus} = item;
            return <li key={index} onClick={e=>that.setStatus(e)} data-action={actionName} data-activeStatus={activeStatus} className={activeStatus==1?'active':''}>{text}</li>
        });
        specalButtons = specalButtons.map(function(item,index){
            const {actionName, text} = item;
            return <li key={index} onClick={e=>that.setStatus(e)} data-action={actionName}>{text}</li>
        });
        return (
            <div>
                <ul className="control-panel">{normalButtons}</ul>
                <ul className="control-panel">{specalButtons}</ul>
            </div>
        )
    }
}

export default ControlPanel;