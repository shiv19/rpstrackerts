import * as appSettings from 'application-settings';
import { Observable, PropertyChangeData, EventData } from 'data/observable';
import { Button } from 'ui/button';

import * as emailValidator from 'email-validator';

import { login } from '../../services/auth-service';
import { ROUTES } from '../../shared/routes';
import { PtLoginModel } from '../../core/models/domain';


export class LoginViewModel extends Observable {
    email: string;
    emailValid: boolean;
    emailEmpty: boolean;
    password: string;
    passwordEmpty: boolean;
    formValid: boolean;
    loggedIn: boolean;

    constructor() {
        super();

        this.set('email', 'alex@email.com');
        this.set('emailValid', true);
        this.set('emailEmpty', false);
        this.set('password', 'nuvious');
        this.set('passwordEmpty', false);
        this.set('formValid', true);
        this.set('loggedIn', true);

        this.on(
            Observable.propertyChangeEvent,
            (propertyChangeData: PropertyChangeData) => {
                switch (propertyChangeData.propertyName) {
                    case 'email':
                        if (this.email.trim() === '') {
                            this.set('emailEmpty', true);
                            this.set('emailValid', true);
                        } else if (emailValidator.validate(this.email)) {
                            this.set('emailValid', true);
                            this.set('emailEmpty', false);
                        } else {
                            this.set('emailValid', false);
                            this.set('emailEmpty', false);
                        }
                        break;

                    case 'password':
                        if (this.password.trim().length === 0) {
                            this.set('passwordEmpty', true);
                        } else {
                            this.set('passwordEmpty', false);
                        }
                        break;

                    case 'default':
                        return;
                }
                if (
                    this.emailValid &&
                    !this.emailEmpty &&
                    !this.passwordEmpty
                ) {
                    this.set('formValid', true);
                } else {
                    this.set('formValid', false);
                }
            }
        );
    }

    public onLoginTap(args: EventData) {
        const btn = <Button>args.object;
        const loginModel: PtLoginModel = {
            username: this.email,
            password: this.password
        };

        login(loginModel)
            .then(response => {
                appSettings.setString(
                    'loginDetails',
                    JSON.stringify(loginModel)
                );
                btn.page.frame.navigate({
                    moduleName: ROUTES.backlogPage,
                    clearHistory: true
                });
            })
            .catch(error => {
                console.error(error);
            });
    }

    public onGotoRegisterTap(args: EventData) {
        const btn = <Button>args.object;
        btn.page.frame.navigate({
            moduleName: ROUTES.registerPage,
            animated: false
        });
    }
}
