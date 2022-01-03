import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from "@angular/common/http";
import { BehaviorSubject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./auth.user.model";
import {environment} from "../../environments/environment"
import { GoogleLoginProvider, SocialAuthService, SocialUser } from 'angularx-social-login';
import { Router } from "@angular/router";


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
    private socialAuthService: SocialAuthService,
    private router: Router,
    ){}



    lambdaApiCreateFirebseUser(token){
      const url = 'https://vlzmlddotg.execute-api.us-east-1.amazonaws.com/Prod/updateemailstatus'
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'X-Api-Key': environment.awsAPIKEY
      });
      let params = new HttpParams().set('token', token);

      let options = { headers: headers, params: params };

      return this.http.post<{body:string, statusCode: number }>(url, null, options)

    }


    signupInternalDB(email: string, password: string){
      const url = 'https://vlzmlddotg.execute-api.us-east-1.amazonaws.com/Prod/sendemails'
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',

        'X-Api-Key': environment.awsAPIKEY});
      let params = new HttpParams().set('email', email).set('password', password);

      let options = { headers: headers, params: params };

      return this.http.post<{body:string, statusCode: number }>(url, null, options)

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
          +resData.expiresIn))
      )
    }

    resetPasswordFirebase(email){
      return this.http.post<{email: string, kind: string}>(
        'https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=' + environment.firbaseAPIKEY
      ,{
        email: email,
        requestType: 'PASSWORD_RESET'
      }
      ).pipe(
        catchError(this.fireBaseHandleError),
      )
    }




  signInWithGoogle() {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
    return this.socialAuthService.authState.pipe(
      catchError(this.fireBaseHandleError),
      tap(resData => this.fireBaseHandleAuth(
        resData.email,
        resData.authToken,
        resData.idToken,
        +resData.response.expires_in))
    )
  }


  autoLogIn(){
    const userDate : {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userDate'))
    if (!userDate) {
        return;
    }

    const loadedUser = new User(userDate.email, userDate.id, userDate._token, new Date(userDate._tokenExpirationDate))
    if (loadedUser.token) {
        this.user.next(loadedUser)


        const expirationDuration = new Date(userDate._tokenExpirationDate).getTime() - new Date().getTime()
        this.autoLogout(expirationDuration)
    }
  }

  autoLogout(expirationDuration: number){
    console.log(expirationDuration)
    setTimeout(() => {
    console.log('timer logout')
      this.LogOut()
    }, expirationDuration);

  }

  LogOut(){
    this.user.next(null)
    localStorage.removeItem('userDate')
    this.router.navigate(['/auth']);
  }


  googleSignOut() {
    return this.socialAuthService.signOut();
  }


    private fireBaseHandleAuth(email, localId, idToken, expiresIn) {

      const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
      console.log(expirationDate)
      const loadedUser = new User(email,localId, idToken, new Date(expirationDate))
      this.user.next(loadedUser)
      localStorage.setItem('userDate', JSON.stringify(loadedUser))
      // this.autoLogout(expirationDate)

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

