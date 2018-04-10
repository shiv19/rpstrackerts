import { Observable, PropertyChangeData, EventData } from 'data/observable';

import * as emailValidator from 'email-validator';

import { register } from '../../services/auth.service';
import { goToBacklogPage, goToLoginPage } from '../../services/navigation.service';
import { PtRegisterModel } from '../../core/models/domain';


export class RegisterViewModel extends Observable {
    public fullName: string;
    public nameEmpty: boolean;
    public email: string;
    public emailValid: boolean;
    public emailEmpty: boolean;
    public password: string;
    public passwordEmpty: boolean;
    public formValid: boolean;

    constructor() {
        super();

        this.set('fullName', '');
        this.set('nameEmpty', false);
        this.set('email', '');
        this.set('emailValid', true);
        this.set('emailEmpty', false);
        this.set('password', '');
        this.set('passwordEmpty', false);
        this.set('formValid', false);

        this.on(
            Observable.propertyChangeEvent,
            (propertyChangeData: PropertyChangeData) => {
                switch (propertyChangeData.propertyName) {
                    case 'fullName':
                        if (this.fullName.trim() === '') {
                            this.set('nameEmpty', true);
                        } else {
                            this.set('nameEmpty', false);
                        }
                        break;

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
        );
    }

    public onRegisterTap(args: EventData) {
        const registerModel: PtRegisterModel = {
            username: this.email,
            password: this.password,
            fullName: this.fullName
        };

        register(registerModel)
            .then(response => {
                goToBacklogPage();
            })
            .catch(error => {
                console.error(error);
            });
    }

    public onGotoLoginTap(args: any) {
        goToLoginPage(false);
    }
}
