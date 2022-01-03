import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuhtGuard } from './auth/auth.guard';
import { MusicHomeComponent } from './music-home/music-home.component';
import { StartPageComponent } from './start-page/start-page.component';

const routes: Routes = [
  {path: '', redirectTo: '/musicHome', pathMatch: 'full'},
  {path: 'musicHome', component: MusicHomeComponent, canActivate: [AuhtGuard],},
  {path: 'auth', loadChildren: ()=> import('./auth/auth.module').then(module => module.AuthModule)},
  {path: '**', component: StartPageComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
