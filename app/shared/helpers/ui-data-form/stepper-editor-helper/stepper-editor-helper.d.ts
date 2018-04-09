import { Color } from 'color';

export function setStepperEditorContentOffset(editor, horizontalOffset: number, verticalOffset: number): void;
export function setStepperEditorTextPostfix(editor, singularPostfix: string, pluralPostfix: string): void;
export function setStepperEditorColors(editor, lightColor: Color, darkColor: Color): void;

declare module com {
    module telerik {
        module android {
            module common {
                class Procedure<T> {
                    constructor(imp);
                }
            }

        }
        module widget {
            class RadioGroup {
                setPadding(l, t, r, b);
            }

            module numberpicker {
                class RadNumberPicker {
                    rootView;
                    labelView();
                    decreaseView();
                    increaseView();
                }
            }
        }
    }
}
