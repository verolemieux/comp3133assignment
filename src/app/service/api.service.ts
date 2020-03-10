import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse
} from "@angular/common/http";
import { Http, Response } from "@angular/http";
import { History } from "../../model/history";
import { Event } from "../../model/event";
import { User } from "../../model/user";
import { Game } from "../../model/game";

@Injectable({
  providedIn: "root"
})
export class ApiService {
  baseUri: string = "http://localhost:3000/api";
  headers = new HttpHeaders().set("Content-Type", "application/json");

  constructor(private http: Http) {}

  getHistory(): Promise<void | History[]> {
    return this.http
      .get(`${this.baseUri}/history`)
      .toPromise()
      .then(response => response.json() as History[])
      .catch(this.handleError);
  }

  getEventLog(): Promise<void | Event[]> {
    return this.http
      .get(`${this.baseUri}/eventlog`)
      .toPromise()
      .then(response => response.json() as Event[])
      .catch(this.handleError);
  }

  getGameHistory(): Promise<void | Game[]> {
    return this.http
      .get(`${this.baseUri}/games`)
      .toPromise()
      .then(response => response.json() as Game[])
      .catch(this.handleError);
  }

  getTopScores(): Promise<void | User[]> {
    return this.http
      .get(`${this.baseUri}/topscores`)
      .toPromise()
      .then(response => response.json() as User[])
      .catch(this.handleError);
  }

  getTopUsers(): Promise<void | User[]> {
    return this.http
      .get(`${this.baseUri}/topusers`)
      .toPromise()
      .then(response => response.json() as User[])
      .catch(this.handleError);
  }

  private handleError(error: any) {
    let errMsg = error.message
      ? error.message
      : error.status
      ? `${error.status} - ${error.statusText}`
      : "Server error";
    console.error(errMsg); // log to console instead
  }
}
