import { Either, left, right } from "@/core/either";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { QuestionsRespository } from "@/domain/forum/application/repositories/question-repository";
import { Injectable } from "@nestjs/common";
import { QuestionDetails } from "../../enterprise/entities/value-objects/question-details";

interface GetQuestionBySlugUseCaseRequest {
  slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: QuestionDetails;
  }
>;

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRespository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findDetailsBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({
      question,
    });
  }
}
