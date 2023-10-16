import { Component, OnInit, inject } from '@angular/core';
import { NewsService } from '../../services/news.service';
import { Article } from 'src/app/interfaces';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  private NewSvc = inject ( NewsService )

  public articles: Article[] = []

  constructor() {}

  ngOnInit() {
      this.NewSvc.getTopHeadlines()
       .subscribe({
        next: articles =>{
          this.articles.push(...articles)
        },
        error: error => {
          console.log(error)
        }
       })
  }

}
