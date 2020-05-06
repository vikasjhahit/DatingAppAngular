import { LoginComponent1 } from './login/login.component';
import { RegisterComponent1 } from './register/register.component';



export const HomeRoutes = [
  // { 
  //     path: '', 
  //     redirectTo: 'home', 
  //     pathMatch: 'full' 
  // },
  {
    path: 'home/login',
    component: LoginComponent1,
    data: { title: 'Login' },
  },
  {
    path: 'home/register',
    component: RegisterComponent1,
    data: { title: 'Register' }
  }
];
