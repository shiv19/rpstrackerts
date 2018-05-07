// const config = require('../config/app-config');
import { Observable } from 'data/observable';
import { ObservableArray } from 'data/observable-array';
import { RadDataForm } from 'nativescript-ui-dataform';
import {
  toCreateCommentRequest,
  toCreateTaskRequest,
  toDeleteItemRequest,
  toUpdateItemRequest
} from '~/core/contracts/requests/backlog';
import {
  PtAuthService,
  PtCommentService,
  PtTaskService
} from '~/core/contracts/services';
import { PtBacklogService } from '~/core/contracts/services/pt-backlog-service.contract';
import { AppConfig } from '~/core/models/config/app-config.model';
import { getCurrentUserAvatar } from '~/core/services/avatar.service';
import {
  getAuthService,
  getBacklogService,
  getCommentService,
  getTaskService
} from '~/globals/dependencies/locator';
import { back } from '~/shared/helpers/navigation/nav.helper';
import { appConfig } from '../../../../config/app-config';
import {
  PT_ITEM_PRIORITIES,
  PT_ITEM_STATUSES
} from '../../../../core/constants';
import { ItemType } from '../../../../core/constants/pt-item-types';
import { PtItem, PtUser } from '../../../../core/models/domain';
import { EMPTY_STRING } from '../../../../core/models/domain/constants/strings';
import { PriorityEnum } from '../../../../core/models/domain/enums';
import { PtItemType } from '../../../../core/models/domain/types';
import { PtNewComment, PtNewTask } from '../../../../core/models/dto/backlog';
import {
  PtItemDetailsEditFormModel,
  applyFormModelUpdatesToItem,
  ptItemToFormModel
} from '../../../../core/models/forms';
import { DetailScreenType } from '../../../../core/models/types';
import { PtCommentModel } from './pt-comment.vm';
import { PtTaskModel } from './pt-task.vm';

const config = <AppConfig>appConfig;

export class DetailViewModel extends Observable {
  private authService: PtAuthService;
  private backlogService: PtBacklogService;
  private taskService: PtTaskService;
  private commentService: PtCommentService;

  public selectedScreen: DetailScreenType = 'details';
  public itemTitle: string;
  private selectedAssignee: PtUser;

  /* details form */
  public itemForm: PtItemDetailsEditFormModel = null;
  public itemTypesProvider = ItemType.List.map(t => t.PtItemType);
  public statusesProvider = PT_ITEM_STATUSES;
  public prioritiesProvider = PT_ITEM_PRIORITIES;
  public selectedTypeValue: PtItemType;
  public selectedPriorityValue: PriorityEnum;
  public itemTypeImage;
  /* details form END */

  /* tasks */
  public newTaskTitle = EMPTY_STRING;
  public tasks: ObservableArray<PtTaskModel>;
  /* tasks END */

  /* comments */
  public currentUserAvatar: string;
  public newCommentText = EMPTY_STRING;
  public comments: ObservableArray<PtCommentModel>;
  /* comments END */

  public get itemTypeEditorDisplayName() {
    return 'Type';
  }

  public getSelectedAssignee() {
    return this.selectedAssignee ? this.selectedAssignee : this.ptItem.assignee;
  }

  public setSelectedAssignee(selectedAssignee: PtUser) {
    if (selectedAssignee) {
      this.set('selectedAssignee', selectedAssignee);
      this.onPropertyCommitted();
    }
  }

  constructor(
    private ptItem: PtItem,
    private itemDetailsDataForm: RadDataForm
  ) {
    super();

    this.authService = getAuthService();
    this.backlogService = getBacklogService();
    this.taskService = getTaskService();
    this.commentService = getCommentService();

    this.itemForm = ptItemToFormModel(ptItem);
    this.itemDetailsDataForm = itemDetailsDataForm;

    this.currentUserAvatar = getCurrentUserAvatar(
      config.apiEndpoint,
      this.authService.getCurrentUserId()
    );
    this.itemTitle = ptItem.title;
    this.selectedAssignee = ptItem.assignee;

    this.tasks = new ObservableArray<PtTaskModel>(
      ptItem.tasks.map(task => new PtTaskModel(task, ptItem))
    );
    this.comments = new ObservableArray<PtCommentModel>(
      ptItem.comments.map(comment => new PtCommentModel(comment))
    );
  }

  public onNavBackTap() {
    back();
  }

  public onTabDetailsTap(args) {
    this.set('selectedScreen', 'details');
  }

  public onTabTasksTap(args) {
    this.set('selectedScreen', 'tasks');
  }

  public onTabChitchatTap(args) {
    this.set('selectedScreen', 'chitchat');
  }

  /* details START */
  public updateSelectedTypeValue(selTypeValue: PtItemType) {
    this.set('selectedTypeValue', selTypeValue);
    this.set(
      'itemTypeImage',
      ItemType.imageResFromType(this.selectedTypeValue)
    );
  }

  public updateSelectedPriorityValue(
    editorPriority: PriorityEnum
  ): PriorityEnum {
    const selectedPriorityValue = editorPriority
      ? editorPriority
      : <PriorityEnum>this.itemForm.priorityStr;
    this.set('selectedPriorityValue', selectedPriorityValue);
    return selectedPriorityValue;
  }

  public deleteRequested() {
    const deleteItemRequest = toDeleteItemRequest(this.ptItem);
    this.backlogService
      .deletePtItem(deleteItemRequest)
      .then(() => {
        back();
      })
      .catch(() => {
        console.log('some error occured');
        back();
      });
  }
  /* details END */

  /* tasks START */
  public onAddTask(args) {
    const newTitle = this.newTaskTitle.trim();
    if (newTitle.length === 0) {
      return;
    }

    const newTask: PtNewTask = {
      title: newTitle,
      completed: false
    };

    const createTaskRequest = toCreateTaskRequest(newTask, this.ptItem);

    this.taskService
      .addNewPtTask(createTaskRequest)
      .then(response => {
        this.tasks.unshift(new PtTaskModel(response.createdTask, this.ptItem));
        this.set('newTaskTitle', EMPTY_STRING);
      })
      .catch(error => {
        console.log('something went wrong when adding task');
      });
  }
  /* tasks END */

  /* comments START */
  public onAddComment(args) {
    const newCommentTxt = this.newCommentText.trim();
    if (newCommentTxt.length === 0) {
      return;
    }

    const newComment: PtNewComment = {
      title: newCommentTxt
    };

    const createCommentRequest = toCreateCommentRequest(
      newComment,
      this.ptItem
    );

    this.commentService
      .addNewPtComment(createCommentRequest)
      .then(response => {
        const addedComment = response.createdComment;
        addedComment.user.avatar = this.currentUserAvatar;
        this.comments.unshift(new PtCommentModel(addedComment));
        this.set('newCommentText', EMPTY_STRING);
      })
      .catch(error => {
        console.log('something went wrong when adding comment');
      });
  }
  /* comments END */

  public onPropertyCommitted() {
    this.notifyUpdateItem();
  }

  private notifyUpdateItem() {
    this.itemDetailsDataForm
      .validateAll()
      .then(ok => {
        if (ok) {
          const updatedItem = applyFormModelUpdatesToItem(
            this.ptItem,
            this.itemForm,
            this.selectedAssignee
          );

          const updateItemRequest = toUpdateItemRequest(config, updatedItem);

          this.backlogService.updatePtItem(updateItemRequest);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }
}
