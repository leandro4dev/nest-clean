import { Either, left, right } from "@/core/either";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { QuestionsRespository } from "@/domain/forum/application/repositories/question-repository";
import { Injectable } from "@nestjs/common";

interface GetQuestionBySlugUseCaseRequest {
  slug: string;
}

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: Question;
  }
>;

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRespository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    console.log(slug);

    const question = await this.questionsRepository.findBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({
      question,
    });
  }
}
