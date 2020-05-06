import {Routes, RouterModule} from '@angular/router';
 import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
 import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { PreventUnsavedChanges } from './_guards/prevent-unsaved-changes.guard';
import { ListsResolver } from './_resolvers/lists.resolver';
import { MessagesResolver } from './_resolvers/messages.resolver';
import { NgModule } from '@angular/core';

export const appRoutes: Routes = [
         {
           path: 'home',
           component: HomeComponent,
           pathMatch: 'full',
           data: { title: "Welcome To Dating Application's Home Page" },
           loadChildren: './home/home.module#HomeModule',
         },
         //  {
         //    path: 'home/login',
         //    component: LoginComponent,
         //  },
         //  {
         //    path: 'home/register',
         //    component: RegisterComponent,
         //  },
         {
           path: '',
           runGuardsAndResolvers: 'always',
           canActivate: [AuthGuard],
           children: [
             {
               path: 'members',
               component: MemberListComponent,
               pathMatch: 'full',
               data: { title: 'Matches List' },
               resolve: { users: MemberListResolver },
             },
             {
               path: 'members/:id',
               component: MemberDetailComponent,
               pathMatch: 'full',
               data: { title: 'Member Detail' },
               resolve: { user: MemberDetailResolver },
             },
             {
               path: 'member/edit',
               component: MemberEditComponent,
               pathMatch: 'full',
               data: { title: 'My Profile' },
               resolve: { user: MemberEditResolver },
               canDeactivate: [PreventUnsavedChanges],
             },
             {
               path: 'messages',
               component: MessagesComponent,
               pathMatch: 'full',
               data: { title: 'Chats' },
               resolve: { messages: MessagesResolver },
             },
             {
               path: 'lists',
               component: ListsComponent,
               pathMatch: 'full',
               data: { title: 'Member List' },
               resolve: { users: ListsResolver },
             },
           ],
         },
         {
           path: '**',
           redirectTo: 'home',
           pathMatch: 'full',
           data: { title: "Welcome To Dating Application's Home Page" },
         },
       ];

@NgModule({
      imports: [RouterModule.forRoot(appRoutes)],
      exports: [RouterModule],
      providers: [],
    })
    export class AppRoutingModule {}   
