export class App {
    message: string;
    
    constructor() {
        this.message = 'It Works ';
    }

    exclaim() {
        this.message += '!!';
    }
}