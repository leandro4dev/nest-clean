import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ZodValidationPipe } from "src/pipes/zod-validation-pipe";
import { PrismaService } from "src/prisma/prisma.service";
import { z } from "zod";

const createQuestionBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller("/questions")
@UseGuards(AuthGuard("jwt"))
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  async handle(@Body() body: CreateQuestionBodySchema) {
    return "ok";
  }
}
