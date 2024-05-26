import { Module } from '@nestjs/common';
import { KycController } from './kyc.controller';
import { KycService } from './kyc.service';
import { HttpModule } from '@nestjs/axios';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [HttpModule,
    ClientsModule.register([{
      name:'PRODUCTS_CLIENT',
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port:4003
      }
    }]),
    MulterModule.register({
      dest: 'uploads/',
    }),
  ],
  controllers: [KycController],
  providers: [KycService, PrismaService]
})
export class KycModule {}
