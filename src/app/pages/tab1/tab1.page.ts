import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { Article } from 'src/app/interfaces';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  @ViewChild( IonInfiniteScroll, { static:true } ) infiniteScroll!: IonInfiniteScroll; // añadiendo { static:true } al @ViewChild evitamos que éste
                                                                                       // sea undefined en el ngOnInit()

    private newsSvc = inject ( NewsService )


  public articles: Article[] = []
  public finalData:string = ''
  public selectedCategory:string = 'business'

  constructor() {}

  ngOnInit() {
      this.newsSvc.getTopHeadlines()
       .subscribe({
        next: articles =>{
          this.articles.push(...articles)
        },
        error: error => {
          console.log(error)
        }
       })
  }

  loadData(  ) {
    console.log( this.articles[this.articles.length-1].title)
    setTimeout(() => {

      this.newsSvc.getTopHeadlinesByCategory( this.selectedCategory, true)
      .subscribe( articles => {

        if (this.articles[this.articles.length-1].title === articles[articles.length-1].title ){
          this.infiniteScroll.disabled = true;
          this.finalData = 'Has llegado al final!'
          return
        }
        this.articles = articles;

        this.infiniteScroll.complete();
      })
    }, 700);

  }

}
