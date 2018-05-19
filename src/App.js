import React, { Component } from 'react';
import $ from 'jquery';
class App extends Component {
  state = {
    numberOfDataElements: 0,
    legend: { y: "Y axis", x: "X axis" },
    data: [{ x: "yeas", y: 10 }, { x: "yeas", y: 2 }, { x: "yeas", y: 8 }, { x: "yeas", y: 4 }],
    maxHeight: 0,
    tempValues: {
      x: "test",
      y: ""
    },
    mouseCoordinateY: 0,
    mouseMoveValue: 0
  }

  setMax = () => {
    let cData = this.state.data;
    let max = 0;
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
  mouseMovehandler = (e) => {
    let heightInPixels = $(".bar-graph").height() - e.clientY + $(".bar-graph").offset().top;
    let heightInUnits = this.state.maxHeight * (heightInPixels / $(".bar-graph").height());
    let finalHeightUnit = Math.floor(heightInUnits * 100) / 100;

    this.setState({
      mouseCoordinateY: - $(".bar-graph").offset().top + e.clientY,
      mouseMoveValue: finalHeightUnit
    });
  }

  remove = (e) => {
    let cData = this.state.data;
    cData.splice(e, 1);
    this.setState({
      data: cData,
      numberOfDataElements: this.state.numberOfDataElements - 1
    }, () => {
      this.setMax();
      console.log(this.state.data);
    });
  }
  render() {
    return (
      <div className="input">
        <input type="text" placeholder="Add X" value="Test" onChange={(e) => this.onInputChange(e, "x")} /><br />
        <input type="text" placeholder="Add Y" onChange={(e) => this.onInputChange(e, "y")} /><br />
        <button type="button" onClick={() => this.onAddClick()}>Add!</button>

        <BarGraph
          mouseMovehandler = {this.mouseMovehandler}
          legX = {this.state.legend.x}
          legY = {this.state.legend.y}
          setYmarkings = {this.setYmarkings}
          mouseMoveValue = {this.state.mouseMoveValue}
          mouseCoordinateY = {this.state.mouseCoordinateY}
          remove = {this.remove}
          maxHeight = {this.state.maxHeight}
          data = {this.state.data}
        />
      </div>
    );
  }
}

//Bar Graph Container 

class BarGraph extends Component {

  render() {

    return (
      <div className="bar-graph" onMouseMove={this.props.mouseMovehandler.bind(this)}>
        <Legend legX={this.props.legX} legY={this.props.legY} />
        <div className="y-markings">
          {this.props.setYmarkings().map((elem, i) =>
            <li key={i} className="y-markings-elem" >{elem}</li>
          )}
        </div>
        <GraphLines />
        <Reference mouseValue={this.props.mouseMoveValue} mouseHeight={this.props.mouseCoordinateY} />
        <BarsContainer remove={this.props.remove} maxHeight={this.props.maxHeight} data={this.props.data} />
      </div>
    );
  }
}

//Bar Graph Component
class BarsContainer extends Component {

  mapHeight = (yPos) => {
    return (yPos / this.props.maxHeight) * 500;
  }

  render() {
    return (
      <ul>
        {this.props.data.map((elem, index) =>
          <Bar remove={this.props.remove} id={index} key={index} className="bar" data={this.props.data[index]} height={this.mapHeight(elem.y)} />
        )}
      </ul>
    );
  }
}

//Reference Line Component
class Reference extends Component {

  render() {
    return (
      <div className="reference-container">
        <div className="reference-line" style={{ top: this.props.mouseHeight - 2 }}></div>
        <div className="reference-text" style={{ top: (this.props.mouseHeight - 20) + "px" }}>{this.props.mouseValue}</div>
      </div>
    );
  }
}

//Individual bars
class Bar extends Component {
  render() {
    return (
      <div className="bar" onClick={() => this.props.remove(this.props.id)}>
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

  lineGenerator = () => {
    let number = 11;
    let lines = [];
    for (let i = 0; i < number; i++) {
      lines.push(<div key={i} className="line"></div>);
    }
    return lines;
  }

  render() {
    return (

      <div className="graph-lines">
        {this.lineGenerator().map((elem, index) => elem)}
      </div>

    );
  }

}

export default App;
