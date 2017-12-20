import { HomeComponent } from './components/home/home.component';
import { HistoryComponent } from './components/history/history.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
      path: '',
      redirectTo: 'diff',
      pathMatch: 'full'
    },
    {
      path: 'diff',
      component: HomeComponent
    },
    {
      path: 'diff/:id',
      component: HomeComponent
    },
    {
      path: 'history',
      component: HistoryComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
