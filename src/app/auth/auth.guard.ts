import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { AuthService } from "./auth.service";



@Injectable({providedIn: 'root'})
export class AuhtGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router,
        ) {}


    canActivate(
        route: ActivatedRouteSnapshot,
        router: RouterStateSnapshot
        ): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree>
        {
          // let user = JSON.parse(localStorage.getItem('userDate'))
          // if (user) {
          //   this.authService.user.next(user)
          //   console.log('user loged in')
          //   return this.router.createUrlTree(['asfhklh'])
          // }else {
          //   console.log('please log in')
          //   return this.router.createUrlTree(['auth'])
          //   // return false
          // }

          return this.authService.user.pipe(
                take(1),
                map(user => {
                    console.log(user)
                    return user
                }),
                map(user => {
                const isAuth = user
                if(isAuth) {
                  console.log('asklfklashf')
                  return true
                }
                return this.router.createUrlTree(['auth'])
            }))
        }



}
