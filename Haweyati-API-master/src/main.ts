import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from "./app.module";
import { join } from 'path';

async function runApp() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors();
    app.useStaticAssets(
      join(__dirname, '..', '..',  'uploads'),
       {
           prefix: '/uploads/'
       }
    )
    await app.listen(4000, '0.0.0.0');
}
runApp();

// /Volumes/Workspace/MongoDB/mongodb-macos-x86_64-4.2.7/bin/mongod --dbpath /Volumes/Workspace/MongoDB/data