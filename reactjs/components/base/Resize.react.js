var React = require('react');
var WinSettingsActionCreators = require('../../actions/WinSettingsActionCreators');
var Resize = React.createClass({
        getInitialState: function() {
            return { 
                resizeEvent : {
                    down:false,
                    up:false,
                    downClassName:"",
                    downPosition:{ x:0, y:0},
                    movePosition:{x:0,y:0},
                    upPosition:{x:0,y:0},
                    height:this.props.height?this.props.height:100,
                    width:this.props.width?this.props.width:100,
                    position:{
                        x:this.props.position.x?this.props.position.x:0,
                        y:this.props.position.y?this.props.position.y:0
                    }
                },
                display:{
                    height:this.props.height?this.props.height:100,
                    width:this.props.width?this.props.width:100
                },
                position:{
                    x:this.props.position.x?this.props.position.x:0,
                    y:this.props.position.y?this.props.position.y:0
                },
                where:this.props.where?this.props.where:["top","left"]
            };
        },
        onResize:function(){
            if(this.props.onResize){
                this.props.onResize(this.state.resizeEvent);
            }
        },
        getTargetByEvent:function(e){
            e = e || window.event;
            return e.target || e.srcElement;
        },
        getMousePosition:function(e){
            e = e || window.event;
            var scrollX = document.documentElement.scrollLeft || document.body.scrollLeft;
            var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
            
            var x = parseFloat(e.pageX || e.clientX +scrollX);
            var y = parseFloat(e.pageY || e.clientY +scrollY);
            return {x:x,y:y};
        },
        stopPropagation:function(e){
              if(e.stopPropagation)
                    e.stopPropagation();
              else
                    e.cancelBubble = true;
        },
        clearSelect:function(e){
            if(window.getSelection){
                    window.getSelection().removeAllRanges();
            }else{
                document.selection.empty();
            }
        },
        moveToTop:function(offsetY){
            var resizeEve = this.state.resizeEvent;
            if(this.state.where[0]=="top"){
                resizeEve.position.y = this.state.position.y + offsetY;
            }
            resizeEve.height = this.state.display.height - offsetY;
            this.setState({resizeEvent:resizeEve});
        },
        moveToBottom:function(offsetY){
            var resizeEve = this.state.resizeEvent;
            if(this.state.where[0]=="bottom"){
                resizeEve.position.y = this.state.position.y - offsetY;
            }
            resizeEve.height = this.state.display.height + offsetY;
            this.setState({resizeEvent:resizeEve});
        },
        moveToLeft:function(offsetX){
            var resizeEve = this.state.resizeEvent;
            if(this.state.where[1]=="left"){
                resizeEve.position.x = this.state.position.x + offsetX;
            }
            resizeEve.width = this.state.display.width - offsetX;  
            this.setState({resizeEvent:resizeEve});
        },
        moveToRight:function(offsetX){
            var resizeEve = this.state.resizeEvent;
            if(this.state.where[1]=="right"){
                 resizeEve.position.x = this.state.position.x - offsetX;
            }
             resizeEve.width = this.state.display.width + offsetX;
             this.setState({resizeEvent:resizeEve});
        },
        moveWindow:function(offsetX,offsetY){
             var resizeEve = this.state.resizeEvent;
            if(this.state.where[1]=="left"){
                 resizeEve.position.x = this.state.position.x + offsetX;
            }else{
                resizeEve.position.x = this.state.position.x - offsetX;
            }
            if(this.state.where[0]=="top"){
                resizeEve.position.y = this.state.position.y + offsetY;
            }else{
                resizeEve.position.y = this.state.position.y - offsetY;
            }
            this.setState({resizeEvent:resizeEve});
        },
        moveToPositoin:function(e){
            var className = this.state.resizeEvent.downClassName;
            var downPosition = this.state.resizeEvent.downPosition;
            var upPosition = this.getMousePosition(e);
            this.state.resizeEvent.upPosition = upPosition;
            switch(className){
                case "resize-ns-n":
                    console.log(upPosition.y-downPosition.y);
                    this.moveToTop(upPosition.y - downPosition.y);
                    break;
                case "resize-ns-s":
                    this.moveToBottom(upPosition.y - downPosition.y);
                    break;
                case "resize-ew-e":
                    this.moveToLeft(upPosition.x - downPosition.x);
                    break;
                case "resize-ew-w":
                    this.moveToRight(upPosition.x - downPosition.x);
                    break;
                case "resize-se":
                    this.moveToLeft(upPosition.x - downPosition.x);
                    this.moveToBottom(upPosition.y - downPosition.y);
                    break;
                case "resize-sw":
                    this.moveToRight(upPosition.x - downPosition.x);
                    this.moveToBottom(upPosition.y - downPosition.y);
                    break;
                case "resize-ne":
                    this.moveToLeft(upPosition.x - downPosition.x);
                    this.moveToTop(upPosition.y - downPosition.y);
                    break;
                case "resize-nw":
                    this.moveToRight(upPosition.x - downPosition.x);
                    this.moveToTop(upPosition.y - downPosition.y);
                    break;
                case "resize-drag":
                    this.moveWindow(upPosition.x - downPosition.x,upPosition.y - downPosition.y);
                    break;
            }
            if(className.indexOf("resize")==0){
                this.onResize();
            }
        },
        onMouseDown:function(e){
            var target = this.getTargetByEvent(e);
            var resizeEve = this.state.resizeEvent;
            switch(target.className){
                case "resize-ns-n":
                case "resize-ns-s":
                case "resize-ew-e":
                case "resize-ew-w":
                case "resize-se":
                case "resize-sw":
                case "resize-ne":
                case "resize-nw":
                    $("#resize_mask").show();
                case "resize-drag":
                    resizeEve.down = true;
                    resizeEve.up = false;
                    resizeEve.downClassName = target.className;
                    resizeEve.downPosition = this.getMousePosition(e);
                    break;
                default:
                    resizeEve.down = false;
                    resizeEve.up = false;
                    resizeEve.downClassName = "";
                    break;
            }
             this.setState({resizeEvent:resizeEve});
            this.stopPropagation(e);
        },
        onMouseUp:function(e){
            var resizeEve = this.state.resizeEvent;
            if( resizeEve.down){
                    this.clearSelect(e);
                    this.moveToPositoin(e);
                    resizeEve.down = false;
                    resizeEve.up = true;
                    resizeEve.downClassName = "";
                    $("#resize_mask").hide();
                    this.onResize();
                    this.setState({
                        position:{
                            x:resizeEve.position.x,
                            y:resizeEve.position.y,
                        },
                        display:{
                            width:resizeEve.width,
                            height:resizeEve.height
                        }
                    });
                   
            }
            this.stopPropagation(e);
        },
        onMouseMove:function(e){
            var resizeEve = this.state.resizeEvent;
            if( resizeEve.down){
                this.clearSelect(e);
                this.moveToPositoin(e);
            }
            this.stopPropagation(e);
        },
        componentDidMount:function(){
                window.addEventListener("mouseup",this.onMouseUp);
                window.addEventListener("mousemove",this.onMouseMove);
        },
        componentWillUnmount:function(){
                window.removeEventListener("mouseup",this.onMouseUp);
                window.removeEventListener("mousemove",this.onMouseMove);
        },
        onDoubleClick:function(e){
            if(this.props.onDoubleClick)
                this.props.onDoubleClick(e);
        },
        render: function() {
               var resizeStyle = this.props.style?this.props.style:{};
               var classArr = ["resize-ns-n","resize-ns-s","resize-ew-e","resize-ew-w","resize-se","resize-sw","resize-ne","resize-nw"];
                var onMouseDown = this.onMouseDown,onMouseMove=this.onMouseMove,onMouseUp=this.onMouseUp;
               return (<div>
                        <div className="resize-drag" onDoubleClick={this.onDoubleClick} onMouseDown={this.onMouseDown} onMouseMove={this.onMouseMove} onMouseUp={this.onMouseUp}></div>
                       {
                                classArr.map(function(cls){
                                    return (<div key={cls} style={resizeStyle} className={cls}  onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp}></div>);
                                })
                        }
                 </div>)
        }
});
module.exports = Resize;