import { Enum } from './Enum';
import { Schema } from './Schema';

export interface Model extends Schema {
    name: string;
    export: 'reference' | 'generic' | 'enum' | 'array' | 'dictionary' | 'interface';
    type: string;
    base: string;
    template: string | null;
    link: Model | null;
    description: string | null;
    isProperty: boolean;
    isReadOnly: boolean;
    isRequired: boolean;
    isNullable: boolean;
    imports: string[];
    extends: string[];
    enum: Enum[];
    enums: Model[];
    properties: Model[];
}
