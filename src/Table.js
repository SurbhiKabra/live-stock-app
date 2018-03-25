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
          props.messages
          .map((item, index)=>
             {
              return (<tr key={item[0]+index} className="table-row">
              <td className="table-data">{item[0]}</td>
              <td
                className=  {"table-data " + ((item[2] === SAME) ? 'same' :
                ((item[2] === INCREASED) ? 'increased' : 'decreased'))}>
                {item[1]}
              </td>
              <td className="table-data">{item[3]}</td>
            </tr>);
          })
        }
       </tbody>
     </table>
  )};

export default Table;
