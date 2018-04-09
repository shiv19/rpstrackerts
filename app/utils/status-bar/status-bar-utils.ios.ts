import * as utils from 'utils/utils';

declare const UIApplication: any;
declare const UIStatusBarStyle: any;

export function setStatusBarColors() {
    utils.ios.getter(
        UIApplication,
        UIApplication.sharedApplication
    ).statusBarStyle =
        UIStatusBarStyle.LightContent;
}
