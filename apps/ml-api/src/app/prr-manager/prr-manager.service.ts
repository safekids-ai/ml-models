import { Injectable } from '@nestjs/common';
import { CreatePrrManagerDto } from './dto/create-prr-manager.dto';
import { UpdatePrrManagerDto } from './dto/update-prr-manager.dto';
import { ConfigService} from '@nestjs/config';
import {WebAppConfig} from "apps/ml-api/src/app/config/webapp";

@Injectable()
export class PrrManagerService {
    private readonly WEB_URL: string;
    constructor(private readonly config: ConfigService) {
        this.WEB_URL = this.config.get<WebAppConfig>('webAppConfig').url;
    }
    create(createPrrManagerDto: CreatePrrManagerDto) {
        return 'This action adds a new prrManager';
    }

    findAll() {
        return `This action returns all prrManager`;
    }

    findOne(id: number) {
        return `This action returns a #${id} prrManager`;
    }

    update(id: number, updatePrrManagerDto: UpdatePrrManagerDto) {
        return `This action updates a #${id} prrManager`;
    }

    remove(id: number) {
        return `This action removes a #${id} prrManager`;
    }

    process(createPrrManagerDto: CreatePrrManagerDto): string {
        return this.WEB_URL + '/prr.html';
    }
}
