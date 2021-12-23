import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./auth.user.model";
import {environment} from "../../environments/environment"


export interface AuthRespData{
  kind: string;
  idToken: string;
  email: string;
  refershToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean
}
@Injectable({providedIn: 'root'})
export class AuthService {

  user = new BehaviorSubject<User>(null)


  constructor(
    private http: HttpClient,
    // private router: Router,
    ){}




    signupInternalDB(email: string, password: string){
      const url = 'https://vlzmlddotg.execute-api.us-east-1.amazonaws.com/Prod/sendemails'
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',

        'X-Api-Key': environment.awsAPIKEY});
      let params = new HttpParams().set('email', 'abdul.2020alsh@gmail.com').set('password', '123123');

      let options = { headers: headers, params: params };

      return this.http.post<{body:string, statusCode: number }>(url, null, options)
      // .pipe(
      //   catchError(this.fireBaseHandleError),
      //   tap(resData => this.fireBaseHandleAuth(
      //     resData.email,
      //     resData.localId,
      //     resData.idToken,
      //     +resData.expiresIn, 0))
      // )
      // .subscribe(res => {
      //   console.log(res.statusCode)
      //   if (res.statusCode==200) {
      //     let message = JSON.parse(res.body)
      //     this.messageFromAPI = message.messages
      //   }
      // }, err => {
      //   console.log(err)
      // })
      // return this.http.post<AuthRespData>(
      //   'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firbaseAPIKEY
      // ,{
      //   email: email,
      //   password: password,
      //   returnSecureToken: true
      // }
      // ).pipe(
      //   catchError(this.fireBaseHandleError),
      //   tap(resData => this.fireBaseHandleAuth(
      //     resData.email,
      //     resData.localId,
      //     resData.idToken,
      //     +resData.expiresIn, 0))
      // )
    }


    loginFirebase(email: string, password: string) {
      console.log(environment.firbaseAPIKEY)
      return this.http.post<AuthRespData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firbaseAPIKEY
      ,{
        email: email,
        password: password,
        returnSecureToken: true
      }
      ).pipe(
        catchError(this.fireBaseHandleError),
        tap(resData => this.fireBaseHandleAuth(
          resData.email,
          resData.localId,
          resData.idToken,
          +resData.expiresIn, 1))
      )
    }


    private fireBaseHandleAuth(email, localId, idToken, expiresIn, method) {

      const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
      const loadedUser = new User(email,localId, idToken, new Date(expirationDate))

    }


    private fireBaseHandleError(resError: HttpErrorResponse){
      console.log(resError)
      let errorMassage = 'An unkonwen Error occurred !'
      if (!resError.error || !resError.error.error) {
        return throwError(errorMassage)
      }
      switch(resError.error.error.message){
        case 'EMAIL_EXISTS':
          errorMassage = 'This Email already Existed'
          break
        case 'INVALID_PASSWORD':
          errorMassage = 'Password or Email is not Correct'
          break
        case 'EMAIL_NOT_FOUND':
          errorMassage = 'Password or Email is not Correct'
      }
      return throwError(errorMassage)
    }






}

