import { Observable, PropertyChangeData } from "data/observable";
import { EventData } from "tns-core-modules/ui/frame/frame";
import * as emailValidator from "email-validator";

export class RegisterViewModel extends Observable {
    name: string;
    nameEmpty: boolean;
    email: string;
    emailValid: boolean;
    emailEmpty: boolean;
    password: string;
    passwordEmpty: boolean;
    formValid: boolean;

    constructor() {
        super();

        this.set("name", "");
        this.set("nameEmpty", false);
        this.set("email", "");
        this.set("emailValid", true);
        this.set("emailEmpty", false);
        this.set("password", "");
        this.set("passwordEmpty", false);
        this.set("formValid", false);

        this.on(
            Observable.propertyChangeEvent,
            (propertyChangeData: PropertyChangeData) => {
                switch (propertyChangeData.propertyName) {
                    case "name":
                        if (this.name.trim() === "") {
                            this.set("nameEmpty", true);
                        } else {
                            this.set("nameEmpty", false);
                        }
                        break;

                    case "email":
                        if (this.email.trim() === "") {
                            this.set("emailEmpty", true);
                            this.set("emailValid", true);
                        } else if (emailValidator.validate(this.email)) {
                            this.set("emailValid", true);
                            this.set("emailEmpty", false);
                        } else {
                            this.set("emailValid", false);
                            this.set("emailEmpty", false);
                        }
                        break;

                    case "password":
                        if (this.password.trim().length === 0) {
                            this.set("passwordEmpty", true);
                        } else {
                            this.set("passwordEmpty", false);
                        }
                        break;

                    case "default":
                        return;
                }
                if (
                    !this.nameEmpty &&
                    this.emailValid &&
                    !this.emailEmpty &&
                    !this.passwordEmpty
                ) {
                    this.set("formValid", true);
                } else {
                    this.set("formValid", false);
                }
            }
        );
    }
}
