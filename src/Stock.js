import React, { Component } from 'react';
import Table from './Table'

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

  formatInitialData = (data) => {
    let currentdate = new Date();
    let displayTime = currentdate.toLocaleString("en-US", OPTIONS);
    data.map((item) => {
      item.push(SAME);
      item.push(displayTime);
    });
    return data;
  }


  compareData = (data) => {
    let currentdate = new Date();
    let displayTime = currentdate.toLocaleString("en-US", OPTIONS);
    let prevData = this.state.messages;

    for (let i=0; i<data.length; i++) {
      let item = data[i];
      let count=0;
      for(let j=0; j<prevData.length; j++) {
        let prevItem = prevData[j];
        if(item[0] === prevItem[0]) {
          count++;
          if(item[1] > prevItem[1]) {
            prevItem[2] = INCREASED;
          } else if (item[1] < prevItem[1]) {
            prevItem[2] = DECREASED;
          } else {
            prevItem[2] = SAME;
          }
          prevItem[1] = item[1];
          prevItem[3] = displayTime;
        }
      }
      if(!count) {
        item.push(SAME);
        item.push(displayTime);
        prevData.push(item);
      }
    }
    return prevData;
  }

  formatData = (data) => {
    let prevData = this.state.messages;
    if(data && data.length) {
      if(prevData && prevData.length) {
        return (this.compareData(data));
      }
      return (this.formatInitialData(data));
    }
  }

  render() {
    return (
      <div>
        {
          (this.state.messages && this.state.messages.length) ?
          (<Table messages={this.state.messages} />) : ''
        }
    </div>
    );
  }
}

export default Stock;
