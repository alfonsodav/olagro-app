// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://api.olagro.org/api',
  endpoint: 'https://api.olagro.org/api',
  endpointURL: 'https://blog.olagro.org/wp-json/',
  blogURL: 'https://blog.olagro.org',
  dateFormat: 'MMM d, y',
  agora: {
    appId: '941bfaa355a74d01815da3b702429c9a'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
