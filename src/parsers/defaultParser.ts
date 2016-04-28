import {IParser} from './IParser';

export class DefaultParser implements IParser {
    
    parse(data: any): any {
        return data;
    }
    
    encode(data: any): any {
        return data;
    }
}
