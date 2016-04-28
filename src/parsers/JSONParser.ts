import {IParser} from './IParser';

export class JSONParser implements IParser {
    
    parse(data: any): any {
        return JSON.parse(data);
    }
    
    encode(data: any): any {
        return JSON.stringify(data);
    }
}
