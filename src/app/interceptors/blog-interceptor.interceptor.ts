import { HttpInterceptorFn } from '@angular/common/http';

export const blogInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};
