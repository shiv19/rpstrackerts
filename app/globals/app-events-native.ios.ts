import * as app from 'application';

class MyDelegate extends UIResponder implements UIApplicationDelegate {
    public static ObjCProtocols = [UIApplicationDelegate];

    applicationWillFinishLaunchingWithOptions(
        _application: UIApplication,
        _launchOptions: NSDictionary<any, any>
    ): boolean {
        console.logIos('applicationWillFinishLaunchingWithOptions');
        return true;
    }

    applicationDidFinishLaunchingWithOptions(
        _application: UIApplication,
        _launchOptions: NSDictionary<any, any>
    ): boolean {
        console.logIos('applicationDidFinishLaunchingWithOptions');
        return true;
    }

    applicationDidBecomeActive(_application: UIApplication): void {
        console.logIos('applicationDidBecomeActive');
    }

    applicationDidEnterBackground(_application: UIApplication): void {
        console.logIos('applicationDidEnterBackground');
    }

    applicationWillResignActive(_application: UIApplication) {
        console.logIos('applicationWillResignActive');
    }

    applicationWillEnterForeground(_application: UIApplication) {
        console.logIos('applicationWillEnterForeground');
    }

    applicationWillTerminate(_application: UIApplication) {
        console.logIos('applicationWillTerminate');
    }
}

export const setNativeEvents = () => {
    app.ios.delegate = MyDelegate;
};
