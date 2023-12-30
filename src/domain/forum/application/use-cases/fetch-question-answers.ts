import { Either, right } from "@/core/either";
import { AnswersRepository } from "../repositories/answers-repository";
import { Injectable } from "@nestjs/common";
import { AnswerWithAuthor } from "../../enterprise/entities/value-objects/answer-with-author";

interface FetchQuestionAnswerUseCaseRequest {
  page: number;
  questionId: string;
}

type FetchQuestionAnswerUseCaseResponse = Either<
  null,
  {
    answers: AnswerWithAuthor[];
  }
>;

@Injectable()
export class FetchQuestionAnswerUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionAnswerUseCaseRequest): Promise<FetchQuestionAnswerUseCaseResponse> {
    const answers = await this.answerRepository.findManyByQuestionIdWithAuthor(
      questionId,
      { page },
    );

    return right({
      answers,
    });
  }
}
