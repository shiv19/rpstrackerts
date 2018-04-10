import { Observable, PropertyChangeData, EventData } from 'data/observable';

import * as emailValidator from 'email-validator';

import { login } from '../../services/auth.service';
import { goToBacklogPage, goToRegisterPage } from '../../services/navigation.service';
import { PtLoginModel } from '../../core/models/domain';
import { EMPTY_STRING } from '../../core/helpers/string-helpers';


export class LoginViewModel extends Observable {
    public email = 'alex@email.com';
    public emailValid = true;
    public emailEmpty = false;
    public password = 'nuvious';
    public passwordEmpty = false;
    public formValid = true;
    public loggedIn = false;

    constructor() {
        super();

        this.on(Observable.propertyChangeEvent,
            (propertyChangeData: PropertyChangeData) => {
                this.validate(propertyChangeData.propertyName);
            }
        );
    }

    public onLoginTap() {
        const loginModel: PtLoginModel = {
            username: this.email,
            password: this.password
        };

        login(loginModel)
            .then(() => {
                goToBacklogPage(true);
            })
            .catch(error => {
                console.error(error);
            });
    }

    public onGotoRegisterTap(args: EventData) {
        goToRegisterPage();
    }

    private validate(changedPropName: string) {
        switch (changedPropName) {
            case 'email':
                if (this.email.trim() === EMPTY_STRING) {
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
                if (this.password.trim() === EMPTY_STRING) {
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
}

