import { Controller, Post, Query, UseGuards } from '@nestjs/common';
import { BatchService } from './batch.service';
import { AccessTokenGuard } from 'src/auth/guards/access-token.guard';

@Controller('admin/batch')
@UseGuards(AccessTokenGuard)
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post('payment-stats')
  async runPaymentStats(@Query('date') date?: string) { // 배치돌렸을 떄 잘못된 데이터가 있다면 로직을 수정하고 어드민이 수동으로 호출할 수 있어야 함
    return await this.batchService.runManualStats(date);
  }
}