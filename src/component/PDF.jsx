import React from 'react';
import ReactDOM from 'react-dom';
import PDFJS from 'pdfjs-dist';
class PDF extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			fileData:'',
			page:1,
			pages:1
		}
	}
	jumpPage(number){
		const canvas = ReactDOM.findDOMNode(this).children[0];
		const context = canvas.getContext('2d');
		const scale = 2;
		const pdfFile = this.state['fileData'];
		pdfFile.getPage(number).then(function(page) {
			const viewport = page.getViewport(scale);
			canvas.height = viewport.height;
			canvas.width = viewport.width;
			const renderContext = {
				canvasContext: context,
				viewport: viewport
			};
			page.render(renderContext);
		});
	}
	componentDidMount(){
		const pdfurl = this.props['src'];
		PDFJS.getDocument(pdfurl).then((pdf) =>{
			this.setState({
				fileData:pdf,
				page:1,
				pages:pdf.numPages
			});
			this.jumpPage(1);
		});
	}
	render(){
		const canvas = <canvas id="canvas"/>;
		return (<div>section page!{canvas}</div>)
	}
}

export default PDF;