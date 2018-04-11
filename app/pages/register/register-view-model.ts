import { Observable, PropertyChangeData, EventData } from 'data/observable';

import * as emailValidator from 'email-validator';

import * as authService from '../../services/auth.service';
import * as navService from '../../services/navigation.service';
import { PtRegisterModel } from '../../core/models/domain';
import { EMPTY_STRING } from '../../core/models/domain/constants/strings';


export class RegisterViewModel extends Observable {
    public fullName = EMPTY_STRING;
    public nameEmpty = false;
    public email = EMPTY_STRING;
    public emailValid = true;
    public emailEmpty = false;
    public password = EMPTY_STRING;
    public passwordEmpty = false;
    public formValid = false;

    constructor() {
        super();

        this.on(Observable.propertyChangeEvent,
            (propertyChangeData: PropertyChangeData) => {
                this.validate(propertyChangeData.propertyName);
            }
        );
    }

    public onRegisterTap(args: EventData) {
        const registerModel: PtRegisterModel = {
            username: this.email,
            password: this.password,
            fullName: this.fullName
        };

        authService.register(registerModel)
            .then(() => {
                navService.goToBacklogPage(true);
            })
            .catch(error => {
                console.error(error);
            });
    }

    public onGotoLoginTap(args: any) {
        navService.goToLoginPage(false);
    }

    private validate(changedPropName: string) {
        switch (changedPropName) {
            case 'fullName':
                if (this.fullName.trim() === EMPTY_STRING) {
                    this.set('nameEmpty', true);
                } else {
                    this.set('nameEmpty', false);
                }
                break;

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
                if (this.password.trim().length === 0) {
                    this.set('passwordEmpty', true);
                } else {
                    this.set('passwordEmpty', false);
                }
                break;

            default:
                return;
        }
        if (
            !this.nameEmpty &&
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
