import React, { Component } from 'react';
import './App.css';
import mySocket from "socket.io-client";



class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            myImg:require("./img/dog1.png"),
            myImg2:require("./img/dog2.png"),
            allusers:[],
            myId:null
        }
        
    this.handleImage = this.handleImage.bind(this);
    }

    
    
    componentDidMount(){
        this.socket = mySocket("http://localhost:10000");
        this.socket.on("createimage", (data)=>{
            this.setState({
                allusers:data
            })    
        });
        
        this.socket.on("yourid", (data)=>{
            this.setState({
                myId:data
            })
            
        });
        this.socket.on("usermove", (data)=>{
          console.log("user has moved");
          this.refs["u"+data.id].style.top = data.y+"px";
          this.refs["u"+data.id].style.left = data.x+"px";
          this.refs["u"+data.id].src = data.img;
        })
        
        
        
        this.refs.thedisplay.addEventListener("mousemove", (ev)=>{
          // console.log("moving");
          // this.refs.myImg.style.left = ev.pageX+"px";
          // this.refs.myImg.style.top = ev.pageY+"px";
            if(this.state.myId === null){
              return false;
            }
            this.refs["u"+this.state.myId].style.left = ev.pageX+"px";
            this.refs["u"+this.state.myId].style.top = ev.pageY+"px";
            
            
              this.socket.emit("mymove",{

                x:ev.pageX,
                y:ev.pageY,
                id:this.state.myId,
                img: this.refs["u"+ this.state.myId].src
              });
        });
        
    }
    
    handleImage (evt){
      this.refs["u"+this.state.myId].src = evt.target.src;
    }
    
  render() {
      var auImgs = this.state.allusers.map((obj,i)=>{
          return(
            <img ref={"u"+obj} key={i} height={50} className="allImgs" src={this.state.myImg} />
          
          
          )
      })
      
    return (
      <div className="App">
        
        <div ref="thedisplay" id="display">
            {auImgs}
            <img ref="myImg" id="myImg" src={this.state.myImg} height={200}/>
        
        </div>
        <div className="control">
            {this.state.myId}
            <img src={this.state.myImg} height = {50} />
            <img src={this.state.myImg2} height = {50} onClick ={this.handleImage} />
        </div>
      </div>
    );
  }
}

export default App;
