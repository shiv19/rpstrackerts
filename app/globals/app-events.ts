import * as app from 'application';

import { setNativeEvents } from './app-events-native';
import { setStatusBarColors } from '../utils';

export const setAppEvents = () => {

    setNativeEvents();

    app.on(app.launchEvent, function (_args: app.ApplicationEventData) {
        console.logNativeScript('launchEvent');
    });

    app.on(app.displayedEvent, function (_args: app.ApplicationEventData) {
        console.logNativeScript('displayedEvent');
    });

    app.on(app.suspendEvent, function (_args: app.ApplicationEventData) {
        console.logNativeScript('suspendEvent');
    });

    app.on(app.resumeEvent, function (_args: app.ApplicationEventData) {
        console.logNativeScript('resumeEvent');
        setStatusBarColors();
    });

    app.on(app.exitEvent, function (_args: app.ApplicationEventData) {
        console.logNativeScript('exitEvent');
    });

    app.on(app.lowMemoryEvent, function (_args: app.ApplicationEventData) {
        console.logNativeScript('lowMemoryEvent');
    });

    app.on(app.uncaughtErrorEvent, function (_args: app.ApplicationEventData) {
        console.logNativeScript('uncaughtErrorEvent');
    });

    app.on(app.orientationChangedEvent, function (_args: app.ApplicationEventData) {
        console.logNativeScript('orientationChangedEvent');
    });
};
