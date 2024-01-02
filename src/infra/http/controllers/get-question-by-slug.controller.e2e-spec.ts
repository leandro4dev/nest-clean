import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug";
import { AppModule } from "@/infra/app.module";
import { DatabaseModule } from "@/infra/database/database.module";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AttachmentFactory } from "test/factories/make-attachment";
import { QuestionFactory } from "test/factories/make-question";
import { QuestionAttachmentFactory } from "test/factories/make-question-attachments";
import { StudentFactory } from "test/factories/make-student";

describe("Fetch recent question (E2E)", () => {
  let app: INestApplication;
  let jwt: JwtService;
  let studentFactory: StudentFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;
  let questionFactory: QuestionFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
    questionFactory = moduleRef.get(QuestionFactory);

    await app.init();
  });

  test("[GET] /questions", async () => {
    const user = await studentFactory.makePrismaStudent({ name: "John Doe" });

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      title: "Question 01",
      slug: Slug.create("question-01"),
      content: "Question content",
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment({
      title: "Some Attachment",
    });

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment.id,
      questionId: question.id,
    });

    const response = await request(app.getHttpServer())
      .get(`/questions/question-01`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      question: expect.objectContaining({
        title: "Question 01",
        author: "John Doe",
        attachments: [
          expect.objectContaining({
            title: "Some Attachment",
          }),
        ],
      }),
    });
  });
});
