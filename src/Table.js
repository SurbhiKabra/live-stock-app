import React from 'react';
import './Table.css';

const SAME="same";
const INCREASED="increased";
const DECREASED="decreased";

// Stateless component which displays teh stock data in a tabular format
const Table = (props) => {
  return (
    <table>
      <thead>
        <th>
          Ticker
        </th>
        <th>
          Price
        </th>
        <th>
          Change
        </th>
        <th>
        Last Updated
        </th>
      </thead>
      <tbody>
        {
          Object.keys(props.messages).map((item, index)=>
             {
              let currentItem = props.messages[item];
              return (<tr key={index} className="table-row">
              <td className="table-data">{item}</td>
              <td
                className=  {"table-data " + ((currentItem.state === SAME) ? 'same' :
                ((currentItem.state === INCREASED) ? 'increased' : 'decreased'))}>
                {currentItem.val}
              </td>
              <td
                className=  {"table-data " + ((currentItem.state === SAME) ? 'same' :
                ((currentItem.state === INCREASED) ? 'increased' : 'decreased'))}>
                <b>{currentItem.change}</b>
              </td>
              <td className="table-data">{currentItem.time}</td>
            </tr>);
          })
        }
       </tbody>
     </table>
  )};

export default Table;
