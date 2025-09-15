import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AppError } from './ErrorHandler';

export function validateRequest(type: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Convert request body to DTO instance
    const dtoObj = plainToInstance(type, req.body);
    
    // Validate the DTO
    const errors = await validate(dtoObj, { 
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
      validationError: { target: false, value: false }
    });
    
    if (errors.length > 0) {
      // Format validation errors
      const formattedErrors = formatValidationErrors(errors);
      return next(new AppError(formattedErrors, 400));
    }
    
    req.body = dtoObj;
    return next();
  };
}

function formatValidationErrors(errors: ValidationError[]): string {
  const messages: string[] = [];
  
  errors.forEach(error => {
    if (error.constraints) {
      Object.values(error.constraints).forEach(constraint => {
        messages.push(constraint);
      });
    }
    
    // Handle nested errors
    if (error.children && error.children.length > 0) {
      const nestedMessages = formatValidationErrors(error.children);
      messages.push(nestedMessages);
    }
  });
  
  return messages.join(', ');
}
