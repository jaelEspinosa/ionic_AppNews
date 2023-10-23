import { Component, Input, OnInit, inject } from '@angular/core';
import { ActionSheetController, Platform } from '@ionic/angular';
import { Article } from 'src/app/interfaces';
import { Browser } from '@capacitor/browser';
import { Share } from '@capacitor/share'
import { Source } from '../../interfaces/news';



@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent  implements OnInit {

  @Input() article!: Article
  @Input() i!: number


  private platform = inject ( Platform )
  private actionCtrl = inject ( ActionSheetController )

  constructor() { }

  ngOnInit() {}

  async onOpenMenu(){

    const actionSheet = await this.actionCtrl.create({
      header:'Opciones',
      mode:'ios',
      cssClass:'myActSheet',
      backdropDismiss: false,
      buttons:[
        {
          text:'Compartir',
          icon: 'share-outline',
          handler:()=>this.onShareArticle()
        },
        {
          text:'Favorito',
          icon: 'heart-outline',
          handler:()=>this.onToggleFavorite()
        },
        {
          text:'Cancelar',
          icon: 'close-outline',
          role:'cancelar'
        }
      ]
    })
   await actionSheet.present()
  }

 async onShareArticle(){
 const{ title, source, url} = this.article
 await Share.share({
  title: title,
  text: title,
  url,
  dialogTitle: 'Shared by'+source.name,
});
  }

  async openArticle() {
    if(this.platform.is('ios') || this.platform.is('android')){
      await Browser.open({ url: this.article.url });
      return;
    }
   window.open( this.article.url, '_blank')
  }

  onToggleFavorite(){
    console.log('Toggle Favorite')
  }
}
