# DeliPop: sitio web

Landing page de DeliPop, pop para tu empresa o evento en Uruguay (carrito para eventos, pop a granel y pops individuales). Es un sitio estático (HTML, CSS y JS, sin build), listo para publicar en GitHub Pages.

## Estructura

```
index.html          Página principal
css/styles.css      Estilos (colores y tipografías arriba de todo)
js/main.js          Datos de contacto (CONFIG), menú, formulario, animaciones
assets/img/         Logo e ilustraciones con fondo transparente, favicon
assets/fonts/       Acá va la fuente Zing Rust Base (ver abajo)
assets/photos/      Fotos y video del carrusel (versiones livianas para web)
Img/                Imágenes originales (el sitio no las usa)
```

## 1. Cargar los datos de contacto

Editá el objeto `CONFIG` al principio de `js/main.js`:

```js
const CONFIG = {
  whatsapp: "59897852637",        // 598 + celular sin el 0 inicial, sin + ni espacios
  email: "delipopuruguay@gmail.com", // vacío = no se muestran links de correo
  instagram: "delipopuyoficial",  // usuario sin @
  waMessage: "¡Hola DeliPop! ...", // mensaje precargado en WhatsApp
};
```

Todos los botones de WhatsApp, correo e Instagram del sitio toman estos datos.

### Cómo llegan los pedidos del formulario

El formulario no necesita servidor. Al final tiene dos botones:

- **Enviar pedido por WhatsApp** (principal): abre WhatsApp con el pedido ya escrito y el cliente solo toca enviar.
- **Enviar pedido por mail**: abre la app de correo del cliente con el pedido escrito, dirigido a `email`.

### Links que eligen el servicio solos

Agregá `?servicio=` a la dirección del sitio y el formulario ya aparece con ese servicio marcado. Sirve para la bio de Instagram, campañas o mails:

```
https://tu-sitio/?servicio=evento#pedido
https://tu-sitio/?servicio=granel#pedido
https://tu-sitio/?servicio=individual#pedido
```

## 2. Agregar la fuente Zing Rust Base

Chivo se carga desde Google Fonts. Zing Rust Base hay que agregarla a mano:

1. Descargala desde Fontfabric (es gratuita).
2. Copiá el archivo en `assets/fonts/` con uno de estos nombres:
   `ZingRustBase.woff2`, `ZingRustBase.woff`, `ZingRustBase.otf` o `ZingRustBase.ttf`.
   Si tenés el `.otf`/`.ttf`, convertirlo a `.woff2` (por ejemplo con transfonter.org) hace que cargue más rápido.

Mientras no esté el archivo, los títulos se muestran en Chivo Black.

## 3. Publicar en GitHub Pages

1. Subí el contenido de esta carpeta a un repositorio de GitHub.
2. En el repo: **Settings → Pages → Build and deployment**, elegí *Deploy from a branch*, rama `main` y carpeta `/ (root)`.
3. En un par de minutos queda online en `https://<usuario>.github.io/<repo>/`.

Para usar un dominio propio (por ejemplo `delipop.com.uy`), cargalo en la misma pantalla de Pages y configurá el DNS como indica GitHub.

## Ver el sitio en tu compu

Abrí `index.html` en el navegador, o levantá un servidor local:

```bash
python -m http.server 8080
```

## Después de cada cambio

En `index.html`, subí el número de `?v=` en los links a `css/styles.css` y `js/main.js` (por ejemplo de `?v=7` a `?v=8`). Así los navegadores descargan la versión nueva en lugar de usar la guardada.

## Página /formulario

`formulario/index.html` es una página con solo el formulario, para mandarle a clientes habituales (por ejemplo `https://tu-sitio/formulario/`). No aparece en buscadores. También acepta `?servicio=evento`, `granel` o `individual`.

El formulario está copiado del de `index.html`: si cambiás preguntas u opciones en uno, cambialas también en el otro.
