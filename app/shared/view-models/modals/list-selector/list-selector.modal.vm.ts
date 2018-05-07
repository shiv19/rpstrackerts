import { Observable } from 'data/observable';
import { ShownModallyData } from 'ui/page';
import { PtModalContext } from '../../../../shared/helpers/modals';

export class ListSelectorModalViewModel<T, R> extends Observable {
  protected modalContext: PtModalContext<T, R>;
  protected closeCallback: Function;

  public modalTitle: string;
  public okText: string;

  public items;

  constructor(private modalData: ShownModallyData) {
    super();

    this.modalContext = <PtModalContext<T, R>>this.modalData.context;
    this.closeCallback = this.modalData.closeCallback;

    this.items = this.modalContext.payload;
  }

  public onCancelButtonTap(): void {
    this.closeCallback(this.modalContext.defaultResult);
  }

  public onItemSelected(args) {
    this.closeCallback(this.items[args.index]);
  }
}
