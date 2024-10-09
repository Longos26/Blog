import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { PostListComponent } from './post-list/post-list.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CreateBlogComponent } from './create-blog/create-blog.component';
import { PostDetailedComponent } from './post-detailed/post-detailed.component';
import { EditBlogComponent } from './edit-blog/edit-blog.component';
import { authGuard } from './auth.guard';
// import path from 'path';

export const routes: Routes = [
    
    //default route
    {path: '', redirectTo: 'blogs', pathMatch: 'full'},

    {path: 'home', component: HomeComponent},
    {path: 'about', component: AboutComponent},
    {path: 'blogs', component: PostListComponent},
    {path: 'blogs/:id', component: PostDetailedComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'create-blog', component: CreateBlogComponent, canActivate: [authGuard]},
    {path: 'edit-blog/:id', component: EditBlogComponent, canActivate: [authGuard]},

    // testing routes
    // {path: 'comment-form', component: CommentsFormComponent},
];
