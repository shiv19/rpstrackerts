import * as utils from "utils/utils";

declare var UIApplication: any;
declare var UIStatusBarStyle: any;

export function setStatusBarColors() {
    utils.ios.getter(
        UIApplication,
        UIApplication.sharedApplication
    ).statusBarStyle =
        UIStatusBarStyle.LightContent;
}
