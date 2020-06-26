import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { PersonsModule } from "./modules/persons/persons.module";
import { DbModule } from "./common/db/db.module";
import { AuthModule } from "./common/auth/auth.module";
import { DumpstersModule } from './modules/dumpsters/dumpsters.module';
import { DumpsterAvailabilityModule } from './modules/dumpster-availability/dumpster-availability.module';
import { BuildingMaterialsModule } from './modules/building-materials/building-materials.module';
import { BuildingMaterialCategoryModule } from './modules/building-material-category/building-material-category.module';
import { FinishingMaterialCategoryModule } from './modules/finishing-material-category/finishing-material-category.module';
import { FinishingMaterialsModule } from './modules/finishing-materials/finishing-materials.module';
import { DriversModule } from './modules/drivers/drivers.module';

@Module({
  imports: [
    DbModule,
    AuthModule,
    PersonsModule,
    DumpstersModule,
    DumpsterAvailabilityModule,
    BuildingMaterialsModule,
    BuildingMaterialCategoryModule,
    FinishingMaterialCategoryModule,
    FinishingMaterialsModule,
    DriversModule
  ],
  controllers: [AppController]
})
export class AppModule {}