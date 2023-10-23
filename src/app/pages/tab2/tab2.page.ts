import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Article } from 'src/app/interfaces';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  @ViewChild( IonInfiniteScroll, { static:true } ) infiniteScroll!: IonInfiniteScroll; // añadiendo { static:true } al @ViewChild
                                                                                      //  evitamos que sea undefined en el ngOnInit

  public finalData:string = ''

  public newsSvc = inject ( NewsService )

  public articles: Article[] = [];

  public categories: string[] = [
    'business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology',
  ]

  public selectedCategory: string = this.categories[0];

  constructor() {}

  ngOnInit() {
    console.log( this.infiniteScroll) // en este momento es undefined, si necesitase asignar valores tendria un problema ya que el objeto es undefined

    this.newsSvc.getTopHeadlinesByCategory( this.selectedCategory )
     .subscribe( articles =>{
      this.articles = [...articles]
     })
  }

  segmentChanged( event: Event ) {
    this.selectedCategory = ( event as CustomEvent ).detail.value
    this.newsSvc.getTopHeadlinesByCategory( this.selectedCategory )
     .subscribe(articles =>{
      this.articles = [ ...articles ]
     })

  }

 loadData() {
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

