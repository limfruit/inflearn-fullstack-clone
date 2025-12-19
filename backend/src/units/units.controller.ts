import { Controller } from '@nestjs/common';
import { UnitsService } from './units.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Unit')
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}
}
