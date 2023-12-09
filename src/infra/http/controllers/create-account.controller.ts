import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { z } from "zod";
import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-student";

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createAccountBodySchema);

@Controller("/accounts")
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe)
    body: CreateAccountBodySchema,
  ) {
    const { name, email, password } = createAccountBodySchema.parse(body);

    const result = await this.registerStudent.execute({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      throw new Error();
    }
  }
}
