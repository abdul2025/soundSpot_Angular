import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AuthService, AuthRespData } from './auth.service';


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
  @ViewChild('form') form;


  private storeSub: Subscription;


  constructor(private authService: AuthService) {}


  ngOnInit(): void {
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
        // this.store.dispatch(new AuthActions.LogingStart({email: email, password: passowrd}))
        fireBaseAuth = this.authService.loginFirebase(email, passowrd)

      }else {
        ////////// SignUP
        fireBaseAuth = this.authService.signupFirebase(email, passowrd)
      // this.store.dispatch(new AuthActions.Signup({email: email, password: passowrd}))
    }

    this.authForm.reset();
    // to set the form as unsubmitted
    this.form.resetForm();



    fireBaseAuth.subscribe(
        resData=>{
          console.log(resData)
          this.isLoading = false;
        },
        errorMessage => {
          console.log(errorMessage)
          this.isLoading = false;
          this.APIerror = errorMessage
        }
      )


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
