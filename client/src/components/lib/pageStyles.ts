/*
Copyright (c) Bryan Hughes <bryan@nebri.us>

This file is part of Home Lights.

Home Lights is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Home Lights is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Home Lights.  If not, see <http://www.gnu.org/licenses/>.
*/

import { makeStyles } from '@material-ui/core/styles';

export const useContainerStyles = makeStyles({
  container: {
    height: '100%',
    maxHeight: '100%',
    display: 'grid',
    gridTemplateRows:
      '[header-start] auto [content-start] minmax(0, 1fr) [end]',
    gridTemplateColumns:
      '[left-start] auto [center-start] 1fr [right-start] auto [end]'
  },
  header: {
    gridColumnStart: 'right-start',
    gridColumnEnd: 'end',
    gridRowStart: 'header-start',
    gridRowEnd: 'content-start',
    margin: '1em'
  },
  altHeader: {
    gridColumnStart: 'left-start',
    gridColumnEnd: 'center-start',
    gridRowStart: 'header-start',
    gridRowEnd: 'content-start',
    padding: '1em'
  },
  content: {
    gridColumnStart: 'left-start',
    gridColumnEnd: 'end',
    gridRowStart: 'content-start',
    gridRowEnd: 'end',
    position: 'relative',
    overflowY: 'scroll'
  },
  innerContent: {
    position: 'absolute',
    width: '100%'
  }
});

export const useContentStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  detailContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  itemHeading: {
    display: 'grid',
    gridTemplateColumns:
      '[left-icon-start] auto [title-start] 1fr [right-icon-start] auto [end]',
    gridTemplateRows: 'auto',
    width: '100%',
    height: '50px',
    alignItems: 'center'
  },
  listItem: {
    display: 'grid',
    gridTemplateColumns:
      '[left-icon-start] auto [title-start] 1fr [right-icon-start] auto [end]',
    gridTemplateRows: 'auto',
    width: '100%',
    height: '65px',
    paddingLeft: '10px',
    paddingRight: '10px',
    alignItems: 'center'
  },
  leftButton: {
    minWidth: '4em',
    width: '4em',
    gridColumnStart: 'left-icon-start',
    gridColumnEnd: 'title-start',
    gridRowStart: 1,
    gridRowEnd: 1
  },
  itemTitle: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    paddingLeft: '1em',
    gridColumnStart: 'title-start',
    gridColumnEnd: 'right-icon-start',
    gridRowStart: 1,
    gridRowEnd: 1
  },
  rightButton: {
    minWidth: '2em',
    width: '2em',
    gridColumnStart: 'right-icon-start',
    gridColumnEnd: 'end',
    gridRowStart: 1,
    gridRowEnd: 1,
    marginRight: '12px'
  },
  rightAccordionButton: {
    minWidth: '2em',
    width: '2em',
    gridColumnStart: 'right-icon-start',
    gridColumnEnd: 'end',
    gridRowStart: 1,
    gridRowEnd: 1
  }
}));
