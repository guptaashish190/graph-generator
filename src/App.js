import React, { Component } from 'react';
import $ from 'jquery';
class App extends Component {
  state = {
    numberOfDataElements: 0,
    legend: { y: "Y axis", x: "X axis" },
    data: [],
    maxHeight: 0,
    tempValues: {
      x: "test",
      y: ""
    },
    mouseCoordinateY : 0,
    mouseMoveValue : 0
  }

  setMax = () => {
    let cData = this.state.data;
    let max = this.state.maxHeight;
    cData.forEach((coord) => {
      if (coord.y > max) {
        max = coord.y;
      }
    });
    this.setState({
      maxHeight: max
    }, () => {
      this.setYmarkings();
    });

  }
  onInputChange = (e, axis) => {

    let cState = this.state;
    switch (axis) {
      case "x":
        cState.tempValues.x = e.target.value
        break;
      case "y":
        cState.tempValues.y = e.target.value
        break;
      default:

    }
    this.setState(cState);
  }

  onAddClick = () => {
    let cData = this.state.data;

    cData.push({ x: this.state.tempValues.x, y: Number(this.state.tempValues.y) });

    this.setState({
      data: cData,
      numberOfDataElements: 1 + this.state.numberOfDataElements
    }, () => {
      this.setMax();
    });
  }

  setYmarkings = () => {
    let yMarkingArray = [0];
    let spacing = this.state.maxHeight / 10;
    for (let i = 1; i <= 10; i++) {
      yMarkingArray.push(Math.round(i * spacing * 100) / 100);
    }
    return yMarkingArray;
  }

  //Mouse handler to get mapped value according to the state.maxHeight
  mouseMovehandler = (e)=>{
    let heightInPixels = $(".bar-graph").height() - e.clientY + $(".bar-graph").offset().top;   
    let heightInUnits = this.state.maxHeight*(heightInPixels/$(".bar-graph").height());
    let finalHeightUnit = Math.floor(heightInUnits*100)/100;

    this.setState({
      mouseCoordinateY :  - $(".bar-graph").offset().top + e.clientY,
      mouseMoveValue : finalHeightUnit
    });

    console.log(heightInPixels);
  }
  render() {
    return (
      <div className="input">
        <input type="text" placeholder="Add X" value="Test" onChange={(e) => this.onInputChange(e, "x")} /><br />
        <input type="text" placeholder="Add Y" onChange={(e) => this.onInputChange(e, "y")} /><br />
        <button type="button" onClick={() => this.onAddClick()}>Add!</button>
        <div className="bar-graph" onMouseMove={this.mouseMovehandler.bind(this)}>
          <Legend legX={this.state.legend.x} legY={this.state.legend.y} />
          <div className="y-markings">
            {this.setYmarkings().map((elem, i) =>
              <li key={i} className="y-markings-elem" >{elem}</li>
            )}
          </div>
          <GraphLines />
          <Reference mouseValue = {this.state.mouseMoveValue} mouseHeight = {this.state.mouseCoordinateY}/>
          <Bargraph maxHeight={this.state.maxHeight} data={this.state.data} />
        </div>
      </div>
    );
  }
}

//Reference Line Component
class Reference extends Component {

  render(){
    return(
      <div className="reference-container">
        <div className = "reference-line" style = {{top:this.props.mouseHeight}}></div>
        <div className = "reference-text" style = {{top: (this.props.mouseHeight - 20) + "px"}}>{this.props.mouseValue}</div>
      </div>
    );
  }
}

//Bar Graph Component
class Bargraph extends Component {

  mapHeight = (yPos) => {
    return (yPos / this.props.maxHeight) * 500;
  }

  render() {
    return (
      <ul>
        {this.props.data.map((elem, index) =>
          <Bar key={index} className="bar" data={this.props.data[index]} height={this.mapHeight(elem.y)} />
        )}
      </ul>
    );
  }
}

//Individual bars
class Bar extends Component {
  render() {
    return (
      <div className="bar">
        {this.props.data.y}
        <div style={{ width: 25 + "px", height: this.props.height + "px" }} className="shape">
        </div>
        <span>{this.props.data.x}</span>
      </div>
    );
  }
}

//Display Legends
class Legend extends Component {
  render() {
    return (
      <div className="legend">
        <div>{this.props.legX}</div>
        <div>{this.props.legY}</div>
      </div>
    );
  }
}


class GraphLines extends Component {

  lineGenerator = ()=>{
    let number = 11;
    let lines = [];
    for(let i = 0; i< number ; i++){
      lines.push(<div key = {i} className= "line"></div>);
    }
    return lines;
  }

  render(){
    return(

      <div className= "graph-lines">
        {this.lineGenerator().map((elem,index)=>elem)}
      </div>

    );
  }

}

export default App;
