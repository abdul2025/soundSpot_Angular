import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';




@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy{
  isAuth = false;
  isMobileMode = false;

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
  constructor() { }

  ngOnInit(): void {


  }

  onSaveData() {
    // console.log('safklh')
    // this.RecipeSub = this.store.select('recipes').pipe(map(recipes => {
    //   console.log(recipes)
    //   return recipes.recipes
    // })).subscribe(recipes => {
    //   // if(recipes.length !== 0){
    //   console.log(recipes.length)
    //   this.store.dispatch(new RecipeActions.StoreRecipes())
    //   // }
    // })

  }

  onFetchData(){
    // this.store.dispatch(new RecipeActions.FetchRecipes())
  }



  onLogout() {
    // this.store.dispatch(new AuthActions.Logout())

  }

  ngOnDestroy() {
    // this.userSub.unsubscribe()
    // this.RecipeSub.unsubscribe()
  }


  dropDownHeader() {
    this.isMobileMode == false ? this.isMobileMode = true : this.isMobileMode = false
  }


  CloseHeader() {
    this.isMobileMode = !this.isMobileMode
  }

  test() {
    console.log('aslkfjlk')
  }

}
