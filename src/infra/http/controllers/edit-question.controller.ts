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
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { ResourceNotFoundError } from "@/domain/forum/application/use-cases/errors/resource-not-found-error";
import { NotAllowedError } from "@/domain/forum/application/use-cases/errors/not-allowed-error";

const editQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.string().uuid()),
});

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema);

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>;

@Controller("/questions/:id")
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditQuestionBodySchema,
    @CurrentUser() user: UserPayload,
    @Param("id") questionId: string,
  ) {
    const { title, content, attachments } = body;
    const userId = user.sub;

    const result = await this.editQuestion.execute({
      title,
      content,
      authorId: userId,
      attachmentsIds: attachments,
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
