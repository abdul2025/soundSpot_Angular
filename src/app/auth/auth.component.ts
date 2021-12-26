import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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


  constructor(
      private authService: AuthService,
      private http: HttpClient,
      private route:ActivatedRoute,
      private router: Router
    )
    {
    // check if this user coming form email verification
    // Accessing the token in the URL
    this.userTokenLambdaAPI = this.route.snapshot.children[0]
  }



  ngOnInit(): void {
    // Get params (token) that means an email validation
    //  do the email chack validation and user creation firebase lambda
    if (this.userTokenLambdaAPI){
      this.isLoading = true;
      // save token to varibale
      this.userTokenLambdaAPI = this.route.snapshot.children[0].params.token
      this.authService.lambdaApiCreateFirebseUser(this.userTokenLambdaAPI)
      .subscribe(res => {
        this.handleAuthLambda(res)
      }, err => {
        this.messageFromAPI = err.statusText
        this.isLoading = false
        }
      )
    }
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

  signInWithGoogle() {
    this.authService.signInWithGoogle().subscribe(res => {
      this.handleAuthLambda(res)
    }, err => {
      this.messageFromAPI = err.statusText
      this.isLoading = false
      }
    )
  }






  onSubmit() {

    this.isLoading = true;

    const email = this.authForm.value.email;
    const passowrd = this.authForm.value.passowrd;

    if (!this.authForm.valid) {
        return
    }
    ///// Login mode ture
    if (this.isLoginMode){
        this.authService.loginFirebase(email, passowrd).subscribe(
          resData=>{
              console.log(resData)
              this.isLoading = false;
              this.messageFromAPI = ''
              this.router.navigate(['/']);
            },
            errorMessage => {
              console.log(errorMessage)
              this.isLoading = false;
              this.APIerror = errorMessage
              this.messageFromAPI = ''
            }
        )

      }else {
        ////////// SignUP
        this.authService.signupInternalDB(email, passowrd).subscribe(res => {
          this.handleAuthLambda(res)
        }, err => {
          this.messageFromAPI = err.statusText
          this.isLoading = false
          }
        )
    }

    this.authForm.reset();
    // to set the form as unsubmitted
    this.form.resetForm();
  }


  private handleAuthLambda(res) {
    if (res.statusCode==200) {
      let message = JSON.parse(res.body)
      this.messageFromAPI = message.messages
      this.isLoading = false
    }else {
      this.messageFromAPI = 'Unknown error occured'
      this.isLoading = false
    }
  }

  ngOnDestroy() {
      if(this.storeSub){
          this.storeSub.unsubscribe()
      }
  }

}
