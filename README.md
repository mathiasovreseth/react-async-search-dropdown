# react-async-search-dropdown

>Simple customizable async dropdown with search! 
https://scouns.github.io/react-async-search-dropdown/

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
                leftIcon={true}
                defaultListStyling={false}
                canClearAll={true}
                onChange={(values)=> {
                }}
                placeholder={'Search here...'}
                getItems={(input) => {
                  return new Promise(async (resolve, reject) => {
                  try {
                   resolve(items);
                  }
                  catch (e) {
                  console.error('Fail', e);
                  reject(e);
                }
                });
                }}
                renderItem={(value, i, isActive, isSelected, img) => (
                  <div
                    key={value.id + i}
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

## Props
```tsx
  leftIcon - A boolean for if you want a search icon 
  canClearAll - An X button will show that clears all selectedItems onClick
  defaultListStyling - A boolean for if you want to use predefined styling for the popover list, the renderItem prop will then be invalid
  onChange - The onChange event occurs when there have been changes to the selectedItems
  placeholder - Placeholder text for the input. The text will be replaced by the label of the items you select
  getItems - Based on the input on the dropdown it returns a list with items that renders in the dropdown
  renderItem - A render props for if you want to style the popover list yourself
```


## License

MIT © [Scouns](https://github.com/Scouns)
