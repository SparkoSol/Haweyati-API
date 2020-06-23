import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { PersonsModule } from "./modules/persons/persons.module";
import { MongooseModule } from '@nestjs/mongoose'
import { DbModule } from "./common/db/db.module";
import { AuthModule } from "./common/auth/auth.module";
import { DumpstersModule } from './modules/dumpsters/dumpsters.module';
import { MulterModule } from '@nestjs/platform-express';
import { DumpsterAvailabilityModule } from './modules/dumpster-availability/dumpster-availability.module';
import { StudentModule } from './modules/student/student.module';
import { BuildingMaterialsModule } from './modules/building-materials/building-materials.module';
import { BuildingMaterialCategoryModule } from './modules/building-material-category/building-material-category.module';

@Module({
  imports: [
    DbModule,
    AuthModule,
    PersonsModule,
    DumpstersModule,
    DumpsterAvailabilityModule,
    StudentModule,
    BuildingMaterialsModule,
    BuildingMaterialCategoryModule

  ],
  controllers: [AppController]
})
export class AppModule {}