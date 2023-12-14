import { Module } from "@nestjs/common";
import { AuthenticateController } from "./controllers/authenticate.controller";
import { CreateAccountController } from "./controllers/create-account.controller";
import { CreateQuestionController } from "./controllers/create-question.controller";
import { FethRecentQuestionsController } from "./controllers/fetch-recent-questions.controller";
import { DatabaseModule } from "../database/database.module";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student";
import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-student";
import { CryptographyModule } from "../cryptography/cryptography.module";
import { GetQuestionBySlugController } from "./controllers/get-question-by-slug.controller";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug";
import { EditQuestionController } from "./controllers/edit-question.controller";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question";
import { DeleteQuestionController } from "./controllers/delete-question.controller";
import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-question";
import { AnswerQuestionController } from "./controllers/answer-question.controller";

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    EditQuestionController,
    CreateQuestionController,
    FethRecentQuestionsController,
    GetQuestionBySlugController,
    DeleteQuestionController,
    AnswerQuestionController,
  ],
  providers: [
    CreateQuestionUseCase,
    RegisterStudentUseCase,
    EditQuestionUseCase,
    FetchRecentQuestionsUseCase,
    AuthenticateStudentUseCase,
    GetQuestionBySlugUseCase,
    DeleteQuestionUseCase,
    AnswerQuestionUseCase,
  ],
})
export class HttpModule {}
