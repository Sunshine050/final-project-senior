import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { Request, Response, NextFunction } from 'express'; // ✅ เพิ่ม type ที่นี่

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- Ignore Chrome DevTools & Debugger requests ---
  app.use('/.well-known', (req: Request, res: Response, next: NextFunction) => {
    return res.status(204).send();
  });

  // Enable CORS
  app.enableCors();

  // Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Emergency Care API')
    .setDescription('API for Emergency Care System')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentication endpoints')
    .addTag('sos', 'Emergency SOS endpoints')
    .addTag('hospitals', 'Hospital endpoints')
    .addTag('rescue-teams', 'Rescue team endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/api`);
}

bootstrap();
