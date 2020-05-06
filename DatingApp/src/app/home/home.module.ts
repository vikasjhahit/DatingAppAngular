import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent1 } from './login/login.component';
import { RegisterComponent1 } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeRoutes } from './home.route';

@NgModule({
  declarations: [LoginComponent1, RegisterComponent1],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule.forChild(HomeRoutes)],
  exports: [LoginComponent1, RegisterComponent1],
})
export class HomeModule {}
