import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { PostDetails } from '../pages/post-details/post-details';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    PostDetails
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    PostDetails
  ],
  providers: []
})
export class AppModule {}
