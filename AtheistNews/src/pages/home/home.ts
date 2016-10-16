import { Component } from '@angular/core';
import { ContentProvider } from '../../providers/content-provider';
import { NavController } from 'ionic-angular';
import { Splashscreen } from 'ionic-native';
import { PostDetails } from '../post-details/post-details';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ContentProvider]
})
export class HomePage {

  posts : Array<any>;

  constructor(public navCtrl: NavController, public contentProvider: ContentProvider) {
    console.log('page1 constructor');
    this.getAndDisplayPosts();
  }

  private getAndDisplayPosts() : void{
    this.contentProvider.getPosts().subscribe((posts)=> {
      this.posts = posts;
      console.dir(this.posts);
      Splashscreen.hide();
    }, (err) => {
      console.error(err);
    });
  }

  public viewDetails(post) : void{
    if(post.type === 'link'){
      Splashscreen.show();
      let ref: any = window.open(post.link, '_self', 'location=no,hidden=yes,clearcache=yes,clearsessioncache=yes,zoom=no,hardwareback=yes,disallowoverscroll=yes');
      ref.addEventListener('loadstop', ()=>{
        ref.show();
        window.setTimeout(()=>{
          Splashscreen.hide();
        }, 300);
      });
    }
    else{
      this.navCtrl.push(PostDetails, {
        post : post
      })
    }
  }

}
