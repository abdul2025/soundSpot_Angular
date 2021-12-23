import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService, AuthRespData } from './auth.service';
import {environment} from "../../environments/environment"


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {



  authForm: FormGroup
  hide= true;
  isLoginMode = true;
  isLoading = false;
  APIerror: string;
  emailValidationMode: boolean = false
  messageFromAPI: string;
  userTokenLambdaAPI

  @ViewChild('form') form;


  private storeSub: Subscription;


  constructor(private authService: AuthService, private http: HttpClient, private route:ActivatedRoute) {
    // check if this user coming form email verification
    this.userTokenLambdaAPI = this.route.snapshot.children[0]


  }


  ngOnInit(): void {
    this.isLoading = true;
    // Get params (token) that means an email validation
        //  do the email chack validation and user creation firebase lambda
    if (this.userTokenLambdaAPI){
      // save token to varibale
      this.userTokenLambdaAPI = this.route.snapshot.children[0].params.token
      const url = 'https://vlzmlddotg.execute-api.us-east-1.amazonaws.com/Prod/updateemailstatus'
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',

        'X-Api-Key': environment.awsAPIKEY});
      let params = new HttpParams().set('token', this.userTokenLambdaAPI);

      let options = { headers: headers, params: params };

      this.http.post<{body:string, statusCode: number }>(url, null, options).subscribe(res => {
        console.log(res)
        console.log(res.statusCode)
        if (res.statusCode==200) {
          this.isLoading = false;
          let message = JSON.parse(res.body)
          this.messageFromAPI = message.messages
          this.isLoading = false;

        }}, err => {
          console.log(err)
        })

      console.log(this.userTokenLambdaAPI)
    }

    // Call lambda function to create firebase user and update internal DB




      // this.storeSub = this.store.select('auth').subscribe(authState => {
      //     this.isLoading = authState.loading,
      //     this.error = authState.authError
      //     console.log(this.error)
      //     // if (this.error) {
      //     //     this.handleError()
      //     // }

      // })
      this.initForm()
  }


  initForm(){
      this.authForm = new FormGroup({
          'email': new FormControl(null, Validators.required),
          'passowrd': new FormControl(null, Validators.required)
      })
  }

  onSwitchMode() {
      this.isLoginMode = !this.isLoginMode;
      this.APIerror = '';
  }






  onSubmit() {

    this.isLoading = true;


    const email = this.authForm.value.email;
    const passowrd = this.authForm.value.passowrd;
    let fireBaseAuth: Observable<AuthRespData>


    if (!this.authForm.valid) {
        return
    }



    ///// Login mode ture
    if (this.isLoginMode){
        this.authService.loginFirebase(email, passowrd).subscribe(
          resData=>{
              console.log(resData)
              this.isLoading = false;
              this.isLoginMode = false
            },
            errorMessage => {
              console.log(errorMessage)
              this.isLoading = false;
              this.APIerror = errorMessage
              this.isLoginMode = false
            }
        )

      }else {
        ////////// SignUP
        this.authService.signupInternalDB(email, passowrd).subscribe(res => {
          console.log(res.statusCode)
          if (res.statusCode==200) {
            let message = JSON.parse(res.body)
            this.messageFromAPI = message.messages
            this.isLoading = false
            this.isLoginMode = false
          }
        }, err => {
          this.messageFromAPI = err.statusText
          console.log(err)
          this.isLoading = false
          this.isLoginMode = false


        })
    }

    this.authForm.reset();
    // to set the form as unsubmitted
    this.form.resetForm();



    // fireBaseAuth.subscribe(
    //     resData=>{
    //       console.log(resData)
    //       this.isLoading = false;
    //     },
    //     errorMessage => {
    //       console.log(errorMessage)
    //       this.isLoading = false;
    //       this.APIerror = errorMessage
    //     }
    //   )


  }





  handleError() {
    this.APIerror = ''
      // this.store.dispatch(new AuthActions.ClearError());

  }

  ngOnDestroy() {
      if(this.storeSub){
          this.storeSub.unsubscribe()
      }
  }

}
