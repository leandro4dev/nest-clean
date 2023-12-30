import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from "@nestjs/common";
import { FetchQuestionAnswerUseCase } from "@/domain/forum/application/use-cases/fetch-question-answers";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { z } from "zod";
import { AnswerWithAuthorPresenter } from "../presenters/answer-with-author-presenter";

const pageQueryParamSchema = z
  .string()
  .optional()
  .default("1")
  .transform(Number)
  .pipe(z.number().min(1));

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema);

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>;

@Controller("/questions/:questionId/answers")
export class FetchQuestionAnswerController {
  constructor(private fetchQuestionAnswers: FetchQuestionAnswerUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Param("questionId") questionId: string,
    @Query("page", queryValidationPipe) page: PageQueryParamSchema,
  ) {
    const result = await this.fetchQuestionAnswers.execute({
      page,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const answers = result.value.answers;

    return { answers: answers.map(AnswerWithAuthorPresenter.toHTTP) };
  }
}
