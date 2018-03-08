import { StackLayout } from "ui/layouts/stack-layout";
import { NavigatedData, Page } from "ui/page";
import { confirm, ConfirmOptions } from "ui/dialogs";

require("../../shared/convertors"); // register convertors

import { DetailViewModel } from "./detail-view-model";
import { BacklogService } from "../../services/backlog-service";
import { PtNewTask, PtNewComment, PtTaskUpdate } from "../../shared/models/dto";

/************************************************************
 * Use the "onNavigatingTo" handler to initialize the page binding context.
 *************************************************************/
let drawer;
let backlogService = new BacklogService();
let currentItem;
let detailsVm;
let lastUpdatedTitle;

export function toggleDrawer() {
    drawer.showDrawer();
}

export function onNavigatingTo(args: NavigatedData) {
    const page = <Page>args.object;
    currentItem = page.navigationContext;
    detailsVm = new DetailViewModel(currentItem);
    page.bindingContext = detailsVm;
    drawer = page.getViewById("sideDrawer");
}

export function onNavBackTap(args) {
    args.object.page.frame.goBack();
}

export function onDetailsTap(args) {
    args.object.page.bindingContext.set("selectedScreen", "details");
}

export function onTasksTap(args) {
    args.object.page.bindingContext.set("selectedScreen", "tasks");
}

export function onChitchatTap(args) {
    args.object.page.bindingContext.set("selectedScreen", "chitchat");
}

export function onDeleteTap(args) {
    const page = args.object.page;

    // Simple approach
    // if (confirm('Are you sure you want to delete this item?')) {

    // }

    // Better approach with promise
    const options: ConfirmOptions = {
        title: "Delete Item",
        message: "Are you sure you want to delete this item?",
        okButtonText: "Yes",
        cancelButtonText: "Cancel"
    };
    // confirm without options, with promise
    // confirm('Are you sure you want to delete this item?')
    // confirm with options, with promise
    confirm(options).then((result: boolean) => {
        // result can be true/false/undefined
        if (result) {
            backlogService
                .deletePtItem(currentItem)
                .then(() => {
                    page.frame.goBack();
                })
                .catch(() => {
                    console.log("some error occured");
                    page.frame.goBack();
                });
        }
    });
}

export function toggleTapped(args) {
    const page = args.object.page;
    const item = currentItem;
    const task = args.view.bindingContext;
    currentItem = backlogService.updatePtTask(item, task, true, task.title);
    detailsVm.set("item", currentItem);
}

export function onAddTask(args) {
    const page = args.object.page;
    const tasksList = page.getViewById("tasksList");
    const newTitle = detailsVm.newTaskTitle.trim();
    if (newTitle.length === 0) {
        return;
    }

    const newTask: PtNewTask = {
        title: newTitle,
        completed: false
    };

    detailsVm.set("newTaskTitle", "");
    backlogService
        .addNewPtTask(newTask, currentItem)
        .then(addedTask => {
            detailsVm.item.tasks.unshift(addedTask);
            tasksList.refresh(); // Because tasks object is not an observable
        })
        .catch(error => {
            console.log("something went wrong when adding task");
        });
}

export function onAddComment(args) {
    const page = args.object.page;
    const commentsList = page.getViewById("commentsList");
    const newCommentTxt = detailsVm.newCommentText.trim();
    if (newCommentTxt.length === 0) {
        return;
    }

    const newComment: PtNewComment = {
        title: newCommentTxt
    };

    detailsVm.set("newCommentText", "");
    backlogService
        .addNewPtComment(newComment, currentItem)
        .then((addedComment: any) => {
            addedComment.user.avatar = detailsVm.currentUserAvatar;
            detailsVm.item.comments.unshift(addedComment);
            commentsList.refresh(); // Because tasks object is not an observable
        })
        .catch(error => {
            console.log("something went wrong when adding task");
        });
}

export function taskFocused(args) {
    lastUpdatedTitle = args.object.text;
    args.object.on("textChange", onTextChange);
}

export function taskBlurred(args) {
    args.object.off("textChange");
    lastUpdatedTitle = null;
}

function onTextChange(args) {
    const newTitle = args.object.text;
    if (lastUpdatedTitle !== newTitle) {
        lastUpdatedTitle = newTitle;
        const taskUpdate: PtTaskUpdate = {
            task: args.object.bindingContext,
            toggle: false,
            newTitle: lastUpdatedTitle
        };

        // Dont't care about return value
        backlogService.updatePtTask(
            currentItem,
            taskUpdate.task,
            taskUpdate.toggle,
            taskUpdate.newTitle
        );
    }
}
