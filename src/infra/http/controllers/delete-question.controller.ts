import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from "@nestjs/common";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";
import { NotAllowedError } from "@/domain/forum/application/use-cases/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/domain/forum/application/use-cases/errors/resource-not-found-error";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPaylod } from "@/infra/auth/jwt.strategy";

@Controller("/questions/:id")
export class DeleteQuestionController {
  constructor(private deleteQuestion: DeleteQuestionUseCase) {}

  @Delete()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPaylod,
    @Param("id") questionId: string,
  ) {
    const userId = user.sub;

    const result = await this.deleteQuestion.execute({
      authorId: userId,
      questionId,
    });

    console.log(result);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new ResourceNotFoundError();
        case NotAllowedError:
          throw new NotAllowedError();
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
