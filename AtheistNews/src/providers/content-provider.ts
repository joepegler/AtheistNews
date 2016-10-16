import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/Rx';
import { Parser } from './parser';

@Injectable()
export class ContentProvider {

  private FEED_URL : string = "http://www.reddit.com/r/atheism/.rss";

  constructor(public http: Http) {
    console.log('Hello ContentProvider Provider');
  }

  public getPosts () : Observable <any[]>{
    console.log('getPosts()');
    return this.http.get(this.FEED_URL).map(ContentProvider.extractData).catch(ContentProvider.handleError)
  }

  private static extractData(res: any) {
    let xmlString = res._body;
    let json = Parser.xml2json(xmlString, '\t');
    let jsObj = JSON.parse(json);
    jsObj = (jsObj.feed || {}).entry;
    let dataArr = ContentProvider.sanitizeData(jsObj);
    // console.dir(dataArr);
    return dataArr;
  }

  private static handleError (error: any) {
    let errMsg = (error.message) ? error.message : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  }

  public static sanitizeData(data: any){
    let resArr = [];
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        // console.dir(data[key]);
        let post = data[key],
          _tempHtmlString = post.content['#text'],
          _htmlString = ContentProvider.htmlDecode(_tempHtmlString),
          _link = ContentProvider.getLink(_htmlString),
          _thumbnail = ContentProvider.extractImageSource(_htmlString),
          _type = ContentProvider.checkType(_htmlString),
          _title = post.title,
          author = post.author.name,
          resObj = {
            htmlString : _htmlString,
            title : _title,
            thumbnail : _thumbnail,
            link : _link,
            type : _type
          };
        if(author !== "/u/rAtheismMods"){
          resArr.push(resObj);
        }
        // console.dir(resObj);
      }
    }
    return resArr;
  }

  private static checkType(contentString): string{
    var type = 'link';
    if (contentString.indexOf("imgur") >= 0){
      type = 'image'
    }
    else if(contentString.indexOf("<!-- SC_OFF -->") >= 0){
      type = 'text';
    }
    return type;
  }

  private static getLink(contentString): string{
    let e = document.createElement('div');
    e.innerHTML = contentString;
    let aTags = e.getElementsByTagName("a"),
      searchText = "[link]",
      found;
    for (let i = 0; i < aTags.length; i++) {
      if (aTags[i].textContent.indexOf(searchText) > -1) {
        found = aTags[i].href;
        if (found.indexOf('imgur') >= 0 && found.indexOf('.jpg') < 0){
          found += '.jpg';
        }
      }
    }
    return found;
  }


  private static extractImageSource(contentString): string{
    let src;
    const regex = /<img.*?src="(.*?)"/;
    var srcRes = regex.exec(contentString);
    if (srcRes){
      src = srcRes[1];
    }
    else{
      src = 'assets/icon/default.png'
    }
    return src;
  }

  public static htmlDecode(input: string){
    let e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  // public static removeUnwantedChars(contentString: string): string{
  //   contentString = contentString.replace(/&#32; submitted by &#32;/gi, '');
  //   return contentString;
  // }

}
