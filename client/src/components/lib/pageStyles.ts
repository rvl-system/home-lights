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
    'max-height': '100%',
    display: 'grid',
    'grid-template-rows':
      '[header-start] auto [content-start] minmax(0, 1fr) [end]',
    'grid-template-columns':
      '[left-start] auto [center-start] 1fr [right-start] auto [end]'
  },
  header: {
    'grid-column-start': 'right-start',
    'grid-column-end': 'end',
    'grid-row-start': 'header-start',
    'grid-row-end': 'content-start',
    margin: '1em'
  },
  altHeader: {
    'grid-column-start': 'left-start',
    'grid-column-end': 'center-start',
    'grid-row-start': 'header-start',
    'grid-row-end': 'content-start',
    padding: '1em'
  },
  content: {
    'grid-column-start': 'left-start',
    'grid-column-end': 'end',
    'grid-row-start': 'content-start',
    'grid-row-end': 'end',
    position: 'relative',
    'overflow-y': 'scroll'
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
    'flex-direction': 'column'
  },
  itemHeading: {
    display: 'grid',
    'grid-template-columns':
      '[left-icon-start] auto [title-start] 1fr [right-icon-start] auto [end]',
    'grid-template-rows': 'auto',
    width: '100%',
    height: '38px',
    'align-items': 'center'
  },
  leftButton: {
    'min-width': '4em',
    width: '4em',
    'grid-column-start': 'left-icon-start',
    'grid-column-end': 'title-start',
    'grid-row-start': 1,
    'grid-row-end': 1
  },
  itemTitle: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    'padding-left': '1em',
    'grid-column-start': 'title-start',
    'grid-column-end': 'right-icon-start',
    'grid-row-start': 1,
    'grid-row-end': 1
  },
  rightButton: {
    'min-width': '2em',
    width: '2em',
    'grid-column-start': 'right-icon-start',
    'grid-column-end': 'end',
    'grid-row-start': 1,
    'grid-row-end': 1,
    'margin-right': '12px'
  },
  rightAccordionButton: {
    'min-width': '2em',
    width: '2em',
    'grid-column-start': 'right-icon-start',
    'grid-column-end': 'end',
    'grid-row-start': 1,
    'grid-row-end': 1
  }
}));
