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
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer";
import { NotAllowedError } from "@/domain/forum/application/use-cases/errors/not-allowed-error";
import { ResourceNotFoundError } from "@/domain/forum/application/use-cases/errors/resource-not-found-error";

const editAnswerBodySchema = z.object({
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema);

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>;

@Controller("/answers/:id")
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param("id") answerId: string,
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: EditAnswerBodySchema,
  ) {
    const { content } = body;
    const userId = user.sub;

    const result = await this.editAnswer.execute({
      content,
      answerId,
      authorId: userId,
      attachmentsIds: [],
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
