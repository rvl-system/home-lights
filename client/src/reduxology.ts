import { Reduxology } from 'reduxology';
import { Actions } from './common/actions';
import { State } from './types';

const reduxology = new Reduxology<State, Actions>();

export const createContainer = reduxology.createContainer;
export const createReducer = reduxology.createReducer;
export const handle = reduxology.handle;
export const createApp = reduxology.createApp;
export const dispatch = reduxology.dispatch;
