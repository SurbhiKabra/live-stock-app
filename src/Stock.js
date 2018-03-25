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
    // closeing the connection
    this.connection.close();
  }

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

  compare = (data) => {
    let currentdate = new Date();
    let displayTime = currentdate.toLocaleString("en-US", OPTIONS);
    let prevData = this.state.messages;
    data = Object.assign({}, prevData, data);
    for (let key in data) {
      if(data[key] && prevData[key]) {
        if(data[key].val < prevData[key].val) {
          data[key].state = DECREASED;
          data[key].time = displayTime;
        } else if(data[key].val > prevData[key].val){
          data[key].state = INCREASED;
          data[key].time = displayTime;
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
