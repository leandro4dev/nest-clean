import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { UserPaylod } from "@/infra/auth/jwt.strategy";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { ResourceNotFoundError } from "@/domain/forum/application/use-cases/errors/resource-not-found-error";
import { NotAllowedError } from "@/domain/forum/application/use-cases/errors/not-allowed-error";

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema);

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

@Controller("/questions")
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditQuestionBodySchema,
    @CurrentUser() user: UserPaylod,
    @Param("id") questionId: string,
  ) {
    const { title, content } = body;
    const userId = user.sub;

    const result = await this.editQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: [],
      questionId,
    });

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
