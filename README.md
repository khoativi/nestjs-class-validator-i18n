# @khoativi/nestjs-class-validator-i18n

**@khoativi/nestjs-class-validator-i18n** is a lightweight NestJS extension to provide localized error messages for `class-validator` without needing to customize each decorator. It supports multi-language validation errors via standard JSON files and integrates with `ValidationPipe` and `ExceptionFilter`.

## ✨ Key Features

- 🌍 Supports multiple languages (e.g., `en`, `vi`)
- 📥 Reads `Accept-Language` header to determine language dynamically
- 📦 Plug-and-play integration with NestJS's `ValidationPipe`
- 🧩 Customizable message files for each locale
- ⚡ Zero config needed per-decorator

## 📦 Installation

**npm:**

```bash
npm install @khoativi/nestjs-class-validator-i18n
```

**yarn:**

```bash
yarn add @khoativi/nestjs-class-validator-i18n
```

**pnpm:**

```bash
pnpm add @khoativi/nestjs-class-validator-i18n
```

## 🚀 Usage

### 1. Register Global Pipes and Filter

Use the provided exception and filter classes to apply localized validation globally.

```ts
// main.ts
import {
  I18nValidationException,
  I18nValidationFilter,
} from '@khoativi/nestjs-class-validator-i18n';
import { ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => new I18nValidationException(errors),
    }),
  );

  const adapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new I18nValidationFilter(adapterHost, { fallbackLanguage: 'vi' }),
  );

  await app.listen(3000);
}

bootstrap();
```

### 2. Create DTO with class-validator

```ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;
}
```

### 3. Send a request with `Accept-Language` header

```http
POST /users
Accept-Language: vi
Content-Type: application/json

{
  "email": "not-an-email"
}
```

Response:

```json
{
  "statusCode": 400,
  "message": "email phải là email hợp lệ",
  "error": "Bad Request"
}
```

## 🛠️ Issues and Contributing

Feel free to open [issues](https://github.com/khoativi/nestjs-class-validator-i18n/issues) or submit pull requests for improvements, bug fixes, or additional language support.

## 📄 License

MIT License © [Khoa Trần](https://github.com/khoativi)
