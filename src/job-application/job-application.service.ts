import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cache } from "cache-manager";
import { ethers } from "ethers";
import * as ContractAbi from "../assets/contract.json";

const JOB_APPLICATION_KEYSTORE_PREFIX = "jobApplicationsPerAddress-";
export interface JobApplicationsForUser {
  applications: Record<string, { appliedOn: string }>;
}

export interface NewApplicationPayload {
  signedTransaction: string;
  signature: string;
}

export interface ChangeApplicationStatus {
  applicantAddress: string;
  jobId: string;
  status: ApplicationStatus;
}

export const ApplicationStatuses = [
  "screening",
  "firstInterview",
  "technicalTest",
  "finalInterview",
  "hired",
  "rejected",
] as const;

export type ApplicationStatus = typeof ApplicationStatuses[number];

@Injectable()
export class JobApplicationService {
  // init
  provider: ethers.providers.Provider;
  web3JobsContract: ethers.Contract;
  contractAddress: string;

  constructor(
    private configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {
    const network =
      this.configService.get<ethers.providers.Networkish>("WEB3_NETWORK");
    this.contractAddress = this.configService.get<string>(
      "WEB3_JOBS_CONTRACT_ADDRESS"
    );
    this.provider = ethers.getDefaultProvider(network);

    this.web3JobsContract = new ethers.Contract(
      this.contractAddress,
      ContractAbi.abi,
      this.provider
    );
  }

  getContractAddress() {
    return { address: this.contractAddress };
  }

  async submitNewApplication(jobId: string, payload: NewApplicationPayload) {
    const address = ethers.utils.verifyMessage(
      payload.signedTransaction,
      payload.signature
    );
    await this.provider.sendTransaction(payload.signedTransaction);
    // Cache for efficiency but not mandatory
    let jobApplicationsForUser: JobApplicationsForUser;
    const jobApplicationsForUserString = await this.cacheManager.get<string>(
      `${JOB_APPLICATION_KEYSTORE_PREFIX}${address}`
    );
    if (jobApplicationsForUserString) {
      jobApplicationsForUser = JSON.parse(jobApplicationsForUserString);
    } else {
      jobApplicationsForUser.applications = {};
    }
    jobApplicationsForUser.applications[jobId] = {
      appliedOn: new Date().toISOString(),
    };
    await this.cacheManager.set(
      `${JOB_APPLICATION_KEYSTORE_PREFIX}${address}`,
      JSON.stringify(jobApplicationsForUser)
    );
  }

  async getMyApplications() {}

  async getMyApplicants(jobId: string) {}

  async claimBounty(jobId: string) {}
  async changeApplicationStatus(payload: ChangeApplicationStatus) {}
}
