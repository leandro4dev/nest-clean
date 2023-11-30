import { PaginatinParams } from "@/core/repositories/pagination-params";
import { QuestionsRespository } from "@/domain/forum/application/repositories/question-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRespository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  findManyRecent(params: PaginatinParams): Promise<Question[]> {
    throw new Error("Method not implemented.");
  }

  findBySlug(slug: string): Promise<Question | null> {
    throw new Error("Method not implemented.");
  }

  save(question: Question): Promise<void> {
    throw new Error("Method not implemented.");
  }

  create(question: Question): Promise<void> {
    throw new Error("Method not implemented.");
  }

  delete(question: Question): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
