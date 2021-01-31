import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashComponent } from './UI/dash/dash.component';
import { LogComponent } from './UI/log/log.component';

const routes: Routes = [
  {path: 'Dashboard', component: DashComponent},
  {path: 'View Full Log', component: LogComponent}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
