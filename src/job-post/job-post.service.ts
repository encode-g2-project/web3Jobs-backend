import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Cache } from "cache-manager";
import { ethers } from "ethers";
import * as ContractAbi from "../assets/contract.json";

@Injectable()
export class JobPostService {
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
  async postJob() {}
  async getMyJobs() {}
  async unpublishJob() {}
}
