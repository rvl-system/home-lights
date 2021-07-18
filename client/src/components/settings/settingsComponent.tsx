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

import { Button, makeStyles, Typography } from '@material-ui/core';
import React, { FunctionComponent, useState } from 'react';
import { RVLInfo, Theme } from '../../common/types';
import { ConfirmDialog } from '../lib/confirmDialog';
import { GroupInput } from '../lib/formInputs/groupInput';
import { SelectInput } from '../lib/formInputs/selectInput';
import { useContainerStyles } from '../lib/pageStyles';

const useStyles = makeStyles({
  innerContainer: {
    padding: '25px 20px'
  },
  row: {
    paddingBottom: '30px'
  }
});

export interface SettingsComponentProps {
  theme: Theme;
  philipsHueBridgeIp: string | undefined;
  rvlInfo: RVLInfo;
}

export interface SettingsComponentDispatch {
  setTheme: (theme: Theme) => void;
  connectPhilipsHueBridge: () => void;
  refreshPhilipsHueLights: () => void;
  refreshLIFXLights: () => void;
  setRVLInterface: (networkInterface: string) => void;
}

export const settingsComponent: FunctionComponent<
  SettingsComponentProps & SettingsComponentDispatch
> = (props) => {
  const classes = useContainerStyles();
  const contentClasses = useStyles();
  const [changeInterfaceDialogOpen, setChangeInterfaceDialogOpen] = useState(
    false
  );
  const [selectedNetworkInterface, setSelectedNetworkInterface] = useState(
    props.rvlInfo.networkInterface
  );
  return (
    <div className={classes.container}>
      <div className={contentClasses.innerContainer}>
        <div className={contentClasses.row}>
          <GroupInput label="General">
            <SelectInput
              name="Theme"
              label="Theme"
              defaultValue={props.theme}
              options={[
                {
                  value: Theme.Auto,
                  label: Theme.Auto
                },
                {
                  value: Theme.Light,
                  label: Theme.Light
                },
                {
                  value: Theme.Dark,
                  label: Theme.Dark
                }
              ]}
              onChange={(value) => props.setTheme(value as Theme)}
            />
          </GroupInput>
        </div>
        <div className={contentClasses.row}>
          <GroupInput label="Philips Hue"></GroupInput>
          <div className={contentClasses.row}>
            {props.philipsHueBridgeIp ? (
              <Typography>Bridge IP: {props.philipsHueBridgeIp}</Typography>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={props.connectPhilipsHueBridge}
              >
                Connect Bridge
              </Button>
            )}
          </div>
          <div className={contentClasses.row}>
            <Button
              variant="contained"
              color="primary"
              onClick={props.refreshPhilipsHueLights}
            >
              Refresh Lights
            </Button>
          </div>
        </div>
        <div className={contentClasses.row}>
          <GroupInput label="LIFX"></GroupInput>
          <div className={contentClasses.row}>
            <Button
              variant="contained"
              color="primary"
              onClick={props.refreshLIFXLights}
            >
              Refresh Lights
            </Button>
          </div>
        </div>
        <div className={contentClasses.row}>
          <GroupInput label="RVL">
            <SelectInput
              name="RVL Network Interface"
              label="RVL Network Interface"
              defaultValue={props.rvlInfo.networkInterface || ''}
              options={props.rvlInfo.availableInterfaces.map(
                (networkInterface) => ({
                  value: networkInterface,
                  label: networkInterface
                })
              )}
              onChange={(value) => {
                setSelectedNetworkInterface(value);
                setChangeInterfaceDialogOpen(true);
              }}
            />
          </GroupInput>
        </div>
      </div>
      <ConfirmDialog
        onConfirm={() => {
          setChangeInterfaceDialogOpen(false);
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          props.setRVLInterface(selectedNetworkInterface!);
        }}
        onCancel={() => setChangeInterfaceDialogOpen(false)}
        open={changeInterfaceDialogOpen}
        title={`Changing the network interface to "${selectedNetworkInterface}" requires a server reboot, proceed?`}
        description="The app will briefly disconnect"
        confirmLabel="Reboot"
        confirmColor="secondary"
      />
    </div>
  );
};
