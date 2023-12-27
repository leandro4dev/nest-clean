import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AnswerFactory } from "test/factories/make-answer";
import { AnswerAttachmentFactory } from "test/factories/make-answer-attachements";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-question";
import { StudentFactory } from "test/factories/make-student";

describe("Edit Answer (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let questionFactory: QuestionFactory;
  let studentFactory: StudentFactory;
  let answerFactory: AnswerFactory;
  let attachmentFactory: AttachmentFactory;
  let answerAttachmentFactory: AnswerAttachmentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
        AttachmentFactory,
        AnswerAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory);

    await app.init();
  });

  test("[PUT] /answers/:id", async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment1 = await attachmentFactory.makePrismaAttachment();
    const attachment2 = await attachmentFactory.makePrismaAttachment();

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    });

    await answerAttachmentFactory.makePrismaanswerAttachment({
      attachmentId: attachment1.id,
      answerId: answer.id,
    });

    await answerAttachmentFactory.makePrismaanswerAttachment({
      attachmentId: attachment2.id,
      answerId: answer.id,
    });

    const attachment3 = await attachmentFactory.makePrismaAttachment();

    const answerId = answer.id.toString();

    const response = await request(app.getHttpServer())
      .put(`/answers/${answerId}`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        content: "New Example Content",
        attachments: [attachment1.id.toString(), attachment3.id.toString()],
      });

    expect(response.statusCode).toBe(204);

    const asnwerOnDatabase = await prisma.answer.findFirst({
      where: {
        content: "New Example Content",
      },
    });

    expect(asnwerOnDatabase).toBeTruthy();

    const attachmentOnDatabase = await prisma.attachment.findMany({
      where: {
        answerId: asnwerOnDatabase?.id,
      },
    });

    expect(attachmentOnDatabase).toHaveLength(2);
    expect(attachmentOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.toString(),
        }),
        expect.objectContaining({
          id: attachment3.id.toString(),
        }),
      ]),
    );
  });
});
