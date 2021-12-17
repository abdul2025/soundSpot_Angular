import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { MusicHomeComponent } from './music-home/music-home.component';
import { StartPageComponent } from './start-page/start-page.component';
import { SuccessEmailVerificationComponent } from './success-email-verification/success-email-verification.component';

const routes: Routes = [
  // {path: '', redirectTo: '', pathMatch: 'full'},
  {path: '', component: StartPageComponent},
  {path: 'successVerify/:token', component: SuccessEmailVerificationComponent},
  {path: 'musicHome', component: MusicHomeComponent},
  {path: 'auth', component: AuthComponent},
  {path: '**', component: StartPageComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
