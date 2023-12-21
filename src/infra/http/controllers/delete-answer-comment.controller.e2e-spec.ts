import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import { StudentFactory } from "test/factories/make-student";
import request from "supertest";
import { AnswerCommentsFactory } from "test/factories/make-answer-comments";
import { AnswerFactory } from "test/factories/make-answer";
import { QuestionFactory } from "test/factories/make-question";

describe("Delete Answer (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let answerFactory: AnswerFactory;
  let questionFactory: QuestionFactory;
  let studentFactory: StudentFactory;
  let answerCommentFactory: AnswerCommentsFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AnswerCommentsFactory,
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    studentFactory = moduleRef.get(StudentFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    answerCommentFactory = moduleRef.get(AnswerCommentsFactory);
    questionFactory = moduleRef.get(QuestionFactory);

    await app.init();
  });

  test("[DELETE] /answers/comments/:id", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    });

    const answerComment = await answerCommentFactory.makePrismaAnswerComment({
      authorId: user.id,
      answerId: answer.id,
    });

    const answerCommentId = answerComment.id.toString();

    const response = await request(app.getHttpServer())
      .delete(`/answers/comments/${answerCommentId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);

    const answerCommentOnDatabase = await prisma.comment.findUnique({
      where: {
        id: answerCommentId,
      },
    });

    expect(answerCommentOnDatabase).toBeNull();
  });
});
