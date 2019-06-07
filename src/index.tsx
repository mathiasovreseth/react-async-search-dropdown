/**
 * @class AsyncSearch
 */

import * as React from 'react';
import { CSSProperties, RefObject, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  background-color: #fff;
  height: 31px;
  position: relative;
  border-radius: 3px;
  border: 1px solid rgba(208, 211, 212, 0.7);
  width: 160px;
  /*Removes the default x on input field in ie11*/
  input[type='search']::-ms-clear {
    display: none;
    width: 0;
    height: 0;
  }
  input[type='search']::-ms-reveal {
    display: none;
    width: 0;
    height: 0;
  }

  /* clears the 'X' from Chrome */
  input[type='search']::-webkit-search-decoration,
  input[type='search']::-webkit-search-cancel-button,
  input[type='search']::-webkit-search-results-button,
  input[type='search']::-webkit-search-results-decoration {
    display: none;
  }
  &:hover {
    cursor: text;
  }
  transition: box-shadow 0.2s ease-in-out;
`;

const Input = styled.input`
  border: none;
  color: #333;
  font-family: Lato, sans-serif;
  font-size: 14px;
  background-color: #fff;
  border-radius: 3px;
  width: 75%;
  margin-left: 0.5em;
  -webkit-appearance: none;
  -webkit-moz-appearance: none;
  appearance: none;
  font-weight: bold;
  &:focus:enabled {
    outline: none;
  }
`;
const RemoveButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 4px;
  margin-left: 4px;

  &:hover {
    cursor: pointer;
  }
`;
const Popover = styled.div`
  position: absolute;
  box-sizing: border-box;
  border-radius: 3px;
  box-shadow: 0 2px 7px 0 rgba(0, 0, 0, 0.1);
  padding: 0.5em;
  z-index: 3;
  top: 38px;
  min-width: 160px;
  max-height: 25em;
  width: max-content;
  max-width: 20em;
  overflow-y: auto;
  background-color: #fff;
  //transition: 1s ease-in-out;
`;

const ListDiv = styled.div`
  padding: 0.5em;
  align-items: center;
  display: flex;
  font-size: 14px;
  font-family: Lato, sans-serif;
  border-bottom: 1px solid grey;
`;

const SearchIcon = styled.div`
  color: rgb(255, 92, 57);
  display: flex;
  align-items: center;
  margin-left: 4px;
  margin-right: 4px;
  font-size: 18px;
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(-45deg);
  -o-transform: rotate(-45deg);
  transform: rotate(-45deg);
`;

interface ItemType {
  id: number;
  label: string;
}

interface IAsyncSearchDropdown {
  /***
   * if true, a default styled list will appear and you will not be able to use the RenderItem prop
   */
  defaultListStyling: boolean;
  /**
   * boolean if you want to render a searchIcon
   */
  leftIcon?: boolean;
  /**
   * A boolean for if the user can press the x button and clear all the selected items
   */
  canClearAll?: boolean;
  /**
   * Placeholder text for the input object,
   * Will be replaced by the label of the items you select
   */
  placeholder?: string;
  /**
   * Will be called everytime there is a change in the selection of items, and returns the new items
   * @param items
   */
  onChange: (items: Array<any>) => void;
  /**
   * When you want the dropdown to be disabled, grey's out the box and makes it unclickable
   */
  disabled?: boolean;
  /**
   * render prop for reusibility so you can style the list of items how you want it
   * @param items that is returned by the getItems promise
   * @param i the index of each item
   * @param isActive boolean for if the item is active
   */
  renderItem?: (
    items: Array<any>,
    i: number,
    isActive: boolean,
    isSelected: boolean,
    img: any
  ) => React.ReactNode;
  /**
   * if you want to change the size of the dropdown
   */
  style?: CSSProperties;
  /***
   * Message when there are no items to render
   */
  noResultMessage?: string;
  /**
   *  returns a promise with the  items that renders in the dropdown
   * @param input value from input
   */
  getItems: (input: string) => Promise<Array<any>>;
}

export const AsyncSearchDropdown: React.FunctionComponent<
  IAsyncSearchDropdown
  > = (props: IAsyncSearchDropdown) => {
  let containerRef: RefObject<any>;
  let popoverRef: RefObject<any>;
  let timeOutId: any = null;
  const [searchValue, setSearchValue] = React.useState<string>('');
  containerRef = React.createRef();
  popoverRef = React.createRef();

  const [items, setItems] = React.useState([]);
  const [isPopoverOpen, setPopoverState] = React.useState(false);
  const [hoveredIndex, sethoveredIndex] = React.useState(-1);
  const [lastSelectedItem, setLastSelectedItem] = React.useState(
    props.placeholder
  );
  const [selectedItems, setSelectedItems] = React.useState<Array<ItemType>>([]);

  useEffect(() => {
    document.addEventListener('keyup', handleKeyPress);

    return () => {
      document.removeEventListener('keyup', handleKeyPress);
    };
  });

  function handleKeyPress(e: any) {
    if (e.which === 38) {
      if (hoveredIndex > 0) {
        sethoveredIndex(c => c - 1);
      }
    } else if (e.which === 40) {
      if (hoveredIndex < items.length - 1) {
        sethoveredIndex(c => c + 1);
      }
    } else if (e.which === 13) {
      if (isPopoverOpen && hoveredIndex > -1) {
        const selectedItem = items[hoveredIndex];
        handleClickItem(selectedItem, hoveredIndex);
      }
    } else if (e.which === 27) {
      setPopoverState(false);
    }
  }

  function handleClickItem(item: ItemType, index: number) {
    // check if item is already selected
    let isSelected2 = false;
    selectedItems.forEach(t => {
      if (t.id === item.id) {
        isSelected2 = true;
      }
    });
    /* creates a shallow copy of the selected items, then it pushes the new object into
       the copy. After that it runs the setSelectedItems hook with the copy as value
    */
    if (isSelected2) {
      const temp = selectedItems.slice();
      const indexToRemove = temp.findIndex(function(tempValue: any) {
        return tempValue.id === item.id;
      });
      temp.splice(indexToRemove, 1);
      setSelectedItems(temp);
      props.onChange(temp);
    } else {
      const copy = selectedItems.slice();
      copy.push(item);
      setSelectedItems(copy);

      // Changes the placeholder text to the items that are chosen
      if (copy.length > 1) {
        setLastSelectedItem(c => c + '...' + item.label);
      } else {
        setLastSelectedItem(item.label);
      }
      // Empties the input's value, dispatches an onChange event, and closes the popover
      setSearchValue('');
      props.onChange(copy);
      sethoveredIndex(-1);
    }
    onBlurHandler();
  }

  function handleSearchChange(e: any) {
    e.persist();
    setSearchValue(e.target.value);
    if (searchValue.length > 1) {
      setPopoverState(true);
    } else {
      setPopoverState(false);
    }


    props.getItems(e.target.value).then((result: any) => {
      setItems(result);
    });

  }

  function clearAllItems() {
    setSelectedItems([]);
    setLastSelectedItem('');
    setSearchValue('');
    props.onChange([]);
  }

  function onBlurHandler() {
    timeOutId = setTimeout(() => {
      setPopoverState(false);
    }, 200);
  }
  return (
    <Container
      style={props.style}
      ref={containerRef}
      onBlur={() => onBlurHandler()}
      onFocus={() => {
        if (searchValue.length > 2) {
          setPopoverState(true);
        }
      }}
    >
      {props.leftIcon && <SearchIcon>&#9906;</SearchIcon>}
      <Input
        type="search"
        value={searchValue}
        onChange={e => handleSearchChange(e)}
        placeholder={lastSelectedItem || props.placeholder || 'Search here...'}
      />
      {props.canClearAll && (
        <RemoveButton onClick={() => clearAllItems()}>&#10005;</RemoveButton>
      )}
      {isPopoverOpen && (
        <Popover
          ref={popoverRef}
          onBlur={() => onBlurHandler()}
          onClick={e => {
            clearTimeout(timeOutId);
          }}
        >
          {items.length === 0 && (
            <div
              style={{
                display: 'flex',
                fontFamily: 'Lato,sans-serif',
                fontSize: '14px',
                fontWeight: 'bold',
                justifyContent: 'center',
              }}
            >
              {props.noResultMessage || 'No result...'}
            </div>
          )}
          {items.map((c: any, i) => {
            const isActive = hoveredIndex === i;
            let isSelected = false;
            selectedItems.forEach(t => {
              if (t.id === c.id) {
                isSelected = true;
              }
            });
            return (
              <div
                onMouseEnter={() => {
                  sethoveredIndex(i);
                }}
                onMouseLeave={() => {
                  sethoveredIndex(-1);
                }}
                key={i}
                onClick={() => {
                  handleClickItem(c, i);
                }}
              >
                {!props.defaultListStyling &&
                props.renderItem &&
                props.renderItem(c, i, isActive, isSelected, c.img)}
                {props.defaultListStyling && (
                  <ListDiv
                    style={{
                      backgroundColor: isActive ? '#00B0B9' : '#fff',
                      cursor: isActive ? 'pointer' : 'normal',
                    }}
                  >
                    <div
                      style={{
                        height: '1.6em',
                        fontSize: '18px',
                        color: isSelected ? 'red' : 'grey',
                        marginRight: '.5em',
                      }}
                    >
                      &#10003;
                    </div>
                    {c.label}
                  </ListDiv>
                )}
              </div>
            );
          })}
        </Popover>
      )}
    </Container>
  );
};
