import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase';

@Injectable()
export class FirebaseService {
  productos:FirebaseListObservable<any[]>;
  producto:FirebaseObjectObservable<any[]>;
  folder:any;
  pro:Producto;

  constructor(private af: AngularFireDatabase) {
    this.folder = 'productoimages';
   }

  getProductos(){
    this.productos = this.af.list('/productos/') as FirebaseListObservable<Producto[]>
    return this.productos;
  }

  getProductoDetails(id){
    this.producto = this.af.object('/productos/'+id) as FirebaseObjectObservable<Producto[]>
    return this.producto;
  }

  addProducto(producto){
    let storageRef = firebase.storage().ref();
    let path=["","","","",""];
    let foto=["","","","",""];
    for(let selectedFiles of [(<HTMLInputElement>document.getElementById('productofoto')).files]){
      console.log(selectedFiles);
      if(selectedFiles.item(0)===null){
        if(!producto.foto) 
        {
          path[0]="/productoimages/default_image.png";
          foto[0]="default_image.png";
          producto.foto = foto;
          producto.path = path;
        }
        return this.af.database.ref('productos/'+producto.id).set(producto);        
      }
      else{
        for(let i=0 ; i<selectedFiles.length ; i++){
          console.log(selectedFiles.item(i).name);
          path[i]=`/${this.folder}/${selectedFiles.item(i).name}`;
          foto[i]=selectedFiles.item(i).name;
          let iRef = storageRef.child(path[i]);
          iRef.put(selectedFiles.item(i)).then((snapshot) => {  
            producto.foto = foto;
            producto.path = path;
            return this.af.database.ref('productos/'+producto.id).set(producto);  
          });      
        }
      }
    }
  }

  deleteProducto(id){
    this.af.object('/productos/'+id).remove();
  }

  updateProducto(id,pro){
    this.af.object('/productos/'+id).update(pro);
  }

}

interface Producto{
  id?:number;
  name?:string;
  descripcion?:string;
  precio?:number;
  foto?:string;
  tipo?:string;
  cantidad?:number;
  color?:string;
  dimensiones?:string;
  peso?:string;
  caracteristicas?:string;
}
