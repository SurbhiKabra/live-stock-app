import React from 'react';
import './Table.css';

const SAME="same";
const INCREASED="increased";
const DECREASED="decreased";

const Table = (props) => {
  return (
    <table>
      <thead>
        <tr>
          <th>
            Ticker
          </th>
          <th>
            Price
          </th>
          <th>
          Last Updated
          </th>
        </tr>
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
              <td className="table-data">{currentItem.time}</td>
            </tr>);
          })
        }
       </tbody>
     </table>
  )};

export default Table;
