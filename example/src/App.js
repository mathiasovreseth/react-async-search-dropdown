import React, { Component } from 'react'

import AsyncSearchDropdown from 'react-async-search-dropdown'



export default class App extends Component {
  render () {
    return (
      <div>
        <AsyncSearchDropdown
          leftIcon={true}
          defaultListStyling={true}
          canClearAll={true}
          onChange={(values)=> {
          }}
          placeholder={'Søk her...'}
          getItems={(input) => {
            return new Promise(async (resolve, reject) => {
            const items = [];
            try {
              items.push({
                id: '1',
                label: 'Stryn kommune',
              }, {
                id: '2', label: 'Geiranger kommuneGeiranger'
              },
              {
                id: '3', label: 'breik'
              },
              {
                id: '4', label: 'Heisann'
              }

              );
              resolve(items);
            }
            catch (e) {
            console.error('Fail', e);
            reject(e);
          }
          });
          }}
          // renderItem={(value, i, isActive) => (
          //       <div
          //         key={'dasd' + value.label + i}
          //         style={{
          //         backgroundColor: isActive ? '#00B0B9' : '#fff',
          //           cursor: isActive ? 'pointer': 'normal',
          //         display: 'flex',
          //         borderBottom: '1px solid #333',
          //         padding: '.5em',
          //         boxSizing: 'borderBox',
          //       }}
          //       >
          //         {value.label}
          //       </div>
          //     )}
        />
      </div>
    )
  }
}
