import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MusicHomeComponent } from './music-home/music-home.component';
import { StartPageComponent } from './start-page/start-page.component';
import { SuccessEmailVerificationComponent } from './success-email-verification/success-email-verification.component';

const routes: Routes = [
  // {path: '', redirectTo: '', pathMatch: 'full'},
  {path: '', component: StartPageComponent},
  {path: 'successVerify/', component: SuccessEmailVerificationComponent},
  {path: 'musicHome', component: MusicHomeComponent},
  {path: 'auth', loadChildren: ()=> import('./auth/auth.module').then(module => module.AuthModule)},
  {path: '**', component: StartPageComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
