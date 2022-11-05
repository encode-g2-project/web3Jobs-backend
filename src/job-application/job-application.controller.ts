import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import {
  JobApplicationService,
  NewApplicationPayload,
} from "./job-application.service";

@Controller("job-application")
export class JobApplicationController {
  constructor(private readonly service: JobApplicationService) {}

  @Get("contract-address")
  getContractAddress() {
    return this.service.getContractAddress();
  }

  @Post("jobs/:jobId/apply")
  createOrder(
    @Param("jobId") jobId: string,
    @Body() body: NewApplicationPayload
  ) {
    return this.service.submitNewApplication(jobId, body);
  }
}
