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

import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { Zone } from '../../common/types';
import { EditMode } from '../../types';
import { EditZoneButton, EditZoneButtonDispatch } from './editZoneButton';
import { DeleteZoneButton, DeleteZoneButtonDispatch } from './deleteZoneButton';
import { ZonePowerSwitch, ZonePowerSwitchDispatch } from './zonePowerSwitch';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  detailContainer: {
    display: 'flex',
    'flex-direction': 'column'
  },
  zoneHeading: {
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
  zoneTitle: {
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
    'grid-row-end': 1
  }
}));

export interface ZoneProps {
  zone: Zone;
  editMode: EditMode;
}

export type ZoneDispatch = EditZoneButtonDispatch &
  DeleteZoneButtonDispatch &
  ZonePowerSwitchDispatch;

export function Zone(props: ZoneProps & ZoneDispatch): JSX.Element {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div className={classes.zoneHeading}>
            <DeleteZoneButton
              zone={props.zone}
              editMode={props.editMode}
              className={classes.leftButton}
              deleteZone={props.deleteZone}
            />
            <ZonePowerSwitch
              className={classes.leftButton}
              zone={props.zone}
              editMode={props.editMode}
              toggleZonePower={props.toggleZonePower}
            />
            <Typography className={classes.zoneTitle}>
              {props.zone.name}
            </Typography>
            <EditZoneButton
              className={classes.rightButton}
              zone={props.zone}
              editMode={props.editMode}
              editZone={props.editZone}
            />
          </div>
        </AccordionSummary>
        <AccordionDetails className={classes.detailContainer}>
          <Typography>TODO: scenes for {props.zone.name}</Typography>
        </AccordionDetails>
      </Accordion>
    </React.Fragment>
  );
}
