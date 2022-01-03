import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';




@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy{
  isMobileMode = false;

  isLogged = false
  userSub: Subscription

// this is will close the header dropdown from outside
  isFocusInsideComponent = false;
  isComponentClicked = false;
  @HostListener('click')
  clickInside() {
      this.isFocusInsideComponent = true;
      this.isComponentClicked = true;
      if(!this.isMobileMode) {
        this.isMobileMode = false
      }
    }
  @HostListener('document:click')
  clickout() {
      if (!this.isFocusInsideComponent && this.isComponentClicked) {
          this.isMobileMode = false
          this.isComponentClicked = false;
      }
      this.isFocusInsideComponent = false;
  }
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      if (user){
        this.isLogged = true
      }else {
        this.isLogged= false
      }

    })

  }


  logOut(){
    console.log('logg out')
    this.authService.LogOut()
  }



  ngOnDestroy() {
    this.userSub.unsubscribe()
    // this.RecipeSub.unsubscribe()
  }


  dropDownHeader() {
    this.isMobileMode == false ? this.isMobileMode = true : this.isMobileMode = false
  }


  CloseHeader() {
    this.isMobileMode = !this.isMobileMode
  }


}
