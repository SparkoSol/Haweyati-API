import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { PersonsModule } from "./modules/persons/persons.module";
import { MongooseModule } from '@nestjs/mongoose'
import { DbModule } from "./common/db/db.module";
import { AuthModule } from "./common/auth/auth.module";
import { DumpstersModule } from './modules/dumpsters/dumpsters.module';
import { MulterModule } from '@nestjs/platform-express';
import { DumpsterAvailabilityModule } from './modules/dumpster-availability/dumpster-availability.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { StudentModule } from './modules/student/student.module';

@Module({
    imports: [
        DbModule,
        AuthModule,
        PersonsModule,
        DumpstersModule,
        DumpsterAvailabilityModule,
        SuppliersModule,
        StudentModule,
    ],
    controllers: [AppController]
})
export class AppModule {}