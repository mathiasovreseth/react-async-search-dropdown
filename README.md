# react-async-search-dropdown

>Simple customizable async dropdown with search!

[![NPM](https://img.shields.io/npm/v/react-async-search-dropdown.svg)](https://www.npmjs.com/package/react-async-search-dropdown) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-async-search-dropdown
```

## Usage

```tsx
import * as React from 'react'

import AsyncSearchDropdown from 'react-async-search-dropdown'

class AsyncSearchDropdown extends React.Component {
  render () {
    return (
       <AsyncSearchDropdown
                // if you want a search icon
                leftIcon={true}
                // If you want to use predefined styling for the popover list
                defaultListStyling={false}
                // if you want a X icon that clears all the selected items
                canClearAll={true}
      
                onChange={(values)=> {
                }}
                placeholder={'Search here...'}
                getItems={(input) => {
                  return new Promise(async (resolve, reject) => {
                  const items = [];
                  try {
                    items.push({
                      id: '1',
                      label: 'Obj1',
                    },
                    {
                      id: '2', label: 'Obj2'
                    },
                    {
                      id: '3', label: 'Obj3'
                    },
                    {
                      id: '4', label: 'Obj4'
                    });
      
                    resolve(items);
                  }
                  catch (e) {
                  console.error('Fail', e);
                  reject(e);
                }
                });
                }}
                // Optional renderProp if you want to style the popover list youself
                renderItem={(value, i, isActive) => (
                  <div
                    key={'dasd' + value.label + i}
                    style={{}}
                  >
                    {value.label}
                  </div>
                )}
              />
    )
  }
}
```

## License

MIT © [Scouns](https://github.com/Scouns)
