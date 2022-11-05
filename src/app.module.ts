import { CacheModule, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JobApplicationController } from "./job-application/job-application.controller";
import { JobApplicationService } from "./job-application/job-application.service";
import { JobPostController } from './job-post/job-post.controller';
import { JobPostService } from './job-post/job-post.service';

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot({
      envFilePath: [".env.local", ".env"],
    }),
  ],
  controllers: [JobApplicationController, JobPostController],
  providers: [JobApplicationService, JobPostService],
})
export class AppModule {}
