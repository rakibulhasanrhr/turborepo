import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) { }

    transform(value: unknown, metadata: ArgumentMetadata) {
        try {
            const parsedValue = this.schema.parse(value);
            console.log("this is meta data", metadata)
            console.log("this is metadata.data", metadata.data)
            console.log("this is  metatype", metadata.metatype)
            console.log("this is meta datatype", metadata.type)
            return parsedValue;
        } catch (error) {
            throw new BadRequestException(error);

        }
    }
}
