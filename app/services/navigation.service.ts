import { topmost, NavigationEntry, Frame } from 'ui/frame';

import { ROUTES } from '../shared/routes';


export function getCurrentPage() {
    const currentPage = topmost().currentPage;
    return currentPage;
}

export function navigate(pageModuleNameOrNavEntry: string | NavigationEntry, otherFrame?: Frame) {
    const navFrame = otherFrame ? otherFrame : topmost();
    if (typeof pageModuleNameOrNavEntry === 'object') {
        navFrame.navigate(pageModuleNameOrNavEntry);
    } else if (typeof pageModuleNameOrNavEntry === 'string') {
        navFrame.navigate(pageModuleNameOrNavEntry);
    }
}

export function back() {
    topmost().goBack();
}

export function goToLoginPage() {
    const navEntry: NavigationEntry = {
        moduleName: ROUTES.loginPage,
        clearHistory: true
    };
    navigate(navEntry);
}

export function goToRegisterPage(clearHistory?: boolean) {
    const navEntry: NavigationEntry = {
        moduleName: ROUTES.registerPage,
        clearHistory: clearHistory
    };
    navigate(navEntry);
}

export function goToBacklogPage(clearHistory?: boolean) {
    const navEntry: NavigationEntry = {
        moduleName: ROUTES.backlogPage,
        clearHistory: clearHistory
    };
    navigate(navEntry);
}

export function goToDetailPage(clearHistory?: boolean) {
    const navEntry: NavigationEntry = {
        moduleName: ROUTES.detailPage,
        clearHistory: clearHistory
    };
    navigate(navEntry);
}
