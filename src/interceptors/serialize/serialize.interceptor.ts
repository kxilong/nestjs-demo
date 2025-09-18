import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly dto: any) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('这里是拦截器执行之前...');

    const now = Date.now();
    return next.handle().pipe(
      map((data) => {
        console.log(`这里是拦截器执行之后... ${Date.now() - now}ms`);
        return plainToInstance(this.dto, data, {
          // 启用装饰器转换功能
          // 如果没有这个选项，@Exclude()将不会生效
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
