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

import React, { FunctionComponent } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { Zone as ZoneType } from '../../common/types';
import { EditMode } from '../../types';
import { EditZoneButton, EditZoneButtonDispatch } from './editZoneButton';
import { DeleteZoneButton, DeleteZoneButtonDispatch } from './deleteZoneButton';
import { ZonePowerSwitch, ZonePowerSwitchDispatch } from './zonePowerSwitch';
import { useContentStyles } from '../lib/pageStyles';

export interface ZoneProps {
  zone: ZoneType;
  editMode: EditMode;
}

export type ZoneDispatch = EditZoneButtonDispatch &
  DeleteZoneButtonDispatch &
  ZonePowerSwitchDispatch;

export const Zone: FunctionComponent<ZoneProps & ZoneDispatch> = (props) => {
  const classes = useContentStyles();
  return (
    <React.Fragment>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div className={classes.itemHeading}>
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
            <Typography className={classes.itemTitle}>
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
};
