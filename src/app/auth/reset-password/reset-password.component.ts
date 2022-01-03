import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['../auth.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  isLoading = false
  APIerror: string
  messageFromAPI: string

  resetPassForm: FormGroup
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm()
  }


  initForm(){
    this.resetPassForm = new FormGroup({
        'email': new FormControl(null, Validators.required),
    })
  }


  onSubmit() {
    const email = this.resetPassForm.value.email;

    if (!this.resetPassForm.valid) {
        return
    }
    this.authService.resetPasswordFirebase(email).subscribe(res => {
      this.messageFromAPI = "A reset Password Sent to your Email:" + res.email
    })

  }

}
