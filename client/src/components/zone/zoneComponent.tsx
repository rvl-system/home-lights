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

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Slider
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import React, { FunctionComponent } from 'react';
import { BRIGHTNESS_STEP, MAX_BRIGHTNESS } from '../../common/config';
import { EditMode, Scene, Zone, ZoneState } from '../../common/types';
import { useContentStyles } from '../lib/pageStyles';
import { ZoneScenesContainer } from '../scene/zoneScenesContainer';
import { DeleteZoneButton, DeleteZoneButtonDispatch } from './deleteZoneButton';
import { EditZoneButtonContainer } from './editZoneButtonContainer';
import { ZonePowerSwitch, ZonePowerSwitchDispatch } from './zonePowerSwitch';

const useStyles = makeStyles({
  container: {
    width: '100%'
  }
});

export interface ZoneComponentProps {
  zone: Zone;
  editMode: EditMode;
  state: ZoneState;
  currentScene?: Scene;
}

export type ZoneComponentDispatch = DeleteZoneButtonDispatch &
  ZonePowerSwitchDispatch & {
    setZoneBrightness: (zoneId: number, brightness: number) => void;
  };

export const ZoneComponent: FunctionComponent<
  ZoneComponentProps & ZoneComponentDispatch
> = (props) => {
  const classes = useStyles();
  const contentClasses = useContentStyles();
  return (
    <React.Fragment>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} id="panel1a-header">
          <div className={classes.container}>
            <div className={contentClasses.itemHeading}>
              <DeleteZoneButton
                zone={props.zone}
                editMode={props.editMode}
                className={contentClasses.leftButton}
                deleteZone={props.deleteZone}
              />
              <ZonePowerSwitch
                className={contentClasses.leftButton}
                zone={props.zone}
                editMode={props.editMode}
                setZonePower={props.setZonePower}
                defaultChecked={props.state.power}
              />
              <Typography className={contentClasses.itemTitle}>
                {props.zone.name}
              </Typography>
              <EditZoneButtonContainer
                className={contentClasses.rightAccordionButton}
                zone={props.zone}
                editMode={props.editMode}
              />
            </div>
            <div>
              <Slider
                disabled={props.state.currentSceneId === undefined}
                value={props.currentScene ? props.currentScene.brightness : 0}
                valueLabelDisplay="auto"
                step={BRIGHTNESS_STEP}
                min={0}
                max={MAX_BRIGHTNESS}
                onChange={(e, newValue) => {
                  if (Array.isArray(newValue)) {
                    throw new Error(
                      'Internal Error: expected number but got number[]'
                    );
                  }
                  props.setZoneBrightness(props.zone.id, newValue);
                }}
              />
            </div>
          </div>
        </AccordionSummary>
        <AccordionDetails className={contentClasses.detailContainer}>
          <ZoneScenesContainer zone={props.zone} editMode={props.editMode} />
        </AccordionDetails>
      </Accordion>
    </React.Fragment>
  );
};
