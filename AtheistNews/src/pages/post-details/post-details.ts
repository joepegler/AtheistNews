import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
@Component({
  selector: 'page-post-details',
  templateUrl: 'post-details.html'
})
export class PostDetails {

  post : any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.post = navParams.get('post');
  }

  ionViewDidLoad() {
    console.log('Hello PostDetails Page');
  }

  public goToLink(url): void{
    console.info(url);
  }

}
