import { Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Product } from 'src/app/models/product.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
  standalone: false,
})
export class AddUpdateProductComponent implements OnInit {
  @Input() product: Product;
  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    price: new FormControl(null, [Validators.required, Validators.min(0)]),
    soldUnits: new FormControl(null, [Validators.required, Validators.min(0)]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.product) this.form.setValue(this.product);
  }

  //=== TOMAR O SELECCIONAR IMAGEN ===//
  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del producto'))
      .dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {
      if (this.product) this.updateProduct();
      else this.createProduct();
    }
  }

  setNumberInputs(){
    let {soldUnits, price}= this.form.controls
    if(soldUnits.value) soldUnits.setValue(parseFloat(soldUnits.value));
    if(price.value) price.setValue(parseFloat(price.value));
  }

  //=== CREAR PRODUCTO ===//
 async createProduct() {
  let path = `users/${this.user.uid}/products`;
  let loading;

  try {
    loading = await this.utilsSvc.loading('Creando producto...');
    await loading.present();

    let dataUrl = this.form.value.image;
    let imagePath = `${this.user.uid}/${Date.now()}`;
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.form.controls.image.setValue(imageUrl);

    delete this.form.value.id;

    await this.firebaseSvc.addDocument(path, this.form.value);

    this.utilsSvc.dismissModal({ success: true });

    this.utilsSvc.presentToast({
      message: 'Producto creado exitosamente',
      duration: 1500,
      color: 'success',
      position: 'bottom',
      icon: 'checkmark-circle-outline',
    });

  } catch (err) {
    console.error('Error al crear producto:', err);
    this.utilsSvc.presentToast({
      message: 'Error al crear el producto',
      duration: 2000,
      color: 'danger',
      position: 'bottom',
      icon: 'alert-circle-outline',
    });
  } finally {
    loading?.dismiss();
  }
}

  //=== ACTUALIZAR PRODUCTO ===//
  async updateProduct() {
  let path = `users/${this.user.uid}/products/${this.product.id}`;
  let loading;

  try {
    loading = await this.utilsSvc.loading('Actualizando producto...');
    await loading.present();

    if (this.form.value.image !== this.product.image) {
      let dataUrl = this.form.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.product.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);
    }

    delete this.form.value.id;

    await this.firebaseSvc.updateDocument(path, this.form.value);

    this.utilsSvc.dismissModal({ success: true });

    this.utilsSvc.presentToast({
      message: 'Producto actualizado exitosamente',
      duration: 1500,
      color: 'success',
      position: 'bottom',
      icon: 'checkmark-circle-outline',
    });

  } catch (err) {
    console.error('Error al actualizar producto:', err);
    this.utilsSvc.presentToast({
      message: 'Error al actualizar el producto',
      duration: 2000,
      color: 'danger',
      position: 'bottom',
      icon: 'alert-circle-outline',
    });
  } finally {
    loading?.dismiss();
  }
}



}
