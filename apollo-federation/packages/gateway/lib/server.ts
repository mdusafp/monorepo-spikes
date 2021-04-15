import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

const bootstrap = async (port: number) => {
  const app = await NestFactory.create(AppModule);
  app.listen(port);
};

bootstrap(4000);
