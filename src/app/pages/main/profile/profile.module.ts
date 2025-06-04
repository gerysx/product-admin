import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import { SharedModule } from "../../../shared/shared.module";
import { EditProfileComponent } from './edit-profile.component';
import { TermsModalComponent } from './terms/terms-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    SharedModule,

    ],
  declarations: [ProfilePage, EditProfileComponent, TermsModalComponent]
})
export class ProfilePageModule {

}
