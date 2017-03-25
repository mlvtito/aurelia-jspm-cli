export class App {
    message: string;

    constructor() {
        this.message = 'It Works ';
    }

    exclaim() {
        this.message += '!!';
    }

    lorem() {
        this.message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras luctus tempor aliquet. Phasellus "
            + "ut laoreet urna, et porta justo. Orci varius natoque penatibus et magnis dis parturient montes, nascetur"
            + " ridiculus mus. Maecenas enim lorem, ullamcorper sed semper ut, hendrerit id lacus. Pellentesque in nunc"
            + " turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin et vehicula lectus. Sed urna "
            + "est, posuere quis bibendum non, dictum quis erat. Ut varius odio non nisi condimentum, ut auctor quam "
            + "condimentum."
    }
}