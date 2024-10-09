import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { loggerInterceptor } from './interceptors/logger.interceptor';
import { provideQuillConfig, QuillModule} from 'ngx-quill';

import hljs from 'highlight.js';
import 'highlight.js/styles/default.css'; // Import the CSS style for highlighting

(window as any).hljs = hljs; // Expose hljs to the global scope

import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter';

Quill.register('modules/blotFormatter', BlotFormatter);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch(), withInterceptors([loggerInterceptor])),
    // provideQuillConfig({
    //   modules: {
    //     blotFormatter: {
    //       overlay: {
    //         style: {
    //           border: '1px solid white',
    //         }
    //       }
    //     },
    //     syntax: true,
    //     toolbar: [
    //       ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    //       ['blockquote', 'code-block'],

    //       [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    //       [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    //       [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    //       [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    //       [{ 'direction': 'rtl' }],                         // text direction

    //       [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    //       [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    //       [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    //       [{ 'font': [] }],
    //       [{ 'align': [] }],

    //       ['clean'],                                         // remove formatting button

    //       // ['image']
    //       ['link', 'image', 'video']
    //     ],

    //   }
    // })
  ],
};
