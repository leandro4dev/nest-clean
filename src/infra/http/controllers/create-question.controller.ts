import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { z } from "zod";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPaylod } from "@/infra/auth/jwt.strategy";

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe)
    body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPaylod,
  ) {
    const { title, content } = body;
    const userId = user.sub;

    const slug = this.convertToSlug(title);

    await this.prisma.question.create({
      data: {
        authorId: userId,
        title,
        content,
        slug,
      },
    });
  }

  private convertToSlug(title: string): string {
    const normalizedString = title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const slug = normalizedString.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    return slug.replace(/^-+|-+$/g, "");
  }
}
