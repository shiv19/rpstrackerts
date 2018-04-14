import { Observable } from 'data/observable';
import { ShownModallyData } from 'ui/page';

import { PtModalContext } from '../../../models/ui';

export class TextInputModalViewModel extends Observable {

    protected modalContext: PtModalContext<string, string>;
    protected closeCallback: Function;

    public modalTitle: string;
    public theText: string;
    public okText: string;

    constructor(
        private modalData: ShownModallyData
    ) {
        super();

        this.modalContext = <PtModalContext<string, string>>this.modalData.context;
        this.closeCallback = this.modalData.closeCallback;

        this.modalTitle = this.modalContext.title;
        this.theText = this.modalContext.payload;
        this.okText = this.modalContext.btnOkText;
    }

    public onOkButtonTap() {
        this.closeCallback(this.theText);
    }

    public onCancelButtonTap(): void {
        this.closeCallback(this.modalContext.payload);
    }
}
