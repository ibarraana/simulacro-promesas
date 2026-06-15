function verificarStock(idProducto, cantidad) {

  console.log(`[STOCK] Verificando stock para ${cantidad} unidad(es) de ${idProducto}...`);

  return new Promise((resolve, reject) => {

    setTimeout(() => {

      const inventario = {

        "PROD001": { stock: 10, precio: 25.50 },

        "PROD002": { stock: 5, precio: 100.00 },

        "PROD003": { stock: 0, precio: 15.75 } // Sin stock

      };

      const item = inventario[idProducto];

      if (!item) {

        console.error(`[STOCK] Error: Producto ${idProducto} no encontrado.`);

        reject(new Error(`Producto ${idProducto} no encontrado en el inventario.`));

      } else if (item.stock >= cantidad) {

        console.log(`[STOCK] Éxito: Stock disponible para ${idProducto}. Precio unitario: $${item.precio}`);

        resolve({ stockDisponible: true, precioUnitario: item.precio });

      } else {

        console.warn(`[STOCK] Error: Stock insuficiente para ${idProducto}. Solicitado: ${cantidad}, Disponible: ${item.stock}`);

        reject(new Error(`Stock insuficiente para ${idProducto}.`));

      }

    }, 1500); // Simula demora de red/DB

  });

}
function procesarPago(datosPago, montoTotal) {

  console.log(`[PAGO] Procesando pago de $${montoTotal.toFixed(2)} con ${datosPago.metodo}...`);

  return new Promise((resolve, reject) => {

    setTimeout(() => {

      if (montoTotal <= 0) {

        console.error("[PAGO] Error: El monto a pagar debe ser positivo.");

        reject(new Error("Monto de pago inválido."));

      } else if (datosPago.metodo === 'tarjeta' && montoTotal < 500) {

        const transaccionId = `TXN-${Date.now()}`;

        console.log(`[PAGO] Éxito: Pago aprobado. Transacción ID: ${transaccionId}`);

        resolve({ transaccionId, estado: 'aprobado' });

      } else if (datosPago.metodo === 'paypal' && montoTotal < 1000) {

        const transaccionId = `PP-${Date.now()}`;

        console.log(`[PAGO] Éxito: Pago con PayPal aprobado. Transacción ID: ${transaccionId}`);

        resolve({ transaccionId, estado: 'aprobado' });

      } else {

        console.error(`[PAGO] Error: Pago rechazado para monto $${montoTotal.toFixed(2)} con ${datosPago.metodo}. (Límite excedido o método no soportado para el monto)`);

        reject(new Error("Pago rechazado por el proveedor."));

      }

    }, 2000); // Simula demora del procesador de pagos

  });

}
function enviarNotificacion(emailUsuario, detallesPedido) {

  console.log(`[NOTIFICACION] Preparando notificación para ${emailUsuario} sobre pedido ${detallesPedido.transaccionId}...`);

  return new Promise((resolve, reject) => {

    setTimeout(() => {

      // Simular un fallo aleatorio en el envío de emails (10% de probabilidad)

      if (Math.random() < 0.1) {

          console.error(`[NOTIFICACION] Error: Fallo al enviar email a ${emailUsuario}.`);

          reject(new Error(`Fallo en el servicio de notificaciones para ${emailUsuario}.`));

      } else {

          console.log(`[NOTIFICACION] Éxito: Notificación enviada a ${emailUsuario} para el pedido con producto ${detallesPedido.productoId}.`);

          resolve(`Confirmación enviada a ${emailUsuario} para la transacción ${detallesPedido.transaccionId}.`);

      }

    }, 1000); // Simula demora del servicio de email

  });

}
function procesarPedidoCompleto(idProducto, cantidad, datosPago, emailUsuario) {

    return verificarStock(idProducto, cantidad)

        .then(resultadoStock => {

            const montoTotal =
                cantidad * resultadoStock.precioUnitario;

            return procesarPago(datosPago, montoTotal)

                .then(resultadoPago => {

                    const detallesPedido = {
                        productoId: idProducto,
                        cantidad: cantidad,
                        montoPagado: montoTotal,
                        transaccionId: resultadoPago.transaccionId
                    };

                    return enviarNotificacion(
                        emailUsuario,
                        detallesPedido
                    );
                });
        });
}
// PRUEBA
procesarPedidoCompleto(
   "PROD001",
   2,
   { metodo: 'tarjeta' },
   "cliente@example.com"
)
.then(mensajeFinal => {

   console.log(
      "RESULTADO FINAL:",
      mensajeFinal
   );

})
.catch(error => {

   console.error(
      "ERROR EN EL PROCESO DEL PEDIDO:",
      error.message
   );
});