import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import { QuestionComments } from "@/domain/forum/enterprise/entities/question-comments";
import { Prisma, Comment as PrismaComment } from "@prisma/client";

export class PrismaQuestionCommentsMapper {
  static toDomain(raw: PrismaComment): QuestionComments {
    if (!raw.questionId) {
      throw new Error("Invalid comment type");
    }

    return QuestionComments.create({
      content: raw.content,
      authorId: new UniqueEntityID(raw.authorId),
      questionId: new UniqueEntityID(raw.questionId),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }

  static toPrisma(
    questionComments: QuestionComments,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: questionComments.id.toString(),
      authorId: questionComments.authorId.toString(),
      questionId: questionComments.questionId.toString(),
      content: questionComments.content,
      createdAt: questionComments.createdAt,
      updatedAt: questionComments.updatedAt,
    };
  }
}
