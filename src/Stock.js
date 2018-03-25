import React, { Component } from 'react';
import Table from './Table';
import Header from './Header';

const SAME="same";
const INCREASED="increased";
const DECREASED="decreased";
const OPTIONS = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };

// Stateful component which fetches data and renders the Table
class Stock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    }
  }

  componentDidMount(){
    // this is a websocket service
  	this.connection = new WebSocket('ws://stocks.mnet.website');
    // listen to onmessage event
    this.connection.onmessage = evt => {
      // add the new message to state
      let messages = this.formatData(JSON.parse(evt.data));
      this.setState({
        messages
      });
    };
  }

  componentWillUnmount() {
    // closing the connection
    this.connection.close();
  }

  /*
  * function simplifyData() accepts the data param and returns simplified data
  */
  simplifyData = (data) => {
    let currentdate = new Date();
    let displayTime = currentdate.toLocaleString("en-US", OPTIONS);
    let simplifiedObj = {};
    data.forEach((item) => {
      return simplifiedObj[item[0]] = {
        val: item[1],
        state: item[2] ? item[2] : SAME,
        time: item[3] ? item[3] : displayTime
      };
    })
    return simplifiedObj;
  }

  /*
  * function formatData() accepts the data param
  * If it's a first time service call it simplifies the data else compares with the prevData
  */
  formatData = (data) => {
    if(!data) return;
    let prevData = this.state.messages;
    if(data && data.length) {
      if(prevData && Object.keys(prevData).length > 0) {
        return (this.compare(this.simplifyData([...data])));
      }
      return (this.simplifyData([...data]));
    }
  }

  /*
  * function compare() accepts the data param
  * this compares teh existing state data with the en one and updates accordingly
  */
  compare = (data) => {
    let currentdate = new Date();
    let displayTime = currentdate.toLocaleString("en-US", OPTIONS);
    let prevData = this.state.messages;
    let dataArray = [];
    data = Object.assign({}, prevData, data);
    for (let key in data) {
      let item = [];
      let previousData = prevData[key];
      let currentData = data[key];
      if(currentData && previousData) {
        if(currentData.val < previousData.val) {
          currentData.state = DECREASED;
          currentData.change = `-${(((previousData.val - currentData.val)/previousData.val)*100).toFixed(2)}%`;
          currentData.time = displayTime;
        } else if(currentData.val > previousData.val){
          currentData.state = INCREASED;
          currentData.change = `+${(((currentData.val - previousData.val)/currentData.val)*100).toFixed(2)}%`;
          currentData.time = displayTime;
        }
      }
    }
    return data;
  }

  render() {
    return (
      <div>
      <Header />
      {
          (this.state.messages && Object.keys(this.state.messages).length) ?
          (<Table messages={this.state.messages} />) : ''
        }
    </div>
    );
  }
}

export default Stock;
