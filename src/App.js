import React, { Component } from 'react';
import $ from 'jquery'
class App extends Component {
  state = {
    numberOfDataElements: 0,
    legend: { y: "Y axis", x: "X axis" },
    data: [],
    maxHeight: 0,
    tempValues: {
      x: "test",
      y: ""
    }
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

  mouseMovehandler = (e)=>{
    console.log(e);
  }
  render() {
    return (
      <div className="input">
        <input type="text" placeholder="Add X" value="Test" onChange={(e) => this.onInputChange(e, "x")} /><br />
        <input type="text" placeholder="Add Y" onChange={(e) => this.onInputChange(e, "y")} /><br />
        <button type="button" onClick={() => this.onAddClick()}>Add!</button>

        <div className="bar-graph" onMouseMove={(e)=>this.mouseMovehandler(e)}>
          <Legend legX={this.state.legend.x} legY={this.state.legend.y} />
          <div className="y-markings">
            {this.setYmarkings().map((elem, i) =>
              <li key={i} className="y-markings-elem" >{elem}</li>
            )}
          </div>
          {/* <Reference value={}/> */}
          <Bargraph maxHeight={this.state.maxHeight} data={this.state.data} />
        </div>
      </div>
    );
  }
}


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

class reference extends Component {

  render() {
    return (
      <div>
        <span>{this.props.height}</span>
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

export default App;
