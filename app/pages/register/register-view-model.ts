import { Observable, PropertyChangeData } from 'data/observable';
import { EventData } from 'ui/frame';

import * as emailValidator from 'email-validator';

import { register } from '../../services/auth-service';
import { ROUTES } from '../../shared/routes';
import { PtRegisterModel } from '../../core/models/domain';

export class RegisterViewModel extends Observable {
    fullName: string;
    nameEmpty: boolean;
    email: string;
    emailValid: boolean;
    emailEmpty: boolean;
    password: string;
    passwordEmpty: boolean;
    formValid: boolean;

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

    onRegister(args: any) {
        const registerModel: PtRegisterModel = {
            username: this.email,
            password: this.password,
            fullName: this.fullName
        };

        register(registerModel)
            .then(response => {
                args.object.page.frame.navigate(ROUTES.backlogPage);
            })
            .catch(error => {
                console.error(error);
            });
    }
}
