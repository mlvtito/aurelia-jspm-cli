import {Aurelia} from 'aurelia-framework';


export function configure(aurelia: Aurelia): void {
  aurelia.use.standardConfiguration();
  
  if( ! SystemJS.production ) {
    // configuration for development mode
    aurelia.use.developmentLogging();
  }

  aurelia.start().then(() => aurelia.setRoot());
}

