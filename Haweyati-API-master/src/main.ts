import { join } from 'path'
import { AppModule } from './app.module'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'

async function runApp() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useStaticAssets(
    join(__dirname, '..', '..', 'uploads'),
    {
      prefix: '/uploads/'
    }
  )
  await app.listen(4000, '0.0.0.0');
}
runApp();