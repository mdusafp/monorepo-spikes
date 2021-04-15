import { Module } from "@nestjs/common";
import { GraphQLGatewayModule } from "@nestjs/graphql";

@Module({
  imports: [
    GraphQLGatewayModule.forRoot({
      server: {
        cors: true,
      },
      gateway: {
        serviceList: [
          { name: "users", url: "http://user-service/graphql" },
          { name: "posts", url: "http://post-service/graphql" },
        ],
      },
    }),
  ],
})
export class AppModule {}
