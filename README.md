# Lo de Polo — Menú web + panel del dueño

Sitio de 2 páginas, sin build ni frameworks (HTML + CSS + JS puro), pensado para
abrir directo en NetBeans/Visual Studio y publicar en GitHub Pages.

- `index.html` — menú público. El cliente arma su pedido y lo manda por WhatsApp
  (incluye nombre, pedido, dirección y precio, como pediste).
- `admin.html` — panel del dueño. Login con usuario/contraseña real (no un PIN
  visible en el código), para agregar/editar/borrar platos, marcar sin stock,
  y cambiar precios o datos del negocio.

Los datos se guardan en **Firebase** (gratis), así que cualquier cambio que
haga el dueño se ve al instante en el celular de cualquier cliente que abra
la página, sin que vos tengas que tocar nada.

---

## 1. Crear el proyecto de Firebase (una sola vez, ~5 min, sin tarjeta)

1. Entrá a https://console.firebase.google.com y logueate con una cuenta de Google.
2. **Crear proyecto** → nombre, por ejemplo `lo-de-polo` → seguir los pasos (podés
   desactivar Google Analytics, no hace falta).
3. Dentro del proyecto, click en el ícono **</>** ("Web") para registrar una app.
   - Nombre: `lo-de-polo-web`.
   - **No** marques "Firebase Hosting" (vamos a usar GitHub Pages).
4. Firebase te va a mostrar un bloque `firebaseConfig = {...}`. Copiá esos
   valores y pegalos en `js/firebase-config.js`, reemplazando los `"TU_..."`.
lalala
### Activar la base de datos (Firestore)
1. Menú lateral → **Compilación → Firestore Database** → **Crear base de datos**.
2. Elegí **modo producción** y la ubicación más cercana (ej. `southamerica-east1`).
3. Andá a la pestaña **Reglas** y pegá esto (reemplaza las reglas de ejemplo):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /menu/{itemId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /config/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

Esto significa: **cualquiera puede ver** el menú (para que la página pública
funcione), pero **solo alguien logueado** (el dueño) puede modificarlo.
Click en **Publicar**.

### Activar el login del dueño (Authentication)
1. Menú lateral → **Compilación → Authentication** → **Comenzar**.
2. Pestaña **Sign-in method** → activá **Email/contraseña**.
3. Pestaña **Users** → **Agregar usuario** → cargá el email y contraseña que
   va a usar el dueño para entrar a `admin.html`. Guardalo en un lugar seguro.

Con esto Firebase ya está listo. No hace falta ningún servidor propio.

---

## 2. Cargar el menú inicial

1. Abrí `admin.html` en el navegador (podés abrirlo directo desde el archivo,
   o después de subirlo a GitHub Pages).
2. Iniciá sesión con el usuario que creaste en el paso anterior.
3. Vas a ver un botón **"Cargar menú inicial"** — tocalo una sola vez. Esto
   sube todos los platos que saqué de las cartas del local (empanadas, pizzas,
   milanesas, sandwiches, hamburguesas, etc.) con sus precios.
4. Revisá los precios: los tomé de dos versiones de la carta que mandaste y
   había alguna diferencia entre una y otra (ej. pizza cebollada), así que
   convine chequearlos y corregir lo que haga falta directamente ahí.
5. Los ítems "Pollo a la parrilla" y "Menú diario" quedaron en $0, que la
   página muestra como **"Consultar"** — editalos cuando tengan precio fijo.

---

## 3. Probarlo en tu computadora

No hace falta ningún servidor especial. Alcanza con abrir `index.html` con
**Live Server** (extensión de VS Code) o el servidor embebido de NetBeans,
porque el navegador necesita cargarlo por `http://` (no `file://`) para que
Firebase funcione bien.

**En NetBeans:** `Archivo → Proyecto nuevo → HTML5/JS` y elegí esta carpeta
como código fuente, o simplemente abrí la carpeta como proyecto existente.
No hay paso de compilación: es HTML/CSS/JS común.

---

## 4. Publicar en GitHub Pages

1. Creá un repositorio nuevo en GitHub (público) y subí todo el contenido de
   esta carpeta a la raíz del repo.
2. En el repo: **Settings → Pages**.
3. En "Source" elegí la rama `main` y la carpeta `/ (root)`. Guardar.
4. Esperá 1-2 minutos. GitHub te va a dar una URL como:
   `https://tu-usuario.github.io/lo-de-polo/`
5. Compartí esa URL — funciona igual en celular, no hace falta instalar nada.

---

## 5. Cosas para tener en cuenta

- **Número de WhatsApp**: ya está cargado como `5493425308949`
  (`+54 9 3425 30-8949`). Si necesitás cambiarlo, se edita desde el panel del
  dueño, en "Datos del negocio", sin tocar código.
- **Mensaje de WhatsApp**: incluye nombre del cliente, el detalle del pedido,
  la dirección de entrega y el total, tal como pediste.
- **Costo**: el plan gratuito de Firebase (Spark) alcanza de sobra para una
  casa de comidas — miles de lecturas/escrituras gratis por día.
- **Seguridad**: solo quien tenga el usuario/contraseña de Firebase
  Authentication puede editar el menú. Ese login nunca queda visible en el
  código (a diferencia de un PIN fijo), así que es seguro publicarlo en un
  repo público de GitHub.
- Si el local suma un segundo empleado que también deba editar el menú,
  podés crear otro usuario en Authentication → Users, sin tocar nada más.
