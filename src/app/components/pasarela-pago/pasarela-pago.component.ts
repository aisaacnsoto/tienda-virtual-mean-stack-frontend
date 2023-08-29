import { Component, OnInit, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { loadScript } from '@paypal/paypal-js';
import { CarritoService } from 'src/app/services/carrito.service';

import { environment } from 'src/environments/environment';
const PAYPAL_CLIENT_ID = environment.PAYPAL_CLIENT_ID;
const BACKEND_URL = environment.BACKEND_URL;

@Component({
  selector: 'app-pasarela-pago',
  templateUrl: './pasarela-pago.component.html',
  styleUrls: ['./pasarela-pago.component.css']
})
export class PasarelaPagoComponent implements OnInit {

  @Input()
  amount: number;

  @Input()
  customer: any;
  
  @Input()
  proceed: boolean;

  constructor(private _router: Router, private _carritoService: CarritoService) { }

  ngOnInit(): void {
    this.cargatBotonPaypal();
  }
  
  cargatBotonPaypal() {
    loadScript({ clientId: PAYPAL_CLIENT_ID })
      .then((paypal) => {
        paypal
          .Buttons({
            createOrder: (data, actions) => {
              return fetch(`${BACKEND_URL}/api/payments/create`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  total: this.amount
                }),
              })
                .then((response) => response.json())
                .then((order) => order.id);
            },
            onApprove: (data, actions) => {
              return fetch(`${BACKEND_URL}/api/payments/execute`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderID: data.orderID,
                  total: this.amount,
                  customer: this.customer
                })
              })
                .then((response) => response.json())
                .then((orderData) => {
                  this._carritoService.vaciarCarrito();
                  this._router.navigateByUrl('confirmation');
                  // const transaction = orderData.purchase_units[0].payments.captures[0];
                  // console.log(`Transaction ${transaction.status}: ${transaction.id}\n\nSee console for all available details`);
                });
            },
          })
          .render("#paypal-buttons")
          .catch((error) => {
            console.error("failed to render the PayPal Buttons", error);
          });
      })
      .catch((error) => {
        console.error("failed to load the PayPal JS SDK script", error);
      });
  }

}
