import { appStore } from '~/core/app-store';
import { PtBacklogRepository } from '~/core/contracts/repositories/pt-backlog-repository.contract';
import { CreateCommentRequest } from '~/core/contracts/requests/backlog';
import { CreateCommentResponse } from '~/core/contracts/responses/backlog';
import { PtCommentService } from '~/core/contracts/services/pt-comment-service.contract';
import { PtComment } from '~/core/models/domain';

export class CommentService implements PtCommentService {
  constructor(private backlogRepo: PtBacklogRepository) {}

  public addNewPtComment(
    createCommentRequest: CreateCommentRequest
  ): Promise<CreateCommentResponse> {
    const comment: PtComment = {
      id: 0,
      title: createCommentRequest.newComment.title,
      user: appStore.value.currentUser,
      dateCreated: new Date(),
      dateModified: new Date()
    };

    return new Promise<CreateCommentResponse>((resolve, reject) => {
      this.backlogRepo.insertPtComment(
        comment,
        createCommentRequest.currentItem.id,
        error => {
          console.dir(error);
        },
        (nextComment: PtComment) => {
          const response: CreateCommentResponse = {
            createdComment: nextComment
          };
          resolve(response);
        }
      );
    });
  }
}
