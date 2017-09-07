import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GeneralTabsPage } from './general-tabs';

@NgModule({
  declarations: [
    GeneralTabsPage
  ],
  imports: [
    IonicPageModule.forChild(GeneralTabsPage),
  ]
})
export class GeneralTabsPageModule {}
