import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private appEnvironment;

  constructor(private injector: Injector) { }

  loadAppEnvironment() {
    let http = this.injector.get(HttpClient);

    return http.get('/assets/environment.json')
      .toPromise()
      .then(data => {
        this.appEnvironment = data;
      }).catch(error => {
        console.warn("Error loading environment.json, using default envrionment instead");
        this.appEnvironment = { "backendURL": "http://localhost:3001" };
      })
  }

  get environment() {
    return this.appEnvironment;
  }
  get backendURL() {
    return this.appEnvironment.backendURL;
  }
}