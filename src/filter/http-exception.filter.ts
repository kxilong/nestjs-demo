import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import type { Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly logger: Logger,
    private readonly httpAdapterHost: HttpAdapterHost,
  ) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    // 2. 获取客户端 IP（核心步骤）
    const clientIp = request.ip; // 直接获取 IP
    // 若有代理，可通过 request.ips 获取代理链 IP 列表
    const allIps = request.ips;
    const path = httpAdapter.getRequestUrl(ctx.getRequest());
    this.logger.error({ path, msg: exception.message }, exception.stack);
    console.log(exception.message);

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let msg: string = exception['response'] || 'Internal Server Error';

    if (exception instanceof QueryFailedError) {
      msg = exception.message;
    }

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toLocaleString(),
      path,
      allIps,
      clientIp,
      msg,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
