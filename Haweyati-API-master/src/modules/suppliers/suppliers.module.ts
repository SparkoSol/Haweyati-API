import { Module } from '@nestjs/common';
import { SuppliersController } from './suppliers.controller';
import { SuppliersService } from './suppliers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SuppliersSchema } from 'src/data/schemas/suppliers.schema';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'suppliers',
        schema: SuppliersSchema
      },
    ]),
    MulterModule.register({
      dest: '../uploads',
    }),
  ],
  controllers: [SuppliersController],
  providers: [SuppliersService],
  exports: [SuppliersService]
})
export class SuppliersModule {}
