import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function runApp() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    await app.listen(4000, '0.0.0.0');
}
runApp();

// /Volumes/Workspace/MongoDB/mongodb-macos-x86_64-4.2.7/bin/mongod --dbpath /Volumes/Workspace/MongoDB/data