import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { JobPostService } from "./job-post.service";

@Controller("job-post")
export class JobPostController {
  constructor(private readonly service: JobPostService) {}

  @Get("contract-address")
  getContractAddress() {
    return this.service.getContractAddress();
  }
}
