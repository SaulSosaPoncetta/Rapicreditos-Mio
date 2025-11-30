import { Test, TestingModule } from '@nestjs/testing';
import { CreditoController } from './credito.controller';
import { CreditoService } from './credito.service';

describe('CreditoController', () => {
  let controller: CreditoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreditoController],
      providers: [CreditoService],
    }).compile();

    controller = module.get<CreditoController>(CreditoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
