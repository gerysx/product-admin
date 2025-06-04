import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { EditProfileComponent } from './edit-profile.component';

@NgModule({
  declarations: [EditProfileComponent],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  exports: [EditProfileComponent]
})
export class EditProfileModule {}
