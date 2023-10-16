import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Article, ArticlesByCategoryAndPage, NewsResponse } from '../interfaces';
import { Observable, map, of } from 'rxjs';

const apiKey = environment.apiKey;
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private articlesByCategoryAndPage: ArticlesByCategoryAndPage = {}

  private http = inject ( HttpClient )

  private executeQuery<T> ( endpoint: string) {
    console.log('Peticion Http realizada!!! ')
    return this.http.get<T>(`${ apiUrl }${ endpoint }`,{
      params:{
        apiKey: apiKey,
        country: 'us',
      }
    })
  }

  constructor() { }

  getTopHeadlines(): Observable<Article[]>{
   return this.executeQuery<NewsResponse>(`/top-headlines?category=business`)
   .pipe(
      map(resp => resp.articles)
   )
  }


  getTopHeadlinesByCategory( category: string, loadMore: boolean = false):Observable<Article[]>{

    if(loadMore){
     return this.getArticlesByCategory( category );
    }

    if( this.articlesByCategoryAndPage[category]){
      return of(this.articlesByCategoryAndPage[category].articles)
    }


    return this.getArticlesByCategory( category );
  }



  private getArticlesByCategory( category: string):Observable<Article[]>{

    if(!Object.keys(this.articlesByCategoryAndPage).includes(category)){
       // no existe
       this.articlesByCategoryAndPage[category] = {
        page: 0,
        articles: []
        }
     }

     const page = this.articlesByCategoryAndPage[ category ].page + 1

     return this.executeQuery<NewsResponse>(`/top-headlines?category=${ category }&page=${ page }`)
            .pipe(
              map(resp => {

                if ( resp.articles.length === 0) return this.articlesByCategoryAndPage[category].articles;

                this.articlesByCategoryAndPage[category] = {
                  page:page,
                  articles: [...this.articlesByCategoryAndPage[category].articles, ...resp.articles]
                }
                return this.articlesByCategoryAndPage[category].articles;
              })
            )

  }
}
